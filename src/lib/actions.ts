"use server";

import { and, asc, eq, gte } from "drizzle-orm";
import { addMinutes } from "date-fns";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  availability,
  bookings,
  providers,
  services,
} from "@/db/schema";
import { clearSession, setSession, verifyPassword } from "@/lib/auth";
import { formatTime, generateTimeSlots, parseTime } from "@/lib/slots";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  if (!verifyPassword(password)) {
    return { error: "Contraseña incorrecta" };
  }
  await setSession();
  return { success: true };
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function getProvider() {
  const [provider] = await db.select().from(providers).limit(1);
  return provider ?? null;
}

export async function getProviderBySlug(slug: string) {
  const [provider] = await db
    .select()
    .from(providers)
    .where(eq(providers.slug, slug))
    .limit(1);
  return provider ?? null;
}

export async function getActiveServices(providerId: string) {
  return db
    .select()
    .from(services)
    .where(and(eq(services.providerId, providerId), eq(services.active, true)));
}

export async function getAvailability(providerId: string) {
  return db
    .select()
    .from(availability)
    .where(eq(availability.providerId, providerId));
}

export async function getAvailableSlots(
  providerId: string,
  serviceId: string,
  date: string
) {
  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, serviceId))
    .limit(1);

  if (!service) return [];

  const dayOfWeek = new Date(date + "T12:00:00").getDay();
  const dayAvailability = await db
    .select()
    .from(availability)
    .where(
      and(
        eq(availability.providerId, providerId),
        eq(availability.dayOfWeek, dayOfWeek)
      )
    );

  if (dayAvailability.length === 0) return [];

  const existingBookings = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.providerId, providerId),
        eq(bookings.date, date),
        eq(bookings.status, "confirmed")
      )
    );

  const bookedSlots = existingBookings.map((b) => b.startTime);
  const allSlots: string[] = [];

  for (const slot of dayAvailability) {
    allSlots.push(
      ...generateTimeSlots(
        slot.startTime,
        slot.endTime,
        service.durationMinutes,
        bookedSlots
      )
    );
  }

  return [...new Set(allSlots)].sort();
}

export async function createBooking(data: {
  providerId: string;
  serviceId: string;
  date: string;
  startTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
}) {
  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, data.serviceId))
    .limit(1);

  if (!service) {
    return { error: "Servicio no encontrado" };
  }

  const slots = await getAvailableSlots(
    data.providerId,
    data.serviceId,
    data.date
  );

  if (!slots.includes(data.startTime)) {
    return { error: "Este horario ya no está disponible" };
  }

  const start = parseTime(data.startTime);
  const end = formatTime(addMinutes(start, service.durationMinutes));

  const id = nanoid();
  await db.insert(bookings).values({
    id,
    providerId: data.providerId,
    serviceId: data.serviceId,
    date: data.date,
    startTime: data.startTime,
    endTime: end,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientPhone: data.clientPhone ?? null,
    notes: data.notes ?? null,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/admin");
  revalidatePath(`/reservar/${(await getProvider())?.slug}`);

  return { success: true, bookingId: id };
}

export async function getUpcomingBookings(providerId: string) {
  const today = new Date().toISOString().split("T")[0];
  return db
    .select({
      booking: bookings,
      service: services,
    })
    .from(bookings)
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .where(
      and(
        eq(bookings.providerId, providerId),
        gte(bookings.date, today),
        eq(bookings.status, "confirmed")
      )
    )
    .orderBy(asc(bookings.date), asc(bookings.startTime));
}

export async function cancelBooking(bookingId: string) {
  await db
    .update(bookings)
    .set({ status: "cancelled" })
    .where(eq(bookings.id, bookingId));
  revalidatePath("/admin");
}

export async function setupProvider(data: {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  description?: string;
}) {
  const existing = await getProvider();
  if (existing) {
    await db
      .update(providers)
      .set({
        name: data.name,
        slug: data.slug,
        email: data.email,
        phone: data.phone ?? null,
        description: data.description ?? null,
      })
      .where(eq(providers.id, existing.id));
    revalidatePath("/admin");
    return { success: true, id: existing.id };
  }

  const id = nanoid();
  await db.insert(providers).values({
    id,
    name: data.name,
    slug: data.slug,
    email: data.email,
    phone: data.phone ?? null,
    description: data.description ?? null,
    timezone: "Europe/Madrid",
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/admin");
  return { success: true, id };
}

export async function upsertService(data: {
  id?: string;
  providerId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  priceCents: number;
}) {
  if (data.id) {
    await db
      .update(services)
      .set({
        name: data.name,
        description: data.description ?? null,
        durationMinutes: data.durationMinutes,
        priceCents: data.priceCents,
      })
      .where(eq(services.id, data.id));
  } else {
    await db.insert(services).values({
      id: nanoid(),
      providerId: data.providerId,
      name: data.name,
      description: data.description ?? null,
      durationMinutes: data.durationMinutes,
      priceCents: data.priceCents,
      active: true,
    });
  }
  revalidatePath("/admin");
}

export async function deleteService(serviceId: string) {
  await db.delete(services).where(eq(services.id, serviceId));
  revalidatePath("/admin");
}

export async function setAvailability(
  providerId: string,
  slots: { dayOfWeek: number; startTime: string; endTime: string }[]
) {
  await db
    .delete(availability)
    .where(eq(availability.providerId, providerId));

  if (slots.length > 0) {
    await db.insert(availability).values(
      slots.map((slot) => ({
        id: nanoid(),
        providerId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }))
    );
  }

  revalidatePath("/admin");
}

export async function getAllServices(providerId: string) {
  return db
    .select()
    .from(services)
    .where(eq(services.providerId, providerId));
}
