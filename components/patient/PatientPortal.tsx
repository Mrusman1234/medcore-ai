"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Patient, Appointment, Prescription, Doctor } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AppointmentBookingModal } from "@/components/booking/AppointmentBookingModal";
import {
  Calendar,
  Clock,
  Heart,
  Activity,
  Wind,
  Pill,
  Printer,
  Plus,
  ShieldCheck,
  User,
  AlertCircle,
  FileText,
} from "lucide-react";
import { formatDate, formatTime, getBloodPressureCategory, getBMICategory } from "@/lib/utils";

interface PatientPortalProps {
  patient: Patient;
  appointments: Appointment[];
  prescriptions: Prescription[];
  doctors: Doctor[];
}

export function PatientPortal({
  patient,
  appointments,
  prescriptions,
  doctors,
}: PatientPortalProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const bpCat = getBloodPressureCategory(
    patient.vitals.systolic,
    patient.vitals.diastolic
  );
  const bmiCat = getBMICategory(patient.vitals.bmi);

  // Find upcoming scheduled appointments
  const upcomingAppointments = appointments.filter(
    (a) => a.patientId === patient.id && (a.status === "scheduled" || a.status === "pending")
  );

  const pastAppointments = appointments.filter(
    (a) => a.patientId === patient.id && (a.status === "completed" || a.status === "cancelled")
  );

  const myPrescriptions = prescriptions.filter((p) => p.patientId === patient.id);

  return (
    <div className="space-y-8">
      {/* Patient Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 font-black text-xl shadow-md">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{patient.name}</h1>
              <Badge variant="scheduled" dot={false}>
                Active Patient
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              MRN: {patient.id} &bull; {patient.gender} &bull; {patient.email} &bull; {patient.phone}
            </p>
            <p className="text-xs text-teal-400 font-medium mt-0.5">
              Assigned Physician: {patient.primaryPhysicianName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsBookingOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Book New Consultation
          </Button>
          <Link href="/register">
            <Button variant="outline" size="sm" className="text-xs">
              Update Clinical Intake
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Upcoming Appointments & Clinical Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Upcoming Consultations ({upcomingAppointments.length})
              </h2>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <p className="text-sm text-slate-400">No scheduled appointments active.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsBookingOpen(true)}
                >
                  Schedule Your Next Visit
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                        <Image
                          src={apt.doctorImage || "/assets/images/dr-green.png"}
                          alt={apt.doctorName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{apt.doctorName}</h3>
                          <Badge variant={apt.status}>
                            {apt.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-teal-400">{apt.doctorSpecialty}</p>
                        <p className="text-xs text-slate-300 mt-1 font-medium">{apt.reason}</p>
                      </div>
                    </div>

                    <div className="sm:text-right font-mono text-xs text-slate-300 shrink-0 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                      <div className="font-bold text-white flex items-center sm:justify-end gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {apt.dateString}
                      </div>
                      <div className="text-emerald-400 font-bold mt-0.5 flex items-center sm:justify-end gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {apt.timeSlot}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Consultations */}
          {pastAppointments.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Past Consultation History ({pastAppointments.length})
              </h2>
              <div className="space-y-2">
                {pastAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400"
                  >
                    <div>
                      <span className="font-semibold text-slate-200">{apt.doctorName}</span> &bull;{" "}
                      <span>{apt.reason}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span>{apt.dateString}</span>
                      <Badge variant={apt.status}>{apt.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Digital Prescriptions Section */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-400" />
              My Digital Prescriptions ({myPrescriptions.length})
            </h2>

            {myPrescriptions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
                No prescriptions on file yet.
              </div>
            ) : (
              <div className="space-y-3">
                {myPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rx.diagnosis}</span>
                        <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                          {rx.icdCode}
                        </span>
                      </div>
                      <p className="text-slate-400">
                        Prescribed by {rx.doctorName} &bull; Issued {formatDate(rx.issuedDate)}
                      </p>
                      <p className="text-slate-300 font-medium">
                        {rx.medications.map((m) => `${m.medicationName} (${m.dosage})`).join(", ")}
                      </p>
                    </div>

                    <a
                      href={`/prescriptions/${rx.id}/print`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print PDF
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Patient Health Vitals Summary */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Latest Clinical Vitals
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                {formatDate(patient.vitals.lastRecordedAt)}
              </span>
            </div>

            {/* Blood Pressure */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Blood Pressure</span>
                <span className="text-xl font-black text-white font-mono">
                  {patient.vitals.systolic}/{patient.vitals.diastolic}
                  <span className="text-[10px] text-slate-500 ml-1">mmHg</span>
                </span>
              </div>
              <span className={`text-[11px] font-bold ${bpCat.color}`}>
                {bpCat.label}
              </span>
            </div>

            {/* Heart Rate */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Heart Rate</span>
                <span className="text-xl font-black text-white font-mono">
                  {patient.vitals.heartRate}
                  <span className="text-[10px] text-slate-500 ml-1">bpm</span>
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-400">
                Normal
              </span>
            </div>

            {/* Oxygen SpO2 */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Blood Oxygen</span>
                <span className="text-xl font-black text-white font-mono">
                  {patient.vitals.spO2}%
                </span>
              </div>
              <span className="text-[11px] font-bold text-cyan-400">
                Room Air
              </span>
            </div>

            {/* BMI */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">BMI &bull; Weight</span>
                <span className="text-xl font-black text-white font-mono">
                  {patient.vitals.bmi}
                  <span className="text-[10px] text-slate-500 ml-1">
                    ({patient.vitals.weightKg} kg)
                  </span>
                </span>
              </div>
              <span className={`text-[11px] font-bold ${bmiCat.color}`}>
                {bmiCat.label}
              </span>
            </div>
          </div>

          {/* Allergies Alert Box */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Documented Allergies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {patient.allergies.map((a, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-950/70 text-rose-300 border border-rose-800"
                >
                  ⚠️ {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AppointmentBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        doctors={doctors}
        onBookingSuccess={() => {
          setIsBookingOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
