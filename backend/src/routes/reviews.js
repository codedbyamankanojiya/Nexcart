const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/reviews?productId=xxx
router.get('/', async (req, res, next) => {
  try {
    const { productId } = req.query;
    const filter = {};
    if (productId) filter.productId = productId;
    const reviews = await Review.find(filter).populate('userId', 'name avatar').sort({ createdAt: -1 });
    res.json({
      reviews: reviews.map((r) => ({
        id: r._id.toString(),
        productId: r.productId.toString(),
        userId: r.userId?._id?.toString(),
        rating: r.rating,
        title: r.title,
        content: r.content,
        images: r.images,
        verified: r.verified,
        createdAt: r.createdAt.toISOString(),
        user: r.userId ? { id: r.userId._id.toString(), name: r.userId.name, avatar: r.userId.avatar } : null,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews
router.post('/', protect, async (req, res, next) => {
  try {
    const { productId, rating, title, content, images } = req.body;
    if (!productId || !rating || !content) {
      return res.status(400).json({ message: 'productId, rating, and content are required' });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = await Review.create({
      productId,
      userId: req.user._id,
      rating,
      title: title || null,
      content,
      images: images || [],
    });

    // Update product's cached rating
    const allReviews = await Review.find({ productId });
    product.reviewCount = allReviews.length;
    product.averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await product.save();

    res.status(201).json({
      review: {
        id: review._id.toString(),
        productId: review.productId.toString(),
        rating: review.rating,
        title: review.title,
        content: review.content,
        createdAt: review.createdAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
