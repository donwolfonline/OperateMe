import express from 'express';
import { setupAuth } from '../auth';
import { storage } from '../storage';

const app = express();
app.use(express.json());

// Setup authentication
setupAuth(app);

// Export for serverless use
export default app;
