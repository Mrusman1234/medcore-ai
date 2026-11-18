export type Gender = "Male" | "Female" | "Other";

export type AppointmentStatus = "scheduled" | "pending" | "cancelled" | "completed";

export type TriageUrgency = "routine" | "urgent" | "emergency";

export interface Vitals {
  systolic: number; // mmHg
  diastolic: number; // mmHg
  heartRate: number; // bpm
  spO2: number; // %
  temperature: number; // °F
  weightKg: number; // kg
  heightCm: number; // cm
  bmi: number; // calculated kg/m²
  lastRecordedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  image: string;
  bio: string;
  workingDays: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  workingHours: {
    start: string; // "09:00"
    end: string; // "17:00"
    breakStart?: string; // "13:00"
    breakEnd?: string; // "14:00"
  };
  slotDurationMinutes: number; // 30
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysicianId: string;
  primaryPhysicianName: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string[];
  currentMedications: string[];
  familyMedicalHistory: string;
  pastMedicalHistory: string;
  identificationType: string;
  identificationNumber: string;
  vitals: Vitals;
  registeredAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  schedule: string; // ISO String (e.g. 2026-11-20T10:00:00.000Z)
  timeSlot: string; // e.g. "10:00 AM"
  dateString: string; // e.g. "2026-11-20"
  durationMinutes: number;
  status: AppointmentStatus;
  reason: string;
  note?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "Twice daily after meals"
  duration: string; // e.g. "7 days"
  instructions: string; // e.g. "Do not take on an empty stomach"
}

export interface Prescription {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: Gender;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorLicense: string;
  diagnosis: string;
  icdCode?: string;
  medications: PrescriptionItem[];
  instructions: string;
  issuedDate: string;
  qrVerificationCode: string;
}

export interface TriageMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  recommendedDoctorId?: string;
  recommendedDoctorName?: string;
  recommendedSpecialty?: string;
  triageUrgency?: TriageUrgency;
  clinicalSummaryPoints?: string[];
}

export interface TimeSlot {
  time: string; // "09:00 AM"
  isoString: string;
  isAvailable: boolean;
  bookedAppointmentId?: string;
}
