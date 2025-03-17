import express from 'express';
import type { Request, Response } from 'express';

// Demo admin credentials for testing
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export default function loginHandler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const user = {
        id: 1,
        uid: 'ADM-1',
        username: 'admin',
        role: 'admin',
        status: 'active',
        isApproved: true,
        fullName: 'Admin User',
        createdAt: new Date().toISOString()
      };

      // Set session
      if (req.session) {
        req.session.user = user;
      }

      return res.status(200).json(user);
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}