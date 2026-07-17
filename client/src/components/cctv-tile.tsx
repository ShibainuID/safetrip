import { Maximize2, ShieldAlert } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BoundingBox {
  /** percentages */
  x: number;
  y: number;
  w: number;
  h: number;
  kind: "flag" | "track";
}

/**
 * A CCTV feed placeholder tile: live dot + camera label,
 * expand affordance, and mock detection bounding boxes.
 */
export function CctvTile({
  label,
  boxes,
  alert = false,
  videoSrc,
}: {
  label: string;
  boxes: BoundingBox[];
  alert?: boolean;
  videoSrc?: string;
}) {
  return (
    <figure className="relative aspect-video overflow-hidden rounded-xl bg-[#111827]">
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: "url('/Group 1.png')" }} />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,14,.05),rgba(2,6,14,.72))]" />

      {/* Detection boxes */}
      {boxes.map((b, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "absolute rounded-[3px] border-[3px]",
            b.kind === "flag" ? "border-alert" : "border-signal"
          )}
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.w}%`,
            height: `${b.h}%`,
          }}
        />
      ))}

      {/* Urgent overlay (Dark scrim only for urgent) */}
      {alert && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/70">
          <ShieldAlert className="h-10 w-10 text-alert animate-pulse" />
          <span className="rounded-full bg-alert px-3 py-1 text-xs font-bold text-white">
            Security review
          </span>
        </div>
      )}

      {/* Camera label */}
      <figcaption className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[11px] font-medium text-white drop-shadow">
        <span className={cn("h-2 w-2 rounded-full", alert ? "bg-alert" : "bg-signal")} aria-hidden />
        {label}
      </figcaption>
      <Maximize2 className="absolute bottom-2 right-2 h-4 w-4 text-white/90 drop-shadow" />
    </figure>
  );
}
