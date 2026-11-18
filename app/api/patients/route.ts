import { NextRequest, NextResponse } from "next/server";
import { getPatients, createPatient, getDoctorById } from "@/lib/db/store";
import { generateId, calculateBMI } from "@/lib/utils";
import { Patient } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const patients = await getPatients();
    if (id) {
      const match = patients.find((p) => p.id === id || p.userId === id);
      if (!match) {
        return NextResponse.json({ success: false, error: "Patient not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, patient: match });
    }

    return NextResponse.json({ success: true, count: patients.length, patients });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve patients" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      birthDate,
      gender,
      address,
      occupation,
      emergencyContactName,
      emergencyContactNumber,
      primaryPhysicianId,
      insuranceProvider,
      insurancePolicyNumber,
      allergies,
      currentMedications,
      familyMedicalHistory,
      pastMedicalHistory,
      identificationType,
      identificationNumber,
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    let doctorName = "Dr. Sarah Jenkins";
    if (primaryPhysicianId) {
      const doc = await getDoctorById(primaryPhysicianId);
      if (doc) doctorName = doc.name;
    }

    const defaultWeight = 70;
    const defaultHeight = 175;

    const newPatient: Patient = {
      id: generateId("pat"),
      userId: generateId("usr"),
      name,
      email,
      phone,
      birthDate: birthDate || "1990-01-01",
      gender: gender || "Male",
      address: address || "Not provided",
      occupation: occupation || "General",
      emergencyContactName: emergencyContactName || "Self / None specified",
      emergencyContactNumber: emergencyContactNumber || phone,
      primaryPhysicianId: primaryPhysicianId || "doc_1",
      primaryPhysicianName: doctorName,
      insuranceProvider: insuranceProvider || "Self-Pay",
      insurancePolicyNumber: insurancePolicyNumber || "N/A",
      allergies: Array.isArray(allergies)
        ? allergies
        : typeof allergies === "string" && allergies.trim()
        ? allergies.split(",").map((s: string) => s.trim())
        : ["No Known Drug Allergies (NKDA)"],
      currentMedications: Array.isArray(currentMedications)
        ? currentMedications
        : typeof currentMedications === "string" && currentMedications.trim()
        ? currentMedications.split(",").map((s: string) => s.trim())
        : [],
      familyMedicalHistory: familyMedicalHistory || "None reported",
      pastMedicalHistory: pastMedicalHistory || "None reported",
      identificationType: identificationType || "State ID Card",
      identificationNumber: identificationNumber || "PENDING-VERIFICATION",
      vitals: {
        systolic: 120,
        diastolic: 80,
        heartRate: 72,
        spO2: 99,
        temperature: 98.6,
        weightKg: defaultWeight,
        heightCm: defaultHeight,
        bmi: calculateBMI(defaultWeight, defaultHeight),
        lastRecordedAt: new Date().toISOString(),
      },
      registeredAt: new Date().toISOString(),
    };

    const created = await createPatient(newPatient);
    return NextResponse.json({ success: true, patient: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create patient profile" },
      { status: 500 }
    );
  }
}
