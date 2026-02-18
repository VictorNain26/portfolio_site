import { type ReactNode } from 'react';

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
  return (
    <a
      {...rest}
      className={className}
      href={CAL_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
