import type { Category, Product } from '../types/product';

export const categoryImages: Record<Category, string> = {
  Smartphone:
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=2080&q=80',
  'Gaming PC Gears':
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=2042&q=80',
  Laptop:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=2071&q=80',
  "Men's Fashion":
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=2070&q=80',
  "Women's Fashion":
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=2088&q=80',
  'Gaming Console':
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=2070&q=80',
  Television:
    'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=2070&q=80',
  'PC Accessories':
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=2067&q=80',
  Gadgets:
    'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=2021&q=80',
  Glasses:
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=2080&q=80',
};

export const categories = Object.keys(categoryImages) as Category[];

const baseProducts: Product[] = [
  {
    id: 11,
    name: 'iPhone 15 Pro Max',
    price: 159900.99,
    category: 'Smartphone',
    image:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
    description:
      '6.7-inch Super Retina XDR display with ProMotion technology, A17 Pro chip, titanium design.',
    rating: 4.8,
    reviews: 2156,
    inStock: true,
  },
  {
    id: 12,
    name: 'Samsung Galaxy S24 Ultra',
    price: 124999.99,
    category: 'Smartphone',
    image:
      'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?auto=format&fit=crop&w=1000&q=80',
    description: '6.8-inch Dynamic AMOLED display, S Pen included, 200MP camera, AI features.',
    rating: 4.7,
    reviews: 1834,
    inStock: true,
  },
  {
    id: 13,
    name: 'Google Pixel 8 Pro',
    price: 106999.99,
    category: 'Smartphone',
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
    description: '6.7-inch LTPO OLED display, Google Tensor G3 chip, advanced AI photography.',
    rating: 4.6,
    reviews: 1245,
    inStock: true,
  },
  {
    id: 301,
    name: 'OnePlus 12R 5G',
    price: 39999.99,
    category: 'Smartphone',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
    description: '120Hz AMOLED, Snapdragon performance, fast charging, clean feel for daily power users.',
    rating: 4.5,
    reviews: 892,
    inStock: true,
  },
  {
    id: 302,
    name: 'Nothing Phone (2)',
    price: 44999.99,
    category: 'Smartphone',
    image:
      'https://images.unsplash.com/photo-1674763973792-761fc5e3b0d7?auto=format&fit=crop&w=1000&q=80',
    description: 'Signature Glyph design, smooth OLED, premium build, clean UI with great battery life.',
    rating: 4.4,
    reviews: 640,
    inStock: true,
  },
  {
    id: 303,
    name: 'Xiaomi 14 Ultra',
    price: 99999.99,
    category: 'Smartphone',
    image:
      'https://images.unsplash.com/photo-1623998022290-a74f8cc36563?auto=format&fit=crop&w=1000&q=80',
    description: 'Pro camera system, bright LTPO display, flagship performance for creators and gamers.',
    rating: 4.6,
    reviews: 418,
    inStock: true,
  },
  {
    id: 328,
    name: 'iPhone 15 Pro',
    price: 134900.0,
    category: 'Smartphone',
    image:
      'https://images.unsplash.com/photo-1696446702178-9e0e9c4e55f7?auto=format&fit=crop&w=1000&q=80',
    description: 'A17 Pro chip, titanium design, advanced camera system, Action Button.',
    rating: 4.8,
    reviews: 1234,
    inStock: true,
  },
  {
    id: 329,
    name: 'Samsung Galaxy Z Fold 5',
    price: 154999.99,
    category: 'Smartphone',
    image:
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1000&q=80',
    description: 'Foldable design, big display, multitasking powerhouse, premium build.',
    rating: 4.5,
    reviews: 678,
    inStock: true,
  },
  {
    id: 330,
    name: 'Realme GT 6',
    price: 40999.99,
    category: 'Smartphone',
    image:
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=1000&q=80',
    description: 'Fast performance, smooth AMOLED, reliable camera for daily use, quick charging.',
    rating: 4.5,
    reviews: 734,
    inStock: true,
  },

  {
    id: 14,
    name: 'NVIDIA RTX 4090 Founders Edition',
    price: 164999.99,
    category: 'Gaming PC Gears',
    image:
      'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80',
    description: 'Ultimate gaming graphics card with 24GB GDDR6X memory, ray tracing, DLSS 3.',
    rating: 4.9,
    reviews: 1567,
    inStock: true,
  },
  {
    id: 15,
    name: 'Intel Core i9-14900K',
    price: 59999.99,
    category: 'Gaming PC Gears',
    image:
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80',
    description: '24-core processor with up to 6.0 GHz boost clock, perfect for gaming and creation.',
    rating: 4.8,
    reviews: 892,
    inStock: true,
  },
  {
    id: 304,
    name: 'AMD Ryzen 7 7800X3D',
    price: 38999.99,
    category: 'Gaming PC Gears',
    image:
      'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=1000&q=80',
    description: 'Best-in-class gaming CPU with 3D V-Cache, smooth 1% lows, efficient performance.',
    rating: 4.9,
    reviews: 1443,
    inStock: true,
  },
  {
    id: 305,
    name: 'Corsair 32GB DDR5 6000MHz Kit',
    price: 11999.99,
    category: 'Gaming PC Gears',
    image:
      'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=1000&q=80',
    description: 'High-speed DDR5 memory for esports and creation, stable XMP profiles, premium heatsink.',
    rating: 4.7,
    reviews: 768,
    inStock: true,
  },
  {
    id: 306,
    name: 'Samsung 990 Pro 2TB NVMe SSD',
    price: 15999.99,
    category: 'Gaming PC Gears',
    image:
      'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=1000&q=80',
    description: 'Blazing fast PCIe 4.0 storage with top-tier endurance and consistent real-world speeds.',
    rating: 4.8,
    reviews: 932,
    inStock: true,
  },
  {
    id: 331,
    name: 'AMD Ryzen 9 7950X3D',
    price: 69999.99,
    category: 'Gaming PC Gears',
    image:
      'https://images.unsplash.com/photo-1612810436541-336b3d0f7657?auto=format&fit=crop&w=1000&q=80',
    description: 'Top-tier CPU for gaming and creation with 3D V-Cache for strong performance.',
    rating: 4.7,
    reviews: 654,
    inStock: true,
  },
  {
    id: 332,
    name: 'NVIDIA RTX 4080 Super',
    price: 104999.99,
    category: 'Gaming PC Gears',
    image:
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80',
    description: 'High-end graphics card with excellent 1440p/4K performance and modern features.',
    rating: 4.6,
    reviews: 445,
    inStock: true,
  },

  {
    id: 24,
    name: 'MacBook Pro 16 M3 Max',
    price: 299999.99,
    category: 'Laptop',
    image:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
    description: '16-inch Liquid Retina XDR, M3 Max chip, 32GB RAM, 1TB SSD',
    rating: 4.9,
    reviews: 234,
    inStock: true,
  },
  {
    id: 25,
    name: 'ASUS ROG Strix G15 Gaming Laptop',
    price: 89999.99,
    category: 'Laptop',
    image:
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80',
    description: '15.6-inch 144Hz, RTX 4060, Ryzen 7, 16GB RAM, 512GB SSD',
    rating: 4.7,
    reviews: 567,
    inStock: true,
  },
  {
    id: 307,
    name: 'HP Pavilion 14 (OLED)',
    price: 74999.99,
    category: 'Laptop',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    description: 'Compact OLED laptop for study and work: sharp visuals, solid battery, comfortable keyboard.',
    rating: 4.4,
    reviews: 412,
    inStock: true,
  },
  {
    id: 308,
    name: 'Lenovo IdeaPad Slim 5',
    price: 64999.99,
    category: 'Laptop',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80',
    description: 'Lightweight daily laptop with fast SSD, crisp display, and strong multitasking performance.',
    rating: 4.5,
    reviews: 980,
    inStock: true,
  },
  {
    id: 309,
    name: 'Dell XPS 13 Plus',
    price: 149999.99,
    category: 'Laptop',
    image:
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
    description: 'Premium ultrabook with edge-to-edge design, sharp display, and a top-tier trackpad feel.',
    rating: 4.6,
    reviews: 520,
    inStock: true,
  },
  {
    id: 333,
    name: 'MacBook Air 15-inch (M3)',
    price: 134900.0,
    category: 'Laptop',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    description: 'Thin and light laptop with excellent battery life and smooth performance for everyday work.',
    rating: 4.8,
    reviews: 567,
    inStock: true,
  },
  {
    id: 334,
    name: 'Lenovo ThinkPad X1 Carbon',
    price: 159999.99,
    category: 'Laptop',
    image:
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
    description: 'Business-grade premium laptop with great keyboard, durability, and reliable performance.',
    rating: 4.8,
    reviews: 98,
    inStock: true,
  },

  {
    id: 34,
    name: 'Nike Air Force 1 Low White',
    price: 8999.99,
    category: "Men's Fashion",
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80',
    description: 'Iconic Nike sneakers with premium leather, Air-Sole cushioning, classic white colorway.',
    rating: 4.8,
    reviews: 3421,
    inStock: true,
  },
  {
    id: 310,
    name: "Levi's 501 Original Fit Jeans",
    price: 4499.99,
    category: "Men's Fashion",
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=80',
    description: 'Classic straight-leg jeans with button fly, authentic Levi\'s quality, timeless denim.',
    rating: 4.7,
    reviews: 2156,
    inStock: true,
  },
  {
    id: 311,
    name: 'Adidas Ultraboost 22 Running Shoes',
    price: 14999.99,
    category: "Men's Fashion",
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    description: 'Premium running shoes with Boost cushioning, Primeknit upper, energy return technology.',
    rating: 4.9,
    reviews: 1876,
    inStock: true,
  },
  {
    id: 312,
    name: 'Tommy Hilfiger Slim Fit Polo',
    price: 2999.99,
    category: "Men's Fashion",
    image:
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80',
    description: 'Classic polo shirt with signature flag logo, premium cotton piqué, modern slim fit.',
    rating: 4.5,
    reviews: 892,
    inStock: true,
  },
  {
    id: 335,
    name: 'Puma Essentials Hoodie',
    price: 2499.99,
    category: "Men's Fashion",
    image:
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
    description: 'Comfortable cotton-blend hoodie with Puma Cat logo, kangaroo pocket, ribbed cuffs.',
    rating: 4.6,
    reviews: 1234,
    inStock: true,
  },
  {
    id: 336,
    name: 'Reebok Classic Leather Sneakers',
    price: 5999.99,
    category: "Men's Fashion",
    image:
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1000&q=80',
    description: 'Retro-inspired sneakers with soft leather upper, EVA midsole, timeless design.',
    rating: 4.4,
    reviews: 756,
    inStock: true,
  },
  {
    id: 68,
    name: 'Zara Floral Print Midi Dress',
    price: 3999.99,
    category: "Women's Fashion",
    image:
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80',
    description: 'Elegant floral midi dress with V-neckline, flowing silhouette, perfect for occasions.',
    rating: 4.6,
    reviews: 1245,
    inStock: true,
  },
  {
    id: 313,
    name: 'Fabindia Cotton Kurta Set',
    price: 2999.99,
    category: "Women's Fashion",
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    description: 'Traditional cotton kurta with palazzo pants, ethnic prints, comfortable festive wear.',
    rating: 4.7,
    reviews: 892,
    inStock: true,
  },
  {
    id: 314,
    name: 'Michael Kors Jet Set Tote Bag',
    price: 18999.99,
    category: "Women's Fashion",
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
    description: 'Luxury leather tote with signature MK logo, spacious interior, gold-tone hardware.',
    rating: 4.8,
    reviews: 567,
    inStock: true,
  },
  {
    id: 315,
    name: 'Swarovski Crystal Stud Earrings',
    price: 4999.99,
    category: "Women's Fashion",
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
    description: 'Elegant crystal earrings with rhodium plating, brilliant sparkle, timeless design.',
    rating: 4.9,
    reviews: 1876,
    inStock: true,
  },
  {
    id: 337,
    name: 'H&M Conscious Collection Top',
    price: 1499.99,
    category: "Women's Fashion",
    image:
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=80',
    description: 'Sustainable fashion top made from organic cotton, modern fit, eco-friendly.',
    rating: 4.4,
    reviews: 623,
    inStock: true,
  },
  {
    id: 338,
    name: 'Forever 21 Sequin Party Dress',
    price: 2999.99,
    category: "Women's Fashion",
    image:
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
    description: 'Glamorous sequin dress perfect for parties, bodycon fit, eye-catching shimmer.',
    rating: 4.5,
    reviews: 445,
    inStock: true,
  },

  {
    id: 230,
    name: 'Xbox Series S',
    price: 34999.99,
    category: 'Gaming Console',
    image:
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=1000&q=80',
    description: 'Compact design, 1440p gaming, 512GB SSD, Game Pass ready.',
    rating: 4.6,
    reviews: 567,
    inStock: true,
  },
  {
    id: 316,
    name: 'PlayStation 5 Slim',
    price: 54999.99,
    category: 'Gaming Console',
    image:
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1000&q=80',
    description: 'Next-gen performance, fast loading, immersive haptics. Compact design with premium finish.',
    rating: 4.8,
    reviews: 2045,
    inStock: true,
  },
  {
    id: 317,
    name: 'Nintendo Switch OLED',
    price: 33999.99,
    category: 'Gaming Console',
    image:
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80',
    description: 'Vibrant OLED screen, portable play, great exclusives. Dock and play on TV instantly.',
    rating: 4.7,
    reviews: 1780,
    inStock: true,
  },

  {
    id: 76,
    name: 'Samsung 65 QLED 4K Smart TV',
    price: 89999.99,
    category: 'Television',
    image:
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=1000&q=80',
    description: 'Quantum dot technology, HDR10+, smart features, voice control.',
    rating: 4.8,
    reviews: 245,
    inStock: true,
  },
  {
    id: 318,
    name: 'Sony 55 Bravia 4K HDR TV',
    price: 75999.99,
    category: 'Television',
    image:
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=80',
    description: 'Cinematic color, smooth motion, and strong upscaling. Ideal for movies and console gaming.',
    rating: 4.7,
    reviews: 890,
    inStock: true,
  },
  {
    id: 319,
    name: 'Mi 43 4K Android TV',
    price: 26999.99,
    category: 'Television',
    image:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80',
    description: 'Budget 4K smart TV with smooth streaming apps, crisp panel, and easy casting support.',
    rating: 4.4,
    reviews: 1320,
    inStock: true,
  },

  {
    id: 64,
    name: 'Logitech MX Master 3S Wireless Mouse',
    price: 8999.99,
    category: 'PC Accessories',
    image:
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
    description: 'Ergonomic wireless mouse with MagSpeed scrolling, 8K DPI sensor, multi-device support.',
    rating: 4.8,
    reviews: 2341,
    inStock: true,
  },
  {
    id: 320,
    name: 'Razer BlackWidow V4 Pro Mechanical Keyboard',
    price: 18999.99,
    category: 'PC Accessories',
    image:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80',
    description: 'Premium mechanical keyboard with Razer Green switches, RGB Chroma, command dial.',
    rating: 4.9,
    reviews: 1876,
    inStock: true,
  },
  {
    id: 321,
    name: 'Logitech C920 HD Pro Webcam',
    price: 6999.99,
    category: 'PC Accessories',
    image:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1000&q=80',
    description: '1080p Full HD webcam with autofocus, dual stereo mics, perfect for streaming.',
    rating: 4.7,
    reviews: 3456,
    inStock: true,
  },
  {
    id: 322,
    name: 'Anker PowerExpand 8-in-1 USB-C Hub',
    price: 4999.99,
    category: 'PC Accessories',
    image:
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=1000&q=80',
    description: 'Premium USB-C hub with HDMI 4K, USB 3.0, SD/microSD, 100W Power Delivery.',
    rating: 4.6,
    reviews: 1234,
    inStock: true,
  },

  {
    id: 90,
    name: 'Apple Watch Series 9 GPS',
    price: 41900.99,
    category: 'Gadgets',
    image:
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80',
    description: 'Advanced health tracking, always-on Retina display, crash detection, water resistant.',
    rating: 4.9,
    reviews: 4567,
    inStock: true,
  },
  {
    id: 323,
    name: 'Apple AirPods Pro (2nd Gen)',
    price: 24900.99,
    category: 'Gadgets',
    image:
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80',
    description: 'Active Noise Cancellation, Adaptive Transparency, spatial audio, MagSafe charging.',
    rating: 4.8,
    reviews: 5678,
    inStock: true,
  },
  {
    id: 324,
    name: 'Anker PowerCore 20000mAh Power Bank',
    price: 3999.99,
    category: 'Gadgets',
    image:
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=80',
    description: 'High-capacity portable charger with PowerIQ, dual USB ports, fast charging support.',
    rating: 4.7,
    reviews: 3456,
    inStock: true,
  },
  {
    id: 325,
    name: 'Amazon Echo Dot (5th Gen)',
    price: 4999.99,
    category: 'Gadgets',
    image:
      'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=80',
    description: 'Smart speaker with Alexa, improved audio, temperature sensor, smart home control.',
    rating: 4.6,
    reviews: 6789,
    inStock: true,
  },

  {
    id: 43,
    name: 'Ray-Ban Aviator Classic Gold',
    price: 12999.99,
    category: 'Glasses',
    image:
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1000&q=80',
    description: 'Iconic aviator sunglasses with gold frame, green G-15 lenses, 100% UV protection.',
    rating: 4.8,
    reviews: 3456,
    inStock: true,
  },
  {
    id: 326,
    name: 'Oakley Holbrook Polarized Sunglasses',
    price: 14999.99,
    category: 'Glasses',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
    description: 'Sport-inspired design with Prizm polarized lenses, durable O Matter frame.',
    rating: 4.7,
    reviews: 2134,
    inStock: true,
  },
  {
    id: 327,
    name: 'Warby Parker Blue Light Glasses',
    price: 4999.99,
    category: 'Glasses',
    image:
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80',
    description: 'Stylish frames with blue light filtering lenses, reduces eye strain from screens.',
    rating: 4.6,
    reviews: 1876,
    inStock: true,
  },
];

