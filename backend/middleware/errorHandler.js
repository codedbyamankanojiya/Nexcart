/**
 * errorHandler.js — Global Express error-handling middleware
 *
 * Catches all errors thrown from route handlers (via express-async-handler)
 * and returns a consistent JSON error response.
 *
 * Must be registered LAST — after all routes — in server.js.
 */

/**
 * notFound — 404 handler for unmatched routes.
 * Converts the request into a proper Error and passes it to errorHandler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found — ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * errorHandler — Central error responder.
 * Formats all errors into { success: false, message, stack? } JSON.
 */
const errorHandler = (err, req, res, next) => {
  // Use the existing status code if it was explicitly set (not 200)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Mongoose validation error — surface field-level messages
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  // Mongoose duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `A user with that ${field} already exists`,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: ${err.value}`,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  // Generic error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
