const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    // Count products per category
    const result = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ categoryId: cat._id, status: 'ACTIVE' });
        const obj = cat.toJSON();
        obj._count = { products: count };
        return obj;
      })
    );
    res.json({ categories: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/tree
router.get('/tree', async (req, res, next) => {
  try {
    const categories = await Category.find().populate('children').sort({ name: 1 });
    const roots = categories.filter((c) => !c.parentId);
    res.json({ categories: roots });
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/:id
router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ category });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
