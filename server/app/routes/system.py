from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..db.orm import (
    AuditEvent,
    CandidateClip,
    Investigation,
    InvestigationTimelineEntry,
    Report,
)

router = APIRouter(prefix="/api/v1", tags=["system"])


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": "0.1.0",
        "services": {
            "api": "ok",
            "database": "ok",
            "vision": "ok",
        },
    }


@router.get("/demo/scenarios")
def list_scenarios():
    return {
        "scenarios": [
            {"id": "restricted_intrusion", "name": "Restricted Zone Intrusion", "camera_id": "CAM_PLATFORM_B_01"},
            {"id": "person_down", "name": "Person Down Incident", "camera_id": "CAM_PLATFORM_B_01"},
            {"id": "crowd_compression", "name": "Crowd Compression", "camera_id": "CAM_PLATFORM_B_01"},
        ],
    }


@router.post("/demo/reset")
def reset_demo(db: Session = Depends(get_db)):
    deleted = {
        "timeline_entries": db.query(InvestigationTimelineEntry).delete(
            synchronize_session=False
        ),
        "candidate_clips": db.query(CandidateClip).delete(
            synchronize_session=False
        ),
        "investigations": db.query(Investigation).delete(
            synchronize_session=False
        ),
        "reports": db.query(Report).delete(synchronize_session=False),
        "audit_events": (
            db.query(AuditEvent)
            .filter(
                AuditEvent.entity_type.in_(
                    ("report", "investigation", "candidate")
                )
            )
            .delete(synchronize_session=False)
        ),
    }
    db.commit()
    return {
        "status": "reset",
        "message": "Post-incident demo data reset",
        "deleted": deleted,
    }
