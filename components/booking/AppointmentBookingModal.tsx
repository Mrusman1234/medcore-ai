"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Doctor, TimeSlot } from "@/lib/types";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoctorId?: string;
  doctors: Doctor[];
  onBookingSuccess?: (appointment: any) => void;
}

export function AppointmentBookingModal({
  isOpen,
  onClose,
  initialDoctorId,
  doctors,
  onBookingSuccess,
}: AppointmentBookingModalProps) {
  // Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || (doctors[0]?.id ?? "doc_1")
  );

  // Generate today & upcoming 10 days in YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("John Doe");
  const [patientEmail, setPatientEmail] = useState("john.doe@medcore.example.com");
  const [patientPhone, setPatientPhone] = useState("+1 (555) 234-5678");
  const [reason, setReason] = useState("Cardiovascular Checkup & Baseline Assessment");
  const [note, setNote] = useState("");

  // Slots loading state
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsData, setSlotsData] = useState<{
    isWorkingDay: boolean;
    slots: TimeSlot[];
  }>({
    isWorkingDay: true,
    slots: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookedSuccess, setBookedSuccess] = useState<any | null>(null);

  // Update selected doctor when initialDoctorId changes
  useEffect(() => {
    if (initialDoctorId) {
      setSelectedDoctorId(initialDoctorId);
    }
  }, [initialDoctorId]);

  // Fetch slots whenever selected doctor or date changes
  useEffect(() => {
    if (!isOpen || !selectedDoctorId || !selectedDate) return;

    let isMounted = true;
    setLoadingSlots(true);
    setErrorMessage(null);
    setSelectedSlot(null);

    fetch(`/api/slots?doctorId=${selectedDoctorId}&date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setSlotsData({
            isWorkingDay: data.isWorkingDay,
            slots: data.slots || [],
          });
        } else {
          setErrorMessage(data.error || "Failed to load slots");
        }
      })
      .catch((err) => {
        if (isMounted) setErrorMessage("Failed to load doctor slots");
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedDoctorId, selectedDate]);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  // Helper to generate dates for next 14 days
  const upcomingDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { dateStr, dayName, monthDay };
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMessage("Please choose an available 30-minute time slot.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          patientEmail,
          patientPhone,
          doctorId: selectedDoctorId,
          dateString: selectedDate,
          timeSlot: selectedSlot,
          reason,
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Booking failed");
      }

      setBookedSuccess(data.appointment);
      if (onBookingSuccess) {
        onBookingSuccess(data.appointment);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookedSuccess(null);
    setSelectedSlot(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={bookedSuccess ? "Consultation Confirmed!" : "Book Specialist Appointment"}
      description={
        bookedSuccess
          ? "Your conflict-free 30-minute slot is securely locked and registered."
          : "Powered by Cal.com scheduling logic & double-booking prevention engine."
      }
      maxWidth="3xl"
    >
      {bookedSuccess ? (
        /* ================= SUCCESS STATE ================= */
        <div className="py-4 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 animate-in zoom-in-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">Booking Locked Successfully</h3>
            <p className="text-slate-400 text-sm mt-1">
              Reference ID: <span className="text-cyan-400 font-mono font-bold">{bookedSuccess.id}</span>
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 max-w-md mx-auto text-left space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-teal-500/30 shrink-0">
                <Image
                  src={bookedSuccess.doctorImage || "/assets/images/dr-green.png"}
                  alt={bookedSuccess.doctorName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{bookedSuccess.doctorName}</p>
                <p className="text-xs text-teal-400">{bookedSuccess.doctorSpecialty}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">Date:</span>
                <span className="font-semibold text-slate-200">{bookedSuccess.dateString}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Time Slot:</span>
                <span className="font-semibold text-emerald-400">{bookedSuccess.timeSlot}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-800/80">
                <span className="text-slate-500 block">Patient:</span>
                <span className="font-semibold text-slate-200">
                  {bookedSuccess.patientName} &bull; {bookedSuccess.patientEmail}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-teal-950/40 border border-teal-800/60 rounded-xl p-4 text-xs text-teal-300 max-w-md mx-auto">
            <p className="flex items-center justify-center gap-2 font-medium">
              <Mail className="w-4 h-4 text-cyan-400" />
              Automated confirmation notification dispatched via Nodemailer.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="default" onClick={handleReset} className="w-48">
              Done &bull; View Dashboard
            </Button>
          </div>
        </div>
      ) : (
        /* ================= BOOKING FORM ================= */
        <form onSubmit={handleBooking} className="space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Doctor Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-teal-400" />
              1. Select Specialist Physician
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {doctors.map((doc) => {
                const isSelected = doc.id === selectedDoctorId;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? "bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-teal-500/20">
                      <Image
                        src={doc.image}
                        alt={doc.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{doc.name}</p>
                      <p className="text-[11px] text-teal-400 font-medium truncate">{doc.specialty}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">${doc.consultationFee} &bull; 30 min</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Interactive Calendar Date Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                2. Select Date (Upcoming 14 Days)
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Working Days: {selectedDoctor.workingDays.length === 6 ? "Mon - Sat" : "Mon - Fri"}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {upcomingDates.map((item) => {
                const isSelected = item.dateStr === selectedDate;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl border text-center min-w-[76px] transition-all ${
                      isSelected
                        ? "bg-gradient-to-b from-cyan-950 to-slate-900 border-cyan-400 shadow-md ring-1 ring-cyan-400 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-bold tracking-wider">{item.dayName}</span>
                    <span className="block text-xs font-extrabold mt-0.5 text-slate-100">{item.monthDay}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Cal.com Dynamic 30-Min Slot Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                3. Choose Available 30-Minute Time Slot
              </label>
              {selectedSlot && (
                <Badge variant="scheduled" dot={false} className="text-[10px]">
                  Selected: {selectedSlot}
                </Badge>
              )}
            </div>

            {loadingSlots ? (
              <div className="h-28 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  Generating Cal.com conflict-free slots...
                </div>
              </div>
            ) : !slotsData.isWorkingDay ? (
              <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <p className="text-sm font-semibold text-amber-400">Doctor Not In Clinic On This Day</p>
                <p className="text-xs text-slate-400 mt-1">
                  Dr. {selectedDoctor.name} does not hold clinical consultations on this day of the week. Please select another day above.
                </p>
              </div>
            ) : slotsData.slots.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs text-slate-400">
                No slots found for this schedule.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                {slotsData.slots.map((slot) => {
                  const isSelected = selectedSlot === slot.time;
                  const isAvailable = slot.isAvailable;

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`px-2.5 py-2 rounded-lg border text-xs font-semibold transition-all relative ${
                        !isAvailable
                          ? "bg-slate-950 border-slate-800/60 text-slate-600 line-through cursor-not-allowed opacity-60"
                          : isSelected
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400 scale-[1.02]"
                          : "bg-slate-900 border-slate-800 text-slate-200 hover:border-teal-500/60 hover:bg-slate-800/80"
                      }`}
                    >
                      {slot.time}
                      {!isAvailable && (
                        <span className="block text-[8px] no-underline font-normal text-rose-500 uppercase mt-0.5">
                          Booked
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Patient Information & Reason */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              4. Patient Details &amp; Clinical Reason
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Patient Full Name</label>
                <Input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Email (For Confirmations)</label>
                <Input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Contact Phone</label>
                <Input
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Reason for Consultation</label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Chest pain during exertion, migraine aura, routine prescription review"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Additional Clinical Notes (Optional)</label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="List any acute symptoms, allergy alerts, or questions for the doctor..."
                rows={2}
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real-time conflict detection active</span>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="glow"
                disabled={submitting || !selectedSlot}
                className="min-w-[170px]"
              >
                {submitting ? "Locking Slot..." : `Confirm Booking ($${selectedDoctor.consultationFee})`}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
