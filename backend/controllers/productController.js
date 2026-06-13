/**
 * productController.js — Product catalogue management
 *
 * Provides CRUD operations for the product collection.
 * Public routes: listing and single product lookup.
 * Admin-only routes: create, update, delete.
 */

const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

/**
 * @route   GET /api/products
 * @desc    Fetch all products with optional search, category filter, and pagination
 * @access  Public
 *
 * Query params:
 *   ?keyword=   — fuzzy name/description search
 *   ?category=  — filter by category
 *   ?page=      — page number (default: 1)
 *   ?limit=     — results per page (default: 12)
 *   ?sort=      — price_asc | price_desc | rating | newest (default: newest)
 */
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, page = 1, limit = 12, sort = 'newest' } = req.query;

  // Build the query filter
  const filter = {};

  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { brand: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (category && category !== 'All') {
    filter.category = category;
  }

  // Build the sort order
  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1, numReviews: -1 },
    newest: { createdAt: -1 },
  };
  const sortOrder = sortMap[sort] || sortMap.newest;

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOrder).skip(skip).limit(limitNum).lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    products,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  });
});

/**
 * @route   GET /api/products/:id
 * @desc    Fetch a single product by its MongoDB _id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    originalPrice,
    imageUrl,
    images,
    category,
    brand,
    countInStock,
    isFeatured,
    tags,
  } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    originalPrice,
    imageUrl,
    images: images || [imageUrl],
    category,
    brand,
    countInStock,
    isFeatured: isFeatured || false,
    tags: tags || [],
  });

  res.status(201).json({ success: true, product });
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product
 * @access  Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const allowedFields = [
    'name', 'description', 'price', 'originalPrice', 'imageUrl',
    'images', 'category', 'brand', 'countInStock', 'isFeatured', 'tags',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updatedProduct = await product.save();
  res.json({ success: true, product: updatedProduct });
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Remove a product from the catalogue
 * @access  Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product removed successfully' });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
