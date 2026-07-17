from __future__ import annotations

import json
from pathlib import Path

import pytest

from transitshield_vision.feature1_demo import (
    load_feature1_catalog,
    publish_feature1_outputs,
)
from transitshield_vision.runner import RunResult
from scripts.run_feature1_demo import build_parser


ROOT = Path(__file__).resolve().parents[1]


def test_batch_runner_defaults_target_canonical_and_public_output_folders() -> None:
    args = build_parser().parse_args([])

    assert args.catalog == "configs/feature1_demo.json"
    assert args.output_root == "outputs/feature-1"
    assert args.publish_root == "client/public/videos/feature-1-processed"


def test_repository_feature1_catalog_covers_all_six_source_videos() -> None:
    entries = load_feature1_catalog(ROOT / "configs/feature1_demo.json")

    source_videos = {Path(entry.camera.video_path).name for entry in entries}
    repository_videos = {
        path.name for path in (ROOT / "data/demo-videos/feature-1").glob("*.mp4")
    }

    assert len(entries) == 6
    assert source_videos == repository_videos
    assert len({entry.camera.camera_id for entry in entries}) == 6
    assert all(entry.public_filename.isascii() for entry in entries)


def test_catalog_rejects_unsafe_public_filename(tmp_path: Path) -> None:
    camera_path = tmp_path / "camera.json"
    video_path = tmp_path / "input.mp4"
    video_path.write_bytes(b"video")
    camera_path.write_text(
        json.dumps(
            {
                "camera_id": "CAM_TEST",
                "name": "Test camera",
                "video_path": video_path.as_posix(),
                "fps_override": None,
                "enabled_events": ["possible_person_down"],
                "zones": [
                    {
                        "zone_id": "ZONE_NORMAL",
                        "zone_type": "normal",
                        "polygon": [[0, 0], [10, 0], [10, 10]],
                        "capacity": None,
                        "risk_multiplier": 1,
                        "danger_direction": None,
                    }
                ],
            }
        ),
        encoding="utf-8",
    )
    catalog_path = tmp_path / "catalog.json"
    catalog_path.write_text(
        json.dumps(
            {
                "entries": [
                    {
                        "camera_config": camera_path.as_posix(),
                        "location": "Test station",
                        "public_filename": "../escape.mp4",
                    }
                ]
            }
        ),
        encoding="utf-8",
    )

    with pytest.raises(ValueError, match="public_filename"):
        load_feature1_catalog(catalog_path)


def test_publisher_copies_annotated_video_and_writes_browser_manifest(
    tmp_path: Path,
) -> None:
    entries = load_feature1_catalog(ROOT / "configs/feature1_demo.json")
    first = entries[0]
    annotated = tmp_path / "pipeline" / "annotated.mp4"
    annotated.parent.mkdir()
    annotated.write_bytes(b"annotated-video")
    result = RunResult(
        incidents=(),
        summary={
            "camera_id": first.camera.camera_id,
            "incident_counts": {"possible_person_down": 1},
            "warnings": [],
        },
        output_paths={
            "annotated_video": annotated.as_posix(),
            "incidents": None,
            "pipeline_summary": None,
            "track_cache": None,
        },
    )
    publish_root = tmp_path / "public" / "videos" / "feature-1-processed"
    transcode_calls: list[tuple[Path, Path]] = []

    def fake_transcoder(source: Path, destination: Path) -> None:
        transcode_calls.append((source, destination))
        destination.write_bytes(source.read_bytes())

    manifest_path = publish_feature1_outputs(
        [first],
        {first.camera.camera_id: result},
        publish_root,
        transcoder=fake_transcoder,
    )

    published = publish_root / first.public_filename
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert transcode_calls == [
        (annotated, publish_root / f"{Path(first.public_filename).stem}.tmp.mp4")
    ]
    assert published.read_bytes() == b"annotated-video"
    assert manifest == {
        "schema_version": 1,
        "feeds": [
            {
                "camera_id": first.camera.camera_id,
                "name": first.camera.name,
                "location": first.location,
                "video_src": f"/videos/feature-1-processed/{first.public_filename}",
                "incident_count": 1,
                "incident_types": ["possible_person_down"],
                "source": "prerecorded_pipeline_output",
            }
        ],
    }


def test_publisher_fails_when_pipeline_did_not_generate_annotated_video(
    tmp_path: Path,
) -> None:
    entries = load_feature1_catalog(ROOT / "configs/feature1_demo.json")
    first = entries[0]
    result = RunResult(
        incidents=(),
        summary={"camera_id": first.camera.camera_id, "incident_counts": {}},
        output_paths={
            "annotated_video": None,
            "incidents": None,
            "pipeline_summary": None,
            "track_cache": None,
        },
    )

    with pytest.raises(RuntimeError, match="annotated video"):
        publish_feature1_outputs(
            [first],
            {first.camera.camera_id: result},
            tmp_path / "published",
        )
