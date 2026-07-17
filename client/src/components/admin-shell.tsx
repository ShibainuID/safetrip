"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Cctv,
  TriangleAlert,
  Search,
  LogOut,
  CircleUserRound,
} from "lucide-react";
import { useRoleGuard, useAuth } from "@/lib/auth-context";
import { BrandLogo } from "@/components/brand-logo";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/monitoring", label: "Live Monitoring", icon: Cctv },
  { href: "/dashboard/incidents", label: "Incident Report", icon: TriangleAlert },
  { href: "/dashboard/investigation", label: "Investigation", icon: Search },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const user = useRoleGuard("officer");
  const { logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <div className="operator-theme flex min-h-screen flex-col bg-cloud text-ink">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-hairline bg-midnight px-5 text-white lg:px-8">
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-extrabold tracking-[-0.035em]">
            <BrandLogo light className="text-lg" />
          </Link>
          <div className="hidden items-center gap-2 border-l border-white/15 pl-5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_12px_oklch(0.72_0.16_235)]" />
            <span className="text-xs font-semibold text-frost/65">Operations online</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-right sm:flex">
            <CircleUserRound className="h-5 w-5 text-frost/60" />
            <div><p className="text-xs font-semibold">Control room</p><p className="text-[10px] text-frost/50">{user.role}</p></div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="rounded-full p-2 text-frost/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 items-start">
        <aside className="sticky top-16 flex h-[calc(100vh-4rem)] w-[72px] shrink-0 flex-col gap-2 border-r border-hairline bg-white py-5 md:w-60 md:px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center justify-center gap-3 rounded-xl py-3 transition-colors md:justify-start md:px-4",
                  active
                    ? "bg-signal text-signal-ink"
                    : "text-muted hover:bg-surface-strong hover:text-ink",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden text-sm font-semibold md:block">{label}</span>
                {active && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-signal-ink/60 md:block" />}
              </Link>
            );
          })}
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 p-5 md:p-7 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
