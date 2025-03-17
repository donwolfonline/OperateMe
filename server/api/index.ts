import express from 'express';
import { setupAuth } from '../auth';
import { storage } from '../storage';

const app = express();

app.use(express.json());

// Error handling for serverless environment
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Setup authentication
setupAuth(app);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;