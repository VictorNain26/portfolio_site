import Link from 'next/link';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const socials = [
  { href: 'https://github.com/victornain26', icon: FaGithub, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/victor-lenain/', icon: FaLinkedin, label: 'LinkedIn' },
  {
    href: 'https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous',
    icon: FaWhatsapp,
    label: 'WhatsApp',
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0e082e]/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-8 lg:px-20">
        {/* Left — copyright & legal */}
        <div className="flex flex-col items-center gap-1 text-xs text-gray-500 sm:items-start">
          <span>&copy; {new Date().getFullYear()} Victor Lenain. Tous droits réservés.</span>
          <span>SIRET : 93253488400015 &middot; Paris, France</span>
        </div>

        {/* Center — links */}
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <Link className="transition-colors hover:text-gray-300" href="/blog">
            Blog
          </Link>
          <a
            className="transition-colors hover:text-gray-300"
            href="mailto:victor.lenain26@gmail.com"
          >
            Contact
          </a>
        </div>

        {/* Right — socials */}
        <div className="flex items-center gap-3">
          {socials.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              aria-label={label}
              className="rounded-full p-2 text-gray-600 transition-colors hover:bg-white/[0.06] hover:text-gray-400"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
