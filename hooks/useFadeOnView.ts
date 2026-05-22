'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element with a CSS fade-up when it enters the scroll viewport.
 * Replaces the repeated Framer Motion `fadeUp` pattern with a lighter
 * IntersectionObserver-based approach. Honors `prefers-reduced-motion`
 * (handled in CSS).
 *
 * Bound to `#scroll-viewport` (the Radix ScrollArea viewport used by the
 * layout). Falls back to the document viewport if missing.
 */
export function useFadeOnView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const root =
      (document.getElementById('scroll-viewport') as Element | null) ?? null;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      {
        root,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.05,
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}
