'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { getScrollBehavior } from '@/lib/utils';

export default function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  /* ----------- Observer / Listener ----------- */
  useEffect(() => {
    const canScroll = () =>
      document.documentElement.scrollHeight > document.documentElement.clientHeight;

    const hero = document.getElementById('accueil');

    if (hero && pathname === '/') {
      const io = new IntersectionObserver(([e]) => {
        setVisible(canScroll() && !e?.isIntersecting);
      });
      io.observe(hero);
      return () => {
        io.disconnect();
      };
    }

    const SCROLL_THRESHOLD = 120;
    const onScroll = () => {
      setVisible(canScroll() && window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  /* ----------- Handler « remonter » ----------- */
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: getScrollBehavior() });
  };

  /* ----------- Render ----------- */
  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          animate={{ y: 0, opacity: 1 }}
          aria-label="Revenir en haut de page"
          className="fixed right-4 bottom-[calc(2.5rem+env(safe-area-inset-bottom))] z-40 flex h-11 w-11 items-center justify-center rounded-full bg-brand/90 text-white shadow-lg ring-1 ring-black/10 hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none xs:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:right-8 lg:right-16"
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
