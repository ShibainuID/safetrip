"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Navigation, TriangleAlert, User } from "lucide-react";
import { useRoleGuard } from "@/lib/auth-context";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/track", label: "Track", icon: Navigation },
  { href: "/app/report", label: "Report", icon: TriangleAlert },
  { href: "/app/profile", label: "Profile", icon: User },
];

/**
 * Phone-framed commuter shell: navy header with centered
 * wordmark + floating bottom navigation. docs/DESIGN.md §5.
 */
export function MobileShell({ children }: { children: React.ReactNode }) {
  const user = useRoleGuard("commuter");
  const pathname = usePathname();

  if (!user) return null;

  return (
    <div className="commuter-theme flex min-h-screen bg-cloud text-ink md:justify-center">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-cloud md:max-w-7xl md:flex-row">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-hairline bg-white px-5 md:hidden">
          <span className="flex items-center gap-2 text-lg font-extrabold tracking-[-0.035em] text-ink">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-xs text-white">S</span>
            SafeTrip
          </span>
          <span className="flex items-center gap-2 text-xs font-semibold text-muted"><i className="h-2 w-2 rounded-full bg-signal" />Protected</span>
        </header>

        {/* Desktop Sidebar (Hidden on Mobile) */}
        <aside className="sticky top-0 z-30 hidden h-screen w-64 shrink-0 flex-col border-r border-hairline bg-white px-4 py-6 md:flex">
          <div className="mb-9 flex items-center justify-between px-3">
            <span className="flex items-center gap-2 text-xl font-extrabold tracking-[-0.035em] text-ink">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-xs text-white">S</span>SafeTrip
            </span>
          </div>
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors",
                    active
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-surface-strong hover:text-ink",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[15px] font-bold tracking-tight">{label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-cloud px-4 pb-28 pt-5 md:px-10 md:py-8 lg:px-12">
          <div className="mx-auto w-full max-w-5xl">
            {children}
          </div>
        </main>

        {/* Mobile Bottom nav (Hidden on Desktop) */}
        <nav className="fixed bottom-3 left-1/2 z-30 w-[calc(100%_-_24px)] max-w-[406px] -translate-x-1/2 rounded-2xl border border-hairline bg-white/95 px-3 py-2 shadow-[0_8px_8px_rgba(16,24,40,.12)] backdrop-blur-xl md:hidden">
          <ul className="flex items-center justify-around">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href} className="flex-1 flex justify-center">
                  <Link
                    href={href}
                    className={cn(
                      "relative flex w-16 flex-col items-center gap-1 rounded-xl py-2 transition-transform active:scale-95",
                      active ? "text-primary" : "text-muted hover:text-ink"
                    )}
                  >
                    {active && (
                      <span className="absolute inset-0 -z-10 rounded-xl bg-primary/10" />
                    )}
                    <Icon className={cn("h-5 w-5", active && "drop-shadow-sm")} strokeWidth={active ? 2.5 : 2} />
                    <span className="text-[10px] font-bold tracking-wide">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
