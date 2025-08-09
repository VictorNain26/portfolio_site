/* components/three/Logos.tsx */
'use client';

import { useRef } from 'react';
import { useFrame, type Vector3 } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { animated, useSpring, type SpringValue } from '@react-spring/three';
import { type Group, type Mesh } from 'three';
import { SvgExtrude } from './SvgExtrude';

export type LogoProps = { isVisible: boolean; opacity?: number | SpringValue<number> };

export function ReactLogo3D({ isVisible, opacity }: LogoProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.35;
    }
  });

  const springs = useSpring<{ scale: number; rotation: Vector3 }>({ scale: isVisible ? 1 : 0, rotation: (isVisible ? [0.2, 0, 0] : [0, 0, 0]) as unknown as Vector3 });
  return (
    <animated.group ref={groupRef} scale={springs.scale} rotation={springs.rotation as unknown as [number, number, number]}>
      <Center>
        <SvgExtrude
          src="/logos/react.svg"
          depth={0.36}
          bevelEnabled
          bevelThickness={0.06}
          bevelSize={0.028}
          bevelSegments={3}
          scale={0.035}
          flipY
          material={{ color: '#61DAFB', metalness: 0.4, roughness: 0.28 }}
          opacity={opacity}
        />
      </Center>
    </animated.group>
  );
}

// (ElectronOrbit removed to better match the official React logo)

export function NextJSLogo3D({ isVisible, opacity }: LogoProps) {
  const groupRef = useRef<Group>(null);
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.1;
    }
  });
  const springs = useSpring<{ scale: number; rotation: Vector3 }>({ scale: isVisible ? 1 : 0, rotation: (isVisible ? [0.15, 0, 0] : [0, 0, 0]) as unknown as Vector3 });
  return (
    <animated.group ref={groupRef} scale={springs.scale} rotation={springs.rotation as unknown as [number, number, number]}>
      <Center>
        <SvgExtrude
          src="/logos/nextjs.svg"
          depth={0.3}
          bevelEnabled={false}
          scale={0.045}
          flipY
          material={{ color: '#ffffff', metalness: 0.4, roughness: 0.25 }}
          opacity={opacity}
        />
      </Center>
    </animated.group>
  );
}

export function TypeScriptLogo3D({ isVisible, opacity }: LogoProps) {
  const meshRef = useRef<Mesh>(null);
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  const springs = useSpring<{ scale: number; rotation: Vector3 }>({ scale: isVisible ? 1 : 0, rotation: (isVisible ? [0.2, 0, 0] : [0, 0, 0]) as unknown as Vector3 });
  return (
    <animated.group scale={springs.scale} rotation={springs.rotation as unknown as [number, number, number]}>
      <Center>
        <group ref={meshRef}>
          <SvgExtrude
            src="/logos/typescript.svg"
            depth={0.34}
            bevelEnabled
            bevelThickness={0.055}
            bevelSize={0.026}
            bevelSegments={3}
            scale={0.043}
            flipY
            material={{ color: '#3178C6', metalness: 0.4, roughness: 0.28 }}
            opacity={opacity}
          />
        </group>
      </Center>
    </animated.group>
  );
}

export function NodeJSLogo3D({ isVisible, opacity }: LogoProps) {
  const meshRef = useRef<Mesh>(null);
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });
  const springs = useSpring<{ scale: number; rotation: Vector3 }>({ scale: isVisible ? 1 : 0, rotation: (isVisible ? [0.18, 0, 0] : [0, 0, 0]) as unknown as Vector3 });
  return (
    <animated.group scale={springs.scale} rotation={springs.rotation as unknown as [number, number, number]}>
      <Center>
        <group ref={meshRef}>
          <SvgExtrude
            src="/logos/nodejs.svg"
            depth={0.34}
            bevelEnabled
            bevelThickness={0.055}
            bevelSize={0.026}
            bevelSegments={3}
            scale={0.043}
            flipY
            material={{ color: '#3C873A', metalness: 0.45, roughness: 0.3 }}
            opacity={opacity}
          />
        </group>
      </Center>
    </animated.group>
  );
}

export function AILogo3D({ isVisible, opacity }: LogoProps) {
  const groupRef = useRef<Group>(null);
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });
  const springs = useSpring<{ scale: number; rotation: Vector3 }>({ scale: isVisible ? 1 : 0, rotation: (isVisible ? [0.16, 0, 0] : [0, 0, 0]) as unknown as Vector3 });

  return (
    <animated.group ref={groupRef} scale={springs.scale} rotation={springs.rotation as unknown as [number, number, number]}>
      <Center>
        <SvgExtrude
          src="/logos/openai.svg"
          depth={0.32}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.024}
          bevelSegments={3}
          scale={0.043}
          flipY
          material={{ color: '#10A37F', metalness: 0.45, roughness: 0.28 }}
          opacity={opacity}
        />
      </Center>
    </animated.group>
  );
}

// (Link helper removed with the AI network logo replacement by official SVG)