const dedupeCuratedImages = (products: Product[]): Product[] => {
  const used = new Map<Category, Set<string>>();
  return products.map((p) => {
    const bucket = used.get(p.category) ?? new Set<string>();
    used.set(p.category, bucket);

    const img = p.image?.trim() || '';
    if (!img || bucket.has(img)) {
      const next = pickImageFor(p.category, p.id, bucket);
      bucket.add(next);
      return { ...p, image: next };
    }

    bucket.add(img);
    return p;
  });
};

const categoryImagePool: Record<Category, string[]> = {
  Smartphone: [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1510557880182-3b39d8afbc41?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520166012956-add9ba0835cb?auto=format&fit=crop&w=1200&q=80',
  ],
  'Gaming PC Gears': [
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587202372775-e6a36f82f7f8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1612810436541-336b3d0f7657?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  ],
  Laptop: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
  ],
  "Men's Fashion": [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520975958225-9d2cce5501bd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520975693411-bf58780d45ea?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80',
  ],
  "Women's Fashion": [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520975682031-ae40b4f4f1ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520975745909-91e88f10f1bd?auto=format&fit=crop&w=1200&q=80',
  ],
  'Gaming Console': [
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1606144042614-28f8e1a1f3a9?auto=format&fit=crop&w=1200&q=80',
  ],
  Television: [
    'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520092352425-9699926a9d33?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601944179066-aca3d9a4d6a1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80',
  ],
  'PC Accessories': [
    'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
  ],
  Gadgets: [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576243345690-4e4b79b63227?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518443895471-1c417f7c44b3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517420879524-86d64ac2f339?auto=format&fit=crop&w=1200&q=80',
  ],
  Glasses: [
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520975867597-0f0b0f5c2f2e?auto=format&fit=crop&w=1200&q=80',
  ],
};

