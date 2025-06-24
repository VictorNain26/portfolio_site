"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function BlogFloatingButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const viewport = document.getElementById("scroll-viewport");
    const hero = document.getElementById("accueil");
    if (!viewport || !hero) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const onHome = pathname === "/";
        setVisible(onHome && entry.isIntersecting);
      },
      { root: viewport }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -32, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="
            fixed z-40
            left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 lg:left-16
            bottom-[calc(1.25rem+env(safe-area-inset-bottom))]
          "
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            ↳ Blog
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
