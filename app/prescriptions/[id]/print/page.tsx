import React from "react";
import { notFound } from "next/navigation";
import { getPrescriptionById, getPatientById } from "@/lib/db/store";
import { formatDate } from "@/lib/utils";
import { PrintButton } from "./PrintButton";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, QrCode } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PrescriptionPrintPage({
  params,
}: {
  params: { id: string };
}) {
  const prescription = await getPrescriptionById(params.id);
  if (!prescription) {
    notFound();
  }

  const patient = await getPatientById(prescription.patientId);

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6">
      {/* Non-printable Screen Header Controls */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href="/admin"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Doctor Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <PrintButton />
        </div>
      </div>

      {/* Official Printable Prescription Sheet */}
      <div className="printable-prescription max-w-3xl mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 border border-slate-200">
        {/* Clinic Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-950">
                Med<span className="text-teal-600">Core</span> AI
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-700 border border-slate-300">
                CLINIC &amp; TELEHEALTH
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Institute of Virtual Medicine &bull; Certified Telehealth Provider
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              100 Innovation Way, Suite 400 &bull; Tel: +1 (800) MED-CORE &bull; NPI: 1982034910
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
              Official Digital Rx
            </span>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Rx #: {prescription.id}
            </p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Date: {formatDate(prescription.issuedDate)}
            </p>
          </div>
        </div>

        {/* Doctor & Patient Information Strip */}
        <div className="py-6 border-b border-slate-200 grid grid-cols-2 gap-6 text-xs">
          {/* Patient Details */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Patient Identification
            </span>
            <p className="text-base font-bold text-slate-900">{prescription.patientName}</p>
            <p className="text-slate-600">
              Age: {prescription.patientAge} years &bull; Gender: {prescription.patientGender}
            </p>
            <p className="text-slate-500 font-mono">
              MRN: {prescription.patientId} &bull; Insurer: {patient?.insuranceProvider || "Self-Pay"}
            </p>
            {patient?.allergies && patient.allergies.length > 0 && (
              <p className="text-rose-600 font-semibold pt-1">
                ⚠️ Allergies: {patient.allergies.join(", ")}
              </p>
            )}
          </div>

          {/* Physician Details */}
          <div className="space-y-1 text-right sm:text-left sm:pl-6 sm:border-l border-slate-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Prescribing Physician
            </span>
            <p className="text-base font-bold text-slate-900">{prescription.doctorName}</p>
            <p className="text-teal-700 font-semibold">{prescription.doctorSpecialty}</p>
            <p className="text-slate-500 font-mono">
              License: {prescription.doctorLicense}
            </p>
            <p className="text-slate-500 font-mono">
              DEA / NPI: DEA-US-894210
            </p>
          </div>
        </div>

        {/* Clinical Diagnosis */}
        <div className="py-4 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Clinical Diagnosis
            </span>
            <span className="text-sm font-bold text-slate-900">{prescription.diagnosis}</span>
          </div>
          {prescription.icdCode && (
            <div className="font-mono text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-300">
              ICD-10: <strong>{prescription.icdCode}</strong>
            </div>
          )}
        </div>

        {/* The Rx Symbol & Medications List */}
        <div className="py-8 space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-serif font-black italic text-teal-800">
              &#8478;
            </span>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
              Medication &amp; Dispensing Orders
            </span>
          </div>

          <div className="space-y-6 pl-2 sm:pl-4">
            {prescription.medications.map((med, index) => (
              <div key={med.id || index} className="space-y-1.5 pb-4 border-b border-slate-100 last:border-b-0">
                <div className="flex items-baseline justify-between">
                  <h4 className="text-base font-bold text-slate-900">
                    {index + 1}. {med.medicationName}
                  </h4>
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {med.dosage}
                  </span>
                </div>
                <div className="grid grid-cols-2 text-xs text-slate-600 gap-2">
                  <div>
                    <span className="text-slate-400 font-medium">Frequency:</span>{" "}
                    <strong>{med.frequency}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Duration:</span>{" "}
                    <strong>{med.duration}</strong>
                  </div>
                </div>
                <div className="text-xs text-slate-700 italic pt-0.5">
                  &bull; Sig: {med.instructions}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Clinical Guidance */}
        {prescription.instructions && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 block">General Patient Instructions:</span>
            <p className="leading-relaxed">{prescription.instructions}</p>
          </div>
        )}

        {/* Official Doctor Signature & Security Verification */}
        <div className="mt-12 pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 items-end">
          {/* QR Verification */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Digital Security Verification</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-300 inline-block font-mono text-[10px] text-slate-600 bg-slate-50">
              AUTH HASH: {prescription.qrVerificationCode}
            </div>
            <p className="text-[10px] text-slate-400">
              Pharmacy validation available at verify.medcore.ai
            </p>
          </div>

          {/* Signature Line */}
          <div className="text-right space-y-1">
            <div className="inline-block text-center border-b border-slate-900 pb-1 px-8">
              <span className="font-serif italic text-lg text-slate-800 font-bold block">
                {prescription.doctorName}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900">
              Authorized Medical Practitioner
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Signed Digitally: {formatDate(prescription.issuedDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