const pickImageFor = (category: Category, seed: number, used?: Set<string>) => {
  const pool = categoryImagePool[category];
  if (!pool || pool.length === 0) return categoryImages[category];

  const start = Math.abs(seed) % pool.length;
  for (let step = 0; step < pool.length; step++) {
    const candidate = pool[(start + step) % pool.length];
    if (!used || !used.has(candidate)) return candidate;
  }
  return categoryImages[category];
};

const categoryNamePool: Record<string, string[]> = {
  Smartphone: ['5G', 'Pro', 'Ultra', 'Plus', 'Max'],
  'Gaming PC Gears': ['Pro', 'Elite', 'RGB', 'X', 'Super', 'XT'],
  Laptop: ['Air', 'Pro', 'Plus', 'Slim', 'Ultra', 'Creator'],
  "Men's Fashion": ['Classic', 'Premium', 'Street', 'Essential', 'Signature', 'Everyday'],
  "Women's Fashion": ['Elegant', 'Festive', 'Premium', 'Classic', 'Chic', 'Everyday'],
  'Gaming Console': ['Digital', 'Slim', 'Pro', 'Bundle', 'Edition'],
  Television: ['4K', 'QLED', 'OLED', 'HDR', 'Smart'],
  'PC Accessories': ['Wireless', 'Mechanical', 'Ergonomic', 'Pro', 'USB-C', 'RGB'],
  Gadgets: ['Smart', 'Pro', 'Mini', 'Max', 'Lite'],
  Glasses: ['Classic', 'Round', 'Aviator', 'Blue Light', 'Premium'],
};

