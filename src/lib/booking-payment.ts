import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, providers, services } from "@/db/schema";
import { notifyBookingConfirmed } from "@/lib/notifications";
import { formatDateSpanish } from "@/lib/slots";
import { getAppUrl, getStripe, isStripeConfigured } from "@/lib/stripe";
import type { Booking, Provider, Service } from "@/db/schema";

export async function createCheckoutSession({
  bookingId,
  booking,
  service,
  provider,
}: {
  bookingId: string;
  booking: Pick<Booking, "date" | "startTime" | "clientEmail">;
  service: Pick<Service, "name">;
  provider: Pick<Provider, "name" | "slug" | "depositCents">;
}) {
  const stripe = getStripe();
  const appUrl = getAppUrl();
  const dateLabel = formatDateSpanish(booking.date);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.clientEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: provider.depositCents,
          product_data: {
            name: `Señal — ${service.name}`,
            description: `${provider.name} · ${dateLabel} · ${booking.startTime}`,
          },
        },
      },
    ],
    metadata: { bookingId },
    success_url: `${appUrl}/reservar/${provider.slug}/confirmado?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/reservar/${provider.slug}?cancelado=1`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  return session;
}

export async function confirmBookingPayment(
  bookingId: string
): Promise<{ success: boolean; alreadyConfirmed?: boolean }> {
  const [row] = await db
    .select({
      booking: bookings,
      service: services,
      provider: providers,
    })
    .from(bookings)
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .innerJoin(providers, eq(bookings.providerId, providers.id))
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!row) return { success: false };

  if (row.booking.status === "confirmed") {
    return { success: true, alreadyConfirmed: true };
  }

  if (row.booking.status !== "pending") {
    return { success: false };
  }

  await db
    .update(bookings)
    .set({
      status: "confirmed",
      paymentStatus: "paid",
    })
    .where(eq(bookings.id, bookingId));

  await notifyBookingConfirmed({
    booking: row.booking,
    service: row.service,
    provider: row.provider,
  });

  return { success: true };
}

export async function confirmBookingFromSession(sessionId: string) {
  if (!isStripeConfigured()) {
    return { error: "Pagos no configurados" };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return { error: "El pago no se ha completado" };
  }

  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    return { error: "Reserva no encontrada" };
  }

  const result = await confirmBookingPayment(bookingId);
  if (!result.success) {
    return { error: "No se pudo confirmar la reserva" };
  }

  const [row] = await db
    .select({
      booking: bookings,
      service: services,
      provider: providers,
    })
    .from(bookings)
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .innerJoin(providers, eq(bookings.providerId, providers.id))
    .where(eq(bookings.id, bookingId))
    .limit(1);

  return {
    success: true,
    booking: row?.booking,
    service: row?.service,
    provider: row?.provider,
  };
}

export async function cancelPendingBooking(bookingId: string) {
  await db
    .update(bookings)
    .set({ status: "cancelled", paymentStatus: "none" })
    .where(eq(bookings.id, bookingId));
}
