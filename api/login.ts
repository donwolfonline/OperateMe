import type { VercelRequest, VercelResponse } from '@vercel/node';

// Demo admin credentials for testing
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log raw body for debugging
    const rawBody = JSON.stringify(req.body);
    console.log('Raw request body:', rawBody);

    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      console.log('Login failed: Missing credentials');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    console.log('Login attempt for username:', username);

    // Check admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log('Admin login successful');
      return res.status(200).json({
        id: 1,
        uid: 'ADM-1',
        username: 'admin',
        role: 'admin',
        status: 'active',
        isApproved: true,
        fullName: 'Admin User',
        createdAt: new Date().toISOString()
      });
    }

    console.log('Login failed: Invalid credentials');
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export const config = {
  api: {
    bodyParser: true
  }
};