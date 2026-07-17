import { clsx } from "clsx";

type BrandLogoProps = {
  light?: boolean;
  compact?: boolean;
  className?: string;
};

export function BrandLogo({ light = false, compact = false, className }: BrandLogoProps) {
  return (
    <span
      aria-label="SafeTrip"
      className={clsx(
        "inline-flex items-center gap-2.5 font-extrabold tracking-[-0.035em]",
        light ? "text-white" : "text-ink",
        className,
      )}
    >
      <span
        className={clsx(
          "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
          light ? "bg-signal text-signal-ink" : "bg-primary text-white",
        )}
      >
        <svg
          data-logo-mark="route-s"
          viewBox="0 0 32 32"
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
        >
          <path
            d="M23.5 8.5H13.25c-3.2 0-5.25 1.55-5.25 4s2.05 4 5.25 4h5.5c3.2 0 5.25 1.55 5.25 4s-2.05 4-5.25 4H8.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="24" cy="8.5" r="2.25" fill="currentColor" />
          <circle cx="8" cy="24.5" r="2.25" fill="currentColor" />
        </svg>
      </span>
      {!compact && <span>SafeTrip</span>}
    </span>
  );
}
