import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { ArrowLeft, Eye, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-midnight lg:grid-cols-[1.12fr_0.88fr]">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-white/10 px-10 py-9 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_64%_42%,oklch(0.58_0.245_263/.38),transparent_34%)]" />
        <Link href="/" className="relative z-10 flex items-center gap-2.5 text-lg font-extrabold tracking-[-0.035em]">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal text-signal-ink"><Eye className="h-4 w-4" /></span>
          SafeTrip
        </Link>
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <h1 className="text-5xl font-semibold leading-[0.96] tracking-[-0.04em] xl:text-6xl">One system.<br />Two ways to stay safe.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-frost/65">Enter as a commuter to track and report, or as an officer to monitor, verify, and coordinate response.</p>
        </div>
        <div className="relative z-10 flex items-center gap-3 text-xs text-frost/55"><ShieldCheck className="h-4 w-4 text-signal" />Human-reviewed safety operations</div>
      </section>
      <section className="flex min-h-screen flex-col bg-cloud px-5 py-6 sm:px-10 lg:px-14 lg:py-9">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" />Back to SafeTrip</Link>
        </div>
        <div className="my-auto flex justify-center py-12">
          <LoginForm />
        </div>
        <p className="text-center text-xs text-muted">Demo environment · No production credentials required</p>
      </section>
    </main>
  );
}
