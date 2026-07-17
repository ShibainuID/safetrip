import { describe, expect, test } from "bun:test";
import { CCTV_REVOLUTION_SECONDS, getCctvPose } from "./cctv-motion";

describe("CCTV hero motion", () => {
  test("completes a continuous 360-degree revolution every eight seconds", () => {
    expect(CCTV_REVOLUTION_SECONDS).toBe(8);

    const start = getCctvPose({ seconds: 0, pointerY: 0, reduceMotion: false });
    const quarter = getCctvPose({ seconds: 2, pointerY: 0, reduceMotion: false });
    const end = getCctvPose({ seconds: 8, pointerY: 0, reduceMotion: false });

    expect(quarter.yaw - start.yaw).toBeCloseTo(Math.PI / 2, 8);
    expect(end.yaw - start.yaw).toBeCloseTo(Math.PI * 2, 8);
  });

  test("keeps reduced-motion mode at a stable presentation angle", () => {
    const start = getCctvPose({ seconds: 0, pointerY: -1, reduceMotion: true });
    const later = getCctvPose({ seconds: 20, pointerY: 1, reduceMotion: true });

    expect(later).toEqual(start);
  });
});
