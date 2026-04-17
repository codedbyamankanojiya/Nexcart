import { PrismaClient, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Category seeds
const categorySeeds = [
  {
    name: 'Electronics',
    slug: 'electronics',
    subcategories: [
      { name: 'Smartphones', slug: 'smartphones' },
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Tablets', slug: 'tablets' },
      { name: 'Audio', slug: 'audio' },
    ],
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    subcategories: [
      { name: "Men's Clothing", slug: 'mens-clothing' },
      { name: "Women's Clothing", slug: 'womens-clothing' },
      { name: 'Shoes', slug: 'shoes' },
      { name: 'Accessories', slug: 'accessories' },
    ],
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    subcategories: [
      { name: 'Kitchen Appliances', slug: 'kitchen-appliances' },
      { name: 'Home Decor', slug: 'home-decor' },
      { name: 'Furniture', slug: 'furniture' },
      { name: 'Bedding', slug: 'bedding' },
    ],
  },
  {
    name: 'Books & Media',
    slug: 'books-media',
    subcategories: [
      { name: 'Fiction Books', slug: 'fiction-books' },
      { name: 'Non-Fiction Books', slug: 'non-fiction-books' },
      { name: 'Movies & TV', slug: 'movies-tv' },
      { name: 'Video Games', slug: 'video-games' },
    ],
  },
];

// Product seeds
const productSeeds = [
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Latest iPhone with advanced camera system, A17 Pro chip, and titanium design.',
    price: 149999.99,
    comparePrice: 159999.99,
    sku: 'IP15PMT256',
    trackQuantity: true,
    quantity: 50,
    images: ['https://images.unsplash.com/photo-1592750475288-6e7b39b40d1?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: true,
    tags: ['Apple', 'iPhone', 'Pro', 'Max'],
    categorySlug: 'smartphones',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Premium Android smartphone with S Pen, advanced camera, and AI features.',
    price: 124999.99,
    comparePrice: 139999.99,
    sku: 'SGS24U256',
    trackQuantity: true,
    quantity: 45,
    images: ['https://images.unsplash.com/photo-1598328076208-3d98b9a1eb2?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: true,
    tags: ['Samsung', 'Galaxy', 'S24', 'Ultra'],
    categorySlug: 'smartphones',
  },
  {
    name: 'MacBook Pro 14" M3',
    slug: 'macbook-pro-14-m3',
    description: 'Powerful laptop with M3 chip, stunning display, and all-day battery life.',
    price: 199999.99,
    comparePrice: 219999.99,
    sku: 'MBPM314',
    trackQuantity: true,
    quantity: 25,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a85?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: true,
    tags: ['Apple', 'MacBook', 'Pro', 'M3'],
    categorySlug: 'laptops',
  },
  {
    name: 'ASUS ROG Strix G15 Gaming Laptop',
    slug: 'asus-rog-strix-g15',
    description: '15.6-inch 144Hz, RTX 4060, Ryzen 7, 16GB RAM, 512GB SSD.',
    price: 89999.99,
    comparePrice: 99999.99,
    sku: 'ROGSTRIXG15',
    trackQuantity: true,
    quantity: 35,
    images: ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['ASUS', 'ROG', 'Gaming', 'RTX 4060'],
    categorySlug: 'laptops',
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Create categories and subcategories
    const categorySlugToId: Record<string, string> = {};
    
    for (const category of categorySeeds) {
      console.log(`📁 Creating category: ${category.name}`);
      
      const createdCategory = await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: {
          name: category.name,
          slug: category.slug,
        },
      });

      categorySlugToId[category.slug] = createdCategory.id;

      // Create subcategories
      for (const subcategory of category.subcategories) {
        console.log(`  📂 Creating subcategory: ${subcategory.name}`);
        const createdSubcategory = await prisma.category.upsert({
          where: { slug: subcategory.slug },
          update: {},
          create: {
            name: subcategory.name,
            slug: subcategory.slug,
            parentId: createdCategory.id,
          },
        });
        categorySlugToId[subcategory.slug] = createdSubcategory.id;
      }
    }

    // Create demo seller
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    const demoUser = await prisma.user.upsert({
      where: { email: 'seller@popkart.demo' },
      update: {},
      create: {
        email: 'seller@popkart.demo',
        password: hashedPassword,
        name: 'PopKart Seller',
        role: 'SELLER',
      },
    });

    const demoSeller = await prisma.sellerProfile.upsert({
      where: { userId: demoUser.id },
      update: {},
      create: {
        userId: demoUser.id,
        storeName: 'PopKart Store',
        storeDescription: 'Your trusted destination for quality products',
        verificationStatus: 'APPROVED',
      },
    });

    // Seed products
    for (const product of productSeeds) {
      const categoryId = categorySlugToId[product.categorySlug];
      if (!categoryId) {
        console.log(`⚠️  Skipping ${product.name} - category not found: ${product.categorySlug}`);
        continue;
      }

      console.log(`📦 Creating product: ${product.name}`);

      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          images: product.images,
          price: product.price,
          quantity: product.quantity,
        },
        create: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice,
          sku: product.sku,
          trackQuantity: product.trackQuantity,
          quantity: product.quantity,
          images: product.images,
          status: product.status,
          featured: product.featured,
          tags: product.tags,
          categoryId: categoryId,
          sellerId: demoSeller.id,
        },
      });
    }

    console.log('✅ Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
