import { NextRequest, NextResponse } from "next/server";
import { getAppointmentById } from "@/lib/db/store";
import { sendAppointmentNotificationEmail } from "@/lib/mail/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, type = "confirmed", customMessage } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, error: "Missing required appointmentId field." },
        { status: 400 }
      );
    }

    const appointment = await getAppointmentById(appointmentId);
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: `Appointment "${appointmentId}" not found.` },
        { status: 404 }
      );
    }

    const emailResult = await sendAppointmentNotificationEmail({
      appointment,
      type,
      customMessage,
    });

    return NextResponse.json({
      success: true,
      simulated: emailResult.simulated,
      messageId: emailResult.messageId,
      recipient: appointment.patientEmail,
      status: type,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to trigger email notification" },
      { status: 500 }
    );
  }
}
