"use client";

import { useEffect, useState } from "react";
import { Check, Crosshair, Route, ShieldAlert } from "lucide-react";
import { pipelineClips } from "./pipeline-data";

const stageIcons = [Crosshair, Route, ShieldAlert, Check];

export function PipelineShowcase() {
  const [activeClip, setActiveClip] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const interval = window.setInterval(() => {
      setActiveStage((stage) => (stage + 1) % 4);
    }, 1900);
    return () => window.clearInterval(interval);
  }, []);

  const clip = pipelineClips[activeClip];

  return (
    <div className="overflow-hidden rounded-2xl bg-[#091323] text-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_16px_oklch(0.72_0.16_235)]" />
          <div>
            <p className="text-sm font-semibold">Feature 1 · Live pipeline</p>
            <p className="text-xs text-frost/65">YOLO11 + ByteTrack output · human review required</p>
          </div>
        </div>
        <span className="rounded-full bg-white/8 px-3 py-1.5 text-xs text-frost/75">
          {clip.location}
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.45fr_0.55fr]">
        <div className="relative min-h-[330px] overflow-hidden bg-black md:min-h-[520px]">
          <video
            key={clip.src}
            src={clip.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(2,6,14,.88))]" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-signal">{clip.signal}</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{clip.event}</p>
            </div>
            <span className="hidden rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs backdrop-blur-sm sm:block">
              Full-AI annotated feed
            </span>
          </div>
        </div>

        <aside className="flex flex-col p-5 md:p-7">
          <p className="text-sm leading-relaxed text-frost/70">{clip.description}</p>
          <ol className="mt-7 flex flex-1 flex-col justify-center gap-2">
            {clip.stages.map((stage, index) => {
              const Icon = stageIcons[index];
              const current = activeStage === index;
              return (
                <li
                  key={stage}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                    current ? "bg-primary text-white" : "text-frost/55"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-semibold">{stage}</span>
                  <span className="ml-auto text-[10px]">0{index + 1}</span>
                </li>
              );
            })}
          </ol>
          <div className="mt-7 border-t border-white/10 pt-5">
            <p className="mb-3 text-xs text-frost/50">Choose scenario</p>
            <div className="flex flex-wrap gap-2">
              {pipelineClips.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveClip(index);
                    setActiveStage(0);
                  }}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                    index === activeClip
                      ? "bg-signal text-signal-ink"
                      : "bg-white/8 text-frost/70 hover:bg-white/14"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
