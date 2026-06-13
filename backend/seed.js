/**
 * seed.js — Database Seeder for NexCart
 *
 * Populates the MongoDB database with 8 high-quality sample products.
 * Run with: npm run seed (or: node seed.js)
 *
 * WARNING: This script clears all existing products before inserting new ones.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

const sampleProducts = [
  {
    name: 'Apple iPhone 15 Pro Max',
    description:
      'Experience the pinnacle of smartphone technology with the iPhone 15 Pro Max. Featuring the A17 Pro chip, a stunning 6.7" Super Retina XDR ProMotion display, a revolutionary titanium design, and an advanced 48MP camera system with 5x optical zoom. USB-C connectivity, Action Button, and iOS 17 deliver the most powerful iPhone experience ever.',
    price: 134900,
    originalPrice: 159900,
    imageUrl:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Electronics',
    brand: 'Apple',
    countInStock: 45,
    rating: 4.9,
    numReviews: 1284,
    isFeatured: true,
    tags: ['5G', 'titanium', 'ProMotion', 'USB-C', 'flagship'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Samsung Galaxy S24 Ultra redefines mobile productivity. Featuring the built-in S Pen, a 200MP advanced camera, 6.8" Dynamic AMOLED 2X display with 120Hz, Snapdragon 8 Gen 3 processor, and 5,000mAh battery. AI-powered photography and Galaxy AI features make this the ultimate Android powerhouse.',
    price: 129999,
    originalPrice: 144999,
    imageUrl:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Electronics',
    brand: 'Samsung',
    countInStock: 32,
    rating: 4.8,
    numReviews: 976,
    isFeatured: true,
    tags: ['S Pen', 'Galaxy AI', '200MP', 'Snapdragon 8 Gen 3'],
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description:
      'Industry-leading noise cancellation meets stunning audio quality. The WH-1000XM5 features 8 microphones for unmatched ANC, 30-hour battery life, multipoint connection to two devices simultaneously, and crystal-clear hands-free calling. Foldable design with plush ear cushions for all-day wearing comfort.',
    price: 24990,
    originalPrice: 34990,
    imageUrl:
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Electronics',
    brand: 'Sony',
    countInStock: 78,
    rating: 4.7,
    numReviews: 2341,
    isFeatured: false,
    tags: ['noise-cancelling', 'wireless', 'Bluetooth 5.2', '30hr battery'],
  },
  {
    name: 'Nike Air Jordan 1 Retro High OG',
    description:
      'A timeless icon reimagined. The Air Jordan 1 Retro High OG blends heritage basketball aesthetics with modern craftsmanship. Premium full-grain leather upper, Nike Air cushioning, and a perforated toe box ensure style and comfort in equal measure. The defining sneaker of a generation, back in its purest form.',
    price: 17995,
    originalPrice: 19995,
    imageUrl:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Fashion',
    brand: 'Nike',
    countInStock: 120,
    rating: 4.8,
    numReviews: 3210,
    isFeatured: true,
    tags: ['Air Jordan', 'retro', 'high-top', 'leather', 'OG colourway'],
  },
  {
    name: "Levi's 511 Slim Fit Jeans",
    description:
      "The Levi's 511 Slim is cut close to the body for a modern, tailored look without restricting movement. Made with Flex material that moves with you, these jeans offer all-day comfort in a signature slim silhouette. Premium denim with reinforced stitching for lasting durability.",
    price: 3299,
    originalPrice: 4999,
    imageUrl:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Fashion',
    brand: "Levi's",
    countInStock: 200,
    rating: 4.5,
    numReviews: 1870,
    isFeatured: false,
    tags: ['slim fit', 'denim', 'flex', 'casual', 'everyday'],
  },
  {
    name: 'Dyson V15 Detect Cordless Vacuum',
    description:
      'The Dyson V15 Detect uses a laser to reveal microscopic dust invisible to the naked eye. Its intelligent suction auto-adjusts to tackle any floor type, while an LCD screen shows real-time particle count and run time. 60-minute fade-free power from our most powerful cordless motor.',
    price: 49900,
    originalPrice: 59900,
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Home & Living',
    brand: 'Dyson',
    countInStock: 24,
    rating: 4.6,
    numReviews: 892,
    isFeatured: true,
    tags: ['laser detect', 'cordless', '60 min', 'HEPA filter', 'smart home'],
  },
  {
    name: 'Scitec Nutrition Whey Protein 2.35kg',
    description:
      'Premium quality whey protein concentrate delivering 22g of protein per serving with an exceptional amino acid profile. Ideal for post-workout recovery and muscle building. Available in Chocolate Hazelnut flavour. Mixes instantly, no clumping, 76 servings per tub — the smart choice for serious athletes.',
    price: 3499,
    originalPrice: 4999,
    imageUrl:
      'https://images.unsplash.com/photo-1579722820252-76ab6a857219?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1579722820252-76ab6a857219?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Sports',
    brand: 'Scitec Nutrition',
    countInStock: 150,
    rating: 4.4,
    numReviews: 2678,
    isFeatured: false,
    tags: ['whey', 'protein', 'recovery', 'muscle gain', 'supplement'],
  },
  {
    name: 'Apple MacBook Pro 14" M3 Pro',
    description:
      'The MacBook Pro 14" with M3 Pro delivers groundbreaking performance for pro workflows. Features an 11-core CPU, 14-core GPU, up to 36GB unified memory, and the stunning Liquid Retina XDR display with ProMotion technology. Up to 18 hours battery life. Built for those who push the limits.',
    price: 199900,
    originalPrice: 219900,
    imageUrl:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'Electronics',
    brand: 'Apple',
    countInStock: 18,
    rating: 5.0,
    numReviews: 641,
    isFeatured: true,
    tags: ['M3 Pro', 'Liquid Retina XDR', '18hr battery', 'ProMotion', 'macOS'],
  },
];

const seed = async () => {
  try {
    await connectDB();

    console.log('\n\x1b[33m🌱 Starting database seed...\x1b[0m');

    // Clear existing products
    await Product.deleteMany({});
    console.log('   ✔ Cleared existing products');

    // Insert fresh products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`   ✔ Inserted \x1b[32m${inserted.length}\x1b[0m products`);

    console.log('\n\x1b[32m✅ Database seeded successfully!\x1b[0m\n');

    // List what was inserted
    inserted.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} (₹${p.price.toLocaleString('en-IN')})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('\n\x1b[31m✘ Seed failed:\x1b[0m', error.message);
    process.exit(1);
  }
};

seed();
