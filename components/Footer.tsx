import Link from 'next/link';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const socials = [
  { href: 'https://github.com/VictorNain26', icon: FaGithub, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/victor-lenain/', icon: FaLinkedin, label: 'LinkedIn' },
  {
    href: 'https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous',
    icon: FaWhatsapp,
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
    <footer className="border-t border-white/[0.06] bg-[#0e082e]/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-20">
        {/* Top row — nav + socials */}
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          {/* Nav links */}
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            {navLinks.map(({ href, label, isRoute }) =>
              isRoute ? (
                <Link
                  key={label}
                  className="transition-colors hover:text-gray-300"
                  href={href}
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  className="transition-colors hover:text-gray-300"
                  href={href}
                >
                  {label}
                </a>
              ),
            )}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-2">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                aria-label={label}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
                href={href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="my-8 h-px bg-white/[0.06]" />

        {/* Bottom row — legal */}
        <div className="flex flex-col items-center gap-2 text-center text-xs text-gray-600 sm:flex-row sm:justify-between sm:text-left">
          <span>&copy; {new Date().getFullYear()} Victor Lenain</span>
          <span>SIRET 937 817 914 00016 &middot; Ivry-sur-Seine, France</span>
        </div>
      </div>
    </footer>
  );
}
