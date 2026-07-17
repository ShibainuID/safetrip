import { describe, expect, test } from "bun:test";
import { parseProcessedFeedManifest } from "./processed-feeds";

const validFeed = {
  camera_id: "CAM_TA_01",
  name: "Platform Camera 01",
  location: "Tanah Abang Platform 1",
  video_src: "/videos/feature-1-processed/platform-1.mp4",
  incident_count: 1,
  incident_types: ["possible_person_down"],
  source: "prerecorded_pipeline_output",
};

describe("processed Feature 1 feed manifest", () => {
  test("parses browser-safe annotated feeds", () => {
    expect(
      parseProcessedFeedManifest({ schema_version: 1, feeds: [validFeed] }),
    ).toEqual([validFeed]);
  });

  test("filters invalid feed entries without hiding valid outputs", () => {
    const invalidPath = {
      ...validFeed,
      camera_id: "CAM_BAD",
      video_src: "https://untrusted.example/video.mp4",
    };
    const invalidCount = {
      ...validFeed,
      camera_id: "CAM_BAD_COUNT",
      incident_count: -1,
    };

    expect(
      parseProcessedFeedManifest({
        schema_version: 1,
        feeds: [invalidPath, validFeed, invalidCount],
      }),
    ).toEqual([validFeed]);
  });

  test("returns an empty list for an unsupported manifest", () => {
    expect(parseProcessedFeedManifest(null)).toEqual([]);
    expect(
      parseProcessedFeedManifest({ schema_version: 2, feeds: [validFeed] }),
    ).toEqual([]);
  });
});
