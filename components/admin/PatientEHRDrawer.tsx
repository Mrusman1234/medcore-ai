"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Patient, Prescription } from "@/lib/types";
import {
  calculateAge,
  getBMICategory,
  getBloodPressureCategory,
  formatDate,
} from "@/lib/utils";
import {
  Heart,
  Activity,
  Wind,
  Thermometer,
  Scale,
  AlertTriangle,
  Pill,
  History,
  Users,
  Shield,
  FileCheck2,
  Printer,
  Calendar,
  Sparkles,
} from "lucide-react";

interface PatientEHRDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  prescriptions?: Prescription[];
  onOpenPrescriptionBuilder?: (patient: Patient) => void;
  onScheduleAppointment?: (patient: Patient) => void;
}

export function PatientEHRDrawer({
  isOpen,
  onClose,
  patient,
  prescriptions = [],
  onOpenPrescriptionBuilder,
  onScheduleAppointment,
}: PatientEHRDrawerProps) {
  if (!patient) return null;

  const age = calculateAge(patient.birthDate);
  const bmiCat = getBMICategory(patient.vitals.bmi);
  const bpCat = getBloodPressureCategory(
    patient.vitals.systolic,
    patient.vitals.diastolic
  );

  const patientPrescriptions = prescriptions.filter(
    (rx) => rx.patientId === patient.id
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="2xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-700/60 flex items-center justify-center text-teal-300 font-bold text-lg shadow-sm">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{patient.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {patient.gender}, {age} yrs
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              MRN: {patient.id} &bull; Registered {formatDate(patient.registeredAt)}
            </p>
          </div>
        </div>
      }
      subtitle={
        <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
          <span>Primary: <strong className="text-teal-400">{patient.primaryPhysicianName}</strong></span>
          <span>&bull;</span>
          <span>Insurer: <strong className="text-slate-200">{patient.insuranceProvider}</strong> ({patient.insurancePolicyNumber})</span>
        </div>
      }
      footer={
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">
            FHIR Clinical Resource: <code className="text-cyan-400">Patient/{patient.id}</code>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onScheduleAppointment && onScheduleAppointment(patient)}
            >
              <Calendar className="w-4 h-4 mr-1.5 text-cyan-400" />
              Schedule Visit
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onOpenPrescriptionBuilder && onOpenPrescriptionBuilder(patient)}
            >
              <Pill className="w-4 h-4 mr-1.5 text-teal-200" />
              Compose Digital Rx
            </Button>
          </div>
        </div>
      }
    >
      {/* 1. Medplum-Style Clinical Vitals Dashboard */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Clinical Observations &amp; Vitals (FHIR Observation)
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">
            Recorded: {formatDate(patient.vitals.lastRecordedAt)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Blood Pressure */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Blood Pressure
              </span>
              <span className={`text-[10px] font-bold ${bpCat.color}`}>{bpCat.label}</span>
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {patient.vitals.systolic}/{patient.vitals.diastolic}
              <span className="text-xs font-normal text-slate-400 ml-1">mmHg</span>
            </p>
          </div>

          {/* Heart Rate */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Heart Rate
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Resting</span>
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {patient.vitals.heartRate}
              <span className="text-xs font-normal text-slate-400 ml-1">bpm</span>
            </p>
          </div>

          {/* SpO2 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                Oxygen (SpO2)
              </span>
              <span className="text-[10px] text-cyan-400 font-bold">Room Air</span>
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {patient.vitals.spO2}
              <span className="text-xs font-normal text-slate-400 ml-1">%</span>
            </p>
          </div>

          {/* Body Temperature */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Temperature
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Afebrile</span>
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {patient.vitals.temperature}
              <span className="text-xs font-normal text-slate-400 ml-1">&deg;F</span>
            </p>
          </div>

          {/* BMI */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-teal-400" />
                Calculated BMI
              </span>
              <span className={`text-[10px] font-bold ${bmiCat.color}`}>{bmiCat.label}</span>
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {patient.vitals.bmi}
              <span className="text-xs font-normal text-slate-400 ml-1">kg/m&sup2;</span>
            </p>
          </div>

          {/* Height & Weight */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="text-xs text-slate-400">Height / Weight</div>
            <p className="text-lg font-bold text-white font-mono pt-1">
              {patient.vitals.heightCm} cm &bull; {patient.vitals.weightKg} kg
            </p>
          </div>
        </div>
      </div>

      {/* 2. Documented Allergies & Adverse Reactions */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          Allergies &amp; Adverse Drug Reactions
        </h4>

        <div className="flex flex-wrap gap-2">
          {patient.allergies.length > 0 ? (
            patient.allergies.map((allergy, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/70 text-rose-300 border border-rose-800/80 shadow-sm"
              >
                ⚠️ {allergy}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">No known allergies documented.</span>
          )}
        </div>
      </div>

      {/* 3. Active Current Medications */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Pill className="w-4 h-4 text-cyan-400" />
          Current Active Medications
        </h4>

        {patient.currentMedications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {patient.currentMedications.map((med, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-200"
              >
                <div className="w-6 h-6 rounded-md bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 font-bold shrink-0">
                  Rx
                </div>
                <span className="font-medium">{med}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400">
            No active chronic prescriptions listed.
          </div>
        )}
      </div>

      {/* 4. Past Medical History & Chronic Conditions */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-teal-400" />
          Past Medical History &amp; Chronic Morbidities
        </h4>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          {patient.pastMedicalHistory || "No past surgical or medical history recorded."}
        </div>
      </div>

      {/* 5. Family Medical History */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          Family Medical Lineage
        </h4>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          {patient.familyMedicalHistory || "No significant familial history."}
        </div>
      </div>

      {/* 6. Issued Digital Prescriptions */}
      {patientPrescriptions.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              Issued Digital Prescriptions ({patientPrescriptions.length})
            </h4>
          </div>

          <div className="space-y-2">
            {patientPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rx.diagnosis}</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                      ICD: {rx.icdCode || "R69"}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Prescribed by {rx.doctorName} &bull; {formatDate(rx.issuedDate)}
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    {rx.medications.map((m) => `${m.medicationName} (${m.dosage})`).join(", ")}
                  </p>
                </div>

                <a
                  href={`/prescriptions/${rx.id}/print`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
                  title="Print / View PDF Prescription"
                >
                  <Printer className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </Drawer>
  );
}
