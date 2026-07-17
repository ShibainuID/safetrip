from __future__ import annotations

import json
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Mapping

from .config import CameraConfig, load_json, parse_camera_config
from .runner import RunResult


@dataclass(frozen=True)
class Feature1CatalogEntry:
    camera_config_path: Path
    camera: CameraConfig
    location: str
    public_filename: str


def _safe_public_filename(value: object) -> str:
    filename = str(value or "").strip()
    path = Path(filename)
    if (
        not filename
        or not filename.isascii()
        or path.name != filename
        or path.suffix.lower() != ".mp4"
    ):
        raise ValueError(
            "public_filename must be a plain ASCII .mp4 filename without directories"
        )
    return filename


def load_feature1_catalog(
    path: str | Path,
    *,
    require_videos: bool = True,
) -> tuple[Feature1CatalogEntry, ...]:
    catalog_path = Path(path)
    payload = load_json(catalog_path)
    raw_entries = payload.get("entries")
    if not isinstance(raw_entries, list) or not raw_entries:
        raise ValueError("feature1 catalog entries must be a non-empty list")

    entries: list[Feature1CatalogEntry] = []
    camera_ids: set[str] = set()
    public_filenames: set[str] = set()
    for raw in raw_entries:
        if not isinstance(raw, dict):
            raise ValueError("feature1 catalog entries must be objects")
        raw_config_path = Path(str(raw.get("camera_config", "")))
        config_path = (
            raw_config_path
            if raw_config_path.is_absolute()
            else catalog_path.parent / raw_config_path
        )
        if not config_path.is_file():
            raise ValueError(f"camera_config does not exist: {config_path}")
        camera = parse_camera_config(
            load_json(config_path),
            require_video=require_videos,
        )
        filename = _safe_public_filename(raw.get("public_filename"))
        location = str(raw.get("location", "")).strip()
        if not location:
            raise ValueError("feature1 catalog location is required")
        if camera.camera_id in camera_ids:
            raise ValueError(f"duplicate camera_id: {camera.camera_id}")
        if filename in public_filenames:
            raise ValueError(f"duplicate public_filename: {filename}")
        camera_ids.add(camera.camera_id)
        public_filenames.add(filename)
        entries.append(
            Feature1CatalogEntry(
                camera_config_path=config_path,
                camera=camera,
                location=location,
                public_filename=filename,
            )
        )
    return tuple(entries)


def transcode_browser_mp4(source: Path, destination: Path) -> None:
    ffmpeg = shutil.which("ffmpeg")
    if ffmpeg is None:
        raise RuntimeError(
            "ffmpeg is required to publish browser-compatible H.264 video"
        )
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-v",
            "error",
            "-i",
            source.as_posix(),
            "-map",
            "0:v:0",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "21",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            "-an",
            destination.as_posix(),
        ],
        check=True,
    )


def publish_feature1_outputs(
    entries: list[Feature1CatalogEntry] | tuple[Feature1CatalogEntry, ...],
    results: Mapping[str, RunResult],
    publish_root: str | Path,
    *,
    transcoder: Callable[[Path, Path], None] = transcode_browser_mp4,
) -> Path:
    destination_root = Path(publish_root)
    destination_root.mkdir(parents=True, exist_ok=True)
    feeds: list[dict[str, object]] = []

    for entry in entries:
        result = results.get(entry.camera.camera_id)
        if result is None:
            raise RuntimeError(
                f"pipeline result is missing for {entry.camera.camera_id}"
            )
        annotated_value = result.output_paths.get("annotated_video")
        annotated_path = Path(annotated_value) if annotated_value else None
        if annotated_path is None or not annotated_path.is_file():
            raise RuntimeError(
                f"annotated video is missing for {entry.camera.camera_id}"
            )

        destination = destination_root / entry.public_filename
        temporary_destination = destination.with_suffix(".tmp.mp4")
        temporary_destination.unlink(missing_ok=True)
        try:
            transcoder(annotated_path, temporary_destination)
            temporary_destination.replace(destination)
        finally:
            temporary_destination.unlink(missing_ok=True)

        raw_counts = result.summary.get("incident_counts", {})
        incident_counts = raw_counts if isinstance(raw_counts, dict) else {}
        incident_types = sorted(
            str(event_type)
            for event_type, count in incident_counts.items()
            if isinstance(count, (int, float)) and count > 0
        )
        incident_count = sum(
            int(count)
            for count in incident_counts.values()
            if isinstance(count, (int, float)) and count > 0
        )
        feeds.append(
            {
                "camera_id": entry.camera.camera_id,
                "name": entry.camera.name,
                "location": entry.location,
                "video_src": (
                    f"/videos/feature-1-processed/{entry.public_filename}"
                ),
                "incident_count": incident_count,
                "incident_types": incident_types,
                "source": "prerecorded_pipeline_output",
            }
        )

    manifest_path = destination_root / "manifest.json"
    temporary_manifest = destination_root / "manifest.tmp.json"
    temporary_manifest.write_text(
        json.dumps({"schema_version": 1, "feeds": feeds}, indent=2) + "\n",
        encoding="utf-8",
    )
    temporary_manifest.replace(manifest_path)
    return manifest_path
