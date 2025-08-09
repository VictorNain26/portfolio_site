/* components/three/Logos.tsx */
'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, RoundedBox, Text } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import type { Group, Mesh } from 'three';
import { Vector3, Quaternion } from 'three';

export type LogoProps = { isVisible: boolean };

export function ReactLogo3D({ isVisible }: LogoProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.35;
    }
  });

  const springs = useSpring({ scale: isVisible ? 1 : 0 });

  // Shared materials memoized
  const ringMaterial = useMemo(
    () => ({ color: '#61DAFB', transparent: true as const, opacity: 0.85, metalness: 0.2, roughness: 0.15 }),
    []
  );

  return (
    <animated.group ref={groupRef} scale={springs.scale}>
      <Center>
        {/* Nucleus */}
        <mesh>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color="#61DAFB" emissive="#61DAFB" emissiveIntensity={0.25} />
        </mesh>

        {/* Three elliptical rings */}
        {[0, 60, 120].map((rot, i) => (
          <group key={i} rotation={[Math.PI / 6, 0, (rot * Math.PI) / 180]}>
            <mesh scale={[1.05, 0.6, 1]}>
              <torusGeometry args={[1.25, 0.055, 16, 72]} />
              <meshStandardMaterial {...ringMaterial} />
            </mesh>
          </group>
        ))}

        {/* Small electrons orbiting on the primary ring */}
        <ElectronOrbit radius={1.25} color="#CFF6FF" speed={0.8} />
        <ElectronOrbit radius={1.25} color="#A8EFFF" speed={-0.6} phase={Math.PI} />
      </Center>
    </animated.group>
  );
}

function ElectronOrbit({ radius, color, speed, phase = 0 }: { radius: number; color: string; speed: number; phase?: number }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    const x = Math.cos(t) * radius * 1.05;
    const y = Math.sin(t) * radius * 0.6;
    ref.current.position.set(x, y, 0);
  });
  return (
    <group rotation={[Math.PI / 6, 0, 0]} ref={ref}>
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export function NextJSLogo3D({ isVisible }: LogoProps) {
  const groupRef = useRef<Group>(null);
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.1;
    }
  });
  const springs = useSpring({ scale: isVisible ? 1 : 0 });
  return (
    <animated.group ref={groupRef} scale={springs.scale}>
      <Center>
        {/* Base beveled disc */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 0.22, 64]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Raised N: two bars + diagonal */}
        <mesh position={[-0.55, 0, 0.13]}>
          <boxGeometry args={[0.16, 1.5, 0.16]} />
          <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.55, 0, 0.13]}>
          <boxGeometry args={[0.16, 1.5, 0.16]} />
          <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh rotation={[0, 0, -0.5]} position={[0, 0, 0.13]}>
          <boxGeometry args={[1.95, 0.16, 0.16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.4} />
        </mesh>
      </Center>
    </animated.group>
  );
}

export function TypeScriptLogo3D({ isVisible }: LogoProps) {
  const meshRef = useRef<Mesh>(null);
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  const springs = useSpring({ scale: isVisible ? 1 : 0 });
  return (
    <animated.group scale={springs.scale}>
      <Center>
        <group ref={meshRef}>
          <RoundedBox args={[2.6, 2.6, 0.5]} radius={0.25} smoothness={6}>
            <meshStandardMaterial color="#3178C6" metalness={0.5} roughness={0.3} />
          </RoundedBox>
          {/* 3D letters made of boxes for depth */}
          <TSLetters3D />
        </group>
      </Center>
    </animated.group>
  );
}