const categoryProductNamePool: Record<Category, string[]> = {
  Smartphone: [
    'Google Pixel 8',
    'Samsung Galaxy A55',
    'OnePlus Nord',
    'Xiaomi Redmi Note',
    'Motorola Edge',
    'Nothing Phone',
    'iQOO Neo',
    'Realme Narzo',
  ],
  'Gaming PC Gears': [
    'NVIDIA GeForce RTX',
    'AMD Ryzen',
    'Intel Core',
    'Corsair Vengeance',
    'Samsung NVMe SSD',
    'Logitech Pro',
  ],
  Laptop: ['ASUS ZenBook', 'Lenovo ThinkPad', 'Dell Inspiron', 'HP Pavilion', 'Acer Swift', 'MSI Creator'],
  "Men's Fashion": ['Cotton Shirt', 'Denim Jacket', 'Leather Sneakers', 'Casual Hoodie', 'Chinos', 'Polo T-Shirt'],
  "Women's Fashion": ['Silk Saree', 'Kurti Set', 'Handbag', 'Earrings', 'Designer Saree', 'Georgette Saree'],
  'Gaming Console': ['PlayStation', 'Xbox', 'Nintendo Switch'],
  Television: ['Sony Bravia', 'Samsung QLED', 'LG OLED', 'Mi Android TV'],
  'PC Accessories': ['Mechanical Keyboard', 'Wireless Mouse', '1080p Webcam', 'USB-C Hub', 'Gaming Headset'],
  Gadgets: ['Noise Cancelling Earbuds', 'Smart Speaker', 'Fitness Band', 'Power Bank', 'Smartwatch'],
  Glasses: ['Blue Light Glasses', 'Aviator Sunglasses', 'Round Frame Sunglasses', 'Wayfarer Sunglasses'],
};

