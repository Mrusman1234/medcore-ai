import { NextResponse } from "next/server";
import { getDoctors } from "@/lib/db/store";

export async function GET() {
  try {
    const doctors = await getDoctors();
    return NextResponse.json({ success: true, count: doctors.length, doctors });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve doctors" },
      { status: 500 }
    );
  }
}
