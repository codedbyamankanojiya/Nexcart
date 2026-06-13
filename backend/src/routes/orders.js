const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Format order for frontend
const formatOrder = (order) => ({
  id: order._id.toString(),
  orderNumber: order.orderNumber,
  status: order.status,
  paymentStatus: order.paymentStatus,
  items: order.items.map((i) => ({
    id: i._id.toString(),
    productId: i.productId.toString(),
    quantity: i.quantity,
    price: i.price,
    total: i.total,
  })),
  shippingAddress: order.shippingAddress,
  billingAddress: order.billingAddress,
  paymentMethod: order.paymentId ? 'razorpay' : 'cod',
  subtotal: order.subtotal,
  tax: order.tax,
  shipping: order.shipping,
  discount: order.discount,
  totalAmount: order.total,
  total: order.total,
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
});

// POST /api/orders
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'Order must have items' });

    // Build order items and verify prices
    const orderItems = [];
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
      const price = item.price || product.price;
      const total = price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price,
        total,
      });
      subtotal += total;
      // Decrement stock
      if (product.trackQuantity) {
        product.quantity = Math.max(0, product.quantity - item.quantity);
        await product.save();
      }
    }

    const tax = Math.round(subtotal * 0.05);
    const shipping = subtotal >= 999 ? 0 : 99;
    const orderTotal = totalAmount || subtotal + tax + shipping;

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      tax,
      shipping,
      discount: 0,
      total: orderTotal,
      paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PENDING',
    });

    // Clear cart after order
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    res.status(201).json(formatOrder(order));
  } catch (err) {
    next(err);
  }
});

// GET /api/orders
router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders.map(formatOrder));
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(formatOrder(order));
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/:id/confirm-mock-payment
router.post('/:id/confirm-mock-payment', protect, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.paymentStatus = 'PAID';
    order.status = 'CONFIRMED';
    order.paymentId = `mock_pay_${Date.now()}`;
    await order.save();
    res.json(formatOrder(order));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
