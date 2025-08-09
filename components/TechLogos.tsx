'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion, motion } from 'framer-motion';
import Section from '@/components/Section';

type Tech = {
  name: string;
  src: string;
};

const TECHS: Tech[] = [
  { name: 'React', src: '/logos/react-3d.svg' },
  { name: 'Next.js', src: '/logos/nextjs-3d.svg' },
  { name: 'TypeScript', src: '/logos/typescript-3d.svg' },
  { name: 'Node.js', src: '/logos/nodejs-3d.svg' },
  { name: 'IA/LLM', src: '/logos/ai-3d.svg' },
];

function TiltLogo({ tech }: { tech: Tech }) {
  const prefersReduced = useReducedMotion();
  const [transform, setTransform] = useState<string>('rotateX(0deg) rotateY(0deg) translateZ(0px)');

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 2 - 1; // -1..1
    const py = (y / rect.height) * 2 - 1; // -1..1
    const maxTilt = 10;
    const rx = (-py * maxTilt).toFixed(2);
    const ry = (px * maxTilt).toFixed(2);
    setTransform(`rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`);
  };

  const reset = () => setTransform('rotateX(0deg) rotateY(0deg) translateZ(0px)');

  const wrapperCls = useMemo(
    () =>
      'group relative h-24 w-24 shrink-0 rounded-2xl border border-white/10 bg-gray-900/60 p-3 shadow-lg backdrop-blur-sm will-change-transform',
    []
  );

  return (
    <div
      className={wrapperCls}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ perspective: '800px' }}
      aria-label={tech.name}
    >
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/6 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
      <motion.div
        className="flex h-full w-full items-center justify-center rounded-xl bg-black/20"
        style={{ transform }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.8 }}
      >
        <Image src={tech.src} alt={tech.name} width={64} height={64} priority />
      </motion.div>
    </div>
  );
}

export default function TechLogos() {
  return (
    <Section id="stack" className="pb-4">
      <div className="mb-5 flex items-center gap-3 sm:justify-center">
        <span className="h-1 w-8 rounded-full bg-gradient-to-r from-[#6bb4d8] via-[#4288b7] to-[#2d5e81]" />
        <h2 className="text-sm font-medium uppercase tracking-wide text-indigo-200 sm:text-base">
          Technologies principales
        </h2>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto px-1 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:justify-center">
        {TECHS.map(tech => (
          <TiltLogo key={tech.name} tech={tech} />
        ))}
      </div>
    </Section>
  );
}

