import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type SheetSide = 'right' | 'left';

export default function Sheet({
  open,
  onOpenChange,
  title,
  description,
  side = 'right',
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  side?: SheetSide;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) onOpenChange(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });

    requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>('button, a, input, select, textarea, [tabindex]')?.focus();
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [onOpenChange, open]);

  if (!open) return null;

  const sideClasses = side === 'left' ? 'left-0 border-r' : 'right-0 border-l';

  return (
    <div role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
      <div
        ref={panelRef}
        className={cn(
          'fixed top-0 z-50 h-dvh w-[92%] max-w-md bg-background/85 shadow-2xl backdrop-blur',
          sideClasses,
          'pk-glass p-0'
        )}
      >
        <div className="sticky top-0 z-10 border-b bg-background/70 px-4 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-base font-semibold leading-tight">{title}</div>
              {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
            </div>
            <button
              type="button"
              className="pk-btn pk-btn-outline h-9 w-9"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="h-[calc(100dvh-92px)] overflow-auto px-4 pb-6 pt-4">{children}</div>
      </div>
    </div>
  );
}
