import React from "react";
import { PatientPortal } from "@/components/patient/PatientPortal";
import {
  getPatientById,
  getAppointments,
  getPrescriptionsByPatientId,
  getDoctors,
} from "@/lib/db/store";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PatientPage() {
  // Load default demo patient (John Doe)
  const patient = await getPatientById("pat_1");
  if (!patient) {
    redirect("/register");
  }

  const [appointments, prescriptions, doctors] = await Promise.all([
    getAppointments({ patientId: patient.id }),
    getPrescriptionsByPatientId(patient.id),
    getDoctors(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PatientPortal
        patient={patient}
        appointments={appointments}
        prescriptions={prescriptions}
        doctors={doctors}
      />
    </div>
  );
}
