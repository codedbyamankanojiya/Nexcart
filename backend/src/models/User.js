const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: null },
    avatar: { type: String, default: null },
    role: { type: String, enum: ['CUSTOMER', 'SELLER', 'ADMIN'], default: 'CUSTOMER' },
    // Customer-specific
    addresses: { type: [mongoose.Schema.Types.Mixed], default: [] },
    preferences: { type: mongoose.Schema.Types.Mixed, default: null },
    // Seller-specific
    storeName: { type: String, default: null },
    storeDescription: { type: String, default: null },
    businessEmail: { type: String, default: null },
    businessPhone: { type: String, default: null },
    verificationStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    commissionRate: { type: Number, default: 0.1 },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Return user object matching frontend's expected shape
userSchema.methods.toProfile = function () {
  const obj = {
    id: this._id.toString(),
    email: this.email,
    name: this.name,
    role: this.role,
    phone: this.phone,
    avatar: this.avatar,
  };
  if (this.role === 'CUSTOMER') {
    obj.customerProfile = { addresses: this.addresses, preferences: this.preferences };
  }
  if (this.role === 'SELLER') {
    obj.sellerProfile = {
      id: this._id.toString(),
      storeName: this.storeName,
      storeDescription: this.storeDescription,
      businessEmail: this.businessEmail,
      businessPhone: this.businessPhone,
      verificationStatus: this.verificationStatus,
      commissionRate: this.commissionRate,
    };
  }
  return obj;
};

module.exports = mongoose.model('User', userSchema);
