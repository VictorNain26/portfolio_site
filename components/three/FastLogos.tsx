/* components/three/FastLogos.tsx */
'use client';

import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { type SpringValue } from '@react-spring/three';
import { type Group } from 'three';
import { FastSvgExtrude } from './FastSvgExtrude';

export type LogoProps = {
  isVisible: boolean;
  opacity?: SpringValue<number> | number | undefined;
};

// Animation constants
const ROTATION_SPEED = 0.4;
const METALNESS_VALUE = 0.1;
const ROUGHNESS_VALUE = 0.3;
const BOX_SCALE_Z = 0.2;

const LOGO_CONFIGS = {
  react: { src: '/logos/react.svg', color: '#61DAFB' },
  nextjs: { src: '/logos/nextjs.svg', color: '#000000' },
  typescript: { src: '/logos/typescript.svg', color: '#3178C6' },
  nodejs: { src: '/logos/nodejs.svg', color: '#3C873A' },
  openai: { src: '/logos/openai.svg', color: '#10A37F' },
} as const;

function FastLogo3D({ type, isVisible, opacity }: LogoProps & { type: keyof typeof LOGO_CONFIGS }) {
  const groupRef = useRef<Group>(null);

  useFrame(state => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * ROTATION_SPEED;
    }
  });

  const config = LOGO_CONFIGS[type];

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        <FastSvgExtrude color={config.color} opacity={opacity} src={config.src} />
      </Suspense>
    </group>
  );
}

// Fallback simple geometry for immediate display
function SimpleLogo3D({ type, isVisible, opacity }: LogoProps & { type: keyof typeof LOGO_CONFIGS }) {
  const groupRef = useRef<Group>(null);
  const config = LOGO_CONFIGS[type];

  useFrame(state => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * ROTATION_SPEED;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh scale={[2, 2, BOX_SCALE_Z]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          transparent
          color={config.color}
          metalness={METALNESS_VALUE}
          opacity={typeof opacity === 'number' ? opacity : 1}
          roughness={ROUGHNESS_VALUE}
        />
      </mesh>
    </group>
  );
}

// Hybrid component with fallback
function HybridLogo3D({ type, isVisible, opacity }: LogoProps & { type: keyof typeof LOGO_CONFIGS }) {
  return (
    <Suspense fallback={<SimpleLogo3D isVisible={isVisible} opacity={opacity} type={type} />}>
      <FastLogo3D isVisible={isVisible} opacity={opacity} type={type} />
    </Suspense>
  );
}

export function FastReactLogo3D(props: LogoProps) {
  return <HybridLogo3D type="react" {...props} />;
}

export function FastNextJSLogo3D(props: LogoProps) {
  return <HybridLogo3D type="nextjs" {...props} />;
}

export function FastTypeScriptLogo3D(props: LogoProps) {
  return <HybridLogo3D type="typescript" {...props} />;
}

export function FastNodeJSLogo3D(props: LogoProps) {
  return <HybridLogo3D type="nodejs" {...props} />;
}

export function FastAILogo3D(props: LogoProps) {
  return <HybridLogo3D type="openai" {...props} />;
}