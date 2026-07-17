export type ProcessedFeature1Feed = {
  camera_id: string;
  name: string;
  location: string;
  video_src: string;
  incident_count: number;
  incident_types: string[];
  source: "prerecorded_pipeline_output";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseFeed(value: unknown): ProcessedFeature1Feed | null {
  if (!isRecord(value)) return null;
  const {
    camera_id,
    name,
    location,
    video_src,
    incident_count,
    incident_types,
    source,
  } = value;
  if (
    typeof camera_id !== "string" ||
    !camera_id.trim() ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof location !== "string" ||
    !location.trim() ||
    typeof video_src !== "string" ||
    !video_src.startsWith("/videos/feature-1-processed/") ||
    !video_src.endsWith(".mp4") ||
    typeof incident_count !== "number" ||
    !Number.isInteger(incident_count) ||
    incident_count < 0 ||
    !Array.isArray(incident_types) ||
    !incident_types.every((item) => typeof item === "string") ||
    source !== "prerecorded_pipeline_output"
  ) {
    return null;
  }
  return {
    camera_id,
    name,
    location,
    video_src,
    incident_count,
    incident_types,
    source,
  };
}

export function parseProcessedFeedManifest(
  value: unknown,
): ProcessedFeature1Feed[] {
  if (
    !isRecord(value) ||
    value.schema_version !== 1 ||
    !Array.isArray(value.feeds)
  ) {
    return [];
  }
  return value.feeds
    .map(parseFeed)
    .filter((feed): feed is ProcessedFeature1Feed => feed !== null);
}
