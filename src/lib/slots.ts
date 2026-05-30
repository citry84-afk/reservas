import { addMinutes, format, parse } from "date-fns";
import { es } from "date-fns/locale";

export function parseTime(time: string): Date {
  return parse(time, "HH:mm", new Date());
}

export function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number,
  bookedSlots: string[]
): string[] {
  const slots: string[] = [];
  let current = parseTime(startTime);
  const end = parseTime(endTime);

  while (addMinutes(current, durationMinutes) <= end) {
    const slot = formatTime(current);
    if (!bookedSlots.includes(slot)) {
      slots.push(slot);
    }
    current = addMinutes(current, durationMinutes);
  }

  return slots;
}

export function formatPrice(cents: number): string {
  if (cents === 0) return "Gratis";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function formatDateSpanish(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return format(date, "EEEE d 'de' MMMM, yyyy", { locale: es });
}

export const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
