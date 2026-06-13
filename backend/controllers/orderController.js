/**
 * orderController.js — Order processing and management
 *
 * The `createOrder` route is the core transactional endpoint:
 * - Re-fetches product prices from the DB (never trusts client-sent prices)
 * - Decrements countInStock atomically
 * - Calculates final totals server-side
 */

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * Server-side price calculation constants
 */
const TAX_RATE = 0.08;        // 8% GST
const FREE_SHIPPING_THRESHOLD = 999; // Free shipping for orders above ₹999
const SHIPPING_FEE = 49;       // Flat shipping fee in ₹

/**
 * @route   POST /api/orders
 * @desc    Create a new order (transactional — re-validates prices and stock)
 * @access  Protected
 */
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Order must contain at least one item');
  }

  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address is required');
  }

  // ── Step 1: Fetch ALL ordered products in one DB query ──────────────────
  const productIds = orderItems.map((item) => item.product);
  const dbProducts = await Product.find({ _id: { $in: productIds } });

  if (dbProducts.length !== productIds.length) {
    res.status(400);
    throw new Error('One or more products in your order no longer exist');
  }

  // ── Step 2: Build verified order items with DB prices ───────────────────
  const verifiedItems = [];
  const stockUpdates = [];

  for (const item of orderItems) {
    const dbProduct = dbProducts.find(
      (p) => p._id.toString() === item.product.toString()
    );

    if (!dbProduct) {
      res.status(400);
      throw new Error(`Product not found: ${item.product}`);
    }

    if (dbProduct.countInStock < item.qty) {
      res.status(400);
      throw new Error(
        `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.countInStock} left.`
      );
    }

    verifiedItems.push({
      name: dbProduct.name,
      qty: item.qty,
      imageUrl: dbProduct.imageUrl,
      price: dbProduct.price, // ← Use DB price, not client price
      product: dbProduct._id,
    });

    // Queue stock decrement
    stockUpdates.push({
      updateOne: {
        filter: { _id: dbProduct._id, countInStock: { $gte: item.qty } },
        update: { $inc: { countInStock: -item.qty } },
      },
    });
  }

  // ── Step 3: Decrement stock atomically ──────────────────────────────────
  const bulkResult = await Product.bulkWrite(stockUpdates);

  if (bulkResult.modifiedCount !== stockUpdates.length) {
    // Stock changed between our check and write — race condition guard
    res.status(409);
    throw new Error(
      'Stock changed during checkout. Please review your cart and try again.'
    );
  }

  // ── Step 4: Calculate totals server-side ────────────────────────────────
  const itemsPrice = verifiedItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const taxPrice = Math.round(itemsPrice * TAX_RATE * 100) / 100;
  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const totalPrice =
    Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

  // ── Step 5: Persist the order ───────────────────────────────────────────
  const order = await Order.create({
    user: req.user._id,
    orderItems: verifiedItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Card',
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: true, // Simulated payment — mark as paid immediately
    paidAt: new Date(),
    orderStatus: 'Processing',
  });

  await order.populate('user', 'name email');

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order,
  });
});

/**
 * @route   GET /api/orders/mine
 * @desc    Get all orders belonging to the authenticated user
 * @access  Protected
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    orders,
    count: orders.length,
  });
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get a single order by ID (owner or admin only)
 * @access  Protected
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Ensure only the owner or an admin can view the order
  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Access denied — you do not own this order');
  }

  res.json({ success: true, order });
});

module.exports = { createOrder, getMyOrders, getOrderById };
