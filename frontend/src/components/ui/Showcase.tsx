import { useEffect, useRef, useState } from 'react';

// Floating product showcase items
const SHOWCASE_PRODUCTS = [
  {
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    name: 'iPhone 15 Pro Max',
    price: '₹1,59,900',
    category: 'Smartphone',
    delay: '0s',
    pos: 'top-8 right-4 lg:right-0',
    size: 'w-36 h-36 lg:w-44 lg:h-44',
    rotate: 'rotate-3',
  },
  {
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=600&q=80',
    name: 'PlayStation 5',
    price: '₹54,999',
    category: 'Gaming Console',
    delay: '1.5s',
    pos: 'top-52 right-28 lg:right-24',
    size: 'w-32 h-32 lg:w-40 lg:h-40',
    rotate: '-rotate-2',
  },
  {
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    name: 'Nike Air Force 1',
    price: '₹8,999',
    category: "Men's Fashion",
    delay: '3s',
    pos: 'top-96 right-8 lg:right-4',
    size: 'w-28 h-28 lg:w-36 lg:h-36',
    rotate: 'rotate-6',
  },
  {
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
    name: 'MacBook Pro M3',
    price: '₹2,99,999',
    category: 'Laptop',
    delay: '0.8s',
    pos: 'bottom-32 right-20 lg:right-16',
    size: 'w-40 h-40 lg:w-48 lg:h-48',
    rotate: '-rotate-3',
  },
  {
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    name: 'Luxury Handbag',
    price: '₹18,999',
    category: "Women's Fashion",
    delay: '2.2s',
    pos: 'bottom-8 right-4 lg:right-2',
    size: 'w-32 h-32 lg:w-38 lg:h-38',
    rotate: 'rotate-1',
  },
];

export function FloatingProducts() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="pk-showcase-container" aria-hidden="true">
      {SHOWCASE_PRODUCTS.map((p, i) => (
        <div
          key={i}
          className={`pk-showcase-card pk-float ${p.pos} ${p.size} ${p.rotate}`}
          style={{ animationDelay: p.delay, animationDuration: `${6 + i * 1.5}s` }}
        >
          <div className="pk-showcase-img-wrap">
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              decoding="async"
              className="pk-showcase-img"
            />
          </div>
          <div className="pk-showcase-info">
            <div className="pk-showcase-category">{p.category}</div>
            <div className="pk-showcase-name">{p.name}</div>
            <div className="pk-showcase-price">{p.price}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Animated scroll-reveal hook
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, revealed };
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
}

export function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }: ScrollRevealProps) {
  const { ref, revealed } = useScrollReveal();

  const dirClass = {
    up: revealed ? 'pk-reveal-up-visible' : 'pk-reveal-up',
    left: revealed ? 'pk-reveal-left-visible' : 'pk-reveal-left',
    right: revealed ? 'pk-reveal-right-visible' : 'pk-reveal-right',
    scale: revealed ? 'pk-reveal-scale-visible' : 'pk-reveal-scale',
  }[direction];

  return (
    <div
      ref={ref}
      className={`${dirClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
