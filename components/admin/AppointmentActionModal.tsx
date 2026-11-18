"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Appointment } from "@/lib/types";
import { CheckCircle2, Calendar, XCircle, AlertCircle } from "lucide-react";

interface AppointmentActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  actionType: "confirm" | "reschedule" | "cancel";
  onSuccess: () => void;
}

export function AppointmentActionModal({
  isOpen,
  onClose,
  appointment,
  actionType,
  onSuccess,
}: AppointmentActionModalProps) {
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("10:00 AM");
  const [cancelReason, setCancelReason] = useState(
    "Physician schedule adjustment / patient requested rescheduling"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      let bodyUpdates: any = {};
      if (actionType === "confirm") {
        bodyUpdates = { status: "scheduled" };
      } else if (actionType === "reschedule") {
        if (!newDate || !newSlot) {
          setError("Please provide both a new date and time slot.");
          setSubmitting(false);
          return;
        }
        bodyUpdates = {
          dateString: newDate,
          timeSlot: newSlot,
          schedule: `${newDate}T${newSlot}`,
          status: "scheduled",
        };
      } else if (actionType === "cancel") {
        bodyUpdates = {
          status: "cancelled",
          cancellationReason: cancelReason,
        };
      }

      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyUpdates),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Action failed");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to process appointment action");
    } finally {
      setSubmitting(false);
    }
  };

  const titles = {
    confirm: "Confirm & Schedule Appointment",
    reschedule: "Reschedule Appointment Slot",
    cancel: "Cancel Appointment",
  };

  const descriptions = {
    confirm: `Confirm booking with Dr. ${appointment.doctorName} for patient ${appointment.patientName}. An automated email will be sent.`,
    reschedule: `Adjust date and time slot for appointment ${appointment.id}. Cal.com double-booking engine prevents conflicts.`,
    cancel: `Cancel this consultation and notify ${appointment.patientEmail}.`,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titles[actionType]}
      description={descriptions[actionType]}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Patient:</span>
            <span className="text-white font-semibold">{appointment.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Physician:</span>
            <span className="text-teal-400 font-semibold">{appointment.doctorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Current Slot:</span>
            <span className="text-slate-200 font-mono">
              {appointment.dateString} at {appointment.timeSlot}
            </span>
          </div>
        </div>

        {actionType === "reschedule" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">New Appointment Date</label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">New 30-Min Time Slot</label>
              <Input
                placeholder="e.g. 11:30 AM"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {actionType === "cancel" && (
          <div>
            <label className="text-xs text-slate-300 block mb-1">Cancellation Reason</label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              required
              rows={3}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Back
          </Button>
          <Button
            type="submit"
            variant={actionType === "cancel" ? "destructive" : "default"}
            disabled={submitting}
          >
            {submitting
              ? "Processing..."
              : actionType === "confirm"
              ? "Confirm & Notify Patient"
              : actionType === "reschedule"
              ? "Apply New Schedule"
              : "Confirm Cancellation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
