"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  Fingerprint,
  Radio,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PipelineShowcase } from "./pipeline-showcase";

const CctvScene = dynamic(
  () => import("./cctv-scene").then((module) => module.CctvScene),
  {
    ssr: false,
    loading: () => null,
  },
);

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-extrabold tracking-[-0.035em] ${light ? "text-white" : "text-ink"}`}>
      <span className={`grid h-7 w-7 place-items-center rounded-lg ${light ? "bg-signal text-signal-ink" : "bg-primary text-white"}`}>
        <Eye className="h-4 w-4" strokeWidth={2.4} />
      </span>
      SafeTrip
    </span>
  );
}

export function LandingPage() {
  return (
    <div className="overflow-x-clip bg-cloud text-ink">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between rounded-2xl border border-hairline bg-white/90 px-4 text-ink shadow-[0_8px_8px_rgba(16,24,40,.08)] backdrop-blur-xl md:px-6">
          <Link href="/" aria-label="SafeTrip home">
            <Wordmark />
          </Link>
          <nav aria-label="Landing navigation" className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#pipeline" className="transition-colors hover:text-ink">How it works</a>
            <a href="#response" className="transition-colors hover:text-ink">Response</a>
            <a href="#investigation" className="transition-colors hover:text-ink">Investigation</a>
            <a href="#principles" className="transition-colors hover:text-ink">Safety principles</a>
          </nav>
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Enter console <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative min-h-[900px] bg-white text-ink lg:min-h-screen">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,oklch(0.72_0.16_235/.18),transparent_32%),radial-gradient(circle_at_46%_88%,oklch(0.58_0.245_263/.06),transparent_36%)]" />
          <div className="relative mx-auto grid min-h-[900px] max-w-[1440px] items-end px-5 pb-8 pt-28 lg:min-h-screen lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:pb-10">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 pb-6 lg:pb-14"
            >
              <div className="mb-7 flex w-fit items-center gap-2 rounded-full border border-hairline bg-cloud px-3 py-2 text-xs text-muted">
                <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_14px_oklch(0.72_0.16_235)]" />
                Tanah Abang demo · System online
              </div>
              <h1 className="landing-display max-w-[780px] font-semibold">
                The station sees.
                <span className="block text-outline">Your team acts.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-muted md:text-lg">
                SafeTrip turns existing CCTV into explainable alerts, coordinated response,
                and searchable evidence—while people remain responsible for every decision.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  Run the live demo <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#pipeline"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-hairline px-5 text-sm font-semibold text-ink transition-colors hover:bg-cloud"
                >
                  Watch the pipeline <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            <div className="relative min-h-[460px] self-center lg:min-h-[680px]">
              <div className="absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20 shadow-[0_0_100px_oklch(0.58_0.245_263/.12)]" />
              <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
              <CctvScene />
              <div className="absolute bottom-8 right-0 hidden w-52 border-t border-hairline pt-3 text-xs text-muted xl:block">
                <span className="font-semibold text-ink">Camera intelligence</span>
                <br />Detection supports judgment. It never replaces it.
              </div>
            </div>

            <div className="col-span-full mt-4 grid overflow-hidden rounded-xl border border-hairline bg-cloud sm:grid-cols-4">
              {[
                ["01", "Detect", "Person + zone signals"],
                ["02", "Track", "Movement over time"],
                ["03", "Assess", "Transparent risk rules"],
                ["04", "Respond", "Human-approved action"],
              ].map(([number, title, detail], index) => (
                <div key={title} className={`flex gap-3 px-4 py-4 ${index ? "border-t border-hairline sm:border-l sm:border-t-0" : ""}`}>
                  <span className="text-xs text-signal">{number}</span>
                  <div><p className="text-sm font-semibold text-ink">{title}</p><p className="mt-0.5 text-xs text-muted">{detail}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pipeline" className="bg-[#e9edf4] px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1320px]">
            <motion.div {...reveal} className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <h2 className="landing-section-title max-w-4xl font-semibold">
                Watch one camera become an operational decision.
              </h2>
              <p className="max-w-md text-base leading-7 text-muted">
                Real Feature 1 demo clips show how SafeTrip adds context over time instead of firing an alert from a single frame.
              </p>
            </motion.div>
            <motion.div {...reveal}><PipelineShowcase /></motion.div>
          </div>
        </section>

        <section id="response" className="bg-white px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div {...reveal}>
              <p className="mb-6 text-sm font-semibold text-primary">From signal to coordinated action</p>
              <h2 className="landing-section-title font-semibold">Context first. Then the right response.</h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted">
                Every incident carries its evidence, contributing indicators, approved playbook, and available personnel into one calm operator flow.
              </p>
              <ol className="mt-10 border-t border-hairline">
                {[
                  ["Verify", "Review the clip and the signals behind the alert."],
                  ["Approve", "Confirm a predefined safety playbook—never freeform AI advice."],
                  ["Dispatch", "Assign the nearest officer and track the response to resolution."],
                ].map(([title, body], index) => (
                  <li key={title} className="grid grid-cols-[44px_1fr] gap-3 border-b border-hairline py-5">
                    <span className="text-xs font-semibold text-primary">0{index + 1}</span>
                    <div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted">{body}</p></div>
                  </li>
                ))}
              </ol>
            </motion.div>
            <motion.div {...reveal} className="relative overflow-hidden rounded-2xl bg-midnight p-3 md:p-5">
              <Image src="/Group 2.png" alt="SafeTrip operator incident response interface" width={1000} height={560} className="h-auto w-full rounded-xl" />
              <div className="mt-3 flex items-center justify-between px-2 pb-1 text-xs text-frost/60">
                <span>Operator evidence view</span><span className="text-signal">Human review active</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="investigation" className="relative overflow-hidden bg-primary px-5 py-24 text-white md:px-10 md:py-36">
          <div className="absolute -right-24 top-20 h-96 w-96 rounded-full border border-white/15" />
          <div className="absolute -right-10 top-36 h-64 w-64 rounded-full border border-signal/30" />
          <div className="relative mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div {...reveal} className="order-2 overflow-hidden rounded-2xl bg-midnight p-3 lg:order-1 md:p-5">
              <Image src="/Group 3.png" alt="SafeTrip post-incident evidence search interface" width={1000} height={560} className="h-auto w-full rounded-xl" />
              <div className="mt-3 grid grid-cols-3 gap-2 px-2 pb-1 text-xs text-frost/60"><span>Report parsed</span><span>Clips filtered</span><span className="text-signal">Timeline verified</span></div>
            </motion.div>
            <motion.div {...reveal} className="order-1 lg:order-2">
              <Search className="mb-8 h-10 w-10 text-signal" />
              <h2 className="landing-section-title font-semibold">Describe what happened. Find where it happened.</h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/75">
                A natural-language report becomes editable search attributes, candidate footage, and a human-verified timeline across cameras.
              </p>
              <div className="mt-9 flex flex-wrap gap-2">
                {["Time window", "Location", "Clothing", "Direction", "Camera path"].map((item) => (
                  <span key={item} className="rounded-full border border-white/20 px-3 py-2 text-xs text-white/80">{item}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-cloud px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto max-w-[1320px]">
            <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-sm font-semibold text-primary">One system, every person in the loop</p>
                <h2 className="mt-5 text-4xl font-semibold leading-none tracking-[-0.04em] md:text-6xl">Built around the shift—not the algorithm.</h2>
              </div>
              <div className="border-t border-hairline">
                {[
                  [Radio, "Control-room operator", "Prioritize alerts, approve playbooks, and coordinate response."],
                  [ShieldCheck, "Field safety officer", "Receive clear evidence, location, and step-by-step instructions."],
                  [Fingerprint, "Safety investigator", "Verify candidate clips and reconstruct a defensible timeline."],
                ].map(([Icon, title, body]) => {
                  const RoleIcon = Icon as typeof Radio;
                  return (
                    <div key={title as string} className="grid gap-4 border-b border-hairline py-7 sm:grid-cols-[56px_0.65fr_1fr] sm:items-center">
                      <RoleIcon className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-semibold">{title as string}</h3>
                      <p className="text-sm leading-6 text-muted">{body as string}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="principles" className="bg-midnight px-5 py-24 text-white md:px-10 md:py-36">
          <div className="mx-auto max-w-[1320px]">
            <motion.div {...reveal} className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-semibold text-signal">Safety technology with a visible boundary</p>
                <h2 className="landing-section-title mt-5 max-w-4xl font-semibold">Detect risky situations. Never invent criminal intent.</h2>
              </div>
              <ul className="border-t border-white/15">
                {[
                  "No face recognition",
                  "No alert from a single frame",
                  "No freeform response advice",
                  "No evidence accepted without human confirmation",
                ].map((principle) => (
                  <li key={principle} className="flex items-center gap-3 border-b border-white/15 py-5 text-sm text-frost/75">
                    <CheckCircle2 className="h-5 w-5 text-signal" />{principle}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <section className="bg-signal px-5 py-20 text-signal-ink md:px-10 md:py-28">
          <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div><p className="text-sm font-bold">SafeTrip live demonstration</p><h2 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-7xl">See the station move from signal to response.</h2></div>
            <Link href="/login" className="inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-midnight px-6 text-sm font-bold text-white transition-transform hover:-translate-y-1">Enter the demo <ChevronRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#050a12] px-5 py-10 text-white md:px-10">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-5 border-t border-white/12 pt-8 md:flex-row md:items-center">
          <Wordmark light />
          <p className="max-w-lg text-xs leading-5 text-frost/50">AI-assisted safety operations for public transit. Every consequential decision remains human-reviewed.</p>
          <p className="text-xs text-frost/40">© {new Date().getFullYear()} SafeTrip</p>
        </div>
      </footer>
    </div>
  );
}
