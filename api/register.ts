import express from 'express';
import type { Request, Response } from 'express';
import { randomBytes } from 'crypto';

function generateUID(): string {
  const prefix = 'DRV';
  const timestamp = Date.now().toString(36);
  const randomSuffix = randomBytes(2).toString('hex');
  return `${prefix}-${timestamp}-${randomSuffix}`.toUpperCase();
}

export default function registerHandler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password, fullName, idNumber, licenseNumber } = req.body;

    if (!username || !password || !fullName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate a unique ID for the new driver
    const uid = generateUID();

    // Create new driver object
    const newDriver = {
      id: Math.floor(Date.now() / 1000),
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

    // Set session
    if (req.session) {
      req.session.user = newDriver;
    }

    return res.status(201).json(newDriver);
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}