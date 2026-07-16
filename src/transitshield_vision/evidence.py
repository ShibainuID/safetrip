from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Sequence

from .schemas import Incident


@dataclass(frozen=True)
class EvidenceFrame:
    timestamp_seconds: float
    raw_frame: Any
    annotated_frame: Any


def evidence_paths(incident_id: str, root: str | Path = "outputs/incidents") -> dict[str, str]:
    base = Path(root) / incident_id
    return {
        "snapshot_raw": (base / "snapshot_raw.jpg").as_posix(),
        "snapshot_annotated": (base / "snapshot_annotated.jpg").as_posix(),
        "clip": (base / "evidence.mp4").as_posix(),
        "metadata": (base / "metadata.json").as_posix(),
    }


def ensure_evidence_directory(incident_id: str, root: str | Path = "outputs/incidents") -> Path:
    path = Path(root) / incident_id
    path.mkdir(parents=True, exist_ok=True)
    return path


def write_evidence(
    incident: Incident,
    frames: Sequence[EvidenceFrame],
    *,
    fps: float,
    root: str | Path = "outputs/incidents",
    cv2_module: Any = None,
) -> dict[str, str]:
    if not frames:
        raise ValueError("at least one evidence frame is required")
    if fps <= 0:
        raise ValueError("evidence FPS must be positive")
    if cv2_module is None:
        try:
            import cv2 as cv2_module
        except ImportError as error:
            raise RuntimeError("opencv-python is required to write evidence") from error

    directory = ensure_evidence_directory(incident.incident_id, root)
    paths = {
        "snapshot_raw": (directory / "snapshot_raw.jpg").as_posix(),
        "snapshot_annotated": (directory / "snapshot_annotated.jpg").as_posix(),
        "clip": (directory / "evidence.mp4").as_posix(),
        "metadata": (directory / "metadata.json").as_posix(),
    }
    incident.evidence = paths
    Path(paths["metadata"]).write_text(json.dumps(incident.to_dict(), indent=2, sort_keys=True), encoding="utf-8")

    snapshot = min(frames, key=lambda frame: abs(frame.timestamp_seconds - incident.timestamp_detected_seconds))
    if not cv2_module.imwrite(paths["snapshot_raw"], snapshot.raw_frame):
        raise RuntimeError(f"failed to write raw evidence snapshot: {paths['snapshot_raw']}")
    if not cv2_module.imwrite(paths["snapshot_annotated"], snapshot.annotated_frame):
        raise RuntimeError(f"failed to write annotated evidence snapshot: {paths['snapshot_annotated']}")

    height, width = frames[0].annotated_frame.shape[:2]
    writer = cv2_module.VideoWriter(paths["clip"], cv2_module.VideoWriter_fourcc(*"mp4v"), fps, (width, height))
    if not writer.isOpened():
        raise RuntimeError(f"failed to open evidence video writer: {paths['clip']}")
    try:
        for frame in frames:
            writer.write(frame.annotated_frame)
    finally:
        writer.release()
    return paths
