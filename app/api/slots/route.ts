import { NextRequest, NextResponse } from "next/server";
import { getDoctorTimeSlots } from "@/lib/scheduling/engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date"); // YYYY-MM-DD

    if (!doctorId || !date) {
      return NextResponse.json(
        { success: false, error: "doctorId and date (YYYY-MM-DD) query parameters are required." },
        { status: 400 }
      );
    }

    const slotResult = await getDoctorTimeSlots(doctorId, date);
    return NextResponse.json({ success: true, ...slotResult });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate time slots" },
      { status: 500 }
    );
  }
}
