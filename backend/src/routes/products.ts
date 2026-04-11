import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, authenticateToken, requireSeller } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  cost: z.number().positive().optional(),
  sku: z.string().min(1),
  trackQuantity: z.boolean().default(true),
  quantity: z.number().int().min(0).default(0),
  images: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  attributes: z.any().optional(),
  categoryId: z.string(),
  variants: z.array(z.object({
    title: z.string(),
    options: z.record(z.string()),
    price: z.number().positive(),
    sku: z.string(),
    quantity: z.number().int().min(0).default(0),
    image: z.string().optional(),
  })).optional(),
});

router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      minPrice, 
      maxPrice, 
      featured, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {
      status: 'ACTIVE',
    };

    if (category) {
      where.categoryId = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { tags: { hasSome: [search as string] } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          seller: {
            include: {
              user: {
                select: { name: true }
              }
            }
          },
          variants: true,
          reviews: {
            select: { rating: true },
          },
        },
        orderBy: { [sortBy as string]: sortOrder as 'asc' | 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithStats = products.map(product => ({
      ...product,
      images: Array.isArray(product.images) ? product.images : [],
      averageRating: product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
        : 0,
      reviewCount: product.reviews.length,
    }));

    res.json({
      products: productsWithStats,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        seller: {
          include: {
            user: {
              select: { name: true }
            }
          }
        },
        variants: true,
        reviews: {
          include: {
            user: {
              select: { name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const averageRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
      : 0;

    res.json({
      ...product,
      images: Array.isArray(product.images) ? product.images : [],
      averageRating,
      reviewCount: product.reviews.length,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, requireSeller, async (req: AuthRequest, res) => {
  try {
    const validatedData = productSchema.parse(req.body);

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!sellerProfile) {
      return res.status(403).json({ error: 'Seller profile not found' });
    }

    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { variants, ...productData } = validatedData;

    const product = await prisma.product.create({
      data: {
        ...productData,
        slug,
        sellerId: sellerProfile.id,
        variants: variants ? {
          create: variants
        } : undefined,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, requireSeller, async (req: AuthRequest, res) => {
  try {
    const validatedData = productSchema.partial().parse(req.body);

    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { seller: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (product.sellerId !== sellerProfile?.id) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    const updateData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, v]) => v !== undefined)
    );

    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        category: true,
        variants: true,
      },
    });

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, requireSeller, async (req: AuthRequest, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { seller: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (product.sellerId !== sellerProfile?.id) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/seller/my-products', authenticateToken, requireSeller, async (req: AuthRequest, res) => {
  try {
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!sellerProfile) {
      return res.status(403).json({ error: 'Seller profile not found' });
    }

    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { sellerId: sellerProfile.id };
    if (status) {
      where.status = status;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
          reviews: {
            select: { rating: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithStats = products.map(product => ({
      ...product,
      averageRating: product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
        : 0,
      reviewCount: product.reviews.length,
    }));

    res.json({
      products: productsWithStats,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
