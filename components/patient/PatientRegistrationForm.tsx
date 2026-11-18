"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Doctor } from "@/lib/types";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  AlertTriangle,
  Pill,
  ShieldCheck,
  CheckCircle2,
  FileText,
  HeartPulse,
} from "lucide-react";

interface PatientRegistrationFormProps {
  doctors: Doctor[];
}

export function PatientRegistrationForm({ doctors }: PatientRegistrationFormProps) {
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("1995-05-15");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");

  // Emergency Contact
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");

  // Clinical Information
  const [primaryPhysicianId, setPrimaryPhysicianId] = useState(doctors[0]?.id || "doc_1");
  const [insuranceProvider, setInsuranceProvider] = useState("BlueCross BlueShield");
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState("");
  const [pastMedicalHistory, setPastMedicalHistory] = useState("");

  // Identification & Consent
  const [identificationType, setIdentificationType] = useState("Driver's License");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [treatmentConsent, setTreatmentConsent] = useState(true);
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!treatmentConsent || !privacyConsent) {
      setError("Please accept the medical treatment and HIPAA privacy consents to proceed.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          birthDate,
          gender,
          address,
          occupation,
          emergencyContactName,
          emergencyContactNumber,
          primaryPhysicianId,
          insuranceProvider,
          insurancePolicyNumber,
          allergies,
          currentMedications,
          familyMedicalHistory,
          pastMedicalHistory,
          identificationType,
          identificationNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit patient intake.");
      }

      // Automatically route to appointment booking
      router.push(`/book?doctorId=${primaryPhysicianId}&patientName=${encodeURIComponent(name)}&patientEmail=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Failed to register patient profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Personal Information */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-teal-400" />
            1. Personal Demographics &amp; Contact Information
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Legal identity information stored in HIPAA-compliant encrypted storage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Full Legal Name *
            </label>
            <Input
              required
              placeholder="e.g. John Alexander Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Email Address *
            </label>
            <Input
              type="email"
              required
              placeholder="e.g. john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Phone Number *
            </label>
            <Input
              required
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Date of Birth *
            </label>
            <Input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Gender *
            </label>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Occupation
            </label>
            <Input
              placeholder="e.g. Software Engineer, Teacher, Retired"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Residential Address
            </label>
            <Input
              placeholder="e.g. 742 Evergreen Terrace, Springfield, OR 97477"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 2. Emergency Contact */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-cyan-400" />
            2. Emergency Contact Details
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Emergency Contact Full Name
            </label>
            <Input
              placeholder="e.g. Jane Doe (Spouse)"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Emergency Contact Phone
            </label>
            <Input
              placeholder="+1 (555) 123-4567"
              value={emergencyContactNumber}
              onChange={(e) => setEmergencyContactNumber(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 3. Medical & Insurance Information */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-400" />
            3. Medical History &amp; Insurance Coverage
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Preferred Primary Physician
            </label>
            <Select
              value={primaryPhysicianId}
              onChange={(e) => setPrimaryPhysicianId(e.target.value)}
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} — {doc.specialty}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Insurance Provider
            </label>
            <Input
              placeholder="e.g. BlueCross BlueShield, Aetna, Cigna, Self-Pay"
              value={insuranceProvider}
              onChange={(e) => setInsuranceProvider(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Insurance Policy Number
            </label>
            <Input
              placeholder="e.g. BCBS-9043210"
              value={insurancePolicyNumber}
              onChange={(e) => setInsurancePolicyNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Known Allergies (comma-separated)
            </label>
            <Input
              placeholder="e.g. Penicillin, Peanuts, Sulfa (or NKDA)"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Current Medications
            </label>
            <Input
              placeholder="e.g. Lisinopril 10mg daily, Albuterol inhaler PRN"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Past Medical &amp; Surgical History
            </label>
            <Textarea
              placeholder="List any past surgeries, chronic illnesses (hypertension, asthma, diabetes)..."
              value={pastMedicalHistory}
              onChange={(e) => setPastMedicalHistory(e.target.value)}
              rows={2}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Family Medical History
            </label>
            <Textarea
              placeholder="Any hereditary conditions (heart disease, diabetes, cancer)..."
              value={familyMedicalHistory}
              onChange={(e) => setFamilyMedicalHistory(e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* 4. Identification & Consents */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            4. Identification &amp; Regulatory Consents
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Identification Document Type
            </label>
            <Select
              value={identificationType}
              onChange={(e) => setIdentificationType(e.target.value)}
            >
              <option value="Driver's License">Driver&apos;s License</option>
              <option value="Passport">Passport</option>
              <option value="State ID Card">State ID Card</option>
              <option value="Birth Certificate">Birth Certificate</option>
              <option value="National Identity Card">National Identity Card</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Document Number
            </label>
            <Input
              placeholder="e.g. DL-9843214"
              value={identificationNumber}
              onChange={(e) => setIdentificationNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Checkbox Consents */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={treatmentConsent}
              onChange={(e) => setTreatmentConsent(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-400"
            />
            <span className="text-xs text-slate-300">
              I consent to receive healthcare evaluations, clinical telemedicine consultations, and digital prescriptions through MedCore AI.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-400"
            />
            <span className="text-xs text-slate-300">
              I acknowledge that my health records are processed in compliance with the HIPAA Privacy Rule and encrypted with 256-bit security.
            </span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="glow"
          size="lg"
          disabled={submitting}
          className="min-w-[240px]"
        >
          {submitting ? "Registering Intake..." : "Submit Intake & Continue to Booking"}
        </Button>
      </div>
    </form>
  );
}
