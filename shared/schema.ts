import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("driver"),
  status: text("status").notNull().default("pending"), // pending, active, suspended
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
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const passengers = pgTable("passengers", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  name: text("name").notNull(),
  idNumber: text("id_number").notNull(),
  nationality: text("nationality").notNull(),
  phone: text("phone")
});

export const operationOrders = pgTable("operation_orders", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull(),
  vehicleId: integer("vehicle_id"),  
  fromCity: text("from_city").notNull(),
  toCity: text("to_city").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  qrCode: text("qr_code"),
  pdfUrl: text("pdf_url"),
  status: text("status").notNull().default("active"), 
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

export const insertPassengerSchema = createInsertSchema(passengers).pick({
  name: true,
  idNumber: true,
  nationality: true,
  phone: true,
});

export const insertOperationOrderSchema = createInsertSchema(operationOrders)
  .pick({
    fromCity: true,
    toCity: true,
    departureTime: true,
  })
  .extend({
    departureTime: z.string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format"
      })
      .transform((val) => new Date(val)),
    passengers: z.array(insertPassengerSchema)
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type OperationOrder = typeof operationOrders.$inferSelect;
export type Passenger = typeof passengers.$inferSelect;
export type InsertPassenger = z.infer<typeof insertPassengerSchema>;