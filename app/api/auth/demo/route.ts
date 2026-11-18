import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role = "admin" } = body;

    let user;
    if (role === "admin") {
      user = {
        role: "admin",
        userId: "usr_admin_doc1",
        name: "Dr. Sarah Jenkins",
        email: "s.jenkins@medcore.ai",
        specialty: "Chief Medical Officer & Cardiology",
        avatar: "/assets/images/dr-green.png",
      };
    } else {
      user = {
        role: "patient",
        userId: "usr_demo_patient",
        patientId: "pat_1",
        name: "John Doe",
        email: "john.doe@medcore.example.com",
        avatar: "/assets/icons/user.svg",
      };
    }

    const sessionPayload = JSON.stringify(user);

    // Set secure session cookie
    cookies().set("medcore_session", sessionPayload, {
      path: "/",
      httpOnly: false, // Accessible to client-side components as well
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      user,
      redirectTo: role === "admin" ? "/admin" : "/patient",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to establish demo session" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  cookies().delete("medcore_session");
  return NextResponse.json({ success: true, message: "Logged out" });
}
