import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import subscriptionRoutes from './routes/subscriptions.js';
import stripeRoutes from './routes/stripe.js';
import adminRoutes from './routes/admin.js';

const app = express();

// SECURITY: Trust proxy (Render runs behind a reverse proxy)
// Required for express-rate-limit to correctly identify client IPs.
app.set('trust proxy', 1);

// SECURITY: Hide Express signature
// OWASP A05:2021 (Security Misconfiguration) — don't reveal server tech.
app.disable('x-powered-by');

// SECURITY: Helmet — sets safe HTTP response headers
// Includes: X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security,
// Content-Security-Policy, Referrer-Policy, etc.
// OWASP A05:2021 (Security Misconfiguration)
app.use(
  helmet({
    // CSP disabled here because this is an API, not a browser-rendered app.
    // The Vercel-hosted frontend has its own CSP set by Vercel.
    contentSecurityPolicy: false,
    // Cross-origin resource sharing handled separately by `cors` middleware below.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// SECURITY: Strict CORS
// Only origins listed in CLIENT_ORIGIN env var can talk to this API.
// Reject unknown origins (no wildcards, no credentials to unknown sources).
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((s) => s.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`[cors] blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// CRITICAL: Stripe webhook MUST be mounted BEFORE express.json()
// because signature verification needs the raw request body.
// (No rate limiting on webhook — Stripe needs unlimited retry capability.)
app.use('/stripe', stripeRoutes);

// Body parsing with strict limit
// SECURITY: 100kb limit prevents DoS from huge payloads.
// Standard order JSON is <5kb; nothing legitimate exceeds 100kb.
app.use(express.json({ limit: '100kb', strict: true }));

// Rate limiters — protect against brute force, abuse, and DoS
// OWASP A04:2021 (Insecure Design) — apply to all public endpoints

// Health check — generous limit to allow legitimate monitoring
const healthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 60, // 60 reqs/min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again shortly.' },
});

// Menu — read-only, generous (people may refresh the page)
const menuLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 30, // 30 reqs/min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again shortly.' },
});

// Order creation — strict to prevent fraud / abuse
// A real customer places <5 orders/day. This blocks scripted attackers.
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5, // 5 orders per IP per 10 min
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: { error: 'Too many order attempts. Please try again later.' },
});

// Subscription signup — even stricter (people don't subscribe in bursts)
const subscriptionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 subscription attempts per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many subscription attempts. Please try again later.' },
});

// Admin — protect against credential stuffing
const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 30, // 30 admin requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many admin requests.' },
});

// Health check
app.get('/', healthLimiter, (req, res) => {
  res.json({ ok: true, service: 'juicestation-api', version: '1.0.0' });
});

// Mount routes with their limiters
app.use('/menu', menuLimiter, menuRoutes);
app.use('/order', orderLimiter, orderRoutes);
app.use('/subscription', subscriptionLimiter, subscriptionRoutes);
app.use('/admin', adminLimiter, adminRoutes);

// 404 handler — comes after all routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// SECURITY: Generic error handler — never leak stack traces or internals
// OWASP A09:2021 (Security Logging and Monitoring Failures)
// Log full error server-side, return safe message to client.
app.use((err, req, res, next) => {
  // Don't leak CORS errors as 500s
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }
  console.error('[error]', {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: err.stack,
  });
  res.status(500).json({ error: 'Server error.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🧃 JUICEeSTATION API running on http://localhost:${PORT}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
});