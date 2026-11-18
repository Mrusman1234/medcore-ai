import fs from "fs";
import path from "path";
import { Doctor, Patient, Appointment, Prescription } from "@/lib/types";
import {
  SEED_DOCTORS,
  SEED_PATIENTS,
  SEED_APPOINTMENTS,
  SEED_PRESCRIPTIONS,
} from "./seed-data";

interface DatabaseSchema {
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  lastInitialized: string;
}

// In-memory cache for immediate server responses and serverless instances
let inMemoryDb: DatabaseSchema = {
  doctors: [...SEED_DOCTORS],
  patients: [...SEED_PATIENTS],
  appointments: [...SEED_APPOINTMENTS],
  prescriptions: [...SEED_PRESCRIPTIONS],
  lastInitialized: new Date().toISOString(),
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensurePersistenceDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Graceful fallback for read-only environments (e.g., Vercel Lambdas)
    console.warn("Storage warning: Running with volatile in-memory store", err);
  }
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data) as DatabaseSchema;
      if (parsed.doctors && parsed.patients && parsed.appointments) {
        inMemoryDb = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load from disk, using in-memory store", err);
  }

  // Initialize and persist seed data
  saveDatabase(inMemoryDb);
  return inMemoryDb;
}

function saveDatabase(db: DatabaseSchema) {
  inMemoryDb = db;
  try {
    ensurePersistenceDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch {
    // If running in read-only environment like Vercel serverless, in-memory is active
  }
}

// Initialize on first import
try {
  loadDatabase();
} catch {
  // Safe fallback
}

// ============================================================================
// DOCTOR OPERATIONS
// ============================================================================

export async function getDoctors(): Promise<Doctor[]> {
  const db = loadDatabase();
  return db.doctors;
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  const db = loadDatabase();
  return db.doctors.find((d) => d.id === id) || null;
}

// ============================================================================
// PATIENT OPERATIONS
// ============================================================================

export async function getPatients(): Promise<Patient[]> {
  const db = loadDatabase();
  return db.patients;
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const db = loadDatabase();
  return db.patients.find((p) => p.id === id || p.userId === id) || null;
}

export async function createPatient(patient: Patient): Promise<Patient> {
  const db = loadDatabase();
  const existingIndex = db.patients.findIndex(
    (p) => p.id === patient.id || p.email.toLowerCase() === patient.email.toLowerCase()
  );

  if (existingIndex >= 0) {
    db.patients[existingIndex] = { ...db.patients[existingIndex], ...patient };
  } else {
    db.patients.unshift(patient);
  }

  saveDatabase(db);
  return patient;
}

// ============================================================================
// APPOINTMENT OPERATIONS
// ============================================================================

export async function getAppointments(filters?: {
  status?: string;
  doctorId?: string;
  patientId?: string;
  date?: string;
}): Promise<Appointment[]> {
  const db = loadDatabase();
  let list = [...db.appointments];

  if (filters?.status && filters.status !== "all") {
    list = list.filter((a) => a.status === filters.status);
  }

  if (filters?.doctorId && filters.doctorId !== "all") {
    list = list.filter((a) => a.doctorId === filters.doctorId);
  }

  if (filters?.patientId) {
    list = list.filter((a) => a.patientId === filters.patientId);
  }

  if (filters?.date) {
    list = list.filter((a) => a.dateString === filters.date);
  }

  // Sort descending by schedule date
  return list.sort(
    (a, b) => new Date(b.schedule).getTime() - new Date(a.schedule).getTime()
  );
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const db = loadDatabase();
  return db.appointments.find((a) => a.id === id) || null;
}

export async function createAppointment(appointment: Appointment): Promise<Appointment> {
  const db = loadDatabase();

  // Double-booking check: Ensure no active appointment exists for same doctor at same schedule
  const hasConflict = db.appointments.some(
    (a) =>
      a.doctorId === appointment.doctorId &&
      a.dateString === appointment.dateString &&
      a.timeSlot === appointment.timeSlot &&
      a.status !== "cancelled"
  );

  if (hasConflict) {
    throw new Error(
      `Conflict: Dr. ${appointment.doctorName} is already booked on ${appointment.dateString} at ${appointment.timeSlot}. Please choose another time slot.`
    );
  }

  db.appointments.unshift(appointment);
  saveDatabase(db);
  return appointment;
}

export async function updateAppointment(
  id: string,
  updates: Partial<Appointment>
): Promise<Appointment> {
  const db = loadDatabase();
  const index = db.appointments.findIndex((a) => a.id === id);

  if (index === -1) {
    throw new Error(`Appointment with ID "${id}" was not found.`);
  }

  // If rescheduling, check for collisions
  if (
    (updates.dateString || updates.timeSlot) &&
    updates.status !== "cancelled"
  ) {
    const targetDate = updates.dateString || db.appointments[index].dateString;
    const targetSlot = updates.timeSlot || db.appointments[index].timeSlot;
    const doctorId = updates.doctorId || db.appointments[index].doctorId;

    const conflict = db.appointments.some(
      (a) =>
        a.id !== id &&
        a.doctorId === doctorId &&
        a.dateString === targetDate &&
        a.timeSlot === targetSlot &&
        a.status !== "cancelled"
    );

    if (conflict) {
      throw new Error(`Double-booking conflict: This time slot is already taken.`);
    }
  }

  const updated: Appointment = {
    ...db.appointments[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.appointments[index] = updated;
  saveDatabase(db);
  return updated;
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const db = loadDatabase();
  const initialLength = db.appointments.length;
  db.appointments = db.appointments.filter((a) => a.id !== id);
  if (db.appointments.length !== initialLength) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ============================================================================
// PRESCRIPTION OPERATIONS
// ============================================================================

export async function getPrescriptions(): Promise<Prescription[]> {
  const db = loadDatabase();
  return db.prescriptions.sort(
    (a, b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
  );
}

export async function getPrescriptionById(id: string): Promise<Prescription | null> {
  const db = loadDatabase();
  return db.prescriptions.find((p) => p.id === id) || null;
}

export async function getPrescriptionsByPatientId(patientId: string): Promise<Prescription[]> {
  const db = loadDatabase();
  return db.prescriptions.filter((p) => p.patientId === patientId);
}

export async function createPrescription(prescription: Prescription): Promise<Prescription> {
  const db = loadDatabase();
  db.prescriptions.unshift(prescription);
  saveDatabase(db);
  return prescription;
}

// ============================================================================
// RESET DEMO DATA
// ============================================================================

export async function resetToSeedData(): Promise<void> {
  inMemoryDb = {
    doctors: [...SEED_DOCTORS],
    patients: [...SEED_PATIENTS],
    appointments: [...SEED_APPOINTMENTS],
    prescriptions: [...SEED_PRESCRIPTIONS],
    lastInitialized: new Date().toISOString(),
  };
  saveDatabase(inMemoryDb);
}
