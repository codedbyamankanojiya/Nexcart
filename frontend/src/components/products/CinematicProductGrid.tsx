import { useMemo } from 'react';
import type { Product } from '../../lib/products';
import ProductCard from './ProductCard';
import { cn } from '../../lib/utils';
import { motion, type Variants } from 'framer-motion';

interface CinematicProductGridProps {
  products: Product[];
  className?: string;
  stagger?: boolean;
  limit?: number;
}

export default function CinematicProductGrid({ products, className, stagger = true, limit }: CinematicProductGridProps) {
  const items = useMemo(() => (limit ? products.slice(0, limit) : products), [products, limit]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger ? 0.08 : 0,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 300,
      },
    },
  };

  return (
    <motion.div
      className={cn('pk-product-grid', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
