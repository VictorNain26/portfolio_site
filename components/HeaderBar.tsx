'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GithubIcon,
  Linkedin,
  Mail,
  Home,
  Newspaper,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { SocialIconButton } from '@/components/ui/social-icon-button';

const socials = [
  {
    href: 'https://github.com/victornain26',
    icon: GithubIcon,
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/victor-lenain-1907b7282/',
    icon: Linkedin,
    label: 'LinkedIn',
  },
  {
    href: 'https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous',
    icon: FaWhatsapp,
    label: 'WhatsApp',
  },
  {
    href: 'mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission',
    icon: Mail,
    label: 'Mail',
  },
];

export default function HeaderBar() {
  const pathname = usePathname();
  const onBlog = pathname?.startsWith('/blog');

  /* Affichage : fixe sur /blog, sinon après scroll */
  const [show, setShow] = useState(onBlog);

  useEffect(() => {
    if (onBlog) {
      setShow(true);
      return;
    }
    const hero = document.getElementById('accueil');
    if (!hero) {
      return;
    }
    const io = new IntersectionObserver(([e]) => setShow(!e?.isIntersecting), {
      threshold: 0,
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [onBlog]);

  const navLink = onBlog
    ? { href: '/', icon: Home, label: 'Accueil' }
    : { href: '/blog', icon: Newspaper, label: 'Blog' };

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.header
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -32, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-x-0 top-0 z-50 bg-transparent px-4 py-1 text-white ring-1 ring-white/10 backdrop-blur-md sm:px-8 sm:py-1.5 lg:px-20 lg:py-2 xl:px-28 2xl:px-36"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            {/* Logo ---------------------------------------------------------------- */}
            {onBlog ? (
              <Link href="/" aria-label="Retour à l'accueil">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={38}
                  height={38}
                  priority
                  className="select-none transition-opacity hover:opacity-80"
                />
              </Link>
            ) : (
              <Image
                src="/logo.png"
                alt="Logo"
                width={38}
                height={38}
                priority
                className="select-none"
              />
            )}

            {/* Réseaux sociaux ------------------------------------------------------ */}
            <nav className="ms-auto flex items-center gap-1.5 sm:gap-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <SocialIconButton
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    href.startsWith('http') ? 'noopener noreferrer' : undefined
                  }
                  size="sm"
                >
                  <Icon />
                </SocialIconButton>
              ))}
            </nav>

            {/* Bouton Accueil / Blog : icône seule */}
            <Link
              href={navLink.href}
              aria-label={navLink.label}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-2 shadow-lg transition-transform hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <navLink.icon className="h-4 w-4 text-white" />
            </Link>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
