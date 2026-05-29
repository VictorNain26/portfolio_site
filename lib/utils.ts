import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the scroll behavior to use for programmatic scrolling, honoring the
 * user's `prefers-reduced-motion` setting.
 *
 * The JS scroll APIs (`scrollTo`, `scrollIntoView`) ignore the CSS
 * `scroll-behavior` property, so the reduced-motion rule in `globals.css` does
 * not apply to them. Without this check, users who prefer reduced motion would
 * still get animated scrolling. Falls back to `'smooth'` on the server / when
 * `matchMedia` is unavailable.
 */
export function getScrollBehavior(): ScrollBehavior {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'smooth';
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}
