'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Menu, X } from 'lucide-react';
import { FaWhatsapp, FaGithub, FaLinkedin } from 'react-icons/fa';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const NAV_SECTIONS = [
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'projets', label: 'Projets' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const;

const socials = [
  { href: 'https://github.com/victornain26', icon: FaGithub, label: 'GitHub' },
  {
    href: 'https://www.linkedin.com/in/victor-lenain/',
    icon: FaLinkedin,
    label: 'LinkedIn',
  },
  {
    href: 'https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous',
    icon: FaWhatsapp,
    label: 'WhatsApp',
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function HeaderBar() {
  const pathname = usePathname();
  const onBlog = pathname.startsWith('/blog');
  const onHomepage = pathname === '/';

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);

  /* Close mobile menu on route change (derived state from props) */
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setMobileMenuOpen(false);
  }

  /* Track active section via scroll listener on #scroll-viewport */
  useEffect(() => {
    if (!onHomepage) return;

    const viewport = document.getElementById('scroll-viewport');
    if (!viewport) return;

    const handleScroll = () => {
      let current: string | null = null;
      const atBottom =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 2;

      if (atBottom) {
        const last = NAV_SECTIONS[NAV_SECTIONS.length - 1];
        if (last) current = last.id;
      } else {
        for (const { id } of NAV_SECTIONS) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 120) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [onHomepage]);

  const scrollToSection = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    },
    [],
  );

  const scrollToTop = useCallback(
    (e: React.MouseEvent) => {
      if (!onHomepage) return;
      e.preventDefault();
      document.getElementById('scroll-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [onHomepage],
  );

  const navLink = onBlog
    ? { href: '/', icon: Home, label: 'Accueil' }
    : { href: '/blog', icon: Newspaper, label: 'Blog' };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0e082e]/70 px-4 text-white backdrop-blur-xl sm:px-8 lg:px-20 xl:px-28 2xl:px-36"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center lg:h-16">
          {/* Logo + branding */}
          <Link
            aria-label="Retour à l'accueil"
            className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
            href="/"
            onClick={scrollToTop}
          >
            <Image
              priority
              alt="Logo"
              className="select-none"
              height={32}
              src="/logo.png"
              width={32}
            />
            <span className="hidden font-display text-sm font-semibold tracking-tight text-white sm:block">
              Victor Lenain
            </span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop section nav — absolute centered in viewport */}
          {onHomepage && (
            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
              {NAV_SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  className="relative rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-white focus:outline-none"
                  href={`#${id}`}
                  onClick={(e) => scrollToSection(e, id)}
                >
                  {activeSection === id && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-white/[0.08]"
                      layoutId="nav-pill"
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.5,
                      }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </a>
              ))}
            </nav>
          )}

          {/* Right group */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Desktop socials */}
            <div className="hidden items-center gap-1 lg:flex">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  aria-label={label}
                  className="rounded-full p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden h-5 w-px bg-white/[0.08] lg:block" />

            {/* Blog / Accueil button */}
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 transition-all hover:bg-indigo-500/20 hover:text-indigo-200 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              href={navLink.href}
            >
              <navLink.icon className="h-3.5 w-3.5" />
              {navLink.label}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
              type="button"
              aria-label={
                mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'
              }
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0e082e]/95 backdrop-blur-2xl lg:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col items-center gap-2">
              {/* Section nav (homepage only) */}
              {onHomepage &&
                NAV_SECTIONS.map(({ id, label }, i) => (
                  <motion.a
                    key={id}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    href={`#${id}`}
                    initial={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`rounded-full px-6 py-3 text-lg font-medium transition-colors focus:outline-none ${
                      activeSection === id
                        ? 'bg-white/[0.08] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={(e) => scrollToSection(e, id)}
                  >
                    {label}
                  </motion.a>
                ))}

              {/* Blog / Accueil link */}
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
                exit={{ opacity: 0, y: 8 }}
                initial={{ opacity: 0, y: 16 }}
                transition={{
                  duration: 0.3,
                  delay: onHomepage ? NAV_SECTIONS.length * 0.05 : 0,
                }}
              >
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-6 py-3 text-lg font-medium text-indigo-300 transition-all hover:bg-indigo-500/20"
                  href={navLink.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <navLink.icon className="h-5 w-5" />
                  {navLink.label}
                </Link>
              </motion.div>
            </nav>

            {/* Social links */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-center gap-4"
              exit={{ opacity: 0, y: 8 }}
              initial={{ opacity: 0, y: 16 }}
              transition={{
                duration: 0.3,
                delay: onHomepage
                  ? (NAV_SECTIONS.length + 1) * 0.05
                  : 0.1,
              }}
            >
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  aria-label={label}
                  className="rounded-full border border-white/[0.06] bg-white/[0.03] p-3 text-gray-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
