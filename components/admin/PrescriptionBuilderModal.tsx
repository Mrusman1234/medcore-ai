"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Patient, Doctor } from "@/lib/types";
import {
  Pill,
  Plus,
  Trash2,
  FileCheck2,
  AlertCircle,
  CheckCircle,
  Printer,
  ShieldCheck,
} from "lucide-react";

interface PrescriptionBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  doctors: Doctor[];
  selectedPatient?: Patient | null;
  onPrescriptionCreated?: (prescription: any) => void;
}

interface MedicationFormItem {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export function PrescriptionBuilderModal({
  isOpen,
  onClose,
  patients,
  doctors,
  selectedPatient,
  onPrescriptionCreated,
}: PrescriptionBuilderModalProps) {
  const [patientId, setPatientId] = useState<string>(selectedPatient?.id || (patients[0]?.id ?? ""));
  const [doctorId, setDoctorId] = useState<string>(doctors[0]?.id ?? "");
  const [diagnosis, setDiagnosis] = useState("Essential (Primary) Hypertension");
  const [icdCode, setIcdCode] = useState("I10");
  const [instructions, setInstructions] = useState(
    "Take medications strictly with meals. Report any dizziness, rash, or adverse symptoms immediately. Follow up in 30 days."
  );

  const [medications, setMedications] = useState<MedicationFormItem[]>([
    {
      medicationName: "Lisinopril",
      dosage: "10 mg oral tablet",
      frequency: "Once daily in the morning",
      duration: "30 days",
      instructions: "Take with water. Monitor blood pressure weekly.",
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdRx, setCreatedRx] = useState<any | null>(null);

  useEffect(() => {
    if (selectedPatient) {
      setPatientId(selectedPatient.id);
    }
  }, [selectedPatient]);

  const addMedicationRow = () => {
    setMedications((prev) => [
      ...prev,
      {
        medicationName: "",
        dosage: "",
        frequency: "Once daily",
        duration: "14 days",
        instructions: "Take after meals",
      },
    ]);
  };

  const removeMedicationRow = (index: number) => {
    if (medications.length <= 1) return;
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMedicationRow = (
    index: number,
    field: keyof MedicationFormItem,
    value: string
  ) => {
    setMedications((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const hasEmptyMed = medications.some((m) => !m.medicationName || !m.dosage);
    if (hasEmptyMed) {
      setError("Please ensure every medication has a valid Name and Dosage.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          doctorId,
          diagnosis,
          icdCode,
          medications,
          instructions,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create prescription");
      }

      setCreatedRx(data.prescription);
      if (onPrescriptionCreated) {
        onPrescriptionCreated(data.prescription);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate prescription");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCreatedRx(null);
    setError(null);
    onClose();
  };

  const activePatient = patients.find((p) => p.id === patientId);
  const activeDoctor = doctors.find((d) => d.id === doctorId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={createdRx ? "Digital Prescription Formulated" : "Digital Prescription Builder (Medplum FHIR)"}
      description={
        createdRx
          ? "Certified digital prescription has been logged to the patient's EHR."
          : "Formulate clinical medications, instructions, and export an official clinic PDF prescription."
      }
      maxWidth="3xl"
    >
      {createdRx ? (
        <div className="py-6 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Prescription Logged to Clinical Record</h3>
            <p className="text-sm text-slate-400 mt-1">
              Verification Code: <span className="font-mono text-cyan-400 font-bold">{createdRx.qrVerificationCode}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left max-w-md mx-auto text-xs space-y-2">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Patient:</span>
              <span className="text-white font-semibold">{createdRx.patientName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Diagnosis:</span>
              <span className="text-white font-semibold">{createdRx.diagnosis} ({createdRx.icdCode})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Medications:</span>
              <span className="text-teal-400 font-semibold">{createdRx.medications.length} items</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <Button variant="outline" onClick={handleReset}>
              Close
            </Button>
            <a
              href={`/prescriptions/${createdRx.id}/print`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="default">
                <Printer className="w-4 h-4 mr-2" />
                View &amp; Print Branded PDF
              </Button>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Patient and Doctor Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Target Patient (EHR Record)
              </label>
              <Select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.gender}, {p.id})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Prescribing Physician
              </label>
              <Select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                required
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Diagnosis & ICD Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Primary Clinical Diagnosis
              </label>
              <Input
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Essential Hypertension, Atopic Dermatitis, Acute Bronchitis"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                ICD-10 Code
              </label>
              <Input
                value={icdCode}
                onChange={(e) => setIcdCode(e.target.value)}
                placeholder="e.g. I10, L20.9, J45"
              />
            </div>
          </div>

          {/* Dynamic Medication Items List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-4 h-4 text-cyan-400" />
                Medications &amp; Dosage Instructions
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedicationRow}
                className="text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1 text-teal-400" />
                Add Medication
              </Button>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {medications.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-400 font-mono">
                      Item #{idx + 1}
                    </span>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicationRow(idx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Remove medication"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder="Medication Name (e.g. Amoxicillin, Metformin)"
                      value={item.medicationName}
                      onChange={(e) =>
                        updateMedicationRow(idx, "medicationName", e.target.value)
                      }
                      required
                    />
                    <Input
                      placeholder="Dosage (e.g. 500 mg oral tablet)"
                      value={item.dosage}
                      onChange={(e) =>
                        updateMedicationRow(idx, "dosage", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder="Frequency (e.g. Twice daily with meals)"
                      value={item.frequency}
                      onChange={(e) =>
                        updateMedicationRow(idx, "frequency", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Duration (e.g. 14 days, 30 days)"
                      value={item.duration}
                      onChange={(e) =>
                        updateMedicationRow(idx, "duration", e.target.value)
                      }
                    />
                  </div>

                  <Input
                    placeholder="Specific Patient Instructions (e.g. Take with plenty of water)"
                    value={item.instructions}
                    onChange={(e) =>
                      updateMedicationRow(idx, "instructions", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* General Clinical Advice */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              General Clinical Instructions &amp; Dietary Guidance
            </label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={2}
            />
          </div>

          {/* Signature & Security Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Digital cryptographic signature attached automatically</span>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={handleReset}>
                Cancel
              </Button>
              <Button type="submit" variant="glow" disabled={submitting}>
                {submitting ? "Signing & Emitting..." : "Emit Prescription & Print PDF"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
