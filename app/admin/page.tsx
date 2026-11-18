import React from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import {
  getAppointments,
  getDoctors,
  getPatients,
  getPrescriptions,
} from "@/lib/db/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [appointments, doctors, patients, prescriptions] = await Promise.all([
    getAppointments(),
    getDoctors(),
    getPatients(),
    getPrescriptions(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AdminDashboard
        initialAppointments={appointments}
        doctors={doctors}
        patients={patients}
        initialPrescriptions={prescriptions}
      />
    </div>
  );
}
