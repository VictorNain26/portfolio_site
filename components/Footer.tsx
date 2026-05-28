import Link from 'next/link';
import {
  GitHubIcon,
  LinkedInIcon,
  WhatsAppIcon,
  MaltIcon,
} from '@/components/icons/SocialIcons';

const socials = [
  { href: 'https://github.com/VictorNain26', Icon: GitHubIcon, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/victorlenain/', Icon: LinkedInIcon, label: 'LinkedIn' },
  { href: 'https://www.malt.fr/profile/victorlenain', Icon: MaltIcon, label: 'Malt' },
  {
    href: 'https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous',
    Icon: WhatsAppIcon,
    label: 'WhatsApp',
  },
];

const navLinks = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#services', label: 'Services' },
  { href: '#projets', label: 'Projets' },
  { href: '/blog', label: 'Blog', isRoute: true },
  { href: '#contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-line-2 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-20">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500"
          >
            {navLinks.map(({ href, label, isRoute }) =>
              isRoute === true ? (
                <Link key={label} className="transition-colors hover:text-gray-300" href={href}>
                  {label}
                </Link>
              ) : (
                <a key={label} className="transition-colors hover:text-gray-300" href={href}>
                  {label}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                aria-label={label}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-surface-4 hover:text-gray-300"
                href={href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="my-8 h-px bg-surface-4" />

        <div className="flex flex-col items-center gap-2 text-center text-xs text-gray-600 sm:flex-row sm:justify-between sm:text-left">
          <span>&copy; {new Date().getFullYear().toString()} Victor Lenain</span>
          <span>SIRET 937 817 914 00016 &middot; Ivry-sur-Seine, France</span>
        </div>
      </div>
    </footer>
  );
}
