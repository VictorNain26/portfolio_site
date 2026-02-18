'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { getCalApi } from '@calcom/embed-react';

const CAL_LINK = 'victor-lenain-ejsjfb/echange-decouverte';
const CAL_NAMESPACE = 'discovery';

const CAL_CONFIG = JSON.stringify({
  theme: 'dark',
  layout: 'month_view',
});

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
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    // Fix: the browser gives iframes an opaque white background when the
    // parent page uses color-scheme:dark and the iframe doesn't match.
    const style = document.createElement('style');
    style.textContent = `
      [data-cal-namespace="${CAL_NAMESPACE}"] iframe {
        color-scheme: dark !important;
      }
      .cal-modal-overlay, [class*="cal-modal"] {
        background: rgba(0, 0, 0, 0.7) !important;
      }
    `;
    document.head.appendChild(style);

    void (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal('preload', { calLink: CAL_LINK });
      cal('ui', {
        theme: 'dark',
        hideEventTypeDetails: false,
        layout: 'month_view',
        styles: {
          branding: { brandColor: '#4f46e5' },
        },
        cssVarsPerTheme: {
          light: {},
          dark: {
            'cal-bg': '#111827',
            'cal-bg-emphasis': '#1f2937',
            'cal-text': '#f3f4f6',
            'cal-text-emphasis': '#ffffff',
            'cal-text-muted': '#9ca3af',
            'cal-border': '#374151',
            'cal-border-default': '#374151',
            'cal-border-subtle': '#1f2937',
            'cal-border-emphasis': '#4b5563',
            'cal-border-booker': '#374151',
            'cal-text-error': '#ef4444',
            'cal-brand': '#4f46e5',
          },
        },
      });
    })();

    return () => {
      document.head.removeChild(style);
      initialised.current = false;
    };
  }, []);

  return (
    <button
      {...rest}
      className={className}
      data-cal-config={CAL_CONFIG}
      data-cal-link={CAL_LINK}
      data-cal-namespace={CAL_NAMESPACE}
      type="button"
    >
      {children}
    </button>
  );
}
