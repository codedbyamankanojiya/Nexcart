import { Router } from 'express';
import Razorpay from 'razorpay';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const createPaymentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
});

router.post('/create-order', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validatedData = createPaymentSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to pay for this order' });
    }

    if (order.paymentStatus !== 'PENDING') {
      return res.status(400).json({ error: 'Order already paid or payment processing' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100),
      currency: order.currency,
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        userId: req.user!.id,
      },
    });

    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        paymentId: razorpayOrder.id,
        amount: order.total,
        currency: order.currency,
        status: 'PENDING',
        gateway: 'razorpay',
        gatewayResponse: razorpayOrder,
      },
    });

    res.json({
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create payment order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const verifyPaymentSchema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
});

router.post('/verify', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validatedData = verifyPaymentSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
      include: { transactions: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to verify this payment' });
    }

    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${validatedData.paymentId}|${order.orderNumber}`)
      .digest('hex');

    if (generatedSignature !== validatedData.signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    try {
      const payment = await razorpay.payments.fetch(validatedData.paymentId);

      if (payment.status !== 'captured') {
        return res.status(400).json({ error: 'Payment not successful' });
      }

      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
          },
        }),
        prisma.paymentTransaction.updateMany({
          where: { orderId: order.id },
          data: {
            paymentId: validatedData.paymentId,
            status: 'SUCCESS',
            gatewayResponse: payment,
          },
        }),
      ]);

      res.json({
        message: 'Payment verified successfully',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });
    } catch (razorpayError) {
      console.error('Razorpay verification error:', razorpayError);
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/transactions/:orderId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: { transactions: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to view transactions for this order' });
    }

    res.json({ transactions: order.transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
