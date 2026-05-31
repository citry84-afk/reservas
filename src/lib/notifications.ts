import { sendBookingConfirmationEmails } from "@/lib/email";
import { formatDateSpanish } from "@/lib/slots";
import {
  bookingWhatsAppText,
  isWhatsAppConfigured,
  sendWhatsAppMessage,
} from "@/lib/whatsapp";
import type { Booking, Provider, Service } from "@/db/schema";

type NotifyData = {
  booking: Pick<
    Booking,
    | "id"
    | "date"
    | "startTime"
    | "endTime"
    | "clientName"
    | "clientEmail"
    | "clientPhone"
    | "notes"
  >;
  service: Pick<Service, "name" | "durationMinutes" | "priceCents">;
  provider: Pick<
    Provider,
    "name" | "email" | "phone" | "whatsapp" | "slug"
  >;
};

export async function notifyBookingConfirmed(data: NotifyData) {
  const emailResult = await sendBookingConfirmationEmails(data);

  if (isWhatsAppConfigured() && data.booking.clientPhone) {
    const dateLabel = formatDateSpanish(data.booking.date);
    await sendWhatsAppMessage(
      data.booking.clientPhone,
      bookingWhatsAppText({
        clientName: data.booking.clientName,
        providerName: data.provider.name,
        serviceName: data.service.name,
        date: dateLabel,
        time: data.booking.startTime,
        type: "confirmation",
      })
    );
  }

  return emailResult;
}

export async function notifyBookingReminder(data: NotifyData) {
  const { sendBookingReminderEmails } = await import("@/lib/email");
  const emailResult = await sendBookingReminderEmails(data);

  if (isWhatsAppConfigured() && data.booking.clientPhone) {
    const dateLabel = formatDateSpanish(data.booking.date);
    await sendWhatsAppMessage(
      data.booking.clientPhone,
      bookingWhatsAppText({
        clientName: data.booking.clientName,
        providerName: data.provider.name,
        serviceName: data.service.name,
        date: dateLabel,
        time: data.booking.startTime,
        type: "reminder",
      })
    );
  }

  return emailResult;
}
