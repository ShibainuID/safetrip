"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Camera,
  ClipboardList,
  MapPin,
  Radio,
  Search,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight text-primary ${className}`}>
      Safe Trip
    </span>
  );
}

function Pill({
  children,
  variant = "primary",
  href = "#",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 h-11 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-active"
      : "bg-surface-strong text-ink hover:bg-hairline";
  
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={`${base} ${styles}`}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-cloud text-ink font-sans">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-hairline/70 bg-cloud/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Wordmark className="text-xl" />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#platform" className="hover:text-ink">Platform</a>
            <a href="#workflow" className="hover:text-ink">Workflow</a>
            <a href="#investigate" className="hover:text-ink">Investigate</a>
            <a href="#operators" className="hover:text-ink">For operators</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden text-sm font-medium text-ink hover:text-primary sm:inline">
              Sign in
            </Link>
            <Pill href="/login">
              Run Demo <ArrowRight className="h-4 w-4" />
            </Pill>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <motion.div variants={fadeUpVariants}>
              <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Live safety operations for public transit
              </span>
              <h1 className="mt-6 font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl">
                Turn passive CCTV into an
                <span className="text-primary"> active safety layer.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                <Wordmark /> AI unifies detection, response, and investigation on one
                control-room console - so operators move from risk detected to incident
                resolved in minutes, not hours.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Pill href="/login">
                  Run Demo <ArrowRight className="h-4 w-4" />
                </Pill>
                <Pill variant="secondary" href="#workflow">
                  See the workflow
                </Pill>
              </div>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-hairline pt-8">
                {[
                  ["3×", "faster incident triage"],
                  ["24/7", "camera coverage"],
                  ["100%", "human-in-the-loop"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-heading text-2xl font-semibold text-ink">{k}</dt>
                    <dd className="mt-1 text-xs leading-relaxed text-muted">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Console preview */}
            <motion.div variants={fadeUpVariants}>
              <ConsoleMock />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted band */}
      <section className="border-y border-hairline bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-6 text-sm font-semibold text-muted">
          <span>Built for transit safety teams</span>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <img src="/Untitled design (26) 1.png" alt="Transit Partner" className="h-14 md:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/Untitled design (26) 2.png" alt="Transit Partner" className="h-14 md:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/Untitled design (26) 3.png" alt="Transit Partner" className="h-14 md:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/Untitled design (26) 4.png" alt="Transit Partner" className="h-14 md:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </section>

      {/* Platform / Features */}
      <section id="platform" className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">
            The platform
          </p>
          <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Two connected workflows. One calm console.
          </h2>
          <p className="mt-4 text-muted">
            <Wordmark /> AI works alongside your existing camera infrastructure - no
            rip-and-replace. Operators get context; officers get clarity; investigators
            get evidence.
          </p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {features.map((f) => (
            <motion.article
              variants={fadeUpVariants}
              key={f.title}
              className="rounded-[24px] border border-hairline bg-white p-7 shadow-sm transition-shadow hover:shadow-[0_2px_12px_rgba(16,24,40,0.08)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-full bg-surface-strong text-ink">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 font-heading text-lg font-semibold text-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              <ul className="mt-5 space-y-2 text-sm text-ink/80">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="border-y border-hairline bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <motion.div variants={fadeUpVariants}>
              <p className="text-sm font-semibold text-primary">
                Live safety response
              </p>
              <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-ink">
                Risk detected → response assigned, in minutes.
              </h2>
              <p className="mt-4 text-muted">
                A rule-based risk engine enriches every event with zone, duration, crowd
                context, and available personnel - then surfaces an approved playbook
                for the operator to confirm.
              </p>
              <div className="mt-8 space-y-4">
                {liveSteps.map((s, i) => (
                  <div
                    key={s.title}
                    className="flex gap-4 rounded-2xl border border-hairline bg-cloud p-4"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-heading text-sm font-semibold text-ink">
                        {s.title}
                      </div>
                      <div className="text-sm text-muted">{s.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariants}>
              <IncidentMock />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Investigation */}
      <section id="investigate" className="mx-auto max-w-6xl px-6 py-24">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <motion.div variants={fadeUpVariants}>
            <InvestigateMock />
          </motion.div>
          <motion.div variants={fadeUpVariants}>
            <p className="text-sm font-semibold text-primary">
              Post-incident investigation
            </p>
            <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-ink">
              A natural-language report becomes searchable evidence.
            </h2>
            <p className="mt-4 text-muted">
              Describe the incident in plain language. A vision-language model extracts
              structured attributes - time window, location, clothing, direction - then
              filters cameras and returns candidate clips for human verification.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Structured attributes", "Time, zone, clothing, accessories, direction."],
                ["Camera filtering", "Narrow footage by zone and time window."],
                ["VLM-assisted matches", "Explains why each candidate may fit."],
                ["Verified timeline", "Human confirms; system reconstructs the path."],
              ].map(([t, b]) => (
                <div key={t} className="rounded-2xl border border-hairline bg-white p-5">
                  <div className="font-heading text-sm font-semibold text-ink">{t}</div>
                  <div className="mt-1 text-sm text-muted">{b}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Operators */}
      <section id="operators" className="border-y border-hairline bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">
              Built for the people on shift
            </p>
            <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-ink">
              One platform. Every role in the loop.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {roles.map((r) => (
              <div
                key={r.title}
                className="rounded-[24px] border border-hairline bg-cloud p-7"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white">
                    <r.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-heading text-base font-semibold text-ink">
                      {r.title}
                    </div>
                    <div className="text-xs text-muted">{r.tag}</div>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-primary">
              Product principles
            </p>
            <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-ink">
              Detect risky situations. Not criminal intent.
            </h2>
            <p className="mt-4 text-muted">
              <Wordmark /> AI is designed for operational safety. Humans stay
              responsible for every final decision.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {principles.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 rounded-2xl border border-hairline bg-white p-4 text-sm text-ink"
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-signal" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="overflow-hidden rounded-[24px] border border-hairline bg-ink px-8 py-14 text-white md:px-14 md:py-20">
          <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
                Ready to see it running on your feeds?
              </h2>
              <p className="mt-4 max-w-xl text-white/70">
                We'll walk you through a live incident, a full response cycle, and an
                investigation search - using prerecorded footage from a working transit
                deployment.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/login"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-white hover:bg-primary-active"
              >
                Run Demo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 md:flex-row md:items-center">
          <div className="flex items-center">
            <Wordmark className="text-lg" />
          </div>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} <Wordmark /> AI. Safety operations for public transit.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Camera,
    title: "AI-enriched CCTV alerts",
    body: "Turn existing feeds into contextual incidents with zone, duration, and crowd signals.",
    bullets: ["Crowd density & compression", "Restricted-zone entry", "Person-down detection"],
  },
  {
    icon: Zap,
    title: "Playbook-guided response",
    body: "Every alert ships with a risk score and an approved response playbook - never freeform AI.",
    bullets: ["Rule-based risk engine", "Predefined escalation paths", "Operator approval required"],
  },
  {
    icon: Search,
    title: "Natural-language investigation",
    body: "Describe an event in plain words. Get filtered footage and a verifiable timeline.",
    bullets: ["Structured attribute extraction", "Camera & time filtering", "Verified incident timeline"],
  },
];

const liveSteps = [
  { title: "Detect & enrich", body: "CCTV events are tagged with zone, duration, and crowd context." },
  { title: "Score & recommend", body: "Risk engine ranks severity and suggests an approved playbook." },
  { title: "Assign & track", body: "Dispatch the nearest available officer; monitor to resolution." },
];

const roles = [
  {
    icon: Radio,
    title: "Control-Room Operator",
    tag: "Detect · Prioritize · Coordinate",
    body: "Review alerts with full context, approve the recommended playbook, and assign the nearest officer without leaving the console.",
  },
  {
    icon: MapPin,
    title: "Field Safety Officer",
    tag: "Acknowledge · Respond · Resolve",
    body: "Receive clear location details, evidence snapshots, and step-by-step instructions. Update status from en route to resolved.",
  },
  {
    icon: ClipboardList,
    title: "Safety Supervisor",
    tag: "Investigate · Verify · Report",
    body: "Search candidate footage from a natural-language report, verify each clip, and reconstruct the incident timeline.",
  },
];

const principles = [
  "Keep humans responsible for final decisions",
  "Use predefined playbooks for operational safety",
  "Show evidence and contributing factors for each alert",
  "Process only the minimum video data required",
  "Integrate with existing CCTV - never replace it",
  "Prioritize fast, understandable workflows",
];

/* ---------------- Console mock ---------------- */

function ConsoleMock() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[36px] bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-2xl" />
      <img 
        src="/Group 1.png" 
        alt="Console Preview" 
        className="w-full h-auto rounded-[24px] border border-hairline shadow-sm"
      />
    </div>
  );
}

function IncidentMock() {
  return (
    <div className="relative">
      <img 
        src="/Group 2.png" 
        alt="Incident Workflow Preview" 
        className="w-full h-auto rounded-[24px] border border-hairline shadow-sm"
      />
    </div>
  );
}

function InvestigateMock() {
  return (
    <div className="relative">
      <img 
        src="/Group 3.png" 
        alt="Investigation Search Preview" 
        className="w-full h-auto rounded-[24px] border border-hairline shadow-sm"
      />
    </div>
  );
}

// small icon shim for lucide Users import unused? keep to avoid tree-shake noise
void Users;
