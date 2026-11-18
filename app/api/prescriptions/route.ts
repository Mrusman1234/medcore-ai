import { NextRequest, NextResponse } from "next/server";
import {
  getPrescriptions,
  getPrescriptionsByPatientId,
  createPrescription,
  getDoctorById,
  getPatientById,
} from "@/lib/db/store";
import { generateId, calculateAge } from "@/lib/utils";
import { Prescription } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    let prescriptions: Prescription[];
    if (patientId) {
      prescriptions = await getPrescriptionsByPatientId(patientId);
    } else {
      prescriptions = await getPrescriptions();
    }

    return NextResponse.json({ success: true, count: prescriptions.length, prescriptions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve prescriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      icdCode,
      medications,
      instructions,
    } = body;

    if (!patientId || !doctorId || !diagnosis || !medications || medications.length === 0) {
      return NextResponse.json(
        { success: false, error: "Patient, doctor, diagnosis, and at least one medication are required." },
        { status: 400 }
      );
    }

    const patient = await getPatientById(patientId);
    const doctor = await getDoctorById(doctorId);

    if (!patient || !doctor) {
      return NextResponse.json(
        { success: false, error: "Referenced patient or doctor was not found." },
        { status: 404 }
      );
    }

    const age = calculateAge(patient.birthDate);
    const qrCode = `MEDCORE-RX-${Date.now().toString(36).toUpperCase()}-${patient.name.substring(0, 3).toUpperCase()}`;

    const newPrescription: Prescription = {
      id: generateId("rx"),
      appointmentId: appointmentId || undefined,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: age,
      patientGender: patient.gender,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorLicense: `MD-LIC-${Math.floor(1000000 + Math.random() * 9000000)}`,
      diagnosis,
      icdCode: icdCode || "R69",
      medications: medications.map((m: any, idx: number) => ({
        id: generateId(`med_${idx + 1}`),
        medicationName: m.medicationName,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        instructions: m.instructions || "Take as directed",
      })),
      instructions: instructions || "Take all medications strictly as directed. Contact clinic if any adverse reaction occurs.",
      issuedDate: new Date().toISOString(),
      qrVerificationCode: qrCode,
    };

    const saved = await createPrescription(newPrescription);
    return NextResponse.json({ success: true, prescription: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create digital prescription" },
      { status: 500 }
    );
  }
}
