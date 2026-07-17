import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
    >
      <img src="/image 19.png" alt="Map" className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
}
