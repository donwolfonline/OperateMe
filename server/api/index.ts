import express, { type Request, Response, NextFunction } from "express";
import { setupAuth } from '../auth';
import { storage } from '../storage';

const app = express();
app.use(express.json());

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    vercel: process.env.VERCEL === '1'
  });
});

// Setup authentication
setupAuth(app);

// Export the Express app
export default app;

// Handler for Vercel serverless functions
export const handler = async (req: Request, res: Response) => {
  console.log(`[Vercel Handler] ${req.method} ${req.url}`);
  return new Promise((resolve, reject) => {
    app(req, res);
    res.on('finish', resolve);
    res.on('error', reject);
  });
};

// Vercel serverless configuration
export const config = {
  api: {
    bodyParser: true
  }
};