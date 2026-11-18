"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Calendar,
  Stethoscope,
  UserCheck,
  ShieldCheck,
  HeartPulse,
  Activity,
  ArrowRight,
  Clock,
  Award,
} from "lucide-react";

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handle1ClickLogin = async (role: "admin" | "patient") => {
    try {
      setLoadingRole(role);
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success && data.redirectTo) {
        router.push(data.redirectTo);
      }
    } catch (err) {
      console.error("Demo login failed:", err);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="relative pt-8 pb-16 sm:pb-24 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-teal-500/15 via-cyan-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Top Clinical Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-teal-500/30 text-xs text-teal-300 shadow-lg shadow-teal-500/10 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">Next-Gen Telehealth &amp; Clinical Management Platform</span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-cyan-400 font-mono">Cal.com + Medplum + Gemini AI</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Modern Healthcare,{" "}
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Engineered with AI
          </span>{" "}
          Precision.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          MedCore AI unifies conflict-free 30-minute doctor scheduling, FHIR clinical health records, digital prescription generation, and 24/7 AI symptom triage.
        </p>

        {/* Prominent 1-Click Zero-Friction Demo Access Card */}
        <div className="max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-teal-500/40 shadow-2xl shadow-teal-950/50 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-400" />
              Instant Portfolio Access &bull; Zero OTP Required
            </span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold">
              Ready to Explore
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="default"
              size="lg"
              onClick={() => handle1ClickLogin("admin")}
              disabled={loadingRole !== null}
              className="w-full text-sm font-bold shadow-teal-500/30"
            >
              <Stethoscope className="w-4 h-4 mr-2 text-teal-200" />
              {loadingRole === "admin" ? "Logging In..." : "1-Click Doctor Admin"}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => handle1ClickLogin("patient")}
              disabled={loadingRole !== null}
              className="w-full text-sm font-bold border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40"
            >
              <UserCheck className="w-4 h-4 mr-2 text-cyan-400" />
              {loadingRole === "patient" ? "Logging In..." : "1-Click Demo Patient"}
            </Button>
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            variant="glow"
            size="lg"
            onClick={onOpenBooking}
            className="text-sm font-bold"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Specialist Appointment
          </Button>

          <Link href="/register">
            <Button variant="outline" size="lg" className="text-sm font-bold">
              New Patient Intake Form
              <ArrowRight className="w-4 h-4 ml-2 text-teal-400" />
            </Button>
          </Link>
        </div>

        {/* Platform Stat Strip */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">99.4%</p>
            <p className="text-xs text-slate-400 mt-1">Diagnostic Triage Accuracy</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <p className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">30 Min</p>
            <p className="text-xs text-slate-400 mt-1">Conflict-Free Slots</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <p className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">15,000+</p>
            <p className="text-xs text-slate-400 mt-1">Consultations Powered</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</p>
            <p className="text-xs text-slate-400 mt-1">Zero-Error Vercel Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}
