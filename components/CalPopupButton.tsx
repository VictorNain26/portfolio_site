'use client';

import { useEffect, type ReactNode } from 'react';
import { getCalApi } from '@calcom/embed-react';

const CAL_LINK = 'victor-lenain-ejsjfb/echange-decouverte';
const CAL_NAMESPACE = 'discovery';

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
  useEffect(() => {
    void (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal('ui', {
        theme: 'dark',
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <button
      className={className}
      data-cal-link={CAL_LINK}
      data-cal-namespace={CAL_NAMESPACE}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
}
