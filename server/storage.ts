import type { Session } from "express-session";
import type { SessionData } from "express-session";
import createMemoryStore from "memorystore";
import session from "express-session";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { User, Vehicle, OperationOrder, Passenger, InsertUser } from "@shared/schema";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private vehicles: Map<number, Vehicle>;
  private operationOrders: Map<number, OperationOrder>;
  private passengers: Map<number, Passenger>;
  sessionStore: session.Store;
  currentId: number;

  private async createDefaultUsers() {
    // Create admin user
    const adminSalt = randomBytes(16).toString("hex");
    const adminBuf = (await scryptAsync("admin123", adminSalt, 64)) as Buffer;
    const adminHashedPassword = `${adminBuf.toString("hex")}.${adminSalt}`;

    const adminUser: User = {
      id: this.currentId++,
      username: "admin",
      password: adminHashedPassword,
      role: "admin",
      status: "active",
      isApproved: true,
      fullName: "Admin User",
      idNumber: null,
      licenseNumber: null,
      idDocumentUrl: null,
      licenseDocumentUrl: null,
      createdAt: new Date()
    };

    // Create test driver user
    const driverSalt = randomBytes(16).toString("hex");
    const driverBuf = (await scryptAsync("driver123", driverSalt, 64)) as Buffer;
    const driverHashedPassword = `${driverBuf.toString("hex")}.${driverSalt}`;

    const driverUser: User = {
      id: this.currentId++,
      username: "driver",
      password: driverHashedPassword,
      role: "driver",
      status: "active",
      isApproved: true,
      fullName: "Test Driver",
      idNumber: "DRV123",
      licenseNumber: "LIC456",
      idDocumentUrl: null,
      licenseDocumentUrl: null,
      createdAt: new Date()
    };

    this.users.set(adminUser.id, adminUser);
    this.users.set(driverUser.id, driverUser);
  }

  constructor() {
    this.users = new Map();
    this.vehicles = new Map();
    this.operationOrders = new Map();
    this.passengers = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });

    // Create default users
    this.createDefaultUsers();
  }

  async updateUser(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
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
      role: "driver",
      status: "pending",
      isApproved: false,
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

  async updateVehicleStatus(id: number, driverId: number, isActive: boolean): Promise<Vehicle | undefined> {
    const vehicle = await this.getVehicle(id);
    if (vehicle && vehicle.driverId === driverId) {
      const updatedVehicle = { ...vehicle, isActive };
      this.vehicles.set(id, updatedVehicle);
      return updatedVehicle;
    }
    return undefined;
  }

  async getOperationOrder(id: number): Promise<OperationOrder | undefined> {
    return this.operationOrders.get(id);
  }

  async getOperationOrdersByDriver(driverId: number): Promise<OperationOrder[]> {
    return Array.from(this.operationOrders.values()).filter(
      (order) => order.driverId === driverId
    );
  }

  async createOperationOrder(
    order: Omit<OperationOrder, "id">,
    passengers: Omit<Passenger, "id" | "orderId">[]
  ): Promise<OperationOrder> {
    const orderId = this.currentId++;
    const newOrder = { ...order, id: orderId };
    this.operationOrders.set(orderId, newOrder);

    // Create passengers for this order
    passengers.forEach(passenger => {
      const passengerId = this.currentId++;
      const newPassenger: Passenger = {
        ...passenger,
        id: passengerId,
        orderId
      };
      this.passengers.set(passengerId, newPassenger);
    });

    return newOrder;
  }

  async getPendingDrivers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === "driver" && user.status === "pending"
    );
  }

  async getActiveDrivers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === "driver" && user.status === "active"
    );
  }

  async getSuspendedDrivers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === "driver" && user.status === "suspended"
    );
  }

  async updateDriverStatus(id: number, status: string): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (user && user.role === "driver") {
      const updatedUser = { ...user, status };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
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
    this.operationOrders.set(order.id, order);
    return order;
  }

  async getPassengersByOrder(orderId: number): Promise<Passenger[]> {
    return Array.from(this.passengers.values()).filter(
      (passenger) => passenger.orderId === orderId
    );
  }
}

export const storage = new MemStorage();