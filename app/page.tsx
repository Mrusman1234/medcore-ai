"use client";

import React, { useState, useEffect } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { SpecialistDirectory } from "@/components/landing/SpecialistDirectory";
import { PlatformFeatures } from "@/components/landing/PlatformFeatures";
import { AppointmentBookingModal } from "@/components/booking/AppointmentBookingModal";
import { Doctor } from "@/lib/types";

export default function HomePage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.doctors) {
          setDoctors(data.doctors);
        }
      })
      .catch((err) => console.error("Failed to load doctors", err));
  }, []);

  const handleOpenBooking = (doctorId?: string) => {
    setSelectedDoctorId(doctorId);
    setIsBookingOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection onOpenBooking={() => handleOpenBooking()} />

      {/* Specialist Doctor Directory */}
      <SpecialistDirectory
        doctors={doctors}
        onSelectDoctor={(docId) => handleOpenBooking(docId)}
      />

      {/* Architecture & Features Grid */}
      <PlatformFeatures />

      {/* Slot Booking Modal */}
      {doctors.length > 0 && (
        <AppointmentBookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialDoctorId={selectedDoctorId}
          doctors={doctors}
        />
      )}
    </div>
  );
}
