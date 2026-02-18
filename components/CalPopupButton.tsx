'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { getCalApi } from '@calcom/embed-react';

const CAL_LINK = 'victor-lenain-ejsjfb/echange-decouverte';
const CAL_NAMESPACE = 'discovery';

const CAL_CONFIG = JSON.stringify({
  theme: 'dark',
  layout: 'month_view',
});

/**
 * CSS injected into the cal-modal-box shadow DOM to fix the white background.
 * The .message-container inside the shadow root has bg white even with .dark class.
 */
const SHADOW_FIX_CSS = `
  .message-container, .message-container.dark {
    background: #111827 !important;
    color-scheme: dark !important;
  }
  .my-backdrop {
    background: rgba(0, 0, 0, 0.8) !important;
  }
  .body.dark {
    background: transparent !important;
    color-scheme: dark !important;
  }
  .modal-box {
    color-scheme: dark !important;
  }
`;

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

    // Observe DOM for cal-modal-box insertion, then patch its shadow DOM
    const observer = new MutationObserver(() => {
      const modalBox = document.querySelector('cal-modal-box');
      if (modalBox?.shadowRoot) {
        const existing = modalBox.shadowRoot.querySelector('#cal-dark-fix');
        if (!existing) {
          const style = document.createElement('style');
          style.id = 'cal-dark-fix';
          style.textContent = SHADOW_FIX_CSS;
          modalBox.shadowRoot.appendChild(style);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

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
      observer.disconnect();
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
