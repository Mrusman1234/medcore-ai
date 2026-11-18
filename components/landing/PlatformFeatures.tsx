import React from "react";
import {
  CalendarCheck,
  FileHeart,
  Bot,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle,
  Cpu,
  Lock,
} from "lucide-react";

export function PlatformFeatures() {
  const pillars = [
    {
      title: "Conflict-Free Slot Engine",
      inspiration: "Inspired by Cal.com",
      description:
        "Dynamic physician availability, customizable working hours, 30-minute interval generation, and real-time double-booking collision prevention.",
      icon: <CalendarCheck className="w-6 h-6 text-emerald-400" />,
      features: [
        "Doctor-specific working days & lunch breaks",
        "Deterministic 30-min slot calculation",
        "Instant reschedule & slot recovery",
      ],
      badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-950/40",
    },
    {
      title: "FHIR EHR & Digital Prescriptions",
      inspiration: "Inspired by Medplum",
      description:
        "Comprehensive clinical health record drawer tracking blood pressure, heart rate, SpO2, BMI, allergies, and an exportable printable Rx builder.",
      icon: <FileHeart className="w-6 h-6 text-teal-400" />,
      features: [
        "Interactive Doctor EHR Drawer",
        "Digital Rx builder with dosages & frequencies",
        "Branded printable PDF prescription with QR code",
      ],
      badgeColor: "border-teal-500/30 text-teal-400 bg-teal-950/40",
    },
    {
      title: "Clinical Triage & Doctor Copilot",
      inspiration: "Inspired by Vercel AI Chatbot",
      description:
        "Dual-mode floating clinical assistant powered by Gemini AI with an intelligent offline clinical decision fallback engine.",
      icon: <Bot className="w-6 h-6 text-cyan-400" />,
      features: [
        "Symptom assessment & specialist matching",
        "Doctor copilot 3-bullet clinical summaries",
        "Red-flag emergency detection & 911 alert",
      ],
      badgeColor: "border-cyan-500/30 text-cyan-400 bg-cyan-950/40",
    },
    {
      title: "Executive Medical UX",
      inspiration: "Inspired by CarePulse",
      description:
        "Dark-first modern interface with real-time KPI metrics, searchable appointment tables, patient intake registration, and dual 1-click demo access.",
      icon: <LayoutDashboard className="w-6 h-6 text-blue-400" />,
      features: [
        "1-Click Doctor Admin & Patient demo login",
        "Zero-setup embedded persistent data layer",
        "Automated Nodemailer appointment emails",
      ],
      badgeColor: "border-blue-500/30 text-blue-400 bg-blue-950/40",
    },
  ];

  return (
    <section className="py-16 bg-slate-950/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Synthesized Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Synthesized From the Best Open-Source Healthcare Repositories
          </h2>
          <p className="text-sm text-slate-400">
            Extracting Cal.com scheduling logic, Medplum EHR data models, Vercel AI streaming architecture, and modern clinical UX into one unified Next.js codebase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-sm">
                    {pillar.icon}
                  </div>
                  <span
                    className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${pillar.badgeColor}`}
                  >
                    {pillar.inspiration}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                {pillar.features.map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-center gap-2 text-xs text-slate-300"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
