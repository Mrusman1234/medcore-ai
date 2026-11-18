import { NextRequest, NextResponse } from "next/server";
import { getAppointments, createAppointment, getDoctorById } from "@/lib/db/store";
import { generateId } from "@/lib/utils";
import { Appointment } from "@/lib/types";
import { sendAppointmentNotificationEmail } from "@/lib/mail/mailer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const doctorId = searchParams.get("doctorId") || undefined;
    const patientId = searchParams.get("patientId") || undefined;
    const date = searchParams.get("date") || undefined;

    const appointments = await getAppointments({
      status,
      doctorId,
      patientId,
      date,
    });

    return NextResponse.json({ success: true, count: appointments.length, appointments });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      patientId,
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      dateString,
      timeSlot,
      reason,
      note,
    } = body;

    if (!patientName || !patientEmail || !doctorId || !dateString || !timeSlot || !reason) {
      return NextResponse.json(
        { success: false, error: "Missing required booking details (doctor, date, time slot, reason, or patient info)." },
        { status: 400 }
      );
    }

    const doctor = await getDoctorById(doctorId);
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: `Doctor with ID ${doctorId} not found.` },
        { status: 404 }
      );
    }

    // Compose timestamp
    const schedule = `${dateString}T${timeSlot}`;

    const newAppointment: Appointment = {
      id: generateId("apt"),
      patientId: patientId || generateId("pat"),
      patientName,
      patientEmail,
      patientPhone: patientPhone || "+1 (555) 000-0000",
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorImage: doctor.image,
      schedule,
      timeSlot,
      dateString,
      durationMinutes: doctor.slotDurationMinutes || 30,
      status: "scheduled",
      reason,
      note: note || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await createAppointment(newAppointment);

    // Send confirmation email asynchronously (graceful fallback if SMTP unconfigured)
    sendAppointmentNotificationEmail({
      appointment: saved,
      type: "booked",
    }).catch((err) => console.error("Email send failed in background:", err));

    return NextResponse.json({ success: true, appointment: saved }, { status: 201 });
  } catch (error: any) {
    // Return 409 Conflict if double-booked
    const isConflict = error.message?.includes("Conflict");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create appointment" },
      { status: isConflict ? 409 : 500 }
    );
  }
}
