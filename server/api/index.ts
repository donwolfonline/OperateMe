import express from 'express';
import { setupAuth } from '../auth';
import { storage } from '../storage';

const app = express();

app.use(express.json());

// Add CORS headers for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Error handling for serverless environment
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Setup authentication
setupAuth(app);

// Health check endpoint with environment info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    region: process.env.VERCEL_REGION
  });
});

// Export the Express app
export default app;

// Handle serverless function calls
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true
  }
};