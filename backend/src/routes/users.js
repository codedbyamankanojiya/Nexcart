const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    res.json({ user: req.user.toProfile() });
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, phone, avatar, storeName, storeDescription, businessEmail, businessPhone } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (user.role === 'SELLER') {
      if (storeName) user.storeName = storeName;
      if (storeDescription !== undefined) user.storeDescription = storeDescription;
      if (businessEmail !== undefined) user.businessEmail = businessEmail;
      if (businessPhone !== undefined) user.businessPhone = businessPhone;
    }
    await user.save();
    res.json({ user: user.toProfile() });
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/addresses
router.put('/addresses', protect, async (req, res, next) => {
  try {
    const { addresses } = req.body;
    const user = await User.findById(req.user._id);
    user.addresses = addresses || [];
    await user.save();
    res.json({ user: user.toProfile() });
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/password
router.put('/password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
