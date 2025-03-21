import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { insertVehicleSchema, insertOperationOrderSchema } from "@shared/schema";
import { generateOrderPDF } from './utils/pdfGenerator';
import express from "express";
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({ 
  dest: uploadsDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/heic',
      'image/heif',
      'image/svg+xml',
      'image/tiff',
      'image/bmp',
      'image/x-icon',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/rtf'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Configure static file serving for uploads with proper headers
  app.use('/uploads', express.static(uploadsDir, {
    setHeaders: (res, path) => {
      if (path.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + path.split('/').pop() + '"');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }
    },
    fallthrough: true,
    maxAge: '1h'
  }));

  // Document upload route
  app.post("/api/documents/upload", upload.single('document'), async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      if (!req.file) {
        return res.status(400).json({ 
          message: "No file uploaded or file type not supported" 
        });
      }

      const documentType = req.body.type;
      // Store only the filename, not the full path
      const filePath = req.file.filename;

      const user = await storage.getUser(req.user.id);
      if (!user) return res.sendStatus(404);

      if (documentType === 'id') {
        user.idDocumentUrl = filePath;
      } else if (documentType === 'license') {
        user.licenseDocumentUrl = filePath;
      } else if (documentType === 'profile') {
        user.profileImageUrl = filePath;
      }

      await storage.updateUser(user);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Vehicle management routes
  app.post("/api/vehicles", upload.array("photos", 10), async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ 
          message: "No files uploaded or file types not supported" 
        });
      }

      const vehicleData = {
        type: req.body.type,
        model: req.body.model,
        year: req.body.year,
        plateNumber: req.body.plateNumber
      };

      const parsedData = insertVehicleSchema.parse(vehicleData);

      const vehicle = await storage.createVehicle({
        ...parsedData,
        driverId: req.user.id,
        photoUrls: files.map(f => f.filename),
        registrationUrl: "",
        isActive: true,
        createdAt: new Date()
      });

      res.status(201).json(vehicle);
    } catch (error: any) {
      console.error('Vehicle creation error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/vehicles/driver", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const vehicles = await storage.getVehiclesByDriver(req.user.id);
    res.json(vehicles);
  });

  app.patch("/api/vehicles/:id/status", async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const vehicle = await storage.updateVehicleStatus(
        parseInt(req.params.id),
        req.user.id,
        req.body.isActive
      );
      if (!vehicle) return res.sendStatus(404);
      res.json(vehicle);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Operation orders routes
  app.post("/api/operation-orders", async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);

      const orderData = insertOperationOrderSchema.parse({
        ...req.body,
        departureTime: new Date(req.body.departureTime).toISOString()
      });

      const order = await storage.createOperationOrder(
        {
          fromCity: orderData.fromCity,
          toCity: orderData.toCity,
          departureTime: new Date(orderData.departureTime),
          visaType: orderData.visaType,
          tripNumber: orderData.tripNumber,
          driverId: req.user.id,
          vehicleId: null,  // Set to null since it's optional now
          qrCode: "",
          pdfUrl: "",
          status: "active",
          createdAt: new Date()
        },
        orderData.passengers
      );

      try {
        const pdfFileName = await generateOrderPDF(order, req.user);
        order.pdfUrl = pdfFileName;
        await storage.updateOperationOrder(order);
        res.status(201).json(order);
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        res.status(201).json(order);
      }
    } catch (error: any) {
      console.error('Operation order creation error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/operation-orders/driver", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const orders = await storage.getOperationOrdersByDriver(req.user.id);
    res.json(orders);
  });

  app.get("/api/operation-orders/:id/passengers", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const passengers = await storage.getPassengersByOrder(parseInt(req.params.id));
    res.json(passengers);
  });

  // Admin routes
  app.get("/api/admin/pending-drivers", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.sendStatus(403);
    const drivers = await storage.getPendingDrivers();
    res.json(drivers);
  });

  app.get("/api/admin/active-drivers", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.sendStatus(403);
    const drivers = await storage.getActiveDrivers();
    res.json(drivers);
  });

  app.get("/api/admin/suspended-drivers", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.sendStatus(403);
    const drivers = await storage.getSuspendedDrivers();
    res.json(drivers);
  });

  app.post("/api/admin/drivers/:id/status", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.sendStatus(403);
    const { status } = req.body;
    if (!["pending", "active", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await storage.updateDriver(parseInt(req.params.id), {
      status,
      isApproved: status === "active"
    });

    if (!user) return res.sendStatus(404);
    res.json(user);
  });

  app.get("/api/admin/driver/:id/details", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.sendStatus(403);
    const details = await storage.getDriverDetails(parseInt(req.params.id));
    if (!details) return res.sendStatus(404);

    const ordersWithPassengers = await Promise.all(details.orders.map(async (order) => {
      const passengers = await storage.getPassengersByOrder(order.id);
      return { ...order, passengers };
    }));

    res.json({
      ...details,
      orders: ordersWithPassengers
    });
  });

  app.get("/api/admin/all-orders", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.sendStatus(403);
    const orders = await storage.getAllOperationOrders();

    const ordersWithDetails = await Promise.all(orders.map(async (order) => {
      const passengers = await storage.getPassengersByOrder(order.id);
      const driver = await storage.getUser(order.driverId);
      return { 
        ...order, 
        passengers,
        driver: {
          fullName: driver?.fullName,
          uid: driver?.uid
        }
      };
    }));

    res.json(ordersWithDetails);
  });

  app.get("/api/driver/orders", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    try {
      const orders = await storage.getOperationOrdersByDriver(req.user.id);
      const ordersWithDetails = await Promise.all(orders.map(async (order) => {
        const passengers = await storage.getPassengersByOrder(order.id);
        return {
          ...order,
          passengers,
        };
      }));

      console.log('Driver orders fetched:', ordersWithDetails);
      res.json(ordersWithDetails);
    } catch (error) {
      console.error('Error fetching driver orders:', error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}