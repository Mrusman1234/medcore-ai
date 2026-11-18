"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Appointment, Doctor, Patient, Prescription } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PatientEHRDrawer } from "@/components/admin/PatientEHRDrawer";
import { PrescriptionBuilderModal } from "@/components/admin/PrescriptionBuilderModal";
import { AppointmentActionModal } from "@/components/admin/AppointmentActionModal";
import { AppointmentBookingModal } from "@/components/booking/AppointmentBookingModal";
import { formatDateTime } from "@/lib/utils";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  User,
  Pill,
  FileText,
  RotateCcw,
  Sparkles,
  Plus,
  Activity,
  HeartHandshake,
} from "lucide-react";

interface AdminDashboardProps {
  initialAppointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  initialPrescriptions: Prescription[];
}

export function AdminDashboard({
  initialAppointments,
  doctors,
  patients,
  initialPrescriptions,
}: AdminDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");

  // Active Modals & Selected Entities
  const [ehrPatient, setEhrPatient] = useState<Patient | null>(null);
  const [prescriptionTargetPatient, setPrescriptionTargetPatient] = useState<Patient | null>(null);
  const [actionAppointment, setActionAppointment] = useState<Appointment | null>(null);
  const [actionType, setActionType] = useState<"confirm" | "reschedule" | "cancel">("confirm");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  // Refresh data from server
  const refreshAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error("Failed to refresh appointments", err);
    }
  };

  // Stat calculations
  const stats = useMemo(() => {
    const scheduled = appointments.filter((a) => a.status === "scheduled").length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;
    const completed = appointments.filter((a) => a.status === "completed").length;
    return { scheduled, pending, cancelled, completed, total: appointments.length };
  }, [appointments]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Status Filter
      if (statusFilter !== "all" && apt.status !== statusFilter) return false;
      // Doctor Filter
      if (doctorFilter !== "all" && apt.doctorId !== doctorFilter) return false;
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPatient = apt.patientName.toLowerCase().includes(q);
        const matchesDoctor = apt.doctorName.toLowerCase().includes(q);
        const matchesReason = apt.reason.toLowerCase().includes(q);
        const matchesId = apt.id.toLowerCase().includes(q);
        return matchesPatient || matchesDoctor || matchesReason || matchesId;
      }
      return true;
    });
  }, [appointments, statusFilter, doctorFilter, searchQuery]);

  const handleOpenEHR = (patientId: string) => {
    const p = patients.find((pat) => pat.id === patientId) || null;
    setEhrPatient(p);
  };

  const handleOpenPrescription = (patientId: string) => {
    const p = patients.find((pat) => pat.id === patientId) || null;
    setPrescriptionTargetPatient(p);
    setIsPrescriptionModalOpen(true);
  };

  const handleTriggerAction = (
    apt: Appointment,
    type: "confirm" | "reschedule" | "cancel"
  ) => {
    setActionAppointment(apt);
    setActionType(type);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Clinical Executive Dashboard
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800">
              Live EHR Feed
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Logged in as <strong className="text-white">Dr. Sarah Jenkins</strong> (Chief Medical Officer &bull; Cardiology). Managing 6 specialists &amp; {patients.length} active patients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAppointments}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsBookingModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* 2. Real-Time Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Scheduled Appointments */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-900/40 p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Scheduled
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white font-mono">{stats.scheduled}</p>
            <p className="text-xs text-slate-400">Active consultations locked</p>
          </div>
          <div className="text-[11px] text-emerald-400/90 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Cal.com Conflict-Free Engine
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-900/40 p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Pending Approval
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white font-mono">{stats.pending}</p>
            <p className="text-xs text-slate-400">Awaiting clinical confirmation</p>
          </div>
          <div className="text-[11px] text-amber-400/90 flex items-center gap-1 font-medium">
            <span>Requires Doctor Review</span>
          </div>
        </div>

        {/* Cancelled Appointments */}
        <div className="rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-900/40 p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Cancelled
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white font-mono">{stats.cancelled}</p>
            <p className="text-xs text-slate-400">Slots freed back to roster</p>
          </div>
          <div className="text-[11px] text-rose-400/90 flex items-center gap-1 font-medium">
            <span>Automated Patient Notices</span>
          </div>
        </div>

        {/* Electronic Health Records */}
        <div className="rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-900/40 p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Active EHR Patients
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white font-mono">{patients.length}</p>
            <p className="text-xs text-slate-400">{prescriptions.length} Digital Prescriptions Logged</p>
          </div>
          <div className="text-[11px] text-cyan-400/90 flex items-center gap-1 font-medium">
            <span>Medplum FHIR Standard</span>
          </div>
        </div>
      </div>

      {/* 3. Filters & Search Control Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="w-full md:w-96">
            <Input
              icon={<Search className="w-4 h-4" />}
              placeholder="Search by patient, physician, or clinical reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Specialty Filter Dropdown */}
          <div className="w-full md:w-64">
            <Select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
            >
              <option value="all">All Specialists (6 Active)</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: `All Consultations (${stats.total})` },
            { id: "scheduled", label: `Scheduled (${stats.scheduled})` },
            { id: "pending", label: `Pending Review (${stats.pending})` },
            { id: "completed", label: `Completed (${stats.completed})` },
            { id: "cancelled", label: `Cancelled (${stats.cancelled})` },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive Appointments Data Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date &amp; Time Slot</th>
                <th className="py-3.5 px-4">Physician</th>
                <th className="py-3.5 px-4">Consultation Reason</th>
                <th className="py-3.5 px-4 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    No clinical appointments match your selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt, index) => {
                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Index */}
                      <td className="py-4 px-4 text-xs font-mono text-slate-500">
                        {index + 1}
                      </td>

                      {/* Patient Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenEHR(apt.patientId)}
                            className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 hover:border-teal-400 flex items-center justify-center text-teal-300 font-bold text-xs transition-colors shrink-0"
                            title="Open Patient Electronic Health Record"
                          >
                            {apt.patientName.charAt(0)}
                          </button>
                          <div>
                            <button
                              onClick={() => handleOpenEHR(apt.patientId)}
                              className="font-bold text-white hover:text-cyan-400 transition-colors block text-left"
                            >
                              {apt.patientName}
                            </button>
                            <span className="text-[11px] text-slate-400 block">
                              {apt.patientEmail}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <Badge variant={apt.status}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </Badge>
                      </td>

                      {/* Schedule */}
                      <td className="py-4 px-4 font-mono text-xs text-slate-200">
                        <div className="font-semibold">{apt.dateString}</div>
                        <div className="text-[11px] text-emerald-400">{apt.timeSlot}</div>
                      </td>

                      {/* Doctor */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                            <Image
                              src={apt.doctorImage || "/assets/images/dr-green.png"}
                              alt={apt.doctorName}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white truncate">{apt.doctorName}</p>
                            <p className="text-[10px] text-teal-400 font-medium truncate">{apt.doctorSpecialty}</p>
                          </div>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-xs text-slate-300 truncate font-medium">
                          {apt.reason}
                        </p>
                        {apt.note && (
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            Note: {apt.note}
                          </p>
                        )}
                        {apt.cancellationReason && (
                          <p className="text-[10px] text-rose-400 truncate mt-0.5">
                            Cancelled: {apt.cancellationReason}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* EHR Drawer Button */}
                          <button
                            onClick={() => handleOpenEHR(apt.patientId)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
                            title="View Medplum EHR"
                          >
                            <FileText className="w-3.5 h-3.5 text-teal-400" />
                            <span className="hidden sm:inline">EHR</span>
                          </button>

                          {/* Write Rx Button */}
                          <button
                            onClick={() => handleOpenPrescription(apt.patientId)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
                            title="Write Digital Prescription"
                          >
                            <Pill className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="hidden sm:inline">Rx</span>
                          </button>

                          {/* Conditional Schedule / Confirm / Reschedule Actions */}
                          {apt.status === "pending" && (
                            <button
                              onClick={() => handleTriggerAction(apt, "confirm")}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 text-xs font-medium border border-emerald-800 transition-colors"
                            >
                              Confirm
                            </button>
                          )}

                          {apt.status === "scheduled" && (
                            <button
                              onClick={() => handleTriggerAction(apt, "reschedule")}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900/80 text-blue-300 text-xs font-medium border border-blue-800 transition-colors"
                            >
                              Reschedule
                            </button>
                          )}

                          {apt.status !== "cancelled" && (
                            <button
                              onClick={() => handleTriggerAction(apt, "cancel")}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-medium border border-rose-800 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modals & Drawer Overlays */}
      <PatientEHRDrawer
        isOpen={ehrPatient !== null}
        onClose={() => setEhrPatient(null)}
        patient={ehrPatient}
        prescriptions={prescriptions}
        onOpenPrescriptionBuilder={(pat) => {
          setEhrPatient(null);
          setPrescriptionTargetPatient(pat);
          setIsPrescriptionModalOpen(true);
        }}
        onScheduleAppointment={(pat) => {
          setEhrPatient(null);
          setIsBookingModalOpen(true);
        }}
      />

      <PrescriptionBuilderModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        patients={patients}
        doctors={doctors}
        selectedPatient={prescriptionTargetPatient}
        onPrescriptionCreated={(newRx) => {
          setPrescriptions((prev) => [newRx, ...prev]);
        }}
      />

      <AppointmentActionModal
        isOpen={actionAppointment !== null}
        onClose={() => setActionAppointment(null)}
        appointment={actionAppointment}
        actionType={actionType}
        onSuccess={refreshAppointments}
      />

      <AppointmentBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        doctors={doctors}
        onBookingSuccess={() => {
          refreshAppointments();
        }}
      />
    </div>
  );
}