function TSLetters3D() {
  const z = 0.28; // protrusion above the plaque
  return (
    <group position={[0, 0, 0]}>
      {/* T */}
      <mesh position={[-0.5, 0.25, z]}>
        <boxGeometry args={[0.9, 0.18, 0.18]} />
        <meshStandardMaterial color="#ffffff" metalness={0.25} roughness={0.5} />
      </mesh>
      <mesh position={[-0.5, -0.15, z]}>
        <boxGeometry args={[0.18, 0.9, 0.18]} />
        <meshStandardMaterial color="#ffffff" metalness={0.25} roughness={0.5} />
      </mesh>
      {/* S (built from segments) */}
      <group position={[0.65, 0.0, z]}>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.9, 0.18, 0.18]} />
          <meshStandardMaterial color="#ffffff" metalness={0.25} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.0, 0]}>
          <boxGeometry args={[0.9, 0.18, 0.18]} />
          <meshStandardMaterial color="#ffffff" metalness={0.25} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[0.9, 0.18, 0.18]} />
          <meshStandardMaterial color="#ffffff" metalness={0.25} roughness={0.5} />
        </mesh>
        {/* vertical links */}
        <mesh position={[-0.36, 0.225, 0]}>
          <boxGeometry args={[0.18, 0.45, 0.18]} />
          <meshStandardMaterial color="#ffffff" metalness={0.25} roughness={0.5} />
        </mesh>
        <mesh position={[0.36, -0.225, 0]}>
          <boxGeometry args={[0.18, 0.45, 0.18]} />
          <meshStandardMaterial color="#ffffff" metalness={0.25} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export function NodeJSLogo3D({ isVisible }: LogoProps) {
  const meshRef = useRef<Mesh>(null);
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });
  const springs = useSpring({ scale: isVisible ? 1 : 0 });
  return (
    <animated.group scale={springs.scale}>
      <Center>
        <group ref={meshRef} rotation={[0, Math.PI / 6, 0]}>
          {/* Hex base */}
          <mesh>
            <cylinderGeometry args={[1.6, 1.6, 0.45, 6]} />
            <meshStandardMaterial color="#3C873A" metalness={0.75} roughness={0.25} />
          </mesh>
          {/* Inner inset for contrast */}
          <mesh position={[0, 0, 0.18]}>
            <cylinderGeometry args={[1.2, 1.2, 0.1, 6]} />
            <meshStandardMaterial color="#2b5d29" metalness={0.4} roughness={0.5} />
          </mesh>
          {/* Raised JS letters using Text for readability */}
          <Text position={[0.02, -0.02, 0.26]} fontSize={0.7} anchorX="center" anchorY="middle">
            JS
            <meshStandardMaterial color="#1d3e20" metalness={0.2} roughness={0.6} />
          </Text>
          <Text position={[0, 0, 0.28]} fontSize={0.7} anchorX="center" anchorY="middle">
            JS
            <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
          </Text>
        </group>
      </Center>
    </animated.group>
  );
}

export function AILogo3D({ isVisible }: LogoProps) {
  const groupRef = useRef<Group>(null);
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });
  const springs = useSpring({ scale: isVisible ? 1 : 0 });

  const nodes = useMemo(() => {
    const pts = [
      new Vector3(1.2, 0.0, 0.0),
      new Vector3(-1.2, 0.0, 0.0),
      new Vector3(0.0, 1.0, 0.6),
      new Vector3(0.0, -1.0, -0.6),
      new Vector3(0.9, 0.8, -0.4),
      new Vector3(-0.9, -0.8, 0.4),
    ];
    return pts;
  }, []);

  const links = useMemo(() => {
    return [
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 5],
      [0, 4],
      [1, 5],
    ] as const;
  }, []);

  return (
    <animated.group ref={groupRef} scale={springs.scale}>
      <Center>
        {/* Nodes */}
        {nodes.map((p, i) => (
          <mesh key={i} position={p.toArray()}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#8A2BE2" emissive="#8A2BE2" emissiveIntensity={0.25} />
          </mesh>
        ))}

        {/* Links as cylinders oriented between nodes */}
        {links.map(([a, b], i) => (
          <Link key={i} a={nodes[a]!} b={nodes[b]!} />
        ))}
      </Center>
    </animated.group>
  );
}

function Link({ a, b }: { a: Vector3; b: Vector3 }) {
  const mid = useMemo(() => a.clone().add(b).multiplyScalar(0.5), [a, b]);
  const len = useMemo(() => a.distanceTo(b), [a, b]);
  const quat = useMemo(() => {
    const dir = b.clone().sub(a).normalize();
    const q = new Quaternion();
    // align Y-axis to dir
    q.setFromUnitVectors(new Vector3(0, 1, 0), dir);
    return q;
  }, [a, b]);
  return (
    <mesh position={mid.toArray()} quaternion={[quat.x, quat.y, quat.z, quat.w] as unknown as any}>
      <cylinderGeometry args={[0.035, 0.035, len, 8]} />
      <meshStandardMaterial color="#B28CFF" metalness={0.3} roughness={0.5} />
    </mesh>
  );
}
