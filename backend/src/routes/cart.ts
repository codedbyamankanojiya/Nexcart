import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, authenticateToken, requireCustomer } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
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
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
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
          }
        }
      });
    }

    const cartTotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      cart: {
        ...cart,
        total: cartTotal,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const addItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1),
});

router.post('/add', authenticateToken, requireCustomer, async (req: AuthRequest, res) => {
  try {
    const validatedData = addItemSchema.parse(req.body);

    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product || product.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Product not found or not available' });
    }

    if (product.trackQuantity && product.quantity < validatedData.quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.id },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: validatedData.productId,
        variantId: validatedData.variantId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + validatedData.quantity;
      
      if (product.trackQuantity && product.quantity < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: validatedData.productId,
          variantId: validatedData.variantId,
          quantity: validatedData.quantity,
          price: product.price,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
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
        }
      }
    });

    const cartTotal = updatedCart!.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      message: 'Item added to cart',
      cart: {
        ...updatedCart,
        total: cartTotal,
        itemCount: updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0),
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0),
});

router.put('/items/:itemId', authenticateToken, requireCustomer, async (req: AuthRequest, res) => {
  try {
    const validatedData = updateItemSchema.parse(req.body);

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (cartItem.cart.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to update this cart item' });
    }

    if (validatedData.quantity === 0) {
      await prisma.cartItem.delete({
        where: { id: req.params.itemId },
      });
    } else {
      if (cartItem.product.trackQuantity && cartItem.product.quantity < validatedData.quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      await prisma.cartItem.update({
        where: { id: req.params.itemId },
        data: { quantity: validatedData.quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
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
        }
      }
    });

    const cartTotal = updatedCart!.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      message: 'Cart item updated',
      cart: {
        ...updatedCart,
        total: cartTotal,
        itemCount: updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0),
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/items/:itemId', authenticateToken, requireCustomer, async (req: AuthRequest, res) => {
  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (cartItem.cart.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to remove this cart item' });
    }

    await prisma.cartItem.delete({
      where: { id: req.params.itemId },
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/clear', authenticateToken, requireCustomer, async (req: AuthRequest, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
