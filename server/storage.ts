import type { Session } from "express-session";
import type { SessionData } from "express-session";
import createMemoryStore from "memorystore";
import session from "express-session";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { User, Vehicle, OperationOrder, InsertUser } from "@shared/schema";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehiclesByDriver(driverId: number): Promise<Vehicle[]>;
  createVehicle(vehicle: Omit<Vehicle, "id">): Promise<Vehicle>;
  getOperationOrder(id: number): Promise<OperationOrder | undefined>;
  getOperationOrdersByDriver(driverId: number): Promise<OperationOrder[]>;
  createOperationOrder(order: Omit<OperationOrder, "id">): Promise<OperationOrder>;
  getPendingDrivers(): Promise<User[]>;
  approveDriver(id: number): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private vehicles: Map<number, Vehicle>;
  private operationOrders: Map<number, OperationOrder>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.vehicles = new Map();
    this.operationOrders = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });

    // Create default admin user
    this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync("admin123", salt, 64)) as Buffer;
    const hashedPassword = `${buf.toString("hex")}.${salt}`;

    const adminUser: User = {
      id: this.currentId++,
      username: "admin",
      password: hashedPassword,
      role: "admin",
      isApproved: true,
      fullName: "Admin User",
      idNumber: null,
      licenseNumber: null,
      idDocumentUrl: null,
      licenseDocumentUrl: null,
      createdAt: new Date()
    };

    this.users.set(adminUser.id, adminUser);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "driver",
      isApproved: insertUser.role === "admin",
      fullName: insertUser.fullName || null,
      idNumber: insertUser.idNumber || null,
      licenseNumber: insertUser.licenseNumber || null,
      idDocumentUrl: null,
      licenseDocumentUrl: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async getVehiclesByDriver(driverId: number): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(
      (vehicle) => vehicle.driverId === driverId
    );
  }

  async createVehicle(vehicle: Omit<Vehicle, "id">): Promise<Vehicle> {
    const id = this.currentId++;
    const newVehicle = { ...vehicle, id };
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }

  async getOperationOrder(id: number): Promise<OperationOrder | undefined> {
    return this.operationOrders.get(id);
  }

  async getOperationOrdersByDriver(driverId: number): Promise<OperationOrder[]> {
    return Array.from(this.operationOrders.values()).filter(
      (order) => order.driverId === driverId
    );
  }

  async createOperationOrder(order: Omit<OperationOrder, "id">): Promise<OperationOrder> {
    const id = this.currentId++;
    const newOrder = { ...order, id };
    this.operationOrders.set(id, newOrder);
    return newOrder;
  }

  async getPendingDrivers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === "driver" && !user.isApproved
    );
  }

  async approveDriver(id: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (user && user.role === "driver") {
      const updatedUser = { ...user, isApproved: true };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }
}

export const storage = new MemStorage();