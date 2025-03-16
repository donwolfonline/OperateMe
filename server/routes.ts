import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { insertVehicleSchema, insertOperationOrderSchema } from "@shared/schema";
import { generateOrderPDF } from './utils/pdfGenerator';

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Allow a wide range of document and image formats
    const allowedTypes = [
      // Images
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
      // Documents
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
      cb(new Error('Unsupported file type. Please upload an image or document.'), false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Document upload route with error handling
  app.post("/api/documents/upload", upload.single('document'), async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      if (!req.file) {
        return res.status(400).json({ 
          message: "No file uploaded or file type not supported. Please upload a valid image or document." 
        });
      }

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
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message || "Error uploading document" 
      });
    }
  });

  // Vehicle routes with error handling
  app.post("/api/vehicles", upload.array("photos", 10), async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ 
          message: "No files uploaded or file types not supported. Please upload valid images." 
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
        photoUrls: files.map(f => f.path),
        registrationUrl: ""
      });

      res.status(201).json(vehicle);
    } catch (error: any) {
      console.error('Vehicle creation error:', error);
      res.status(400).json({ 
        message: error.message || "Error creating vehicle" 
      });
    }
  });

  // Keep existing routes
  app.get("/api/vehicles/driver", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const vehicles = await storage.getVehiclesByDriver(req.user.id);
    res.json(vehicles);
  });

  app.post("/api/operation-orders", async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);

      const orderData = insertOperationOrderSchema.parse(req.body);

      // Create the order first
      const order = await storage.createOperationOrder({
        ...orderData,
        driverId: req.user.id,
        qrCode: "",
        pdfUrl: "",
        createdAt: new Date()
      });

      // Generate PDF with QR code
      const pdfFileName = await generateOrderPDF(order, req.user);

      // Update order with PDF URL
      order.pdfUrl = pdfFileName;
      await storage.updateOperationOrder(order);

      res.status(201).json(order);
    } catch (error: any) {
      console.error('Operation order creation error:', error);
      res.status(400).json({ 
        message: error.message || "Error creating operation order" 
      });
    }
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