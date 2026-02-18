'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

const CAL_URL =
  'https://cal.com/victor-lenain-ejsjfb/echange-decouverte?theme=dark&layout=month_view';

type CalPopupButtonProps = {
  children: ReactNode;
  className?: string;
  'data-umami-event'?: string;
};

export default function CalPopupButton({
  children,
  className,
  ...rest
}: CalPopupButtonProps) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, close]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      <button
        {...rest}
        className={className}
        type="button"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-label="Réserver un échange découverte"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            exit={{ opacity: 0 }}
            initial={reduced ? false : { opacity: 0 }}
            role="dialog"
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={close}
            />

            {/* Modal container */}
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 h-[min(90vh,680px)] w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900 shadow-2xl shadow-black/50"
              exit={{ scale: 0.95, opacity: 0 }}
              initial={reduced ? false : { scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Close button */}
              <button
                aria-label="Fermer"
                className="absolute right-3 top-3 z-20 rounded-full bg-gray-800/80 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                type="button"
                onClick={close}
              >
                <X aria-hidden className="h-5 w-5" />
              </button>

              {/* Cal.com iframe */}
              <iframe
                ref={iframeRef}
                className="h-full w-full border-0"
                src={CAL_URL}
                title="Réserver un échange découverte — Cal.com"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
