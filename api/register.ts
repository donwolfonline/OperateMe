import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'crypto';

function generateUID(role: string, id: number) {
  const prefix = role === 'admin' ? 'ADM' : 'DRV';
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 5);
  return `${prefix}-${id}${timestamp}${randomSuffix}`.toUpperCase();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { username, password, fullName, idNumber, licenseNumber } = req.body;

      // Basic validation
      if (!username || !password || !fullName) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Generate a unique ID for the new driver
      const id = Date.now();
      const uid = generateUID('driver', id);

      // Create new driver object
      const newDriver = {
        id,
        uid,
        username,
        role: 'driver',
        status: 'pending',
        isApproved: false,
        fullName,
        idNumber: idNumber || null,
        licenseNumber: licenseNumber || null,
        createdAt: new Date().toISOString()
      };

      return res.status(201).json(newDriver);
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export const config = {
  api: {
    bodyParser: true
  }
};