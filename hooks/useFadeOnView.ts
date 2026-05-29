'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element with a CSS fade-up when it enters the viewport.
 * Replaces the repeated Framer Motion `fadeUp` pattern with a lighter
 * IntersectionObserver-based approach. Honors `prefers-reduced-motion`
 * (handled in CSS).
 *
 * Observes against the document viewport (native scroll).
 */
export function useFadeOnView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.05,
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}
