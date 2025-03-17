import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const app = express();

// Body parsing middleware should come before any routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any = undefined;

  const originalJson = res.json;
  res.json = function(body) {
    capturedJsonResponse = body;
    return originalJson.call(this, body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Create uploads directory if it doesn't exist
    if (!existsSync('uploads')) {
      await mkdir('uploads', { recursive: true });
    }

    const server = await registerRoutes(app);

    if (process.env.NODE_ENV !== "production") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = process.env.PORT || 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Server running on port ${port}`);
    });

    server.on('error', (error: any) => {
      log(`Server error: ${error.message}`);
      if (error.syscall !== 'listen') {
        throw error;
      }

      switch (error.code) {
        case 'EACCES':
          log(`Port ${port} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          log(`Port ${port} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
  } catch (error: any) {
    log(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
})();