import React from "react";
import { getDoctors } from "@/lib/db/store";
import { PatientRegistrationForm } from "@/components/patient/PatientRegistrationForm";
import { MedCoreLogo } from "@/components/brand/MedCoreLogo";
import { ShieldCheck, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const doctors = await getDoctors();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="text-center space-y-3 pb-8 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-teal-500/30 text-xs font-semibold text-teal-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Encrypted Electronic Health Record Onboarding
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Patient Clinical Registration
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Please provide accurate medical history, emergency contacts, and active medications. Your information is protected under HIPAA compliance.
        </p>
      </div>

      <div className="pt-8">
        <PatientRegistrationForm doctors={doctors} />
      </div>
    </div>
  );
}
