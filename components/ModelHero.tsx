/* components/ModelHero.tsx */
'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Float,
  Html,
  Center,
} from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/three';
import type * as THREE from 'three';

/* ──────────────────────────────────────────────────────────────── */
/* 1 · Configuration des technologies avec logos 3D créés sur mesure */
// Configuration des modèles 3D simples et reconnaissables
const TECH_MODELS = [
  {
    name: 'React',
    type: 'react' as const,
    color: '#61DAFB',
    scale: 1.0,
  },
  {
    name: 'Next.js',
    type: 'nextjs' as const,
    color: '#000000', 
    scale: 1.0,
  },
  {
    name: 'TypeScript',
    type: 'typescript' as const,
    color: '#3178C6',
    scale: 1.0,
  },
  {
    name: 'Tailwind CSS',
    type: 'tailwind' as const,
    color: '#06B6D4',
    scale: 1.0,
  },
  {
    name: 'Node.js',
    type: 'nodejs' as const,
    color: '#339933',
    scale: 1.0,
  },
];

/* ──────────────────────────────────────────────────────────────── */
/* 2 · Modèles 3D simples et reconnaissables                       */

// React - Atome simple avec noyau et orbites
function ReactLogo({ isVisible }: { isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const springs = useSpring({
    scale: isVisible ? 1 : 0,
  });

  return (
    <animated.group ref={groupRef} scale={springs.scale}>
      <Center>
        {/* Noyau central */}
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#61DAFB" 
            emissive="#61DAFB" 
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* 3 orbites simples */}
        {[0, 60, 120].map((rotation, i) => (
          <group key={i} rotation={[Math.PI / 6, 0, (rotation * Math.PI) / 180]}>
            <mesh>
              <torusGeometry args={[1.5, 0.02, 6, 32]} />
              <meshStandardMaterial 
                color="#61DAFB" 
                transparent 
                opacity={0.6}
              />
            </mesh>
          </group>
        ))}
      </Center>
    </animated.group>
  );
}

// Next.js - Triangle/flèche moderne
function NextJSLogo({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const springs = useSpring({
    scale: isVisible ? 1 : 0,
  });

  return (
    <animated.group scale={springs.scale}>
      <Center>
        <mesh ref={meshRef}>
          <coneGeometry args={[1, 2, 3]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Center>
    </animated.group>
  );
}

// TypeScript - Cube bleu simple
function TypeScriptLogo({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const springs = useSpring({
    scale: isVisible ? 1 : 0,
  });

  return (
    <animated.group scale={springs.scale}>
      <Center>
        <mesh ref={meshRef}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial 
            color="#3178C6" 
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </Center>
    </animated.group>
  );
}

// Tailwind - Vagues simples entrelacées
function TailwindLogo({ isVisible }: { isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
    }
  });

  const springs = useSpring({
    scale: isVisible ? 1 : 0,
  });

  return (
    <animated.group ref={groupRef} scale={springs.scale}>
      <Center>
        {/* Vague principale */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.5, 0.2, 8, 32]} />
          <meshStandardMaterial 
            color="#06B6D4" 
            transparent 
            opacity={0.8}
          />
        </mesh>
        
        {/* Vague secondaire */}
        <mesh rotation={[0, 0, Math.PI / 3]}>
          <torusGeometry args={[1.2, 0.15, 8, 32]} />
          <meshStandardMaterial 
            color="#0891B2" 
            transparent 
            opacity={0.7}
          />
        </mesh>
      </Center>
    </animated.group>
  );
}

// Node.js - Hexagone simple
function NodeJSLogo({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  const springs = useSpring({
    scale: isVisible ? 1 : 0,
  });

  return (
    <animated.group scale={springs.scale}>
      <Center>
        <mesh ref={meshRef} rotation={[0, Math.PI / 6, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.3, 6]} />
          <meshStandardMaterial 
            color="#339933" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </Center>
    </animated.group>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* 3 · Composant principal de modèle                                */
type ModelProps = {
  model: typeof TECH_MODELS[0];
  isVisible: boolean;
};

function TechModel({ model, isVisible }: ModelProps) {
  const renderLogo = () => {
    switch (model.type) {
      case 'react':
        return <ReactLogo isVisible={isVisible} />;
      case 'nextjs':
        return <NextJSLogo isVisible={isVisible} />;
      case 'typescript':
        return <TypeScriptLogo isVisible={isVisible} />;
      case 'tailwind':
        return <TailwindLogo isVisible={isVisible} />;
      case 'nodejs':
        return <NodeJSLogo isVisible={isVisible} />;
      default:
        return null;
    }
  };

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      {renderLogo()}
    </Float>
  );
}

/* 4 · Canvas simplifié avec rotation automatique uniquement        */
export default function ModelHero() {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Rotation automatique des modèles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentModelIndex((prev) => (prev + 1) % TECH_MODELS.length);
    }, 4000); // Change toutes les 4 secondes

    return () => clearInterval(interval);
  }, []);

  // Gestion du chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const currentModel = TECH_MODELS[currentModelIndex]!;

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Légende simple au survol */}
      <div className={`absolute top-4 left-4 z-10 pointer-events-none transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="rounded-lg bg-black/40 backdrop-blur-sm px-3 py-2 border border-white/20">
          <h3 className="text-sm font-medium text-white">
            {currentModel.name}
          </h3>
        </div>
      </div>

      <Canvas
        className="!bg-transparent"
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        {/* ÉCLAIRAGE selon les spécifications recommandées */}
        {/* Lumière ambiante douce */}
        <ambientLight color={0xffffff} intensity={0.6} />
        
        {/* Lumière directionnelle principale */}
        <directionalLight 
          color={0xffffff}
          intensity={1}
          position={[5, 5, 5]}
          castShadow={true}
        />
        
        {/* Lumières d'accentuation pour chaque logo */}
        <pointLight 
          color={0x61dafb} 
          intensity={0.5} 
          position={[0, 0, 3]}
          visible={currentModel.type === 'react'}
        />
        <pointLight 
          color={0x06b6d4} 
          intensity={0.5} 
          position={[0, 0, 3]}
          visible={currentModel.type === 'tailwind'}
        />
        <pointLight 
          color={0x68a063} 
          intensity={0.5} 
          position={[0, 0, 3]}
          visible={currentModel.type === 'nodejs'}
        />

        {/* CONTENU */}
        <Suspense
          fallback={
            <Html center className="text-sm text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" />
                Chargement…
              </div>
            </Html>
          }
        >
          <Environment preset="studio" />
          <AnimatePresence mode="wait">
            <TechModel
              key={currentModel.name}
              model={currentModel}
              isVisible={!isLoading}
            />
          </AnimatePresence>
        </Suspense>

        {/* CONTRÔLES LIMITÉS - HORIZONTAL SEULEMENT */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={1}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
