"use client";

import { useState } from "react";
import { FakeMap } from "@/components/fake-map";
import { TrainFront, Loader2, AlertTriangle, CheckCircle2, Send, ArrowLeft } from "lucide-react";
import { submitReport, type ReportDetail, ApiError } from "@/lib/api";
import { PassengerCharacteristicForm, type PassengerAttributes } from "@/components/passenger-characteristic-form";
import Link from "next/link";

const STEPS = ["Reporting", "Accepted", "Processing", "Resolved", "Done"];

function StepBar({ current }: { current: number }) {
  return (
    <ol className="flex items-start">
      {STEPS.map((label, i) => {
        const stepNo = i + 1;
        const done = stepNo <= current;
        return (
          <li key={label} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div
                className={`h-0.5 flex-1 ${
                  i === 0 ? "bg-transparent" : done ? "bg-primary" : "bg-slate-300"
                }`}
              />
              <span
                className={`h-4 w-4 shrink-0 rounded-full ${
                  done ? "bg-primary" : "bg-slate-300"
                }`}
              />
              <div
                className={`h-0.5 flex-1 ${
                  i === STEPS.length - 1
                    ? "bg-transparent"
                    : stepNo < current
                    ? "bg-primary"
                    : "bg-slate-300"
                }`}
              />
            </div>
            <span
              className={`mt-1.5 px-0.5 text-center text-[10px] leading-tight ${
                done ? "font-bold text-primary" : "text-muted"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

type Phase = "form" | "submitting" | "submitted";

export default function ReportPage() {
  const [phase, setPhase] = useState<Phase>("form");
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [attributes, setAttributes] = useState<PassengerAttributes>({
    gender: "",
    age_group: "",
    upper_clothing: "",
    lower_clothing: "",
    accessories: "",
  });

  const validate = () => {
    if (!description.trim()) return "Please describe what happened.";
    if (description.trim().length < 5)
      return "Description must be at least 5 characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setPhase("submitting");

    // Format description to include attributes
    let fullDescription = description.trim();
    const attrs: string[] = [];
    if (attributes.gender) attrs.push(`Gender: ${attributes.gender}`);
    if (attributes.age_group) attrs.push(`Age: ${attributes.age_group}`);
    if (attributes.upper_clothing) attrs.push(`Upper: ${attributes.upper_clothing}`);
    if (attributes.lower_clothing) attrs.push(`Lower: ${attributes.lower_clothing}`);
    if (attributes.accessories) attrs.push(`Accessories: ${attributes.accessories}`);
    
    if (attrs.length > 0) {
      fullDescription += `\n\nSubject Description: ${attrs.join(", ")}`;
    }

    try {
      const newReport = await submitReport({
        reporter_type: "passenger",
        description: fullDescription,
        location: location.trim(),
      });
      setReport(newReport);
      setPhase("submitted");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 422
            ? "Invalid form data — please check your input."
            : `Server error ${err.status}: ${err.message}`
          : "Could not submit report. Is the server running?";
      setError(msg);
      setPhase("form");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Current location */}
      <section>
        <h1 className="mb-2 text-xl font-bold text-ink">You&apos;re now here</h1>
        <div className="overflow-hidden rounded-[24px] bg-white border border-hairline shadow-sm">
          <div className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-strong text-primary">
              <TrainFront className="h-6 w-6" />
            </span>
            <p className="text-sm font-bold text-ink">
              MRT Jakarta – Lebak Bulus Station
            </p>
          </div>
          <FakeMap route className="h-44 w-full rounded-none" />
        </div>
      </section>

      {/* Progress */}
      <section>
        <h2 className="mb-3 text-xl font-bold text-ink">
          {phase === "form"
            ? "Step 1 – Reporting"
            : phase === "submitting"
            ? "Step 1 – Submitting…"
            : "Step 2 – Accepted"}
        </h2>
        <StepBar
          current={
            phase === "form" || phase === "submitting"
              ? 1
              : 2
          }
        />
      </section>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-alert/30 bg-alert/10 p-4 text-sm text-alert">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Phase: Form ────────────────────────────────────────────────── */}
      {(phase === "form" || phase === "submitting") && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="rounded-[24px] border border-hairline bg-white p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-ink border-b border-hairline pb-2">Incident Details</h3>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-semibold text-ink">
                What happened? <span className="text-alert">*</span>
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the incident..."
                className="w-full rounded-2xl border border-hairline bg-surface-strong px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="location" className="text-sm font-semibold text-ink">
                Location (optional)
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Platform B, near Exit 2"
                className="w-full rounded-full border border-hairline bg-surface-strong px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-hairline bg-white p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-ink border-b border-hairline pb-2">Subject Characteristics</h3>
            <p className="text-xs text-muted leading-relaxed">
              If someone was involved, describe their appearance to help security cameras find them.
            </p>
            <PassengerCharacteristicForm 
              attributes={attributes}
              onChange={setAttributes}
            />
          </div>

          <button
            type="submit"
            disabled={phase === "submitting"}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-primary-active active:scale-[0.99] disabled:opacity-60"
          >
            {phase === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Report
              </>
            )}
          </button>
        </form>
      )}

      {/* ── Phase: Submitted ───────────────────────────────────────────── */}
      {phase === "submitted" && report && (
        <article className="flex flex-col gap-6 rounded-[24px] bg-white border border-hairline shadow-sm p-6 text-center items-center">
          <div className="h-16 w-16 rounded-full bg-signal/10 flex items-center justify-center text-signal mb-2">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-ink">Report Submitted</h3>
            <p className="mt-2 text-sm text-muted">
              Thank you for keeping the station safe. Our security team has received your report and is investigating via AI cameras.
            </p>
          </div>

          <div className="w-full rounded-xl bg-surface-strong px-4 py-3 text-left">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Report ID</p>
            <p className="font-mono text-sm text-ink">#{report.report_id.substring(0, 8).toUpperCase()}</p>
          </div>

          <Link
            href="/app"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-active"
          >
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Link>
        </article>
      )}
    </div>
  );
}
