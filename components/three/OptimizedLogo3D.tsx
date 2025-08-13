/* components/three/OptimizedLogo3D.tsx */
'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { type Group, PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide, TextureLoader } from 'three';
import { type SpringValue } from '@react-spring/three';

export type OptimizedLogoProps = {
  type: 'react' | 'nextjs' | 'typescript' | 'nodejs' | 'openai';
  isVisible: boolean;
  opacity?: SpringValue<number> | number;
};

// Pre-generated simple geometries for each logo type
const LOGO_GEOMETRIES = {
  react: {
    color: '#61DAFB',
    vertices: [
      [-1, -1, 0], [1, -1, 0], [1, 1, 0], [-1, 1, 0], // Square base
      [0, 0, 0.2], // Center point for extrusion
    ],
    faces: [
      [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], // Top faces
      [0, 3, 2], [0, 2, 1], // Bottom faces
    ]
  },
  nextjs: {
    color: '#000000',
    vertices: [
      [-0.8, -1, 0], [0.8, -1, 0], [0.8, 1, 0], [-0.8, 1, 0],
      [0, 0, 0.15],
    ],
    faces: [
      [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4],
      [0, 3, 2], [0, 2, 1],
    ]
  },
  typescript: {
    color: '#3178C6',
    vertices: [
      [-1, -1, 0], [1, -1, 0], [1, 1, 0], [-1, 1, 0],
      [0, 0, 0.18],
    ],
    faces: [
      [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4],
      [0, 3, 2], [0, 2, 1],
    ]
  },
  nodejs: {
    color: '#3C873A',
    vertices: [
      [-1.2, -0.8, 0], [1.2, -0.8, 0], [1.2, 0.8, 0], [-1.2, 0.8, 0],
      [0, 0, 0.16],
    ],
    faces: [
      [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4],
      [0, 3, 2], [0, 2, 1],
    ]
  },
  openai: {
    color: '#10A37F',
    vertices: [
      [-0.9, -0.9, 0], [0.9, -0.9, 0], [0.9, 0.9, 0], [-0.9, 0.9, 0],
      [0, 0, 0.12],
    ],
    faces: [
      [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4],
      [0, 3, 2], [0, 2, 1],
    ]
  }
};

// Ultra-fast logo component using basic geometry
export function OptimizedLogo3D({ type, isVisible, opacity = 1 }: OptimizedLogoProps) {
  const groupRef = useRef<Group>(null);
  const logoData = LOGO_GEOMETRIES[type];

  // Ultra-simple geometry with minimal vertices
  const geometry = useMemo(() => {
    return new PlaneGeometry(2, 2);
  }, []);

  // Basic material for maximum performance
  const material = useMemo(() => {
    return new MeshBasicMaterial({
      color: logoData.color,
      transparent: true,
      opacity: typeof opacity === 'number' ? opacity : 1,
      side: DoubleSide,
      // Disable expensive features
      fog: false,
      toneMapped: false,
    });
  }, [logoData.color, opacity]);

  // Minimal rotation animation
  const ROTATION_SPEED = 0.3;
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * ROTATION_SPEED;
      // Add subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Update material opacity
  useEffect(() => {
    if (material) {
      material.opacity = typeof opacity === 'number' ? opacity : 1;
      material.needsUpdate = true;
    }
  }, [material, opacity]);

  return (
    <group ref={groupRef} scale={0.8}>
      <mesh geometry={geometry} material={material} />
      {/* Add slight depth with a second plane */}
      <mesh
        geometry={geometry}
        material={material}
        position={[0, 0, -0.05]}
        scale={0.95}
      />
    </group>
  );
}

// Alternative: Even more optimized sprite-based version
export function SpriteLogo3D({ type, isVisible, opacity = 1 }: OptimizedLogoProps) {
  const groupRef = useRef<Group>(null);
  const logoData = LOGO_GEOMETRIES[type];

  // Create a simple colored square sprite
  const material = useMemo(() => {
    return new MeshBasicMaterial({
      color: logoData.color,
      transparent: true,
      opacity: typeof opacity === 'number' ? opacity : 1,
    });
  }, [logoData.color, opacity]);

  const geometry = useMemo(() => {
    return new PlaneGeometry(1.5, 1.5);
  }, []);

  // Minimal rotation
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} material={material} />
    </group>
  );
}

// Factory function to create optimized logos
export function createOptimizedLogo(type: OptimizedLogoProps['type']) {
  return function OptimizedLogoComponent(props: Omit<OptimizedLogoProps, 'type'>) {
    return <OptimizedLogo3D type={type} {...props} />;
  };
}

// Pre-created optimized components
export const OptimizedReactLogo = createOptimizedLogo('react');
export const OptimizedNextJSLogo = createOptimizedLogo('nextjs');
export const OptimizedTypeScriptLogo = createOptimizedLogo('typescript');
export const OptimizedNodeJSLogo = createOptimizedLogo('nodejs');
export const OptimizedAILogo = createOptimizedLogo('openai');