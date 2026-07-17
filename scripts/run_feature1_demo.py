from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from transitshield_vision.config import (  # noqa: E402
    load_json,
    parse_event_rules,
    parse_runtime_config,
    set_deterministic_seed,
)
from transitshield_vision.feature1_demo import (  # noqa: E402
    load_feature1_catalog,
    publish_feature1_outputs,
)
from transitshield_vision.runner import run_pipeline, write_library_result  # noqa: E402


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Run all Feature 1 prerecorded videos through YOLO and publish their "
            "annotated outputs for Live Monitoring."
        )
    )
    parser.add_argument("--catalog", default="configs/feature1_demo.json")
    parser.add_argument("--runtime-config", default="configs/runtime.json")
    parser.add_argument("--event-rules", default="configs/event_rules.json")
    parser.add_argument("--output-root", default="outputs/feature-1")
    parser.add_argument(
        "--publish-root",
        default="client/public/videos/feature-1-processed",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()
    runtime = parse_runtime_config(load_json(args.runtime_config))
    if runtime.execution_mode != "full_ai":
        raise ValueError(
            "Feature 1 publishing requires execution_mode full_ai so every "
            "published video contains real YOLO pipeline annotations"
        )
    rules = parse_event_rules(load_json(args.event_rules))
    entries = load_feature1_catalog(args.catalog, require_videos=True)
    set_deterministic_seed(runtime.random_seed)

    output_root = Path(args.output_root)
    results = {}
    for index, entry in enumerate(entries, start=1):
        print(
            f"[{index}/{len(entries)}] Processing {entry.camera.name} "
            f"({Path(entry.camera.video_path).name})",
            flush=True,
        )
        camera_output = output_root / "cameras" / entry.camera.camera_id
        result = run_pipeline(
            runtime,
            entry.camera,
            rules,
            output_root=camera_output,
        )
        results[entry.camera.camera_id] = result

    library_paths = write_library_result(list(results.values()), output_root)
    manifest_path = publish_feature1_outputs(
        entries,
        results,
        args.publish_root,
    )
    print(
        json.dumps(
            {
                "camera_count": len(entries),
                "library": library_paths,
                "manifest": manifest_path.as_posix(),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
