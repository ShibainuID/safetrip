export const CCTV_REVOLUTION_SECONDS = 8;

type CctvPoseOptions = {
  seconds: number;
  pointerY: number;
  reduceMotion: boolean;
};

export function getCctvPose({ seconds, pointerY, reduceMotion }: CctvPoseOptions) {
  if (reduceMotion) {
    return { yaw: -0.65, pitch: -0.06, lift: 0.15 };
  }

  return {
    yaw: -0.65 + (seconds / CCTV_REVOLUTION_SECONDS) * Math.PI * 2,
    pitch: -0.06 + pointerY * 0.055,
    lift: 0.15 + Math.sin(seconds * 0.9) * 0.025,
  };
}
