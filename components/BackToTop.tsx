'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  /* ----------- Observer / Listener ----------- */
  useEffect(() => {
    const viewport = document.getElementById('scroll-viewport');
    if (!viewport) {
      return;
    }

    const hero = document.getElementById('accueil');

    const canScroll = () => viewport.scrollHeight > viewport.clientHeight;

    let cleanup = () => {
      // Cleanup function for event listeners
    };

    if (hero && pathname === '/') {
      const io = new IntersectionObserver(
        ([e]) => {
          setVisible(canScroll() && !e?.isIntersecting);
        },
        {
          root: viewport,
        },
      );
      io.observe(hero);
      cleanup = () => {
        io.disconnect();
      };
    } else {
      const SCROLL_THRESHOLD = 120;
      const onScroll = () => {
        setVisible(canScroll() && viewport.scrollTop > SCROLL_THRESHOLD);
      };
      viewport.addEventListener('scroll', onScroll, { passive: true });
      viewport.addEventListener('resize', onScroll);
      onScroll();
      cleanup = () => {
        viewport.removeEventListener('scroll', onScroll);
        viewport.removeEventListener('resize', onScroll);
      };
    }

    return cleanup;
  }, [pathname]);

  /* ----------- Handler « remonter » ----------- */
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();

    const hero = document.getElementById('accueil');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const viewport = document.getElementById('scroll-viewport');
    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ----------- Render ----------- */
  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          animate={{ y: 0, opacity: 1 }}
          aria-label="Revenir en haut de page"
          className="xs:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] fixed right-4 bottom-[calc(2.5rem+env(safe-area-inset-bottom))] z-40 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600/90 text-white shadow-lg ring-1 ring-black/10 hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none sm:right-8 lg:right-16"
          exit={{ y: 32, opacity: 0 }}
          href="#accueil"
          initial={{ y: 32, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={scrollToTop}
        >
          <ChevronUp aria-hidden className="h-5 w-5" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
