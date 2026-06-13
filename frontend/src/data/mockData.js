/**
 * mockData.js — Local product data
 *
 * These products are used as immediate fallback when the API is unavailable
 * (e.g., MongoDB not running). They use the same shape as the API response,
 * so the UI works identically whether data comes from the API or here.
 */

export const MOCK_PRODUCTS = [
  {
    _id: 'mock_001',
    name: 'Apple iPhone 15 Pro Max',
    description:
      'Experience the pinnacle of smartphone technology with the iPhone 15 Pro Max. Featuring the A17 Pro chip, a stunning 6.7" Super Retina XDR ProMotion display, a revolutionary titanium design, and an advanced 48MP camera system with 5x optical zoom.',
    price: 134900,
    originalPrice: 159900,
    imageUrl:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Electronics',
    brand: 'Apple',
    countInStock: 45,
    rating: 4.9,
    numReviews: 1284,
    isFeatured: true,
    tags: ['5G', 'titanium', 'ProMotion', 'USB-C'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock_002',
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Samsung Galaxy S24 Ultra redefines mobile productivity. Featuring the built-in S Pen, a 200MP advanced camera, 6.8" Dynamic AMOLED 2X display with 120Hz, Snapdragon 8 Gen 3 processor, and 5,000mAh battery with Galaxy AI features.',
    price: 129999,
    originalPrice: 144999,
    imageUrl:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Electronics',
    brand: 'Samsung',
    countInStock: 32,
    rating: 4.8,
    numReviews: 976,
    isFeatured: true,
    tags: ['S Pen', 'Galaxy AI', '200MP'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock_003',
    name: 'Sony WH-1000XM5 Headphones',
    description:
      'Industry-leading noise cancellation meets stunning audio quality. 8 microphones for unmatched ANC, 30-hour battery life, multipoint connection to two devices, and crystal-clear hands-free calling. The best noise-cancelling headphones money can buy.',
    price: 24990,
    originalPrice: 34990,
    imageUrl:
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Electronics',
    brand: 'Sony',
    countInStock: 78,
    rating: 4.7,
    numReviews: 2341,
    isFeatured: false,
    tags: ['ANC', 'wireless', 'Bluetooth 5.2', '30hr'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock_004',
    name: 'Apple MacBook Pro 14" M3 Pro',
    description:
      'The MacBook Pro 14" with M3 Pro chip delivers groundbreaking performance. Features an 11-core CPU, 14-core GPU, Liquid Retina XDR display with ProMotion, and up to 18 hours of battery life. Built for those who push the limits.',
    price: 199900,
    originalPrice: 219900,
    imageUrl:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Electronics',
    brand: 'Apple',
    countInStock: 18,
    rating: 5.0,
    numReviews: 641,
    isFeatured: true,
    tags: ['M3 Pro', 'Liquid Retina XDR', '18hr battery'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock_005',
    name: 'Nike Air Jordan 1 Retro High OG',
    description:
      'A timeless icon reimagined. The Air Jordan 1 Retro High OG blends heritage basketball aesthetics with modern craftsmanship. Premium full-grain leather upper, Nike Air cushioning, and a perforated toe box for ultimate style and comfort.',
    price: 17995,
    originalPrice: 19995,
    imageUrl:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Fashion',
    brand: 'Nike',
    countInStock: 120,
    rating: 4.8,
    numReviews: 3210,
    isFeatured: true,
    tags: ['Air Jordan', 'retro', 'high-top', 'leather'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock_006',
    name: "Levi's 511 Slim Fit Jeans",
    description:
      "The Levi's 511 Slim is cut close to the body for a modern, tailored look without restricting movement. Made with Flex material that moves with you, these jeans offer all-day comfort in a signature slim silhouette.",
    price: 3299,
    originalPrice: 4999,
    imageUrl:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Fashion',
    brand: "Levi's",
    countInStock: 200,
    rating: 4.5,
    numReviews: 1870,
    isFeatured: false,
    tags: ['slim fit', 'denim', 'flex'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock_007',
    name: 'Dyson V15 Detect Cordless Vacuum',
    description:
      'The Dyson V15 Detect uses a laser to reveal microscopic dust invisible to the naked eye. Intelligent suction auto-adjusts, while an LCD screen shows real-time particle count. 60-minute fade-free power from the most powerful cordless motor.',
    price: 49900,
    originalPrice: 59900,
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Home & Living',
    brand: 'Dyson',
    countInStock: 24,
    rating: 4.6,
    numReviews: 892,
    isFeatured: true,
    tags: ['laser detect', 'cordless', '60 min', 'HEPA'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock_008',
    name: 'Scitec Whey Protein 2.35kg',
    description:
      'Premium quality whey protein delivering 22g of protein per serving. Ideal for post-workout recovery and muscle building. Available in Chocolate Hazelnut flavour. Mixes instantly, no clumping — 76 servings per tub.',
    price: 3499,
    originalPrice: 4999,
    imageUrl:
      'https://images.unsplash.com/photo-1579722820252-76ab6a857219?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1579722820252-76ab6a857219?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Sports',
    brand: 'Scitec Nutrition',
    countInStock: 150,
    rating: 4.4,
    numReviews: 2678,
    isFeatured: false,
    tags: ['whey', 'protein', 'recovery', 'supplement'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock_009',
    name: 'Adidas Ultraboost 23 Running Shoes',
    description:
      'Experience the energy return of BOOST cushioning with the responsive feel of a Continental rubber outsole. The Primeknit upper wraps your foot perfectly, adapting to every stride. Made partly with recycled materials.',
    price: 15999,
    originalPrice: 18999,
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Sports',
    brand: 'Adidas',
    countInStock: 85,
    rating: 4.6,
    numReviews: 1542,
    isFeatured: false,
    tags: ['BOOST', 'Primeknit', 'running', 'recycled'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock_010',
    name: 'boAt Airdopes 141 TWS Earbuds',
    description:
      'boAt Airdopes 141 offers up to 42 hours of total playback with its 500mAh charging case. IPX4 water resistance, BEAST Mode for low latency gaming, and instant wake & pair technology make it the best value TWS in India.',
    price: 1299,
    originalPrice: 2999,
    imageUrl:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Electronics',
    brand: 'boAt',
    countInStock: 300,
    rating: 4.3,
    numReviews: 8921,
    isFeatured: false,
    tags: ['TWS', 'IPX4', 'BEAST Mode', '42hr'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock_011',
    name: 'Puma Men\'s Tracksuit',
    description:
      'Stay comfortable and stylish with this Puma tracksuit. Features moisture-wicking DryCell technology, elastic waistband with drawcord, and zippered side pockets. Perfect for workouts, casual wear, and everything in between.',
    price: 2999,
    originalPrice: 4499,
    imageUrl:
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Fashion',
    brand: 'Puma',
    countInStock: 95,
    rating: 4.3,
    numReviews: 743,
    isFeatured: false,
    tags: ['DryCell', 'tracksuit', 'sportswear'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock_012',
    name: 'IKEA LACK Side Table',
    description:
      'Versatile and lightweight side table in classic white. Simple, clean design fits into any room and can also be used as a coffee table. The hollow construction makes it light and easy to move around.',
    price: 1299,
    originalPrice: 1799,
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    ],
    category: 'Home & Living',
    brand: 'IKEA',
    countInStock: 60,
    rating: 4.2,
    numReviews: 2140,
    isFeatured: false,
    tags: ['table', 'furniture', 'minimalist'],
    createdAt: new Date().toISOString(),
  },
];

export default MOCK_PRODUCTS;
