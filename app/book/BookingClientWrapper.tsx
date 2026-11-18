"use client";

import React, { useState } from "react";
import { Doctor } from "@/lib/types";
import { SpecialistDirectory } from "@/components/landing/SpecialistDirectory";
import { AppointmentBookingModal } from "@/components/booking/AppointmentBookingModal";

interface BookingClientWrapperProps {
  doctors: Doctor[];
  initialDoctorId?: string;
}

export function AppointmentBookingModalWrapper({
  doctors,
  initialDoctorId,
}: BookingClientWrapperProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(
    initialDoctorId || null
  );

  return (
    <div>
      <SpecialistDirectory
        doctors={doctors}
        onSelectDoctor={(docId) => setSelectedDoctorId(docId)}
      />

      {selectedDoctorId && (
        <AppointmentBookingModal
          isOpen={true}
          onClose={() => setSelectedDoctorId(null)}
          initialDoctorId={selectedDoctorId}
          doctors={doctors}
        />
      )}
    </div>
  );
}
