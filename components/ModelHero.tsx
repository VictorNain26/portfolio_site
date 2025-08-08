/* components/ModelHero.tsx */
'use client';

import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Float,
  Html,
  Center,
  Text,
  RoundedBox,
  ContactShadows,
} from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

/* ──────────────────────────────────────────────────────────────── */
/* 1 · Configuration des technologies avec logos 3D créés sur mesure */
// Couleurs officielles (fidèles aux chartes)
const BRAND = {
  react: '#61DAFB',
  next: '#0a0a0a',
  typescript: '#3178C6',
  tailwindPrimary: '#06B6D4',
  tailwindSecondary: '#38BDF8',
  node: '#339933',
};

// Configuration des modèles 3D simples et reconnaissables
const TECH_MODELS = [
  {
    name: 'React',
    type: 'react' as const,
    color: BRAND.react,
    scale: 1.0,
  },
  {
    name: 'Next.js',
    type: 'nextjs' as const,
    color: BRAND.next, 
    scale: 1.0,
  },
  {
    name: 'TypeScript',
    type: 'typescript' as const,
    color: BRAND.typescript,
    scale: 1.0,
  },
  {
    name: 'Tailwind CSS',
    type: 'tailwind' as const,
    color: BRAND.tailwindPrimary,
    scale: 1.0,
  },
  {
    name: 'Node.js',
    type: 'nodejs' as const,
    color: BRAND.node,
    scale: 1.0,
  },
];

/* ──────────────────────────────────────────────────────────────── */
/* 2 · Modèles 3D simples et reconnaissables                       */

// React - Atome avec noyau, orbites elliptiques et léger glow (proportions proches du logo)
function ReactLogo({ isVisible }: { isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.22;
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
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial 
            color={BRAND.react} 
            emissive={BRAND.react} 
            emissiveIntensity={0.15}
          />
        </mesh>
        
        {/* 3 orbites elliptiques */}
        {[0, 60, 120].map((rotation, i) => (
          <group key={i} rotation={[Math.PI / 6, 0, (rotation * Math.PI) / 180]}>
            <mesh scale={[1.35, 0.9, 1]}>
              <torusGeometry args={[1.5, 0.025, 16, 96]} />
              <meshStandardMaterial 
                color={BRAND.react}
                transparent
                opacity={0.85}
                metalness={0.08}
                roughness={0.18}
              />
            </mesh>
          </group>
        ))}
      </Center>
    </animated.group>
  );
}

// Next.js - Disque noir glossy avec trait diagonal minimaliste (épaisseur ajustée)
function NextJSLogo({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.45) * 0.06;
    }
  });

  const springs = useSpring({
    scale: isVisible ? 1 : 0,
  });

  return (
    <animated.group scale={springs.scale}>
      <Center>
        {/* Disque */}
        <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.16, 64]} />
          <meshStandardMaterial 
            color={BRAND.next}
            metalness={0.9}
            roughness={0.16}
          />
        </mesh>
        {/* Trait diagonal */}
        <mesh rotation={[0, 0, -0.55]} position={[0, 0, 0.12]}>
          <boxGeometry args={[2.2, 0.06, 0.1]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.4} />
        </mesh>
      </Center>
    </animated.group>
  );
}

// TypeScript - Plaque bleue arrondie avec lettrage "TS" extrudé (rayon et contraste ajustés)
function TypeScriptLogo({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.28) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.18;
    }
  });

  const springs = useSpring({
    scale: isVisible ? 1 : 0,
  });

  return (
    <animated.group scale={springs.scale}>
      <Center>
        <group ref={meshRef}>
          <RoundedBox args={[2.6, 2.6, 0.35]} radius={0.22} smoothness={6}>
            <meshStandardMaterial color={BRAND.typescript} metalness={0.45} roughness={0.32} />
          </RoundedBox>
          {/* Ombre/relief simulé */}
          <Text
            position={[0.02, -0.02, 0.22]}
            fontSize={0.9}
            letterSpacing={-0.03}
            anchorX="center"
            anchorY="middle"
          >
            TS
            <meshStandardMaterial color="#1f3f83" metalness={0.2} roughness={0.65} />
          </Text>
          <Text
            position={[0, 0, 0.24]}
            fontSize={0.9}
            letterSpacing={-0.03}
            anchorX="center"
            anchorY="middle"
          >
            TS
            <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.4} />
          </Text>
        </group>
      </Center>
    </animated.group>
  );
}

