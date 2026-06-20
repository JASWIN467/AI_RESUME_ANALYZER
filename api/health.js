// api/health.js — Debug endpoint to verify env vars are loaded
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    keyPrefix: process.env.GEMINI_API_KEY
      ? process.env.GEMINI_API_KEY.slice(0, 6) + '...'
      : null,
    node: process.version,
    env: process.env.VERCEL_ENV ?? 'unknown',
  });
}
