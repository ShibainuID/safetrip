import { describe, expect, test } from "bun:test";

type PipelineModule = {
  pipelineClips: Array<{ src: string; event: string; stages: string[] }>;
};

async function loadPipelineModule(): Promise<PipelineModule | null> {
  try {
    const path = "./pipeline-data";
    return (await import(path)) as PipelineModule;
  } catch {
    return null;
  }
}

describe("Feature 1 landing pipeline", () => {
  test("maps three real demo clips through the four response stages", async () => {
    const pipelineApi = await loadPipelineModule();

    expect(pipelineApi).not.toBeNull();
    expect(pipelineApi!.pipelineClips).toHaveLength(3);

    for (const clip of pipelineApi!.pipelineClips) {
      expect(clip.src).toStartWith("/feature-1/");
      expect(clip.stages).toEqual(["Detect", "Track", "Assess", "Respond"]);
    }
  });
});
