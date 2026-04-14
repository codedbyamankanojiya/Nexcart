import { useEffect, useRef, useState } from 'react';

// Curated cinematic product images — tech + fashion
const BG_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2400&q=75',
    tag: 'Tech & Laptops',
    accent: '217 92% 56%',
  },
  {
    url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=2400&q=75',
    tag: 'Premium Smartphones',
    accent: '168 76% 42%',
  },
  {
    url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=2400&q=75',
    tag: 'Gaming Consoles',
    accent: '270 70% 60%',
  },
  {
    url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=2400&q=75',
    tag: "Men's Fashion",
    accent: '22 92% 58%',
  },
  {
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=2400&q=75',
    tag: "Women's Fashion",
    accent: '320 70% 60%',
  },
  {
    url: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=2400&q=75',
    tag: 'Gaming PC Gears',
    accent: '195 90% 48%',
  },
];

interface CinematicBgProps {
  className?: string;
  overlay?: 'dark' | 'medium' | 'light';
  interval?: number;
  pause?: boolean;
}

export function CinematicBg({
  className = '',
  overlay = 'dark',
  interval = 6000,
  pause = false,
}: CinematicBgProps) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preloadedRef = useRef<Set<string>>(new Set());

  // Preload next images for instant transitions
  useEffect(() => {
    BG_SLIDES.forEach((slide) => {
      if (!preloadedRef.current.has(slide.url)) {
        const img = new Image();
        img.src = slide.url;
        preloadedRef.current.add(slide.url);
      }
    });
  }, []);

  useEffect(() => {
    if (pause) return;
    timerRef.current = setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(next);
        setNext((next + 1) % BG_SLIDES.length);
        setTransitioning(false);
      }, 1200);
    }, interval);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, next, interval, pause]);

  const overlayClass = {
    dark: 'pk-cinematic-overlay-dark',
    medium: 'pk-cinematic-overlay-medium',
    light: 'pk-cinematic-overlay-light',
  }[overlay];

  return (
    <div className={`pk-cinematic-root ${className}`}>
      {/* Current Slide */}
      <div
        key={`slide-${current}`}
        className="pk-cinematic-slide pk-cinematic-ken-burns"
        style={{ backgroundImage: `url(${BG_SLIDES[current].url})` }}
      />

      {/* Next Slide (cross-fade) */}
      <div
        key={`slide-next-${next}`}
        className={`pk-cinematic-slide pk-cinematic-next ${transitioning ? 'pk-cinematic-revealing' : ''}`}
        style={{ backgroundImage: `url(${BG_SLIDES[next].url})` }}
      />

      {/* Overlay */}
      <div className={`pk-cinematic-overlay ${overlayClass}`} />

      {/* Vignette */}
      <div className="pk-cinematic-vignette" />

      {/* Slide Indicator */}
      <div className="pk-cinematic-dots">
        {BG_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              setNext(i);
              setTransitioning(true);
              setTimeout(() => {
                setCurrent(i);
                setNext((i + 1) % BG_SLIDES.length);
                setTransitioning(false);
              }, 1200);
            }}
            className={`pk-cinematic-dot ${current === i ? 'pk-cinematic-dot-active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
