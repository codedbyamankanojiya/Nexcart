import { Router } from 'express';
import Razorpay from 'razorpay';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
const isRazorpayEnabled = Boolean(razorpayKeyId && razorpayKeySecret);

const razorpay = isRazorpayEnabled
  ? new Razorpay({
      key_id: razorpayKeyId!,
      key_secret: razorpayKeySecret!,
    })
  : null;

const createPaymentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
});

router.post('/create-order', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!isRazorpayEnabled || !razorpay) {
      return res.status(400).json({
        error: 'Razorpay is not configured. Use mock payments via POST /api/orders then POST /api/orders/:id/confirm-mock-payment.',
      });
    }

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

    if (Math.round(validatedData.amount * 100) !== Math.round(order.total * 100)) {
      return res.status(400).json({ error: 'Amount mismatch' });
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

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: razorpayOrder.id,
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
        gatewayResponse: razorpayOrder as any,
      },
    });

    res.json({
      razorpayOrder,
      key: razorpayKeyId,
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
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

router.post('/verify', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!isRazorpayEnabled || !razorpay) {
      return res.status(400).json({
        error: 'Razorpay is not configured. Use mock payments via POST /api/orders then POST /api/orders/:id/confirm-mock-payment.',
      });
    }

    const validatedData = verifyPaymentSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
      include: {
        transactions: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to verify this payment' });
    }

    if (order.paymentId && order.paymentId !== validatedData.razorpayOrderId) {
      return res.status(400).json({ error: 'Razorpay order mismatch' });
    }

    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', razorpayKeySecret!)
      .update(`${validatedData.razorpayOrderId}|${validatedData.razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== validatedData.razorpaySignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    try {
      const payment = await razorpay.payments.fetch(validatedData.razorpayPaymentId);

      if (payment.status !== 'captured') {
        return res.status(400).json({ error: 'Payment not successful' });
      }

      await prisma.$transaction(async (trx: Prisma.TransactionClient) => {
        // re-check inventory before confirming
        for (const item of order.items) {
          if (item.product.trackQuantity && item.product.quantity < item.quantity) {
            throw new Error(`Insufficient stock for product ${item.product.name}`);
          }
        }

        await trx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
          },
        });

        await trx.paymentTransaction.updateMany({
          where: { orderId: order.id },
          data: {
            paymentId: validatedData.razorpayPaymentId,
            status: 'SUCCESS',
            gatewayResponse: payment as any,
          },
        });

        for (const item of order.items) {
          if (item.product.trackQuantity) {
            await trx.product.update({
              where: { id: item.productId },
              data: {
                quantity: { decrement: item.quantity },
              },
            });
          }
        }

        const cart = await trx.cart.findUnique({ where: { userId: req.user!.id } });
        if (cart) {
          await trx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      });

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
      const msg = typeof (razorpayError as any)?.message === 'string' ? (razorpayError as any).message : 'Payment verification failed';
      res.status(400).json({ error: msg });
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
