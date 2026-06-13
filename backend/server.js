/**
 * server.js — NexCart Express Application Entry Point
 *
 * Separates app configuration (middleware, routes) from server startup
 * to keep the module testable and clean.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const apiRouter = require('./routes/api');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// ── Connect to MongoDB ────────────────────────────────────────────────────
connectDB();

// ── Create Express Application ────────────────────────────────────────────
const app = express();

// ── Security & Rate Limiting ──────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// ── CORS Configuration ────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman, mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin "${origin}" is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ── Global Middleware Stack ───────────────────────────────────────────────
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight for all routes
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Request Logging (development only) ───────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`\x1b[36m[${new Date().toISOString()}]\x1b[0m ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ── Mount API Router ──────────────────────────────────────────────────────
app.use('/api', apiRouter);

// ── 404 & Global Error Handlers ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `\x1b[35m🚀 NexCart API\x1b[0m running in \x1b[33m${process.env.NODE_ENV || 'development'}\x1b[0m mode on port \x1b[32m${PORT}\x1b[0m`
  );
  console.log(`   → http://localhost:${PORT}/api/health`);
});

// ── Graceful Shutdown ─────────────────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('\x1b[31m✘ Unhandled Promise Rejection:\x1b[0m', reason);
  server.close(() => process.exit(1));
});

module.exports = app; // Export for testing
