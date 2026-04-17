import { useMemo } from 'react';
import type { Product } from '../../lib/products';
import { cn } from '../../lib/utils';

type CinematicCategory = 'electronics' | 'fashion' | 'home' | 'books' | 'default';

function normalizeCategory(input: unknown): CinematicCategory {
  const raw = String(
    typeof input === 'object' && input && 'name' in (input as any)
      ? (input as any).name
      : input ?? ''
  ).toLowerCase();

  if (/(smartphone|laptop|gaming|pc|console|television|tv|gadgets|accessories|glasses)/.test(raw)) return 'electronics';
  if (/(fashion|men|women|shirt|saree|kurti|handbag|hoodie|sneakers)/.test(raw)) return 'fashion';
  if (/(home|furniture|kitchen|decor|lifestyle)/.test(raw)) return 'home';
  if (/(book|books|novel|reading)/.test(raw)) return 'books';
  return 'default';
}

const themeClassByCategory: Record<CinematicCategory, string> = {
  electronics: 'pk-cine-theme-electronics',
  fashion: 'pk-cine-theme-fashion',
  home: 'pk-cine-theme-home',
  books: 'pk-cine-theme-books',
  default: 'pk-cine-theme-default',
};

interface CinematicProductBackgroundProps {
  product?: Pick<Product, 'category' | 'image'> & { images?: string[] };
  category?: unknown;
  className?: string;
}

export default function CinematicProductBackground({ product, category, className }: CinematicProductBackgroundProps) {
  const cat = normalizeCategory(category ?? product?.category);

  const poster = useMemo(() => {
    const img = product?.images?.[0] || (product as any)?.image;
    return typeof img === 'string' && img.length ? img : null;
  }, [product]);

  return (
    <div className={cn('fixed inset-0 -z-10 overflow-hidden', themeClassByCategory[cat], className)} aria-hidden="true">
      <div className="absolute inset-0 pk-cine-bg" />
      {poster && <div className="absolute inset-0 pk-cine-poster" style={{ backgroundImage: `url(${poster})` }} />}
      <div className="absolute inset-0 pk-cine-overlay" />
      <div className="absolute inset-0 pk-cine-vignette" />
      <div className="absolute inset-0 pk-cine-grain" />
      <div className="pk-cine-particles" />
    </div>
  );
}
