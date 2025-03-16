import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("driver"),
  isApproved: boolean("is_approved").notNull().default(false),
  fullName: text("full_name"),
  idNumber: text("id_number"),
  licenseNumber: text("license_number"),
  idDocumentUrl: text("id_document_url"),
  licenseDocumentUrl: text("license_document_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull(),
  type: text("type").notNull(),
  model: text("model").notNull(),
  year: text("year").notNull(),
  plateNumber: text("plate_number").notNull(),
  registrationUrl: text("registration_url"),
  photoUrls: json("photo_urls").$type<string[]>(),
});

export const operationOrders = pgTable("operation_orders", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull(),
  passengerName: text("passenger_name").notNull(),
  passengerPhone: text("passenger_phone").notNull(),
  fromCity: text("from_city").notNull(),
  toCity: text("to_city").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  qrCode: text("qr_code"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  idNumber: true,
  licenseNumber: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).pick({
  type: true,
  model: true,
  year: true,
  plateNumber: true,
});

export const insertOperationOrderSchema = createInsertSchema(operationOrders)
  .pick({
    passengerName: true,
    passengerPhone: true,
    fromCity: true,
    toCity: true,
    departureTime: true,
  })
  .extend({
    departureTime: z.string()
      .datetime({ offset: true })
      .transform((val) => new Date(val))
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type OperationOrder = typeof operationOrders.$inferSelect;