"use client";

import { useAuth } from "@/lib/auth-context";
import { Siren, Navigation, ShieldCheck, Shield, MapPin, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, type Variants } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const QUICK_ACTIONS = [
  { label: "SOS", icon: Siren, color: "text-alert", bg: "bg-alert/10" },
  { label: "Share Live Loc", icon: Navigation, color: "text-primary", bg: "bg-primary/10" },
  { label: "Nearest Security", icon: ShieldCheck, color: "text-teal", bg: "bg-teal/10" },
  { label: "Safe Tracking", icon: Shield, color: "text-signal", bg: "bg-signal/10" },
];

const RECENT_TRIPS = [
  {
    date: "17 July",
    time: "06:30",
    route: "Cipete Raya – Haji Nawi",
    status: "On Board",
  },
  {
    date: "17 July",
    time: "06:30",
    route: "Fatmawati – Cipete Raya",
    status: "Arrived",
  },
  {
    date: "17 July",
    time: "06:30",
    route: "Lebak Bulus – Fatmawati",
    status: "Arrived",
  },
];

export default function CommuterHomePage() {
  const { user } = useAuth();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6 pt-2 md:gap-8 md:pt-4">
      <motion.section variants={itemVariants} className="relative flex items-center justify-between gap-5 overflow-hidden rounded-2xl bg-primary p-6 text-white md:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-white/8 md:w-64" />
        <div className="min-w-0 relative z-10">
          <p className="mb-2 text-xs font-semibold text-white/65">Protected journey</p>
          <h1 className="truncate text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Welcome, {user?.name ?? "XXX"}!
          </h1>
          <div className="mt-3 flex h-2 w-36 overflow-hidden rounded-full bg-white/20 md:mt-4 md:w-48">
            <div className="h-full w-3/4 rounded-full bg-signal" />
          </div>
        </div>
        <span
          aria-hidden
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold text-primary md:h-16 md:w-16 md:text-3xl"
        >
          {(user?.name ?? "X").charAt(0)}
        </span>
      </motion.section>

      {/* Quick actions */}
      <motion.section variants={itemVariants}>
        <h2 className="mb-3 md:mb-4 text-[17px] md:text-lg font-bold text-ink tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {QUICK_ACTIONS.map(({ label, icon: Icon, color, bg }) => (
            <button
              key={label}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-hairline bg-white px-2 py-5 transition-colors hover:border-primary/40 hover:bg-surface-soft active:scale-95 md:py-6"
            >
              <div className={cn("flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-[18px] transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1", bg)}>
                <Icon className={cn("h-7 w-7 md:h-8 md:w-8", color)} strokeWidth={2} />
              </div>
              <span className="text-[13px] md:text-[14px] font-bold text-ink tracking-tight">{label}</span>
            </button>
          ))}
        </div>
      </motion.section>

      {/* Recent trips */}
      <motion.section variants={itemVariants}>
        <h2 className="mb-3 md:mb-4 text-[17px] md:text-lg font-bold text-ink tracking-tight">Recent Trips</h2>
        <div className="flex flex-col divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-white">
          {RECENT_TRIPS.map((trip, i) => (
            <div key={i} className="group flex items-center gap-3.5 md:gap-5 px-4 md:px-6 py-4 md:py-5 cursor-pointer hover:bg-cloud/40 transition-colors">
              <div className="w-14 shrink-0">
                <p className="text-[14px] font-black leading-tight text-ink">
                  {trip.date}
                </p>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mt-0.5">{trip.time}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cloud group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-hairline">
                <MapPin className="h-5 w-5 text-muted" />
              </div>
              <p className="min-w-0 flex-1 truncate text-[14px] font-bold text-ink">
                {trip.route}
              </p>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wide uppercase",
                  trip.status === "On Board" ? "bg-alert/10 text-alert" : "bg-signal/10 text-signal"
                )}
              >
                {trip.status}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-hairline group-hover:text-muted transition-colors ml-1" />
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
