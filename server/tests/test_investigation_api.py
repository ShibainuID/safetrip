import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from server.app.database import Base, get_db
from server.app.db.orm import (
    AuditEvent,
    Camera,
    CandidateClip,
    Investigation,
    InvestigationTimelineEntry,
    Officer,
    Playbook,
    Report,
    Zone,
)
from server.app.main import app


JAKARTA = datetime.timezone(datetime.timedelta(hours=7))


@pytest.fixture
def api_client(monkeypatch):
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    testing_session = sessionmaker(bind=engine)

    def override_db():
        with testing_session() as session:
            yield session

    app.dependency_overrides[get_db] = override_db
    client = TestClient(app)
    yield client, testing_session
    client.close()
    app.dependency_overrides.pop(get_db, None)
    engine.dispose()


def _report_payload():
    return {
        "reporter_type": "passenger",
        "time_window_start": datetime.datetime(
            2026, 7, 17, 17, 9, tzinfo=JAKARTA
        ).isoformat(),
        "time_window_end": datetime.datetime(
            2026, 7, 17, 17, 11, 59, tzinfo=JAKARTA
        ).isoformat(),
        "location": "",
        "description": (
            "Orang berjaket abu-abu dan membawa tas hitam berlari menuju Exit D."
        ),
        "direction": "toward Exit D",
    }


def test_complete_cached_investigation_api_flow(api_client):
    client, _ = api_client

    report_response = client.post("/api/v1/reports", json=_report_payload())
    assert report_response.status_code == 200
    report_id = report_response.json()["report_id"]

    extraction_response = client.post(f"/api/v1/reports/{report_id}/extract")
    assert extraction_response.status_code == 200
    extracted = extraction_response.json()["attributes"]
    assert extracted["extraction_source"] == "cached"

    correction_response = client.patch(
        f"/api/v1/reports/{report_id}/attributes",
        json={
            "attributes": {
                key: value
                for key, value in extracted.items()
                if key != "extraction_source"
            }
        },
    )
    assert correction_response.status_code == 200
    assert correction_response.json()["status"] == "attributes_confirmed"

    investigation_response = client.post(
        "/api/v1/investigations",
        json={"report_id": report_id},
    )
    assert investigation_response.status_code == 200
    investigation_id = investigation_response.json()["investigation_id"]

    candidates_response = client.get(
        f"/api/v1/investigations/{investigation_id}/candidates"
    )
    assert candidates_response.status_code == 200
    candidates = candidates_response.json()
    assert len(candidates) == 5
    by_clip = {candidate["clip_id"]: candidate for candidate in candidates}
    assert [candidate["clip_id"] for candidate in candidates[:3]] == [
        "CLIP-TA-001",
        "CLIP-TA-004",
        "CLIP-TA-007",
    ]

    for clip_id, note in (
        ("CLIP-TA-007", "Seen near Exit D"),
        ("CLIP-TA-001", "First seen at concourse"),
    ):
        response = client.patch(
            "/api/v1/investigations/"
            f"{investigation_id}/candidates/{by_clip[clip_id]['candidate_id']}",
            json={"verification_status": "confirmed", "note": note},
        )
        assert response.status_code == 200

    rejected = client.patch(
        "/api/v1/investigations/"
        f"{investigation_id}/candidates/{by_clip['CLIP-TA-003']['candidate_id']}",
        json={"verification_status": "rejected", "note": "Wrong direction"},
    )
    assert rejected.status_code == 200

    timeline_response = client.get(
        f"/api/v1/investigations/{investigation_id}/timeline"
    )
    assert timeline_response.status_code == 200
    timeline = timeline_response.json()
    assert [entry["location"] for entry in timeline] == [
        "Lantai 1 Concourse",
        "Exit D Link",
    ]
    assert [entry["note"] for entry in timeline] == [
        "First seen at concourse",
        "Seen near Exit D",
    ]
    assert all(entry["human_verified"] is True for entry in timeline)


def test_demo_reset_removes_investigation_data_and_preserves_configuration(
    api_client,
):
    client, testing_session = api_client
    with testing_session() as db:
        camera = Camera(name="Demo camera")
        db.add(camera)
        db.flush()
        db.add_all(
            [
                Zone(
                    camera_id=camera.id,
                    zone_type="platform",
                    polygon=[[0, 0], [1, 0], [1, 1]],
                ),
                Officer(name="Demo officer"),
                Playbook(
                    name="Demo playbook",
                    incident_type="crowd_compression",
                    actions=["Observe"],
                ),
            ]
        )
        report = Report(report_id="report-reset")
        investigation = Investigation(
            investigation_id="investigation-reset",
            report=report,
        )
        candidate = CandidateClip(
            candidate_id="candidate-reset",
            investigation=investigation,
        )
        db.add(candidate)
        db.flush()
        db.add_all(
            [
                InvestigationTimelineEntry(
                    investigation_id=investigation.id,
                    candidate_id=candidate.id,
                ),
                AuditEvent(
                    entity_type="report",
                    entity_id=report.report_id,
                    action="created",
                ),
                AuditEvent(
                    entity_type="incident",
                    entity_id="incident-preserved",
                    action="created",
                ),
            ]
        )
        db.commit()

    response = client.post("/api/v1/demo/reset")

    assert response.status_code == 200
    assert response.json()["deleted"] == {
        "timeline_entries": 1,
        "candidate_clips": 1,
        "investigations": 1,
        "reports": 1,
        "audit_events": 1,
    }
    with testing_session() as db:
        assert db.query(Report).count() == 0
        assert db.query(Investigation).count() == 0
        assert db.query(CandidateClip).count() == 0
        assert db.query(InvestigationTimelineEntry).count() == 0
        assert db.query(Camera).count() == 1
        assert db.query(Zone).count() == 1
        assert db.query(Officer).count() == 1
        assert db.query(Playbook).count() == 1
        assert db.query(AuditEvent).filter_by(entity_type="incident").count() == 1

