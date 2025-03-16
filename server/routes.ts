import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { insertVehicleSchema, insertOperationOrderSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Document upload route
  app.post("/api/documents/upload", upload.single('document'), async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const documentType = req.body.type;
    const filePath = req.file.path;

    const user = await storage.getUser(req.user.id);
    if (!user) return res.sendStatus(404);

    if (documentType === 'id') {
      user.idDocumentUrl = filePath;
    } else if (documentType === 'license') {
      user.licenseDocumentUrl = filePath;
    }

    await storage.updateUser(user);
    res.json(user);
  });

  // Vehicle routes
  app.post("/api/vehicles", upload.array("photos", 5), async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    const files = req.files as Express.Multer.File[];
    const vehicleData = insertVehicleSchema.parse(req.body);

    const vehicle = await storage.createVehicle({
      ...vehicleData,
      driverId: req.user.id,
      photoUrls: files?.map(f => f.path) || [],
      registrationUrl: ""
    });

    res.status(201).json(vehicle);
  });

  app.get("/api/vehicles/driver", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const vehicles = await storage.getVehiclesByDriver(req.user.id);
    res.json(vehicles);
  });

  // Operation order routes
  app.post("/api/operation-orders", async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    const orderData = insertOperationOrderSchema.parse(req.body);
    const order = await storage.createOperationOrder({
      ...orderData,
      driverId: req.user.id,
      qrCode: "", // Generate QR code
      createdAt: new Date()
    });

    res.status(201).json(order);
  });

  app.get("/api/operation-orders/driver", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const orders = await storage.getOperationOrdersByDriver(req.user.id);
    res.json(orders);
  });

  // Admin routes
  app.get("/api/admin/pending-drivers", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.sendStatus(403);
    const drivers = await storage.getPendingDrivers();
    res.json(drivers);
  });

  app.post("/api/admin/approve-driver/:id", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.sendStatus(403);
    const user = await storage.approveDriver(parseInt(req.params.id));
    if (!user) return res.sendStatus(404);
    res.json(user);
  });

  const httpServer = createServer(app);
  return httpServer;
}