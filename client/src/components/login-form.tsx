"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, homeForRole, type Role } from "@/lib/auth-context";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ArrowRight, MonitorCheck, TrainFront } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("commuter");
  const { login } = useAuth();
  const router = useRouter();

  // Handle Alt+C and Alt+O for demo autofill
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setEmail("commuter@safetrip.id");
        setRole("commuter");
      } else if (e.altKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        setEmail("officer@safetrip.id");
        setRole("officer");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(email, role);
    router.push(homeForRole(role));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-[480px]"
    >
      <div className="mb-9">
        <p className="mb-3 text-sm font-semibold text-primary">Select your SafeTrip workspace</p>
        <h2 className="text-4xl font-semibold tracking-[-0.04em] text-ink">Continue to the demo</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Choose a role and use any valid email address.
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <fieldset>
          <legend className="mb-2 block text-sm font-semibold text-ink">Role</legend>
          <div className="grid grid-cols-2 gap-3">
            {([
              ["commuter", "Commuter", TrainFront],
              ["officer", "Control room", MonitorCheck],
            ] as const).map(([value, label, Icon]) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={cn(
                  "flex min-h-24 flex-col items-start justify-between rounded-xl border p-4 text-left transition-colors",
                  role === value
                    ? "border-primary bg-primary text-white"
                    : "border-hairline bg-white text-ink hover:border-primary/45",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-bold">{label}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink">Email address</label>
          <input
            id="email"
            type="email"
            required
            placeholder={role === "officer" ? "officer@safetrip.id" : "commuter@safetrip.id"}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-xl border border-hairline bg-white px-4 text-ink placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="mt-1 flex flex-col gap-3">
          <button
            type="submit"
            className={cn(
              "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-midnight px-4",
              "text-sm font-bold text-white",
              "transition-colors hover:bg-primary",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Enter {role === "officer" ? "control room" : "commuter app"} <ArrowRight className="h-4 w-4" />
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
            <span>Quick fill:</span>
            <kbd className="rounded-lg border border-hairline bg-white px-2 py-1 font-sans font-semibold text-ink">Alt+C · Commuter</kbd>
            <kbd className="rounded-lg border border-hairline bg-white px-2 py-1 font-sans font-semibold text-ink">Alt+O · Officer</kbd>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
