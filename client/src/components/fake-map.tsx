import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Lightweight CSS map placeholder: streets texture with an
 * optional drawn route between an origin and destination pin.
 */
export function FakeMap({
  className,
  route = false,
}: {
  className?: string;
  route?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        className
      )}
      aria-label="Map preview"
      role="img"
      data-route={route ? "active" : "idle"}
    >
      <Image src="/image 19.png" alt="Map showing the SafeTrip route" fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
      {route && <div className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">Live route</div>}
    </div>
  );
}
