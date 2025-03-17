import type { VercelRequest, VercelResponse } from '@vercel/node';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Demo admin credentials for testing
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

async function verifyPassword(password: string, hashedPassword: string) {
  const [key, salt] = hashedPassword.split('.');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
  return timingSafeEqual(keyBuffer, derivedKey);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;

      // For demo purposes, using hardcoded admin credentials
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return res.status(200).json({
          id: 1,
          username: 'admin',
          role: 'admin',
          status: 'active',
          isApproved: true,
          fullName: 'Admin User'
        });
      }

      return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    try {
      // For now, return a simple response
      res.json({
        message: 'API is working',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: true
  }
};