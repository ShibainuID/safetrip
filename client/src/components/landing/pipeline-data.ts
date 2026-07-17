export const PIPELINE_STAGES = ["Detect", "Track", "Assess", "Respond"] as const;

export type PipelineClip = {
  id: string;
  event: string;
  location: string;
  src: string;
  description: string;
  signal: string;
  stages: string[];
};

export const pipelineClips: PipelineClip[] = [
  {
    id: "crowd",
    event: "Crowd compression",
    location: "Concourse A · Camera 04",
    src: "/feature-1/crowd-compression.mp4",
    description:
      "Density rises while average movement slows inside a monitored concourse zone.",
    signal: "Elevated density",
    stages: [...PIPELINE_STAGES],
  },
  {
    id: "person-down",
    event: "Possible person down",
    location: "Platform 2 · Camera 07",
    src: "/feature-1/person-down.mp4",
    description:
      "A horizontal posture and low movement persist long enough to require operator review.",
    signal: "Review required",
    stages: [...PIPELINE_STAGES],
  },
  {
    id: "queue",
    event: "Passenger queue pressure",
    location: "Boarding gate · Camera 11",
    src: "/feature-1/passenger-queue.mp4",
    description:
      "The camera view becomes operational context for crowd flow and dispatch decisions.",
    signal: "Flow monitored",
    stages: [...PIPELINE_STAGES],
  },
];
