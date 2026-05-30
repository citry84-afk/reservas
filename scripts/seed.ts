import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { nanoid } from "nanoid";
import * as schema from "../src/db/schema";

const url =
  process.env.TURSO_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "file:./local.db";
const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN ?? process.env.DATABASE_AUTH_TOKEN,
});
const db = drizzle(client, { schema });

async function seed() {
  console.log("Sembrando base de datos...");

  const providerId = nanoid();
  await db.insert(schema.providers).values({
    id: providerId,
    slug: "maria-garcia",
    name: "María García",
    email: "maria@ejemplo.com",
    phone: "+34 600 123 456",
    description:
      "Psicóloga clínica especializada en ansiedad y estrés. Sesiones presenciales y online.",
    timezone: "Europe/Madrid",
    createdAt: new Date().toISOString(),
  });

  const consultaId = nanoid();
  const seguimientoId = nanoid();

  await db.insert(schema.services).values([
    {
      id: consultaId,
      providerId,
      name: "Consulta inicial",
      description: "Primera sesión de evaluación (60 min)",
      durationMinutes: 60,
      priceCents: 6000,
      active: true,
    },
    {
      id: seguimientoId,
      providerId,
      name: "Sesión de seguimiento",
      description: "Sesión de seguimiento terapéutico (50 min)",
      durationMinutes: 50,
      priceCents: 4500,
      active: true,
    },
  ]);

  const defaultSchedule = [
    { day: 1, start: "09:00", end: "14:00" },
    { day: 1, start: "16:00", end: "19:00" },
    { day: 2, start: "09:00", end: "14:00" },
    { day: 2, start: "16:00", end: "19:00" },
    { day: 3, start: "09:00", end: "14:00" },
    { day: 4, start: "09:00", end: "14:00" },
    { day: 4, start: "16:00", end: "19:00" },
    { day: 5, start: "09:00", end: "13:00" },
  ];

  await db.insert(schema.availability).values(
    defaultSchedule.map((s) => ({
      id: nanoid(),
      providerId,
      dayOfWeek: s.day,
      startTime: s.start,
      endTime: s.end,
    }))
  );

  console.log("✓ Proveedor: María García (slug: maria-garcia)");
  console.log("✓ 2 servicios creados");
  console.log("✓ Horario L-V configurado");
  console.log("\nReserva pública: http://localhost:3000/reservar/maria-garcia");
  console.log("Panel admin: http://localhost:3000/admin (contraseña: admin123)");
}

seed().catch(console.error);
