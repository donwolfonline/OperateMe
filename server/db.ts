import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Required for Vercel serverless deployment
neonConfig.fetchConnectionCache = true;

// Use the pooled connection string for better performance
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);