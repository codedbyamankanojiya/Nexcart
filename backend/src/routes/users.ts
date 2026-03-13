import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, authenticateToken, requireSeller, requireAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        customerProfile: true,
        sellerProfile: {
          include: {
            _count: {
              select: {
                products: true,
              }
            }
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        customerProfile: true,
        sellerProfile: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const updateCustomerProfileSchema = z.object({
  addresses: z.any().optional(),
  preferences: z.any().optional(),
});

router.put('/customer-profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const validatedData = updateCustomerProfileSchema.parse(req.body);

    let customerProfile = await prisma.customerProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!customerProfile) {
      customerProfile = await prisma.customerProfile.create({
        data: {
          userId: req.user!.id,
          addresses: validatedData.addresses || [],
          preferences: validatedData.preferences || {},
        },
      });
    } else {
      customerProfile = await prisma.customerProfile.update({
        where: { userId: req.user!.id },
        data: validatedData,
      });
    }

    res.json({
      message: 'Customer profile updated successfully',
      customerProfile,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update customer profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const updateSellerProfileSchema = z.object({
  storeName: z.string().min(1).optional(),
  storeDescription: z.string().optional(),
  businessEmail: z.string().email().optional(),
  businessPhone: z.string().optional(),
  taxInfo: z.any().optional(),
  bankAccount: z.any().optional(),
});

router.put('/seller-profile', authenticateToken, requireSeller, async (req: AuthRequest, res) => {
  try {
    const validatedData = updateSellerProfileSchema.parse(req.body);

    let sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!sellerProfile) {
      sellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: req.user!.id,
          storeName: validatedData.storeName || 'My Store',
          storeDescription: validatedData.storeDescription,
          businessEmail: validatedData.businessEmail,
          businessPhone: validatedData.businessPhone,
          taxInfo: validatedData.taxInfo,
          bankAccount: validatedData.bankAccount,
        },
      });
    } else {
      sellerProfile = await prisma.sellerProfile.update({
        where: { userId: req.user!.id },
        data: validatedData,
      });
    }

    res.json({
      message: 'Seller profile updated successfully',
      sellerProfile,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update seller profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/seller/analytics', authenticateToken, requireSeller, async (req: AuthRequest, res) => {
  try {
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!sellerProfile) {
      return res.status(403).json({ error: 'Seller profile not found' });
    }

    const [
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      prisma.product.count({
        where: { sellerId: sellerProfile.id },
      }),
      prisma.product.count({
        where: { 
          sellerId: sellerProfile.id,
          status: 'ACTIVE',
        },
      }),
      prisma.orderItem.count({
        where: {
          product: { sellerId: sellerProfile.id },
        },
      }),
      prisma.orderItem.aggregate({
        where: {
          product: { sellerId: sellerProfile.id },
          order: { paymentStatus: 'PAID' },
        },
        _sum: { total: true },
      }),
      prisma.orderItem.findMany({
        where: {
          product: { sellerId: sellerProfile.id },
        },
        include: {
          order: {
            select: {
              orderNumber: true,
              status: true,
              createdAt: true,
            },
          },
          product: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.product.findMany({
        where: {
          sellerId: sellerProfile.id,
          trackQuantity: true,
          quantity: { lt: 10 },
          status: 'ACTIVE',
        },
        select: {
          id: true,
          name: true,
          sku: true,
          quantity: true,
        },
        orderBy: { quantity: 'asc' },
        take: 10,
      }),
    ]);

    res.json({
      analytics: {
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error('Get seller analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/admin/users', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          customerProfile: true,
          sellerProfile: true,
          _count: {
            select: {
              orders: true,
            }
          }
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
          customerProfile: true,
          sellerProfile: true,
          _count: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
