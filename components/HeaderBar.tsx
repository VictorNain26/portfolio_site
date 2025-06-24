"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GithubIcon, Linkedin, Mail, Phone } from "lucide-react";
import { SocialIconButton } from "@/components/ui/social-icon-button";

const socials = [
  { href: "https://github.com/victornain26", icon: GithubIcon, label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/victor-lenain-1907b7282/",
    icon: Linkedin,
    label: "LinkedIn",
  },
  { href: "tel:+33600000000", icon: Phone, label: "Téléphone" },
  {
    href: "mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission",
    icon: Mail,
    label: "Mail",
  },
];

export default function HeaderBar() {
  const pathname = usePathname();
  const onBlog = pathname?.startsWith("/blog");

  /* apparition / disparition */
  const [show, setShow] = useState(false);
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    ioRef.current?.disconnect();

    const hero = document.getElementById("accueil");
    if (!hero || onBlog) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting));
    io.observe(hero);
    ioRef.current = io;
    return () => io.disconnect();
  }, [pathname, onBlog]);

  /* lien contextuel */
  const navLink = onBlog
    ? { href: "/", label: "Accueil" }
    : { href: "/blog", label: "Blog" };

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.header
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -32, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="
            fixed inset-x-0 top-0 z-50
            bg-transparent backdrop-blur-md        /* ⇦ plus de fond coloré */
            ring-1 ring-white/10                    /* fine bordure */
            px-4 sm:px-8 lg:px-20 xl:px-28 2xl:px-36
            py-1 md:py-1.5 lg:py-3
            text-white
          "
        >
          <div className="mx-auto flex max-w-7xl items-center gap-6">
            <Image
              src="/logo.png"
              alt="Logo"
              width={38}
              height={38}
              priority
              className="select-none"
            />

            {onBlog && (
              <span className="font-display text-lg font-semibold text-indigo-400">
                Blog
              </span>
            )}

            <nav className="ms-auto flex items-center gap-1.5 sm:gap-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <SocialIconButton
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  size="sm"
                >
                  <Icon />
                </SocialIconButton>
              ))}
            </nav>

            <Link
              href={navLink.href}
              className="
                whitespace-nowrap
                rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-600
                px-5 py-2 text-sm font-semibold text-white shadow-lg
                transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-110
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300
              "
            >
              {navLink.label}
            </Link>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
