import type { Product } from '../types/product';
import type { ProductDetailsData, ProductQuestion, ProductReview, ProductSpec } from '../types/productDetails';

const brandColorByCategory: Record<Product['category'], string> = {
  Smartphone: 'bg-sky-500',
  'Gaming PC Gears': 'bg-violet-500',
  Laptop: 'bg-indigo-500',
  "Men's Fashion": 'bg-amber-500',
  "Women's Fashion": 'bg-pink-500',
  'Gaming Console': 'bg-emerald-500',
  Television: 'bg-cyan-500',
  'PC Accessories': 'bg-teal-500',
  Gadgets: 'bg-lime-500',
  Glasses: 'bg-rose-500',
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function seededInt(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function makeImages(base: string, seed: number) {
  const widths = [1200, 1200, 1200, 1200];
  return widths.map((w, idx) => {
    try {
      const u = new URL(base);
      u.searchParams.set('w', String(w));
      u.searchParams.set('q', '80');
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      u.searchParams.set('sig', String(seed + idx * 7));
      return u.toString();
    } catch {
      return base;
    }
  });
}

function makeSpecs(product: Product): ProductSpec[] {
  const cat = product.category;
  const common: ProductSpec[] = [
    { label: 'Brand', value: 'PopKart Select' },
    { label: 'Model', value: `${product.name}` },
    { label: 'Category', value: cat },
    { label: 'In the box', value: 'Main unit, documentation' },
  ];

  if (cat === 'Smartphone') {
    return [
      ...common,
      { label: 'Display', value: '6.7-inch OLED, 120Hz' },
      { label: 'Chipset', value: 'Flagship-grade performance' },
      { label: 'Rear camera', value: '48MP + Ultra-wide' },
      { label: 'Battery', value: '5000mAh (typical)' },
      { label: 'Charging', value: 'Fast charging supported' },
      { label: 'Connectivity', value: '5G, Wi‑Fi 6, Bluetooth 5.3' },
    ];
  }

  if (cat === 'Laptop') {
    return [
      ...common,
      { label: 'Processor', value: 'Intel/AMD class, high efficiency' },
      { label: 'RAM', value: '16GB' },
      { label: 'Storage', value: '512GB SSD' },
      { label: 'Display', value: '15.6-inch FHD' },
      { label: 'Battery life', value: 'Up to 10 hours' },
      { label: 'Weight', value: '1.6 kg (approx.)' },
    ];
  }

  if (cat === 'Television') {
    return [
      ...common,
      { label: 'Screen size', value: '55-inch' },
      { label: 'Resolution', value: '4K Ultra HD' },
      { label: 'Panel', value: 'LED' },
      { label: 'HDR', value: 'HDR10 supported' },
      { label: 'Audio', value: 'Dolby-ready speakers' },
      { label: 'Ports', value: '3x HDMI, 2x USB' },
    ];
  }

  return [
    ...common,
    { label: 'Material', value: 'Premium build' },
    { label: 'Color', value: 'Assorted' },
    { label: 'Care', value: 'Wipe clean with dry cloth' },
  ];
}

function makeHighlights(product: Product): string[] {
  const cat = product.category;
  const base = [
    'Top-rated pick with high customer satisfaction',
    'Quality-checked packaging & safe delivery',
    'Multiple payment options and easy returns',
  ];

  if (cat === 'Smartphone') {
    return ['Super smooth 120Hz display', 'All-day battery + fast charging', 'Pro-grade camera for night shots', ...base];
  }
  if (cat === 'Laptop') {
    return ['Fast multitasking performance', 'Crisp display for work & media', 'Portable and lightweight design', ...base];
  }
  if (cat === 'Gaming Console') {
    return ['Next-gen performance', 'Immersive graphics & sound', 'Optimized controller experience', ...base];
  }
  if (cat === 'Television') {
    return ['4K UHD clarity', 'Vivid colors with HDR support', 'Smart apps and casting ready', ...base];
  }

  return ['Modern, premium design', 'Comfortable for daily use', ...base];
}

function makeReviews(product: Product): ProductReview[] {
  const n = clamp(Math.round(4 + seededInt(product.id) * 6), 4, 10);
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 12);

  const titles = ['Worth the price', 'Amazing quality', 'Good but has minor issues', 'Exceeded expectations', 'Fast delivery'];
  const bodies = [
    'Build quality is excellent. Performance is smooth and it feels premium in hand.',
    'Exactly as described. Packaging was safe and delivery was on time.',
    'Great value overall. I would recommend it to friends and family.',
    'Using it for a week now. Everything works perfectly and battery life is solid.',
    'The product is good, but I wish the accessories were a bit better.',
  ];

  return Array.from({ length: n }).map((_, idx) => {
    const r = clamp(Math.round(product.rating + (seededInt(product.id * 100 + idx) - 0.5) * 1.2), 3, 5);
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - idx * 3);

    return {
      id: `${product.id}-${idx}`,
      userName: ['Aarav', 'Ananya', 'Rohit', 'Priya', 'Karan', 'Sneha'][idx % 6],
      rating: r,
      title: titles[idx % titles.length],
      body: bodies[idx % bodies.length],
      createdAt: d.toISOString().slice(0, 10),
      verifiedPurchase: idx % 2 === 0,
      helpfulCount: Math.round(seededInt(product.id * 77 + idx * 13) * 48),
    };
  });
}

function makeQA(product: Product): ProductQuestion[] {
  const questions = [
    'Is this item compatible with my device?',
    'Does it come with a warranty?',
    'What is the return policy?',
    'Is the color exactly the same as photos?',
  ];

  const answers = [
    'Yes, it works with most standard configurations. Check the specifications section for details.',
    'Yes. Warranty information is listed under Warranty & Support on this page.',
    'Easy returns are available on eligible items within 7 days of delivery.',
    'Minor variations are possible due to lighting and display settings.',
  ];

  const now = new Date();

  return questions.map((q, idx) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (idx + 1) * 8);
    return {
      id: `${product.id}-q-${idx}`,
      question: q,
      answer: answers[idx] ?? answers[0]!,
      answeredBy: ['PopKart Support', 'Seller', 'Verified Buyer'][idx % 3],
      answeredAt: d.toISOString().slice(0, 10),
    };
  });
}

export function getProductDetails(product: Product): ProductDetailsData {
  return {
    productId: product.id,
    images: makeImages(product.image, product.id),
    highlights: makeHighlights(product),
    specs: makeSpecs(product),
    boxContents: ['Main unit', 'User guide', 'Warranty card'],
    warranty: '1-year manufacturer warranty (terms apply).',
    reviews: makeReviews(product),
    qa: makeQA(product),
  };
}

export function getCategoryAccentClass(category: Product['category']) {
  return brandColorByCategory[category] ?? 'bg-primary';
}
