import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, authenticateToken, requireCustomer } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  content: z.string().min(1),
  images: z.array(z.string()).default([]),
});

router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { productId: req.params.productId };
    if (rating) {
      where.rating = Number(rating);
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: { name: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.review.count({ where }),
    ]);

    const ratingStats = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId: req.params.productId },
      _count: { rating: true },
    });

    const averageRating = await prisma.review.aggregate({
      where: { productId: req.params.productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    res.json({
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      stats: {
        averageRating: averageRating._avg.rating || 0,
        totalReviews: averageRating._count.rating,
        ratingDistribution: ratingStats.reduce((acc, stat) => {
          acc[stat.rating] = stat._count.rating;
          return acc;
        }, {} as Record<number, number>),
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, requireCustomer, async (req: AuthRequest, res) => {
  try {
    const validatedData = reviewSchema.parse(req.body);

    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: validatedData.productId,
          userId: req.user!.id,
        },
      },
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const hasOrdered = await prisma.orderItem.findFirst({
      where: {
        productId: validatedData.productId,
        order: {
          userId: req.user!.id,
          status: 'DELIVERED',
        },
      },
    });

    if (!hasOrdered) {
      return res.status(403).json({ error: 'You can only review products you have purchased and received' });
    }

    const review = await prisma.review.create({
      data: {
        ...validatedData,
        userId: req.user!.id,
        verified: true,
      },
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
    });

    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, requireCustomer, async (req: AuthRequest, res) => {
  try {
    const updateReviewSchema = reviewSchema.partial().omit({ productId: true });
    const validatedData = updateReviewSchema.parse(req.body);

    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to update this review' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: req.params.id },
      data: validatedData,
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
    });

    res.json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, requireCustomer, async (req: AuthRequest, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    await prisma.review.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
