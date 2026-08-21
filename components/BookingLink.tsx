import Link from 'next/link';
import { type ReactNode } from 'react';

import { BOOKING_PATH } from '@/lib/cal';

type BookingLinkProps = {
  children: ReactNode;
  className?: string;
  'data-umami-event'?: string;
};

/** CTA de réservation : mène à la page /reserver, qui porte le Booker inline. */
export default function BookingLink({ children, className, ...rest }: BookingLinkProps) {
  return (
    <Link {...rest} className={className} href={BOOKING_PATH}>
      {children}
    </Link>
  );
}
