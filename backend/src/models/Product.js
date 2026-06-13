const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  title: { type: String, required: true },
  options: { type: mongoose.Schema.Types.Mixed, default: {} },
  price: { type: Number, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  image: { type: String, default: null },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    comparePrice: { type: Number, default: null },
    cost: { type: Number, default: null },
    sku: { type: String, required: true, unique: true },
    trackQuantity: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    status: { type: String, enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'], default: 'ACTIVE' },
    featured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    attributes: { type: mongoose.Schema.Types.Mixed, default: null },
    variants: [variantSchema],
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Cached rating fields
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual: first image as `image`
productSchema.virtual('image').get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

// Virtual: inStock
productSchema.virtual('inStock').get(function () {
  return this.quantity > 0;
});

// Format for frontend
productSchema.methods.toAPI = function (category, seller) {
  return {
    id: this._id.toString(),
    name: this.name,
    slug: this.slug,
    description: this.description,
    price: this.price,
    comparePrice: this.comparePrice,
    sku: this.sku,
    trackQuantity: this.trackQuantity,
    quantity: this.quantity,
    inStock: this.quantity > 0,
    image: this.images[0] || null,
    images: this.images,
    status: this.status,
    featured: this.featured,
    tags: this.tags,
    categoryId: this.categoryId?.toString(),
    sellerId: this.sellerId?.toString(),
    createdAt: this.createdAt?.toISOString(),
    updatedAt: this.updatedAt?.toISOString(),
    category: category
      ? { id: category._id?.toString() || category.id, name: category.name, slug: category.slug }
      : undefined,
    seller: seller
      ? { id: seller._id?.toString() || seller.id, storeName: seller.storeName || seller.name, user: { name: seller.name } }
      : undefined,
    averageRating: this.averageRating,
    reviewCount: this.reviewCount,
    rating: this.averageRating,
    reviews: this.reviewCount,
    variants: this.variants?.map((v) => ({
      id: v._id.toString(),
      productId: this._id.toString(),
      title: v.title,
      options: v.options,
      price: v.price,
      sku: v.sku,
      quantity: v.quantity,
      image: v.image,
    })),
  };
};

module.exports = mongoose.model('Product', productSchema);
