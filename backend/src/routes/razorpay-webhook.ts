import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Razorpay webhook signature verification
const verifyWebhookSignature = (body: string, signature: string, secret: string) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};

router.post('/razorpay-webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature, process.env.RAZORPAY_KEY_SECRET!)) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
      const paymentId = payload.payment.entity.id;
      const orderId = payload.payment.entity.notes.order_id;
      const amount = payload.payment.entity.amount / 100; // Convert from paise to rupees

      // Find the payment transaction
      const transaction = await prisma.paymentTransaction.findFirst({
        where: {
          paymentId,
          status: 'PENDING',
        },
      });

      if (!transaction) {
        return res.status(404).json({ error: 'Payment transaction not found' });
      }

      // Find the order
      const orderData = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      });

      if (!orderData) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Update payment transaction
      await prisma.$transaction(async (trx: Prisma.TransactionClient) => {
        // Update payment transaction
        await trx.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'SUCCESS',
            gatewayResponse: payload,
          },
        });

        // Update order status
        await trx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
          },
        });

        // Decrement product inventory
        for (const item of orderData.items) {
          if (item.product.trackQuantity) {
            await trx.product.update({
              where: { id: item.productId },
              data: {
                quantity: { decrement: item.quantity },
              },
            });
          }
        }

        // Clear cart - get userId from order instead
        if (orderData.userId) {
          const cart = await trx.cart.findUnique({
            where: { userId: orderData.userId },
          });

          if (cart) {
            await trx.cartItem.deleteMany({ where: { cartId: cart.id } });
          }
        }
      });

      console.log('Payment captured successfully:', paymentId);
      res.status(200).json({ message: 'Payment processed successfully' });
    } else if (event === 'payment.failed') {
      // Handle failed payment
      const paymentId = payload.payment.entity.id;
      
      await prisma.paymentTransaction.updateMany({
        where: { paymentId },
        data: {
          status: 'FAILED',
        },
      });

      console.log('Payment failed:', paymentId);
      res.status(200).json({ message: 'Payment failure recorded' });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
