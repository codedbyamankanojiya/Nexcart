/**
 * api.js — Central API router
 *
 * Aggregates all sub-routers and mounts them under their respective prefixes.
 * This file is imported once by server.js via: app.use('/api', apiRouter)
 */

const express = require('express');
const router = express.Router();

const { protect, adminOnly } = require('../middleware/authMiddleware');

// ── Controllers ─────────────────────────────────────────────────────────────
const {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation,
} = require('../controllers/authController');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');

// ════════════════════════════════════════════════════════════════════════════
//  AUTH ROUTES — /api/auth
// ════════════════════════════════════════════════════════════════════════════
router.post('/auth/register', registerValidation, register);
router.post('/auth/login', loginValidation, login);
router.get('/auth/me', protect, getMe);

// ════════════════════════════════════════════════════════════════════════════
//  PRODUCT ROUTES — /api/products
// ════════════════════════════════════════════════════════════════════════════
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', protect, adminOnly, createProduct);
router.put('/products/:id', protect, adminOnly, updateProduct);
router.delete('/products/:id', protect, adminOnly, deleteProduct);

// ════════════════════════════════════════════════════════════════════════════
//  ORDER ROUTES — /api/orders
// ════════════════════════════════════════════════════════════════════════════
router.post('/orders', protect, createOrder);
router.get('/orders/mine', protect, getMyOrders);
router.get('/orders/:id', protect, getOrderById);

// ════════════════════════════════════════════════════════════════════════════
//  HEALTH CHECK — /api/health
// ════════════════════════════════════════════════════════════════════════════
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
