'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Menu, X } from 'lucide-react';
import {
  GitHubIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from '@/components/icons/SocialIcons';
import CalPopupButton from '@/components/CalPopupButton';

/** Header nav. Routes (Services, Blog) + ancres homepage (Projets, Contact).
 * Quand on n'est pas sur la homepage, les ancres pointent vers `/#id` pour
 * naviguer puis scroller. */
type NavLink =
  | { label: string; href: string; route: true }
  | { label: string; id: string; route?: false };

const NAV_LINKS: NavLink[] = [
  { label: 'Services', href: '/services', route: true },
  { label: 'Projets', id: 'projets' },
  { label: 'Blog', href: '/blog', route: true },
  { label: 'Contact', id: 'contact' },
];

const TRACKED_SECTION_IDS = ['projets', 'contact'] as const;

const socials = [
  { href: 'https://github.com/victornain26', Icon: GitHubIcon, label: 'GitHub' },
  {
    href: 'https://www.linkedin.com/in/victorlenain/',
    Icon: LinkedInIcon,
    label: 'LinkedIn',
  },
  {
    href: 'https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous',
    Icon: WhatsAppIcon,
    label: 'WhatsApp',
  },
];

export default function HeaderBar() {
  const pathname = usePathname();
  const onHomepage = pathname === '/';

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* État "elevated" du header dès qu'on quitte le tout-haut. Listener passif
   * sur le scroll-viewport (Radix ScrollArea), peu coûteux et plus précis
   * qu'un IO pour ce binaire. */
  useEffect(() => {
    const viewport = document.getElementById('scroll-viewport');
    if (!viewport) return;
    const onScroll = () => {
      setScrolled(viewport.scrollTop > 8);
    };
    onScroll();
    viewport.addEventListener('scroll', onScroll, { passive: true });
    return () => viewport.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!onHomepage) return;

    const root =
      (document.getElementById('scroll-viewport') as Element | null) ?? null;

    const visibleSections = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }
        }

        if (visibleSections.size === 0) {
          setActiveSection(null);
          return;
        }

        let chosen: string | null = null;
        for (const id of TRACKED_SECTION_IDS) {
          if (visibleSections.has(id)) {
            chosen = id;
            break;
          }
        }
        setActiveSection(chosen);
      },
      {
        root,
        rootMargin: '-120px 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const id of TRACKED_SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }

    return () => io.disconnect();
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

  const renderNavLink = (link: NavLink, variant: 'desktop' | 'mobile') => {
    const isMobile = variant === 'mobile';

    if (link.route) {
      const isActive = pathname.startsWith(link.href);
      const desktopClasses = `relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus:outline-none ${
        isActive ? 'text-white' : 'text-gray-400 hover:text-white'
      }`;
      const mobileClasses = `rounded-full px-6 py-3 text-lg font-medium transition-colors focus:outline-none ${
        isActive ? 'bg-white/[0.08] text-white' : 'text-gray-400 hover:text-white'
      }`;
      return (
        <Link
          key={link.label}
          className={isMobile ? mobileClasses : desktopClasses}
          href={link.href}
          onClick={() => {
            if (isMobile) setMobileMenuOpen(false);
          }}
        >
          {!isMobile && isActive && (
            <motion.span
              className="absolute inset-0 rounded-full bg-white/[0.08]"
              layoutId="nav-pill"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{link.label}</span>
        </Link>
      );
    }

    // Anchor link : si on est sur la homepage, on scrolle. Sinon, on
    // navigue vers /#id qui scrollera après mount.
    const href = onHomepage ? `#${link.id}` : `/#${link.id}`;
    const isActive = onHomepage && activeSection === link.id;

    if (!onHomepage) {
      const cls = isMobile
        ? 'rounded-full px-6 py-3 text-lg font-medium text-gray-400 transition-colors hover:text-white focus:outline-none'
        : 'relative rounded-full px-3.5 py-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-white focus:outline-none';
      return (
        <Link
          key={link.label}
          className={cls}
          href={href}
          onClick={() => {
            if (isMobile) setMobileMenuOpen(false);
          }}
        >
          <span className="relative z-10">{link.label}</span>
        </Link>
      );
    }

    const desktopClasses = `relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus:outline-none ${
      isActive ? 'text-white' : 'text-gray-400 hover:text-white'
    }`;
    const mobileClasses = `rounded-full px-6 py-3 text-lg font-medium transition-colors focus:outline-none ${
      isActive ? 'bg-white/[0.08] text-white' : 'text-gray-400 hover:text-white'
    }`;

    return (
      <a
        key={link.label}
        className={isMobile ? mobileClasses : desktopClasses}
        href={href}
        onClick={(e) => {
          scrollToSection(e, link.id);
        }}
      >
        {!isMobile && isActive && (
          <motion.span
            className="absolute inset-0 rounded-full bg-white/[0.08]"
            layoutId="nav-pill"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
          />
        )}
        <span className="relative z-10">{link.label}</span>
      </a>
    );
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 px-4 text-white backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 sm:px-8 lg:px-20 xl:px-28 2xl:px-36 ${
          scrolled
            ? 'border-b border-white/[0.08] bg-[#0e082e]/85 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.5)]'
            : 'border-b border-transparent bg-[#0e082e]/40'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center lg:h-16">
          <Link
            aria-label="Retour à l'accueil"
            className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
            href="/"
            onClick={scrollToTop}
          >
            <Image
              priority
              alt="Logo"
              className="h-8 w-8 select-none"
              height={32}
              src="/logo.png"
              width={32}
            />
            <span className="hidden font-display text-sm font-semibold tracking-tight text-white sm:block">
              Victor Lenain
            </span>
          </Link>

          <div className="flex-1" />

          {/* Desktop nav (centered absolute) */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => renderNavLink(link, 'desktop'))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-1 lg:flex">
              {socials.map(({ href, label, Icon }) => (
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

            <div className="hidden h-5 w-px bg-white/[0.08] lg:block" />

            {/* CTA permanent — Cal.com en popup */}
            <CalPopupButton
              className="hidden items-center gap-2 rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-[0_0_24px_-8px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-0.5 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:inline-flex"
              data-umami-event="cta-header-cal"
            >
              <Calendar className="h-3.5 w-3.5" />
              Réserver
            </CalPopupButton>

            <button
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
              type="button"
              onClick={() => {
                setMobileMenuOpen((v) => !v);
              }}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

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
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  initial={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  {renderNavLink(link, 'mobile')}
                </motion.div>
              ))}

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
                exit={{ opacity: 0, y: 8 }}
                initial={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.3, delay: NAV_LINKS.length * 0.05 }}
              >
                <CalPopupButton
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-lg font-medium text-white shadow-[0_0_32px_-8px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-0.5 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  data-umami-event="cta-mobile-menu-cal"
                >
                  <Calendar className="h-5 w-5" />
                  Réserver un échange
                </CalPopupButton>
              </motion.div>
            </nav>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-center gap-4"
              exit={{ opacity: 0, y: 8 }}
              initial={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, delay: (NAV_LINKS.length + 1) * 0.05 }}
            >
              {socials.map(({ href, label, Icon }) => (
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
