import type { Session } from "express-session";
import type { SessionData } from "express-session";
import createMemoryStore from "memorystore";
import session from "express-session";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { User, Vehicle, OperationOrder, Passenger, InsertUser } from "@shared/schema";
import { db } from "./db";
import { users, vehicles, operationOrders, passengers } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);
const scryptAsync = promisify(scrypt);

// Function to generate unique identifier
function generateUID(role: string, id: number): string {
  const prefix = role === 'admin' ? 'ADM' : 'DRV';
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 5);
  return `${prefix}-${id}${timestamp}${randomSuffix}`.toUpperCase();
}

// Company Mapping Type -  Assuming this is defined elsewhere, but needs to be added for compilation.  Replace with your actual type.
interface CompanyMapping {
  id: number;
  companyId: number;
  isActive: boolean;
  createdAt: Date;
}

interface InsertCompanyMapping {
  companyId: number;
  isActive: boolean;
}

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(user: User): Promise<User>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehiclesByDriver(driverId: number): Promise<Vehicle[]>;
  createVehicle(vehicle: Omit<Vehicle, "id">): Promise<Vehicle>;
  getOperationOrder(id: number): Promise<OperationOrder | undefined>;
  getOperationOrdersByDriver(driverId: number): Promise<OperationOrder[]>;
  createOperationOrder(order: Omit<OperationOrder, "id">, passengers: Omit<Passenger, "id" | "orderId">[]): Promise<OperationOrder>;
  getPendingDrivers(): Promise<User[]>;
  getActiveDrivers(): Promise<User[]>;
  getSuspendedDrivers(): Promise<User[]>;
  updateDriverStatus(id: number, status: string): Promise<User | undefined>;
  updateVehicleStatus(id: number, driverId: number, isActive: boolean): Promise<Vehicle | undefined>;
  getDriverDetails(id: number): Promise<{
    driver: User,
    vehicles: Vehicle[],
    orders: OperationOrder[]
  } | undefined>;
  updateOperationOrder(order: OperationOrder): Promise<OperationOrder>;
  getPassengersByOrder(orderId: number): Promise<Passenger[]>;
  getAllOperationOrders(): Promise<OperationOrder[]>;
  updateDriver(id: number, updates: { status: string; isApproved: boolean }): Promise<User | undefined>;
  getVehicleByOrder(orderId: number): Promise<Vehicle | undefined>;
  // Company mapping methods
  getCompanyMappings(): Promise<CompanyMapping[]>;
  createCompanyMapping(mapping: InsertCompanyMapping): Promise<CompanyMapping>;
  toggleCompanyMapping(id: number): Promise<CompanyMapping | undefined>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });

    // Create default users if they don't exist
    this.createDefaultUsers();
  }

  private async createDefaultUsers() {
    const adminUser = await this.getUserByUsername("admin");
    const driverUser = await this.getUserByUsername("driver");

    if (!adminUser) {
      const adminSalt = randomBytes(16).toString("hex");
      const adminBuf = (await scryptAsync("admin123", adminSalt, 64)) as Buffer;
      const adminHashedPassword = `${adminBuf.toString("hex")}.${adminSalt}`;

      await db.insert(users).values({
        username: "admin",
        password: adminHashedPassword,
        role: "admin",
        status: "active",
        isApproved: true,
        fullName: "Admin User",
        uid: generateUID('admin', 1),
        createdAt: new Date()
      });
    }

    if (!driverUser) {
      const driverSalt = randomBytes(16).toString("hex");
      const driverBuf = (await scryptAsync("driver123", driverSalt, 64)) as Buffer;
      const driverHashedPassword = `${driverBuf.toString("hex")}.${driverSalt}`;

      await db.insert(users).values({
        username: "driver",
        password: driverHashedPassword,
        role: "driver",
        status: "active",
        isApproved: true,
        fullName: "Test Driver",
        idNumber: "DRV123",
        licenseNumber: "LIC456",
        uid: generateUID('driver', 2),
        createdAt: new Date()
      });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      uid: generateUID(insertUser.role || 'driver', Date.now()),
      createdAt: new Date()
    }).returning();
    return user;
  }

  async updateUser(user: User): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, user.id))
      .returning();
    return updatedUser;
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle;
  }

  async getVehiclesByDriver(driverId: number): Promise<Vehicle[]> {
    return db.select().from(vehicles).where(eq(vehicles.driverId, driverId));
  }

  async createVehicle(vehicle: Omit<Vehicle, "id">): Promise<Vehicle> {
    const [newVehicle] = await db.insert(vehicles).values(vehicle).returning();
    return newVehicle;
  }

  async updateVehicleStatus(id: number, driverId: number, isActive: boolean): Promise<Vehicle | undefined> {
    const [vehicle] = await db
      .update(vehicles)
      .set({ isActive })
      .where(and(eq(vehicles.id, id), eq(vehicles.driverId, driverId)))
      .returning();
    return vehicle;
  }

  async getOperationOrder(id: number): Promise<OperationOrder | undefined> {
    const [order] = await db.select().from(operationOrders).where(eq(operationOrders.id, id));
    return order;
  }

  async getOperationOrdersByDriver(driverId: number): Promise<OperationOrder[]> {
    return db.select().from(operationOrders).where(eq(operationOrders.driverId, driverId));
  }

  async createOperationOrder(
    order: Omit<OperationOrder, "id">,
    passengersList: Omit<Passenger, "id" | "orderId">[]
  ): Promise<OperationOrder> {
    const [newOrder] = await db.insert(operationOrders).values(order).returning();

    // Create passengers for this order
    for (const passenger of passengersList) {
      await db.insert(passengers).values({
        ...passenger,
        orderId: newOrder.id
      });
    }

    return newOrder;
  }

  async getPendingDrivers(): Promise<User[]> {
    return db.select().from(users).where(and(
      eq(users.role, "driver"),
      eq(users.status, "pending")
    ));
  }

  async getActiveDrivers(): Promise<User[]> {
    return db.select().from(users).where(and(
      eq(users.role, "driver"),
      eq(users.status, "active")
    ));
  }

  async getSuspendedDrivers(): Promise<User[]> {
    return db.select().from(users).where(and(
      eq(users.role, "driver"),
      eq(users.status, "suspended")
    ));
  }

  async updateDriverStatus(id: number, status: string): Promise<User | undefined> {
    return this.updateDriver(id, { status, isApproved: status === "active" });
  }

  async getDriverDetails(id: number): Promise<{
    driver: User;
    vehicles: Vehicle[];
    orders: OperationOrder[];
  } | undefined> {
    const driver = await this.getUser(id);
    if (!driver) return undefined;

    const vehicles = await this.getVehiclesByDriver(id);
    const orders = await this.getOperationOrdersByDriver(id);

    return {
      driver,
      vehicles,
      orders
    };
  }

  async updateOperationOrder(order: OperationOrder): Promise<OperationOrder> {
    const [updatedOrder] = await db
      .update(operationOrders)
      .set(order)
      .where(eq(operationOrders.id, order.id))
      .returning();
    return updatedOrder;
  }

  async getPassengersByOrder(orderId: number): Promise<Passenger[]> {
    return db.select().from(passengers).where(eq(passengers.orderId, orderId));
  }

  async getAllOperationOrders(): Promise<OperationOrder[]> {
    return db.select().from(operationOrders);
  }

  async updateDriver(id: number, updates: { status: string; isApproved: boolean }): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(and(eq(users.id, id), eq(users.role, "driver")))
      .returning();
    return updatedUser;
  }
  async getVehicleByOrder(orderId: number): Promise<Vehicle | undefined> {
    const [order] = await db.select().from(operationOrders).where(eq(operationOrders.id, orderId));
    if (!order || !order.vehicleId) return undefined;

    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, order.vehicleId));
    return vehicle;
  }

  async getCompanyMappings(): Promise<CompanyMapping[]> {
    return db.select().from(companyMappings);
  }

  async createCompanyMapping(mapping: InsertCompanyMapping): Promise<CompanyMapping> {
    const [newMapping] = await db
      .insert(companyMappings)
      .values({
        ...mapping,
        createdAt: new Date()
      })
      .returning();
    return newMapping;
  }

  async toggleCompanyMapping(id: number): Promise<CompanyMapping | undefined> {
    const [mapping] = await db
      .select()
      .from(companyMappings)
      .where(eq(companyMappings.id, id));

    if (!mapping) return undefined;

    const [updatedMapping] = await db
      .update(companyMappings)
      .set({ isActive: !mapping.isActive })
      .where(eq(companyMappings.id, id))
      .returning();

    return updatedMapping;
  }
}

export const storage = new DatabaseStorage();