/* components/three/Logos.tsx */
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { type SpringValue } from '@react-spring/three';
import { type Group } from 'three';
import { SvgExtrude } from './SvgExtrude';

export type LogoProps = {
  isVisible: boolean;
  opacity?: number | SpringValue<number>;
};

const LOGO_CONFIGS = {
  react: { src: '/logos/react.svg', color: '#61DAFB' },
  nextjs: { src: '/logos/nextjs.svg', color: '#000000' },
  typescript: { src: '/logos/typescript.svg', color: '#3178C6' },
  nodejs: { src: '/logos/nodejs.svg', color: '#3C873A' },
  openai: { src: '/logos/openai.svg', color: '#10A37F' },
} as const;

function Logo3D({ type, isVisible, opacity }: { type: keyof typeof LOGO_CONFIGS } & LogoProps) {
  const groupRef = useRef<Group>(null);

  useFrame(state => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  const config = LOGO_CONFIGS[type];

  return (
    <group ref={groupRef}>
      <SvgExtrude src={config.src} color={config.color} opacity={opacity} />
    </group>
  );
}

export function ReactLogo3D(props: LogoProps) {
  return <Logo3D type="react" {...props} />;
}

export function NextJSLogo3D(props: LogoProps) {
  return <Logo3D type="nextjs" {...props} />;
}

export function TypeScriptLogo3D(props: LogoProps) {
  return <Logo3D type="typescript" {...props} />;
}

export function NodeJSLogo3D(props: LogoProps) {
  return <Logo3D type="nodejs" {...props} />;
}

export function AILogo3D(props: LogoProps) {
  return <Logo3D type="openai" {...props} />;
}
