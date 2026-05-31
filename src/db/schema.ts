import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const providers = sqliteTable("providers", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  description: text("description"),
  timezone: text("timezone").notNull().default("Europe/Madrid"),
  depositEnabled: integer("deposit_enabled", { mode: "boolean" })
    .notNull()
    .default(false),
  depositCents: integer("deposit_cents").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  providerId: text("provider_id")
    .notNull()
    .references(() => providers.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  priceCents: integer("price_cents").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const availability = sqliteTable("availability", {
  id: text("id").primaryKey(),
  providerId: text("provider_id")
    .notNull()
    .references(() => providers.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  providerId: text("provider_id")
    .notNull()
    .references(() => providers.id, { onDelete: "cascade" }),
  serviceId: text("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  notes: text("notes"),
  status: text("status", { enum: ["pending", "confirmed", "cancelled"] })
    .notNull()
    .default("confirmed"),
  paymentStatus: text("payment_status", {
    enum: ["none", "pending", "paid"],
  })
    .notNull()
    .default("none"),
  stripeSessionId: text("stripe_session_id"),
  createdAt: text("created_at").notNull(),
});

export const providersRelations = relations(providers, ({ many }) => ({
  services: many(services),
  availability: many(availability),
  bookings: many(bookings),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  provider: one(providers, {
    fields: [services.providerId],
    references: [providers.id],
  }),
  bookings: many(bookings),
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
  provider: one(providers, {
    fields: [availability.providerId],
    references: [providers.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  provider: one(providers, {
    fields: [bookings.providerId],
    references: [providers.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
}));

export type Provider = typeof providers.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Availability = typeof availability.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
