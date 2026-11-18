import { NextRequest, NextResponse } from "next/server";
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "@/lib/db/store";
import { sendAppointmentNotificationEmail } from "@/lib/mail/mailer";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await getAppointmentById(params.id);
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: "Appointment not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const existing = await getAppointmentById(params.id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Appointment not found." },
        { status: 404 }
      );
    }

    const updated = await updateAppointment(params.id, body);

    // Determine notification type
    let notifyType: "confirmed" | "rescheduled" | "cancelled" | null = null;
    if (body.status === "scheduled" && existing.status !== "scheduled") {
      notifyType = "confirmed";
    } else if (body.status === "cancelled") {
      notifyType = "cancelled";
    } else if (
      (body.dateString && body.dateString !== existing.dateString) ||
      (body.timeSlot && body.timeSlot !== existing.timeSlot)
    ) {
      notifyType = "rescheduled";
    }

    if (notifyType) {
      sendAppointmentNotificationEmail({
        appointment: updated,
        type: notifyType,
        customMessage: body.cancellationReason
          ? `Reason for cancellation: ${body.cancellationReason}`
          : undefined,
      }).catch((err) => console.error("Email send error:", err));
    }

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error: any) {
    const isConflict = error.message?.includes("conflict");
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update appointment" },
      { status: isConflict ? 409 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteAppointment(params.id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Appointment not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