// Tailwind - Courbes tubulaires légères façon "vague" (couleurs officielles)
function TailwindLogo({ isVisible }: { isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.36) * 0.18;
    }
  });

  // animation d'entrée
  const springs = useSpring({ scale: isVisible ? 1 : 0 });

  // courbes paramétriques
  const createWave = useMemo(() => {
    return (scale = 1) => {
      const points: Array<[number, number, number]> = [
        [-1.5, 0.2, 0],
        [-0.5, 0.6, 0],
        [0.5, -0.1, 0],
        [1.5, 0.3, 0],
      ];
      return new THREE.CatmullRomCurve3(
        points.map(p => new THREE.Vector3(p[0] * scale, p[1] * scale, p[2]))
      );
    };
  }, []);

  // déjà défini plus haut

  return (
    <animated.group ref={groupRef} scale={springs.scale}>
      <Center>
        <mesh>
          <tubeGeometry args={[createWave(1), 80, 0.12, 16, false]} />
          <meshStandardMaterial color={BRAND.tailwindPrimary} metalness={0.2} roughness={0.35} />
        </mesh>
        <mesh position={[0.15, -0.15, -0.02]}>
          <tubeGeometry args={[createWave(0.75), 80, 0.09, 16, false]} />
          <meshStandardMaterial color={BRAND.tailwindSecondary} metalness={0.2} roughness={0.35} />
        </mesh>
      </Center>
    </animated.group>
  );
}

// Node.js - Hexagone glossy + lettrage "JS" (teinte et vitesse ajustées)
function NodeJSLogo({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.28;
    }
  });

  const springs = useSpring({
    scale: isVisible ? 1 : 0,
  });

  return (
    <animated.group scale={springs.scale}>
      <Center>
        <group ref={meshRef} rotation={[0, Math.PI / 6, 0]}>
          <mesh>
            <cylinderGeometry args={[1.6, 1.6, 0.35, 6]} />
            <meshStandardMaterial color={BRAND.node} metalness={0.75} roughness={0.25} />
          </mesh>
          {/* Ombre/relief simulé */}
          <Text
            position={[0.02, -0.02, 0.19]}
            fontSize={0.7}
            anchorX="center"
            anchorY="middle"
          >
            JS
            <meshStandardMaterial color="#205c20" metalness={0.2} roughness={0.6} />
          </Text>
          <Text
            position={[0, 0, 0.21]}
            fontSize={0.7}
            anchorX="center"
            anchorY="middle"
          >
            JS
            <meshStandardMaterial color="#303030" metalness={0.2} roughness={0.5} />
          </Text>
        </group>
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
    <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.25}>
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
        shadows
        gl={{ alpha: true, antialias: true }}
      >
        {/* ÉCLAIRAGE selon les spécifications recommandées */}
        {/* Lumière ambiante douce */}
        <ambientLight color={0xffffff} intensity={0.5} />
        
        {/* Lumière directionnelle principale */}
        <directionalLight 
          color={0xffffff}
          intensity={0.9}
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

        {/* Ombres de contact au sol */}
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.25}
          scale={10}
          blur={3}
          far={3}
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
          <EffectComposer>
            <Bloom intensity={0.25} luminanceThreshold={0.7} luminanceSmoothing={0.06} />
          </EffectComposer>
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
          autoRotateSpeed={0.6}
          enableDamping={true}
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
