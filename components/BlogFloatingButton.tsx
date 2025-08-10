'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// même icône que le header
import { Newspaper } from 'lucide-react';

export default function BlogFloatingButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const viewport = document.getElementById('scroll-viewport');
    const hero = document.getElementById('accueil');
    if (!viewport || !hero) {
      return;
    }

    /* Visible uniquement sur la Home + quand Hero visible */
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(pathname === '/' && entry?.isIntersecting === true);
      },
      { root: viewport },
    );
    io.observe(hero);
    return () => {
      io.disconnect();
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={{ x: 0, opacity: 1 }}
          className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-4 z-40 sm:left-8 lg:left-16"
          exit={{ x: -32, opacity: 0 }}
          initial={{ x: -32, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Link
            aria-label="Accéder au blog"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
            href="/blog"
          >
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">Blog</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
