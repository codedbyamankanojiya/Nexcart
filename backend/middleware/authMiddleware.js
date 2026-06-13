/**
 * authMiddleware.js — JWT-based route protection middleware
 *
 * Usage: Apply `protect` to any route that requires an authenticated user.
 * Apply `adminOnly` after `protect` for admin-only routes.
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * protect — Verifies the JWT sent in the Authorization header.
 * On success, attaches the full user document to `req.user`.
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorised — no token provided');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401);
    throw new Error('Not authorised — token is invalid or expired');
  }

  // Fetch fresh user data (excluding password) to ensure the user still exists
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    res.status(401);
    throw new Error('Not authorised — user no longer exists');
  }

  req.user = user;
  next();
});

/**
 * adminOnly — Restricts route access to users with the 'admin' role.
 * Must be applied AFTER the `protect` middleware.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  throw new Error('Forbidden — admin access required');
};

module.exports = { protect, adminOnly };
