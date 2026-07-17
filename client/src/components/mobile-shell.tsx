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
    <div className="flex min-h-screen bg-cloud text-ink md:justify-center">
      <div className="relative flex min-h-screen w-full flex-col md:flex-row md:max-w-7xl bg-cloud md:shadow-none border-x border-hairline md:border-none max-w-[420px] md:max-w-none mx-auto shadow-sm">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex h-16 shrink-0 items-center justify-center bg-white border-b border-hairline sticky top-0 z-30">
          <span className="text-lg font-extrabold tracking-tight text-primary">
            Safe Trip
          </span>
        </header>

        {/* Desktop Sidebar (Hidden on Mobile) */}
        <aside className="hidden md:flex sticky top-0 h-screen w-64 shrink-0 flex-col bg-white border-r border-hairline py-6 px-4 z-30 shadow-[4px_0_24px_rgba(16,24,40,0.02)]">
          <div className="mb-8 px-4 flex items-center justify-between">
            <span className="text-2xl font-extrabold tracking-[0.1em] text-primary">
              SAFE TRIP
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
                    "group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300",
                    active
                      ? "bg-primary text-white shadow-[0_4px_12px_rgba(0,82,255,0.2)]"
                      : "text-muted hover:bg-surface-strong hover:text-ink hover:translate-x-1"
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
        <main className="flex-1 overflow-y-auto px-4 pb-28 pt-5 md:px-10 md:py-8 lg:px-12 bg-cloud">
          <div className="mx-auto w-full max-w-5xl">
            {children}
          </div>
        </main>

        {/* Mobile Bottom nav (Hidden on Desktop) */}
        <nav className="md:hidden fixed bottom-0 left-1/2 z-30 w-full max-w-[420px] -translate-x-1/2 rounded-t-[28px] bg-white/90 backdrop-blur-xl border-t border-hairline shadow-[0_-8px_30px_rgba(0,0,0,0.04)] px-3 py-3 pb-safe">
          <ul className="flex items-center justify-around">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href} className="flex-1 flex justify-center">
                  <Link
                    href={href}
                    className={cn(
                      "relative flex w-16 flex-col items-center gap-1 rounded-full py-2 transition-all active:scale-95",
                      active ? "text-primary" : "text-muted hover:text-ink"
                    )}
                  >
                    {active && (
                      <span className="absolute inset-0 rounded-2xl bg-primary/10 -z-10" />
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
// Force Turbopack rebuild 2
