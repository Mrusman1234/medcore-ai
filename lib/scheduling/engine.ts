import { getDoctorById, getAppointments } from "@/lib/db/store";
import { TimeSlot } from "@/lib/types";

/**
 * Parses "HH:mm" 24h string to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Formats minutes from midnight into 12-hour AM/PM string, e.g. "09:30 AM"
 */
function minutesTo12Hour(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const padHours = String(hours12).padStart(2, "0");
  const padMins = String(mins).padStart(2, "0");
  return `${padHours}:${padMins} ${period}`;
}

/**
 * Cal.com inspired slot generation engine
 * Generates conflict-free 30-minute slots based on doctor's schedule,
 * working days, break intervals, and existing active bookings.
 */
export async function getDoctorTimeSlots(
  doctorId: string,
  dateString: string // Format: "YYYY-MM-DD"
): Promise<{
  doctorName: string;
  specialty: string;
  date: string;
  isWorkingDay: boolean;
  slots: TimeSlot[];
}> {
  const doctor = await getDoctorById(doctorId);
  if (!doctor) {
    throw new Error(`Doctor with ID "${doctorId}" not found.`);
  }

  // Parse target date and check Day of Week (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const [year, month, day] = dateString.split("-").map(Number);
  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = targetDate.getUTCDay();

  // Verify doctor's working days
  const isWorkingDay = doctor.workingDays.includes(dayOfWeek);
  if (!isWorkingDay) {
    return {
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: dateString,
      isWorkingDay: false,
      slots: [],
    };
  }

  // Fetch already booked active appointments for this doctor on this day
  const existingAppointments = await getAppointments({
    doctorId: doctor.id,
    date: dateString,
  });

  const bookedSlotsMap = new Map<string, string>();
  for (const apt of existingAppointments) {
    if (apt.status !== "cancelled") {
      bookedSlotsMap.set(apt.timeSlot, apt.id);
    }
  }

  const startMinutes = timeToMinutes(doctor.workingHours.start);
  const endMinutes = timeToMinutes(doctor.workingHours.end);
  const breakStart = doctor.workingHours.breakStart
    ? timeToMinutes(doctor.workingHours.breakStart)
    : null;
  const breakEnd = doctor.workingHours.breakEnd
    ? timeToMinutes(doctor.workingHours.breakEnd)
    : null;

  const slotDuration = doctor.slotDurationMinutes || 30;
  const slots: TimeSlot[] = [];

  for (let current = startMinutes; current + slotDuration <= endMinutes; current += slotDuration) {
    // Skip if within doctor's break interval
    if (
      breakStart !== null &&
      breakEnd !== null &&
      current >= breakStart &&
      current < breakEnd
    ) {
      continue;
    }

    const formattedTime = minutesTo12Hour(current);
    const hours24 = Math.floor(current / 60);
    const mins = current % 60;

    // ISO timestamp for slot
    const slotDate = new Date(Date.UTC(year, month - 1, day, hours24, mins, 0));
    const isoString = slotDate.toISOString();

    const isBooked = bookedSlotsMap.has(formattedTime);

    slots.push({
      time: formattedTime,
      isoString,
      isAvailable: !isBooked,
      bookedAppointmentId: bookedSlotsMap.get(formattedTime),
    });
  }

  return {
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date: dateString,
    isWorkingDay: true,
    slots,
  };
}

/**
 * Checks whether a specific doctor has an open slot at the desired date and time
 */
export async function isSlotAvailable(
  doctorId: string,
  dateString: string,
  timeSlot: string
): Promise<boolean> {
  const result = await getDoctorTimeSlots(doctorId, dateString);
  const slot = result.slots.find((s) => s.time === timeSlot);
  return !!slot && slot.isAvailable;
}
