import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple health check response
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}

export const config = {
  api: {
    bodyParser: true
  }
};