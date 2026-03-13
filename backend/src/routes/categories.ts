import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true,
        _count: {
          select: {
            products: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      },
      where: { parentId: null },
      orderBy: { name: 'asc' },
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tree', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: {
          include: {
            children: true,
            _count: {
              select: {
                products: {
                  where: { status: 'ACTIVE' }
                }
              }
            }
          }
        },
        _count: {
          select: {
            products: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      },
      where: { parentId: null },
      orderBy: { name: 'asc' },
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const categorySchema = z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      image: z.string().optional(),
      parentId: z.string().optional(),
    });

    const validatedData = categorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: validatedData,
      include: {
        parent: true,
        children: true,
      },
    });

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
