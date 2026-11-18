import React from "react";
import { getDoctors } from "@/lib/db/store";
import { SpecialistDirectory } from "@/components/landing/SpecialistDirectory";
import { AppointmentBookingModalWrapper } from "./BookingClientWrapper";
import { Calendar, Clock, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: { doctorId?: string; specialty?: string };
}) {
  const doctors = await getDoctors();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-teal-500/30 text-xs font-semibold text-teal-300">
          <Clock className="w-4 h-4 text-emerald-400" />
          Cal.com Conflict-Free 30-Minute Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Schedule Clinical Consultation
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Select a physician below to view their real-time calendar and lock in your guaranteed time slot with instant double-booking prevention.
        </p>
      </div>

      <AppointmentBookingModalWrapper
        doctors={doctors}
        initialDoctorId={searchParams.doctorId}
      />
    </div>
  );
}
