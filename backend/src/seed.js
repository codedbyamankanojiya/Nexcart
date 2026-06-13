/**
 * seed.js â€” NexCart Database Seeder
 *
 * Seeds MongoDB with categories, a demo seller, and all 50+ products
 * using the same data as the frontend's mockProducts.ts
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

const CATEGORIES = [
  { name: 'Smartphone', slug: 'smartphone', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80' },
  { name: 'Gaming PC Gears', slug: 'gaming-pc-gears', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Laptop', slug: 'laptop', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80' },
  { name: "Men's Fashion", slug: 'mens-fashion', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' },
  { name: "Women's Fashion", slug: 'womens-fashion', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Gaming Console', slug: 'gaming-console', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80' },
  { name: 'Television', slug: 'television', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80' },
  { name: 'PC Accessories', slug: 'pc-accessories', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Gadgets', slug: 'gadgets', image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80' },
  { name: 'Glasses', slug: 'glasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80' },
];

const PRODUCTS = [
  // â”€â”€â”€ Smartphones â”€â”€â”€
  { name: 'iPhone 15 Pro Max', price: 159900, cat: 'Smartphone', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80', desc: '6.7-inch Super Retina XDR display with ProMotion technology, A17 Pro chip, titanium design.', rating: 4.8, reviews: 2156 },
  { name: 'Samsung Galaxy S24 Ultra', price: 124999, cat: 'Smartphone', img: 'https://images.unsplash.com/photo-1610792516307-ea5c9fbaca49?auto=format&fit=crop&w=1000&q=80', desc: '6.8-inch Dynamic AMOLED display, S Pen included, 200MP camera, AI features.', rating: 4.7, reviews: 1834 },
  { name: 'Google Pixel 8 Pro', price: 106999, cat: 'Smartphone', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80', desc: '6.7-inch LTPO OLED display, Google Tensor G3 chip, advanced AI photography.', rating: 4.6, reviews: 1245 },
  { name: 'OnePlus 12R 5G', price: 39999, cat: 'Smartphone', img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80', desc: '120Hz AMOLED, Snapdragon performance, fast charging, clean feel for daily power users.', rating: 4.5, reviews: 892 },
  { name: 'Nothing Phone (2)', price: 44999, cat: 'Smartphone', img: 'https://images.unsplash.com/photo-1617802808078-0b7fc4c5e20c?auto=format&fit=crop&w=1000&q=80', desc: 'Signature Glyph design, smooth OLED, premium build, clean UI with great battery life.', rating: 4.4, reviews: 640 },
  { name: 'Xiaomi 14 Ultra', price: 99999, cat: 'Smartphone', img: 'https://images.unsplash.com/photo-1592899677974-e1e479a935fa?auto=format&fit=crop&w=1000&q=80', desc: 'Pro camera system, bright LTPO display, flagship performance for creators and gamers.', rating: 4.6, reviews: 418 },
  { name: 'iPhone 15 Pro', price: 134900, cat: 'Smartphone', img: 'https://images.unsplash.com/photo-1696446702178-9e0e9c4e55f7?auto=format&fit=crop&w=1000&q=80', desc: 'A17 Pro chip, titanium design, advanced camera system, Action Button.', rating: 4.8, reviews: 1234 },
  { name: 'Samsung Galaxy Z Fold 5', price: 154999, cat: 'Smartphone', img: 'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=1000&q=80', desc: 'Foldable design, big display, multitasking powerhouse, premium build.', rating: 4.5, reviews: 678 },
  { name: 'Realme GT 6', price: 40999, cat: 'Smartphone', img: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1000&q=80', desc: 'Fast performance, smooth AMOLED, reliable camera for daily use, quick charging.', rating: 4.5, reviews: 734 },
  // â”€â”€â”€ Gaming PC Gears â”€â”€â”€
  { name: 'NVIDIA RTX 4090 Founders Edition', price: 164999, cat: 'Gaming PC Gears', img: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80', desc: 'Ultimate gaming graphics card with 24GB GDDR6X memory, ray tracing, DLSS 3.', rating: 4.9, reviews: 1567 },
  { name: 'Intel Core i9-14900K', price: 59999, cat: 'Gaming PC Gears', img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80', desc: '24-core processor with up to 6.0 GHz boost clock, perfect for gaming and creation.', rating: 4.8, reviews: 892 },
  { name: 'AMD Ryzen 7 7800X3D', price: 38999, cat: 'Gaming PC Gears', img: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=1000&q=80', desc: 'Best-in-class gaming CPU with 3D V-Cache, smooth 1% lows, efficient performance.', rating: 4.9, reviews: 1443 },
  { name: 'Corsair 32GB DDR5 6000MHz Kit', price: 11999, cat: 'Gaming PC Gears', img: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=1000&q=80', desc: 'High-speed DDR5 memory for esports and creation, stable XMP profiles, premium heatsink.', rating: 4.7, reviews: 768 },
  { name: 'Samsung 990 Pro 2TB NVMe SSD', price: 15999, cat: 'Gaming PC Gears', img: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=1000&q=80', desc: 'Blazing fast PCIe 4.0 storage with top-tier endurance and consistent real-world speeds.', rating: 4.8, reviews: 932 },
  { name: 'AMD Ryzen 9 7950X3D', price: 69999, cat: 'Gaming PC Gears', img: 'https://images.unsplash.com/photo-1612810436541-336b3d0f7657?auto=format&fit=crop&w=1000&q=80', desc: 'Top-tier CPU for gaming and creation with 3D V-Cache for strong performance.', rating: 4.7, reviews: 654 },
  { name: 'NVIDIA RTX 4080 Super', price: 104999, cat: 'Gaming PC Gears', img: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80', desc: 'High-end graphics card with excellent 1440p/4K performance and modern features.', rating: 4.6, reviews: 445 },
  // â”€â”€â”€ Laptops â”€â”€â”€
  { name: 'MacBook Pro 16 M3 Max', price: 299999, cat: 'Laptop', img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80', desc: '16-inch Liquid Retina XDR, M3 Max chip, 32GB RAM, 1TB SSD', rating: 4.9, reviews: 234 },
  { name: 'ASUS ROG Strix G15 Gaming Laptop', price: 89999, cat: 'Laptop', img: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80', desc: '15.6-inch 144Hz, RTX 4060, Ryzen 7, 16GB RAM, 512GB SSD', rating: 4.7, reviews: 567 },
  { name: 'HP Pavilion 14 (OLED)', price: 74999, cat: 'Laptop', img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1000&q=80', desc: 'Compact OLED laptop for study and work: sharp visuals, solid battery, comfortable keyboard.', rating: 4.4, reviews: 412 },
  { name: 'Lenovo IdeaPad Slim 5', price: 64999, cat: 'Laptop', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80', desc: 'Lightweight daily laptop with fast SSD, crisp display, and strong multitasking performance.', rating: 4.5, reviews: 980 },
  { name: 'Dell XPS 13 Plus', price: 149999, cat: 'Laptop', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80', desc: 'Premium ultrabook with edge-to-edge design, sharp display, and a top-tier trackpad feel.', rating: 4.6, reviews: 520 },
  { name: 'MacBook Air 15-inch (M3)', price: 134900, cat: 'Laptop', img: 'https://images.unsplash.com/photo-1609429019995-8c40f49535a5?auto=format&fit=crop&w=1000&q=80', desc: 'Thin and light laptop with excellent battery life and smooth performance for everyday work.', rating: 4.8, reviews: 567 },
  { name: 'Lenovo ThinkPad X1 Carbon', price: 159999, cat: 'Laptop', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80', desc: 'Business-grade premium laptop with great keyboard, durability, and reliable performance.', rating: 4.8, reviews: 98 },
  // â”€â”€â”€ Men's Fashion â”€â”€â”€
  { name: 'Nike Air Force 1 Low White', price: 8999, cat: "Men's Fashion", img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80', desc: 'Iconic Nike sneakers with premium leather, Air-Sole cushioning, classic white colorway.', rating: 4.8, reviews: 3421 },
  { name: "Levi's 501 Original Fit Jeans", price: 4499, cat: "Men's Fashion", img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=80', desc: "Classic straight-leg jeans with button fly, authentic Levi's quality, timeless denim.", rating: 4.7, reviews: 2156 },
  { name: 'Adidas Ultraboost 22 Running Shoes', price: 14999, cat: "Men's Fashion", img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80', desc: 'Premium running shoes with Boost cushioning, Primeknit upper, energy return technology.', rating: 4.9, reviews: 1876 },
  { name: 'Tommy Hilfiger Slim Fit Polo', price: 2999, cat: "Men's Fashion", img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80', desc: 'Classic polo shirt with signature flag logo, premium cotton piquÃ©, modern slim fit.', rating: 4.5, reviews: 892 },
  { name: 'Puma Essentials Hoodie', price: 2499, cat: "Men's Fashion", img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80', desc: 'Comfortable cotton-blend hoodie with Puma Cat logo, kangaroo pocket, ribbed cuffs.', rating: 4.6, reviews: 1234 },
  { name: 'Reebok Classic Leather Sneakers', price: 5999, cat: "Men's Fashion", img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80', desc: 'Retro-inspired sneakers with soft leather upper, EVA midsole, timeless design.', rating: 4.4, reviews: 756 },
  // â”€â”€â”€ Women's Fashion â”€â”€â”€
  { name: 'Zara Floral Print Midi Dress', price: 3999, cat: "Women's Fashion", img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80', desc: 'Elegant floral midi dress with V-neckline, flowing silhouette, perfect for occasions.', rating: 4.6, reviews: 1245 },
  { name: 'Fabindia Cotton Kurta Set', price: 2999, cat: "Women's Fashion", img: 'https://images.unsplash.com/photo-1585653757176-b06730171fd0?auto=format&fit=crop&w=1000&q=80', desc: 'Traditional cotton kurta with palazzo pants, ethnic prints, comfortable festive wear.', rating: 4.7, reviews: 892 },
  { name: 'Michael Kors Jet Set Tote Bag', price: 18999, cat: "Women's Fashion", img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80', desc: 'Luxury leather tote with signature MK logo, spacious interior, gold-tone hardware.', rating: 4.8, reviews: 567 },
  { name: 'Swarovski Crystal Stud Earrings', price: 4999, cat: "Women's Fashion", img: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1000&q=80', desc: 'Elegant crystal earrings with rhodium plating, brilliant sparkle, timeless design.', rating: 4.9, reviews: 1876 },
  { name: 'H&M Conscious Collection Top', price: 1499, cat: "Women's Fashion", img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80', desc: 'Sustainable fashion top made from organic cotton, modern fit, eco-friendly.', rating: 4.4, reviews: 623 },
  { name: 'Forever 21 Sequin Party Dress', price: 2999, cat: "Women's Fashion", img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80', desc: 'Glamorous sequin dress perfect for parties, bodycon fit, eye-catching shimmer.', rating: 4.5, reviews: 445 },
  // â”€â”€â”€ Gaming Console â”€â”€â”€
  { name: 'Xbox Series S', price: 34999, cat: 'Gaming Console', img: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=1000&q=80', desc: 'Compact design, 1440p gaming, 512GB SSD, Game Pass ready.', rating: 4.6, reviews: 567 },
  { name: 'PlayStation 5 Slim', price: 54999, cat: 'Gaming Console', img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1000&q=80', desc: 'Next-gen performance, fast loading, immersive haptics. Compact design with premium finish.', rating: 4.8, reviews: 2045 },
  { name: 'Nintendo Switch OLED', price: 33999, cat: 'Gaming Console', img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80', desc: 'Vibrant OLED screen, portable play, great exclusives. Dock and play on TV instantly.', rating: 4.7, reviews: 1780 },
  // â”€â”€â”€ Television â”€â”€â”€
  { name: 'Samsung 65 QLED 4K Smart TV', price: 89999, cat: 'Television', img: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=1000&q=80', desc: 'Quantum dot technology, HDR10+, smart features, voice control.', rating: 4.8, reviews: 245 },
  { name: 'Sony 55 Bravia 4K HDR TV', price: 75999, cat: 'Television', img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=80', desc: 'Cinematic color, smooth motion, and strong upscaling. Ideal for movies and console gaming.', rating: 4.7, reviews: 890 },
  { name: 'Mi 43 4K Android TV', price: 26999, cat: 'Television', img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80', desc: 'Budget 4K smart TV with smooth streaming apps, crisp panel, and easy casting support.', rating: 4.4, reviews: 1320 },
  // â”€â”€â”€ PC Accessories â”€â”€â”€
  { name: 'Logitech MX Master 3S Wireless Mouse', price: 8999, cat: 'PC Accessories', img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80', desc: 'Ergonomic wireless mouse with MagSpeed scrolling, 8K DPI sensor, multi-device support.', rating: 4.8, reviews: 2341 },
  { name: 'Razer BlackWidow V4 Pro Mechanical Keyboard', price: 18999, cat: 'PC Accessories', img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80', desc: 'Premium mechanical keyboard with Razer Green switches, RGB Chroma, command dial.', rating: 4.9, reviews: 1876 },
  { name: 'Logitech C920 HD Pro Webcam', price: 6999, cat: 'PC Accessories', img: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=1000&q=80', desc: '1080p Full HD webcam with autofocus, dual stereo mics, perfect for streaming.', rating: 4.7, reviews: 3456 },
  { name: 'Anker PowerExpand 8-in-1 USB-C Hub', price: 4999, cat: 'PC Accessories', img: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1000&q=80', desc: 'Premium USB-C hub with HDMI 4K, USB 3.0, SD/microSD, 100W Power Delivery.', rating: 4.6, reviews: 1234 },
  // â”€â”€â”€ Gadgets â”€â”€â”€
  { name: 'Apple Watch Series 9 GPS', price: 41900, cat: 'Gadgets', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80', desc: 'Advanced health tracking, always-on Retina display, crash detection, water resistant.', rating: 4.9, reviews: 4567 },
  { name: 'Apple AirPods Pro (2nd Gen)', price: 24900, cat: 'Gadgets', img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80', desc: 'Active Noise Cancellation, Adaptive Transparency, spatial audio, MagSafe charging.', rating: 4.8, reviews: 5678 },
  { name: 'Anker PowerCore 20000mAh Power Bank', price: 3999, cat: 'Gadgets', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=80', desc: 'High-capacity portable charger with PowerIQ, dual USB ports, fast charging support.', rating: 4.7, reviews: 3456 },
  { name: 'Amazon Echo Dot (5th Gen)', price: 4999, cat: 'Gadgets', img: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=80', desc: 'Smart speaker with Alexa, improved audio, temperature sensor, smart home control.', rating: 4.6, reviews: 6789 },
  // â”€â”€â”€ Glasses â”€â”€â”€
  { name: 'Ray-Ban Aviator Classic Gold', price: 12999, cat: 'Glasses', img: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1000&q=80', desc: 'Iconic aviator sunglasses with gold frame, green G-15 lenses, 100% UV protection.', rating: 4.8, reviews: 3456 },
  { name: 'Oakley Holbrook Polarized Sunglasses', price: 14999, cat: 'Glasses', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80', desc: 'Sport-inspired design with Prizm polarized lenses, durable O Matter frame.', rating: 4.7, reviews: 2134 },
  { name: 'Warby Parker Blue Light Glasses', price: 4999, cat: 'Glasses', img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80', desc: 'Stylish frames with blue light filtering lenses, reduces eye strain from screens.', rating: 4.6, reviews: 1876 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('âœ” Connected to MongoDB\n');

    // Clear
    await Category.deleteMany({});
    await Product.deleteMany({});
    const existingSeller = await User.findOne({ role: 'SELLER' });

    // Create demo seller (if not exists)
    let seller = existingSeller;
    if (!seller) {
      seller = await User.create({
        email: 'seller@nexcart.in',
        password: 'seller123',
        name: 'NexCart Official',
        role: 'SELLER',
        storeName: 'NexCart Store',
        storeDescription: 'Official NexCart marketplace seller with premium products.',
        verificationStatus: 'APPROVED',
      });
      console.log(`   âœ” Created seller: ${seller.email}`);
    } else {
      console.log(`   âœ” Using existing seller: ${seller.email}`);
    }

    // Create categories
    const categoryMap = {};
    for (const cat of CATEGORIES) {
      const created = await Category.create(cat);
      categoryMap[cat.name] = created._id;
    }
    console.log(`   âœ” Created ${CATEGORIES.length} categories`);

    // Create products
    let count = 0;
    for (const p of PRODUCTS) {
      const categoryId = categoryMap[p.cat];
      if (!categoryId) {
        console.warn(`   âš  Skipping "${p.name}" â€” category "${p.cat}" not found`);
        continue;
      }
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const comparePrice = Math.round(p.price * (1 + Math.random() * 0.3));
      await Product.create({
        name: p.name,
        slug: `${slug}-${count}`,
        description: p.desc,
        price: p.price,
        comparePrice,
        sku: `PK-${String(count + 1).padStart(4, '0')}`,
        quantity: Math.floor(Math.random() * 50) + 10,
        images: [p.img],
        status: 'ACTIVE',
        featured: count < 8,
        tags: [p.cat.toLowerCase()],
        categoryId,
        sellerId: seller._id,
        averageRating: p.rating || 4.5,
        reviewCount: p.reviews || 0,
      });
      count++;
    }
    console.log(`   âœ” Created ${count} products\n`);
    console.log('âœ… Database seeded successfully!\n');

    // Print summary
    PRODUCTS.slice(0, 10).forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} (â‚¹${p.price.toLocaleString('en-IN')})`);
    });
    if (PRODUCTS.length > 10) console.log(`   ... and ${PRODUCTS.length - 10} more products`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('âœ˜ Seed failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
