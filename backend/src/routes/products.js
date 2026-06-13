const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// Helper: format product for API response
const formatProduct = async (product) => {
  const category = product.categoryId ? await Category.findById(product.categoryId) : null;
  const seller = product.sellerId ? await User.findById(product.sellerId) : null;
  return product.toAPI(category, seller);
};

const formatProducts = async (products) => Promise.all(products.map(formatProduct));

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, minPrice, maxPrice, featured, search, sortBy, sortOrder } = req.query;
    const filter = { status: 'ACTIVE' };

    // Category filter
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.categoryId = cat._id;
      else {
        const catByName = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
        if (catByName) filter.categoryId = catByName._id;
      }
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort
    let sort = { createdAt: -1 };
    if (sortBy) {
      const order = sortOrder === 'asc' ? 1 : -1;
      sort = { [sortBy]: order };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sort).skip((pageNum - 1) * limitNum).limit(limitNum);

    res.json({
      products: await formatProducts(products),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/seller/my-products (must be before /:id)
router.get('/seller/my-products', protect, requireRole('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, sortBy, sortOrder } = req.query;
    const filter = { sellerId: req.user._id };
    if (search) filter.name = { $regex: search, $options: 'i' };

    let sort = { createdAt: -1 };
    if (sortBy) sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sort).skip((pageNum - 1) * limitNum).limit(limitNum);

    res.json({
      products: await formatProducts(products),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product: await formatProduct(product) });
  } catch (err) {
    next(err);
  }
});

// POST /api/products (seller)
router.post('/', protect, requireRole('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const { name, description, price, comparePrice, sku, quantity, images, status, featured, tags, categoryId } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const product = await Product.create({
      name, slug, description, price, comparePrice, sku,
      quantity: quantity || 0,
      images: images || [],
      status: status || 'ACTIVE',
      featured: featured || false,
      tags: tags || [],
      categoryId,
      sellerId: req.user._id,
    });
    res.status(201).json({ message: 'Product created', product: await formatProduct(product) });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id
router.put('/:id', protect, requireRole('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not your product' });
    }
    Object.assign(product, req.body);
    if (req.body.name) {
      product.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    await product.save();
    res.json({ message: 'Product updated', product: await formatProduct(product) });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, requireRole('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not your product' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
