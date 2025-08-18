import { sql } from "drizzle-orm";
import { 
  sqliteTable, 
  text, 
  integer, 
  real,
  blob,
  index
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = sqliteTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: blob("sess").notNull(),
    expires: integer("expires", { mode: 'timestamp' }).notNull(),
  },
  (table) => [index("IDX_session_expires").on(table.expires)],
);

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  emailVerified: integer("email_verified", { mode: 'boolean' }).default(false),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).defaultNow(),
});

// Email verification codes table
export const verificationCodes = sqliteTable("verification_codes", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  used: integer("used", { mode: 'boolean' }).default(false),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

// Providers table - business profiles
export const providers = sqliteTable("providers", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  businessName: text("business_name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: text("category"),
  address: text("address"),
  phone: text("phone"),
  profileImageUrl: text("profile_image_url"),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).defaultNow(),
});

// Services table
export const services = sqliteTable("services", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  providerId: text("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  duration: integer("duration").notNull(), // in minutes
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).defaultNow(),
});

// Weekly availability patterns
export const availability = sqliteTable("availability", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  providerId: text("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  isEnabled: integer("is_enabled", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

// Date-specific blocks (holidays, breaks, etc.)
export const dateBlocks = sqliteTable("date_blocks", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  providerId: text("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  startDate: integer("start_date", { mode: 'timestamp' }).notNull(),
  endDate: integer("end_date", { mode: 'timestamp' }).notNull(),
  isAllDay: integer("is_all_day", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

// Appointments table
export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(16)))`),
  providerId: text("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  serviceId: text("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  clientEmail: text("client_email"),
  appointmentDate: integer("appointment_date", { mode: 'timestamp' }).notNull(),
  duration: integer("duration").notNull(), // in minutes
  price: real("price").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  notes: text("notes"),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  provider: one(providers),
}));

export const providersRelations = relations(providers, ({ one, many }) => ({
  user: one(users, {
    fields: [providers.userId],
    references: [users.id],
  }),
  services: many(services),
  availability: many(availability),
  dateBlocks: many(dateBlocks),
  appointments: many(appointments),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  provider: one(providers, {
    fields: [services.providerId],
    references: [providers.id],
  }),
  appointments: many(appointments),
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
  provider: one(providers, {
    fields: [availability.providerId],
    references: [providers.id],
  }),
}));

export const dateBlocksRelations = relations(dateBlocks, ({ one }) => ({
  provider: one(providers, {
    fields: [dateBlocks.providerId],
    references: [providers.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  provider: one(providers, {
    fields: [appointments.providerId],
    references: [providers.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProviderSchema = createInsertSchema(providers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAvailabilitySchema = createInsertSchema(availability).omit({
  id: true,
  createdAt: true,
});

export const insertDateBlockSchema = createInsertSchema(dateBlocks).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  appointmentDate: z.union([z.date(), z.string()]).transform((val) => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }),
});

// Types
export type User = typeof users.$inferSelect;
export type Provider = typeof providers.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Availability = typeof availability.$inferSelect;
export type DateBlock = typeof dateBlocks.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type InsertDateBlock = z.infer<typeof insertDateBlockSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
