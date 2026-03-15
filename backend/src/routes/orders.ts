import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const createOrderSchema = z.object({
  shippingAddress: z.any(),
  billingAddress: z.any().optional(),
  notes: z.string().optional(),
});

const paymentProviderSchema = z.object({
  provider: z.enum(['mock']).default('mock'),
});

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const { provider } = paymentProviderSchema.parse(req.body);

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let subtotal = 0;
    const orderItems: Array<{ productId: string; variantId?: string | null; quantity: number; price: number; total: number }> = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      if (!product || product.status !== 'ACTIVE') {
        return res.status(400).json({ error: `Product ${cartItem.productId} not found or not available` });
      }

      if (product.trackQuantity && product.quantity < cartItem.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
      }

      const itemTotal = product.price * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: cartItem.productId,
        variantId: cartItem.variantId ?? null,
        quantity: cartItem.quantity,
        price: product.price,
        total: itemTotal,
      });
    }

    const tax = subtotal * 0.18;
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + tax + shipping;

    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user!.id,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal,
        tax,
        shipping,
        discount: 0,
        total,
        notes: validatedData.notes,
        shippingAddress: validatedData.shippingAddress,
        billingAddress: validatedData.billingAddress || validatedData.shippingAddress,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: {
                  include: {
                    user: {
                      select: { name: true, email: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const mockPaymentId = `mock_pay_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const mockOrderId = `mock_order_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        paymentId: mockOrderId,
        amount: order.total,
        currency: order.currency,
        status: 'PENDING',
        gateway: 'mock',
        gatewayResponse: {
          mockOrderId,
          mockPaymentId,
        },
      },
    });

    res.status(201).json({
      message: 'Order created. Payment pending.',
      order,
      payment: {
        provider: 'mock',
        mockOrderId,
        mockPaymentId,
        amount: order.total,
        currency: order.currency,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const confirmMockPaymentSchema = z.object({
  mockOrderId: z.string().min(1),
  mockPaymentId: z.string().min(1),
});

router.post('/:id/confirm-mock-payment', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { mockOrderId, mockPaymentId } = confirmMockPaymentSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (order.paymentStatus === 'PAID') {
      return res.status(400).json({ error: 'Order already paid' });
    }

    const tx = await prisma.paymentTransaction.findFirst({
      where: {
        orderId: order.id,
        gateway: 'mock',
        status: 'PENDING',
        paymentId: mockOrderId,
      },
    });

    if (!tx) {
      return res.status(400).json({ error: 'Payment session not found' });
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

      await trx.paymentTransaction.update({
        where: { id: tx.id },
        data: {
          status: 'SUCCESS',
          gatewayResponse: {
            ...(tx.gatewayResponse as any),
            confirmedMockPaymentId: mockPaymentId,
          },
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

    const updated = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true, transactions: true },
    });

    res.json({
      message: 'Payment confirmed and order placed',
      order: updated,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    const msg = typeof error?.message === 'string' ? error.message : 'Internal server error';
    res.status(400).json({ error: msg });
  }
});

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId: req.user!.id };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  seller: {
                    include: {
                      user: {
                        select: { name: true }
                      }
                    }
                  }
                }
              }
            }
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: {
                  include: {
                    user: {
                      select: { name: true, email: true }
                    }
                  }
                }
              }
            }
          }
        },
        transactions: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id/status', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;

    if (!['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'DELIVERED' && status !== 'REFUNDED') {
      return res.status(400).json({ error: 'Cannot update delivered order' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (status === 'CONFIRMED') {
      for (const item of updatedOrder.items) {
        if (item.product.trackQuantity) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }
    }

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/cancel', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this order' });
    }

    if (order.paymentStatus === 'PAID') {
      return res.status(400).json({ error: 'Paid orders cannot be cancelled here. Contact support.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
        paymentStatus: order.paymentStatus === 'PENDING' ? 'FAILED' : order.paymentStatus,
      },
    });

    res.json({
      message: 'Order cancelled',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
