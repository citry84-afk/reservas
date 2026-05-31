import { addDays, format } from "date-fns";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { bookings, providers, services } from "@/db/schema";
import {
  isEmailConfigured,
} from "@/lib/email";
import { notifyBookingReminder } from "@/lib/notifications";

/** Fecha de mañana en yyyy-MM-dd (zona Europe/Madrid por defecto en servidor Vercel UTC — usamos fecha local del cron) */
function getTomorrowDateString(): string {
  return format(addDays(new Date(), 1), "yyyy-MM-dd");
}

export async function processBookingReminders() {
  if (!isEmailConfigured()) {
    return { sent: 0, skipped: 0, reason: "Email no configurado" };
  }

  const tomorrow = getTomorrowDateString();

  const rows = await db
    .select({
      booking: bookings,
      service: services,
      provider: providers,
    })
    .from(bookings)
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .innerJoin(providers, eq(bookings.providerId, providers.id))
    .where(
      and(
        eq(bookings.date, tomorrow),
        eq(bookings.status, "confirmed"),
        isNull(bookings.reminderSentAt)
      )
    );

  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    const result = await notifyBookingReminder({
      booking: row.booking,
      service: row.service,
      provider: row.provider,
    });

    if (result.sent) {
      await db
        .update(bookings)
        .set({ reminderSentAt: new Date().toISOString() })
        .where(eq(bookings.id, row.booking.id));
      sent++;
    } else {
      failed++;
    }
  }

  return {
    sent,
    failed,
    total: rows.length,
    date: tomorrow,
  };
}
