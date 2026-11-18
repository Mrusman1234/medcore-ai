import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix: string = "id"): string {
  const randomStr = Math.random().toString(36).substring(2, 9);
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}_${randomStr}`;
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTime(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatDateTime(dateString: string | Date): {
  dateOnly: string;
  timeOnly: string;
  dateTime: string;
} {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return {
    dateOnly: formatDate(date),
    timeOnly: formatTime(date),
    dateTime: `${formatDate(date)} at ${formatTime(date)}`,
  };
}

export function calculateAge(birthDateString: string): number {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return parseFloat(bmi.toFixed(1));
}

export function getBMICategory(bmi: number): {
  label: string;
  color: string;
} {
  if (bmi < 18.5) return { label: "Underweight", color: "text-amber-400" };
  if (bmi < 25) return { label: "Normal (Healthy)", color: "text-emerald-400" };
  if (bmi < 30) return { label: "Overweight", color: "text-amber-400" };
  return { label: "Obese (Class I+)", color: "text-rose-400" };
}

export function getBloodPressureCategory(systolic: number, diastolic: number): {
  label: string;
  color: string;
} {
  if (systolic < 120 && diastolic < 80) {
    return { label: "Optimal", color: "text-emerald-400" };
  } else if (systolic <= 129 && diastolic < 80) {
    return { label: "Elevated", color: "text-amber-300" };
  } else if (systolic <= 139 || diastolic <= 89) {
    return { label: "Stage 1 Hypertension", color: "text-amber-400" };
  } else {
    return { label: "Stage 2 Hypertension", color: "text-rose-400" };
  }
}
