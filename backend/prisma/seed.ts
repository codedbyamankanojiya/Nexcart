import { PrismaClient, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Category mapping for the new schema
const categorySlugToId: Record<string, string> = {};

// Product images - using high-quality Unsplash images that accurately represent product categories
// Note: Unsplash has user-submitted photos, NOT official brand product images
// For production, use official brand images hosted on your own storage
const productSeeds = [
  // Smartphones
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: '6.7-inch Super Retina XDR display with ProMotion technology, A17 Pro chip, titanium design.',
    price: 159900.99,
    comparePrice: 169900.99,
    sku: 'IPH15PM256',
    trackQuantity: true,
    quantity: 50,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: true,
    tags: ['Apple', 'iPhone', '5G', 'Flagship'],
    categorySlug: 'smartphones',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: '6.8-inch Dynamic AMOLED display, S Pen included, 200MP camera, AI features.',
    price: 124999.99,
    comparePrice: 134999.99,
    sku: 'SG24U256',
    trackQuantity: true,
    quantity: 45,
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: true,
    tags: ['Samsung', 'Galaxy', 'Android', '5G'],
    categorySlug: 'smartphones',
  },
  {
    name: 'Google Pixel 8 Pro',
    slug: 'google-pixel-8-pro',
    description: '6.7-inch LTPO OLED display, Google Tensor G3 chip, advanced AI photography.',
    price: 106999.99,
    comparePrice: 114999.99,
    sku: 'GPX8P128',
    trackQuantity: true,
    quantity: 30,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['Google', 'Pixel', 'Android', 'AI'],
    categorySlug: 'smartphones',
  },
  {
    name: 'OnePlus 12R 5G',
    slug: 'oneplus-12r-5g',
    description: '120Hz AMOLED, Snapdragon performance, fast charging, clean feel for daily power users.',
    price: 39999.99,
    comparePrice: 44999.99,
    sku: 'OP12R256',
    trackQuantity: true,
    quantity: 60,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['OnePlus', 'Android', '5G', 'Gaming'],
    categorySlug: 'smartphones',
  },
  {
    name: 'Nothing Phone (2)',
    slug: 'nothing-phone-2',
    description: 'Signature Glyph design, smooth OLED, premium build, clean UI with great battery life.',
    price: 44999.99,
    comparePrice: 49999.99,
    sku: 'NP2A256',
    trackQuantity: true,
    quantity: 25,
    images: ['https://images.unsplash.com/photo-1617802808078-0b7fc4c5e20c?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['Nothing', 'Android', 'Unique Design'],
    categorySlug: 'smartphones',
  },

  // Laptops
  {
    name: 'MacBook Pro 16 M3 Max',
    slug: 'macbook-pro-16-m3-max',
    description: '16-inch Liquid Retina XDR, M3 Max chip, 32GB RAM, 1TB SSD.',
    price: 299999.99,
    comparePrice: 329999.99,
    sku: 'MBP16M3MX',
    trackQuantity: true,
    quantity: 15,
    images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80'],
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
  {
    name: 'Dell XPS 13 Plus',
    slug: 'dell-xps-13-plus',
    description: 'Premium ultrabook with edge-to-edge design, sharp display, and a top-tier trackpad feel.',
    price: 149999.99,
    comparePrice: 164999.99,
    sku: 'XPS13PLUS',
    trackQuantity: true,
    quantity: 20,
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['Dell', 'XPS', 'Ultrabook', 'Premium'],
    categorySlug: 'laptops',
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    slug: 'lenovo-thinkpad-x1-carbon',
    description: 'Business-grade premium laptop with great keyboard, durability, and reliable performance.',
    price: 159999.99,
    comparePrice: 174999.99,
    sku: 'TPX1C14',
    trackQuantity: true,
    quantity: 18,
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['Lenovo', 'ThinkPad', 'Business', 'Professional'],
    categorySlug: 'laptops',
  },

  // Men's Clothing
  {
    name: "Nike Air Force 1 Low White",
    slug: 'nike-air-force-1-low-white',
    description: "Iconic Nike sneakers with premium leather, Air-Sole cushioning, classic white colorway.",
    price: 8999.99,
    comparePrice: 9999.99,
    sku: 'NAF1LOWWHT',
    trackQuantity: true,
    quantity: 100,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: true,
    tags: ['Nike', 'Sneakers', 'Classic', 'Casual'],
    categorySlug: 'mens-clothing',
  },
  {
    name: "Levi's 501 Original Fit Jeans",
    slug: 'levis-501-original-fit-jeans',
    description: "Classic straight-leg jeans with button fly, authentic Levi's quality, timeless denim.",
    price: 4499.99,
    comparePrice: 4999.99,
    sku: 'LV501OFL',
    trackQuantity: true,
    quantity: 80,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ["Levi's", 'Jeans', 'Denim', 'Classic'],
    categorySlug: 'mens-clothing',
  },
  {
    name: 'Adidas Ultraboost 22 Running Shoes',
    slug: 'adidas-ultraboost-22',
    description: 'Premium running shoes with Boost cushioning, Primeknit upper, energy return technology.',
    price: 14999.99,
    comparePrice: 16999.99,
    sku: 'ADUB22BK',
    trackQuantity: true,
    quantity: 55,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['Adidas', 'Running', 'Boost', 'Sports'],
    categorySlug: 'mens-clothing',
  },
  {
    name: 'Tommy Hilfiger Slim Fit Polo',
    slug: 'tommy-hilfiger-slim-fit-polo',
    description: 'Classic polo shirt with signature flag logo, premium cotton piqué, modern slim fit.',
    price: 2999.99,
    comparePrice: 3499.99,
    sku: 'THSFPMNV',
    trackQuantity: true,
    quantity: 70,
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['Tommy Hilfiger', 'Polo', 'Shirt', 'Premium'],
    categorySlug: 'mens-clothing',
  },

  // Women's Clothing
  {
    name: 'Zara Floral Print Midi Dress',
    slug: 'zara-floral-midi-dress',
    description: 'Elegant floral midi dress with V-neckline, flowing silhouette, perfect for occasions.',
    price: 3999.99,
    comparePrice: 4999.99,
    sku: 'ZRFMD001',
    trackQuantity: true,
    quantity: 45,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: true,
    tags: ['Zara', 'Dress', 'Floral', 'Elegant'],
    categorySlug: 'womens-clothing',
  },
  {
    name: 'Michael Kors Jet Set Tote Bag',
    slug: 'michael-kors-jet-set-tote',
    description: 'Luxury leather tote with signature MK logo, spacious interior, gold-tone hardware.',
    price: 18999.99,
    comparePrice: 22999.99,
    sku: 'MKJST001',
    trackQuantity: true,
    quantity: 25,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['Michael Kors', 'Bag', 'Tote', 'Luxury'],
    categorySlug: 'womens-clothing',
  },
  {
    name: 'Swarovski Crystal Stud Earrings',
    slug: 'swarovski-crystal-stud-earrings',
    description: 'Elegant crystal earrings with rhodium plating, brilliant sparkle, timeless design.',
    price: 4999.99,
    comparePrice: 5999.99,
    sku: 'SWCRS001',
    trackQuantity: true,
    quantity: 60,
    images: ['https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['Swarovski', 'Earrings', 'Jewelry', 'Crystal'],
    categorySlug: 'womens-clothing',
  },

  // Gaming Console
  {
    name: 'PlayStation 5 Slim',
    slug: 'playstation-5-slim',
    description: 'Next-gen performance, fast loading, immersive haptics. Compact design with premium finish.',
    price: 54999.99,
    comparePrice: 59999.99,
    sku: 'PS5SLIM',
    trackQuantity: true,
    quantity: 20,
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: true,
    tags: ['Sony', 'PlayStation', 'PS5', 'Gaming'],
    categorySlug: 'video-games',
  },
  {
    name: 'Xbox Series S',
    slug: 'xbox-series-s',
    description: 'Compact design, 1440p gaming, 512GB SSD, Game Pass ready.',
    price: 34999.99,
    comparePrice: 39999.99,
    sku: 'XBSS512',
    trackQuantity: true,
    quantity: 30,
    images: ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['Microsoft', 'Xbox', 'Gaming', 'Digital'],
    categorySlug: 'video-games',
  },
  {
    name: 'Nintendo Switch OLED',
    slug: 'nintendo-switch-oled',
    description: 'Vibrant OLED screen, portable play, great exclusives. Dock and play on TV instantly.',
    price: 33999.99,
    comparePrice: 37999.99,
    sku: 'NSWOLED',
    trackQuantity: true,
    quantity: 40,
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80'],
    status: ProductStatus.ACTIVE,
    featured: false,
    tags: ['Nintendo', 'Switch', 'OLED', 'Portable'],
    categorySlug: 'video-games',
  },
];

async function seed() {
  console.log('🌱 Starting database seed...');

  // First, seed categories (same as before)
  const categoryData = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      children: [
        { name: 'Smartphones', slug: 'smartphones', description: 'Mobile phones and accessories' },
        { name: 'Laptops', slug: 'laptops', description: 'Notebook computers and accessories' },
        { name: 'Tablets', slug: 'tablets', description: 'Tablet computers and accessories' },
        { name: 'Audio', slug: 'audio', description: 'Headphones, speakers, and audio equipment' },
      ],
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Clothing and fashion accessories',
      children: [
        { name: "Men's Clothing", slug: 'mens-clothing', description: "Clothing for men" },
        { name: "Women's Clothing", slug: 'womens-clothing', description: "Clothing for women" },
        { name: 'Shoes', slug: 'shoes', description: 'Footwear for all genders' },
        { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories and jewelry' },
      ],
    },
    {
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      description: 'Home appliances and kitchenware',
      children: [
        { name: 'Kitchen Appliances', slug: 'kitchen-appliances', description: 'Cooking and food preparation appliances' },
        { name: 'Home Decor', slug: 'home-decor', description: 'Decorative items for home' },
        { name: 'Furniture', slug: 'furniture', description: 'Home and office furniture' },
        { name: 'Bedding', slug: 'bedding', description: 'Bed sheets, pillows, and bedding accessories' },
      ],
    },
    {
      name: 'Books & Media',
      slug: 'books-media',
      description: 'Books, movies, music, and games',
      children: [
        { name: 'Fiction Books', slug: 'fiction-books', description: 'Novels and story books' },
        { name: 'Non-Fiction Books', slug: 'non-fiction-books', description: 'Educational and reference books' },
        { name: 'Movies & TV', slug: 'movies-tv', description: 'Movies and TV shows' },
        { name: 'Video Games', slug: 'video-games', description: 'Gaming software and accessories' },
      ],
    },
  ];

  for (const category of categoryData) {
    console.log(`📁 Creating category: ${category.name}`);

    const parentCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });

    for (const child of category.children) {
      console.log(`  📂 Creating subcategory: ${child.name}`);

      const childCategory = await prisma.category.upsert({
        where: { slug: child.slug },
        update: {},
        create: {
          name: child.name,
          slug: child.slug,
          description: child.description,
          parentId: parentCategory.id,
        },
      });

      // Store category ID by slug for product seeding
      categorySlugToId[child.slug] = childCategory.id;
    }
  }

  // Note: Products require a sellerId. You'll need to create a seller first
  // or modify this seed to create a demo seller
  console.log('\n⚠️  Products require a sellerId. Skipping product seed.');
  console.log('   To seed products, first create a seller profile in the database.');
  console.log('   Then uncomment the product seeding section below.\n');

  // Uncomment this section once you have a seller set up:
  /*
  // Find or create a demo seller
  const demoUser = await prisma.user.upsert({
    where: { email: 'seller@popkart.demo' },
    update: {},
    create: {
      email: 'seller@popkart.demo',
      password: 'hashed_password_here', // Use bcrypt to hash in production
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
  */

  console.log('✅ Database seed completed successfully!');
}

seed()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