const categoryPriceRange: Record<string, { min: number; max: number }> = {
  Smartphone: { min: 14999, max: 169999 },
  'Gaming PC Gears': { min: 2999, max: 189999 },
  Laptop: { min: 34999, max: 299999 },
  "Men's Fashion": { min: 499, max: 8999 },
  "Women's Fashion": { min: 699, max: 18999 },
  'Gaming Console': { min: 19999, max: 69999 },
  Television: { min: 19999, max: 149999 },
  'PC Accessories': { min: 499, max: 14999 },
  Gadgets: { min: 999, max: 189999 },
  Glasses: { min: 499, max: 9999 },
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const buildGeneratedProducts = (targetPerCategory: number): Product[] => {
  const counts: Record<string, number> = {};
  const curated = dedupeCuratedImages(baseProducts);
  for (const p of curated) counts[p.category] = (counts[p.category] ?? 0) + 1;

  const categories = Object.keys(categoryImages) as Category[];
  const maxId = baseProducts.reduce((acc, p) => Math.max(acc, p.id), 0);
  let nextId = Math.max(1000, maxId + 1);

  const out: Product[] = [];
  for (const category of categories) {
    const current = counts[category] ?? 0;
    const needed = Math.max(0, targetPerCategory - current);
    const images = categoryImagePool[category] ?? [];
    const usedImages = new Set<string>(curated.filter((p) => p.category === category).map((p) => p.image));
    const names = categoryNamePool[category] ?? ['Pro'];
    const baseNames = categoryProductNamePool[category] ?? [category];
    const range = categoryPriceRange[category] ?? { min: 999, max: 99999 };

    for (let i = 0; i < needed; i++) {
      const baseName = baseNames[(current + i) % baseNames.length];
      const suffix = names[(current + i) % names.length];
      const poolPick = images[(current + i) % Math.max(1, images.length)] ?? '';
      const img =
        poolPick && !usedImages.has(poolPick)
          ? poolPick
          : pickImageFor(category, nextId + i, usedImages);
      usedImages.add(img);

      const rawPrice = range.min + ((range.max - range.min) * ((current + i + 3) % 19)) / 18;
      const price = Math.round(rawPrice / 10) * 10 + 0.99;
      const rating = clamp(4.1 + (((current + i) % 9) / 10), 4.1, 4.9);
      const reviews = 60 + (((current + i + 7) * 73) % 5200);

      out.push({
        id: nextId++,
        name: `${baseName} ${suffix}`,
        price,
        category,
        image: img,
        description: `Top value pick in ${category}. Great quality, strong ratings, and reliable performance.`,
        rating,
        reviews,
        inStock: true,
      });
    }
  }
  return out;
};

export const mockProducts: Product[] = [...dedupeCuratedImages(baseProducts), ...buildGeneratedProducts(12)];
