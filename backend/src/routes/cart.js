const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper: populate cart items with product details and format for frontend
const getFormattedCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  // Populate products
  const populatedItems = await Promise.all(
    cart.items.map(async (item) => {
      const product = await Product.findById(item.productId);
      return {
        id: item._id.toString(),
        cartId: cart._id.toString(),
        productId: item.productId.toString(),
        variantId: item.variantId || null,
        quantity: item.quantity,
        price: item.price,
        product: product
          ? {
              id: product._id.toString(),
              name: product.name,
              price: product.price,
              image: product.images[0] || null,
              images: product.images,
              inStock: product.quantity > 0,
              quantity: product.quantity,
            }
          : null,
      };
    })
  );

  // Remove items whose products no longer exist
  const validItems = populatedItems.filter((i) => i.product);

  return {
    id: cart._id.toString(),
    userId: cart.userId.toString(),
    items: validItems,
    total: validItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    itemCount: validItems.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
  };
};

// GET /api/cart
router.get('/', protect, async (req, res, next) => {
  try {
    const cart = await getFormattedCart(req.user._id);
    res.json({ cart });
  } catch (err) {
    next(err);
  }
});

// POST /api/cart/add
router.post('/add', protect, async (req, res, next) => {
  try {
    const { productId, quantity = 1, variantId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });

    const existingIdx = cart.items.findIndex(
      (i) => i.productId.toString() === productId && (i.variantId || null) === (variantId || null)
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += quantity;
    } else {
      cart.items.push({ productId, variantId: variantId || null, quantity, price: product.price });
    }

    await cart.save();
    const formatted = await getFormattedCart(req.user._id);
    res.json({ message: 'Added to cart', cart: formatted });
  } catch (err) {
    next(err);
  }
});

// PUT /api/cart/items/:itemId
router.put('/items/:itemId', protect, async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (quantity <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    const formatted = await getFormattedCart(req.user._id);
    res.json({ message: 'Cart updated', cart: formatted });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/items/:itemId
router.delete('/items/:itemId', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items.pull(req.params.itemId);
    await cart.save();
    res.json({ message: 'Item removed' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/clear
router.delete('/clear', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
