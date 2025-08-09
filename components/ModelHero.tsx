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
import type { Group, Mesh } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

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
    // Remplacer Tailwind par OpenAI pour refléter la présence d'IA dans la stack
    name: 'OpenAI',
    type: 'openai' as const,
    color: '#10A37F',
    scale: 1.0,
  },
  {
    name: 'Node.js',
    type: 'nodejs' as const,
    color: '#339933',
    scale: 1.0,
  },

    // Ajout d'une entrée IA/LLM pour mettre en avant les compétences en intelligence
    // artificielle et modèles de langage. Cette entrée s'affichera dans le carrousel
    // 3D du Hero et permettra de présenter un logo personnalisé représentant un
    // réseau neuronal. La couleur violette (#8A2BE2) est choisie pour évoquer
    // l'innovation et les technologies avancées.
    {
      name: 'IA & LLM',
      type: 'ai' as const,
      color: '#8A2BE2',
      scale: 1.0,
    },
];

/* ──────────────────────────────────────────────────────────────── */
/* 2 · Modèles 3D simples et reconnaissables                       */

// React - Atome avec noyau, orbites elliptiques et léger glow
function ReactLogo({ isVisible }: { isVisible: boolean }) {
  const groupRef = useRef<Group>(null);
  
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
        
        {/* 3 orbites elliptiques */}
            {[0, 60, 120].map((rotation, i) => (
              <group key={i} rotation={[Math.PI / 6, 0, (rotation * Math.PI) / 180]}>
                {/* Boucles affinées : rayon réduit et tube plus fin pour un look plus proche du logo React officiel */}
                <mesh scale={[1.0, 0.55, 1.0]}>
                  <torusGeometry args={[1.25, 0.05, 16, 64]} />
                  <meshStandardMaterial
                    color="#61DAFB"
                    transparent
                    opacity={0.8}
                    metalness={0.2}
                    roughness={0.1}
                  />
                </mesh>
              </group>
            ))}
      </Center>
    </animated.group>
  );
}

// Next.js - Disque noir glossy avec trait diagonal minimaliste
function NextJSLogo({ isVisible }: { isVisible: boolean }) {
  const groupRef = useRef<Group>(null);

  // an animation that gently oscillates the N around the Y axis
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      // slight rocking effect for visual interest
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const springs = useSpring({
    scale: isVisible ? 1 : 0,
  });

  return (
    <animated.group ref={groupRef} scale={springs.scale}>
      <Center>
        {/* 'N' logo for Next.js: two vertical bars and a diagonal connector */}
        {/* Left vertical bar */}
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Right vertical bar */}
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.15, 1.6, 0.15]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Diagonal bar connecting the two vertical bars */}
        <mesh rotation={[0, 0, -0.52]} position={[0, 0, 0]}>
          {/* Length chosen to bridge the gap between the vertical bars */}
          <boxGeometry args={[2.0, 0.15, 0.15]} />
          <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.4} />
        </mesh>
      </Center>
    </animated.group>
  );
}

// TypeScript - Plaque bleue arrondie avec lettrage "TS" extrudé
function TypeScriptLogo({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<Mesh>(null);
  
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
        <group ref={meshRef}>
          <RoundedBox args={[2.6, 2.6, 0.4]} radius={0.25} smoothness={6}>
            <meshStandardMaterial color="#3178C6" metalness={0.5} roughness={0.3} />
          </RoundedBox>
          {/* Ombre/relief simulé */}
          <Text
            position={[0.02, -0.02, 0.22]}
            fontSize={0.9}
            letterSpacing={-0.04}
            anchorX="center"
            anchorY="middle"
          >
            TS
            <meshStandardMaterial color="#1f3f83" metalness={0.2} roughness={0.6} />
          </Text>
          <Text
            position={[0, 0, 0.24]}
            fontSize={0.9}
            letterSpacing={-0.04}
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

/*
 * La fonction TailwindLogo a été retirée car le logo Tailwind a été remplacé
 * par le logo OpenAI dans le carrousel. Si vous souhaitez réintroduire
 * Tailwind plus tard, réimplémentez ici un composant similaire.
 */

// Node.js - Hexagone glossy + lettrage "JS"
function NodeJSLogo({ isVisible }: { isVisible: boolean }) {
  const meshRef = useRef<Mesh>(null);
  
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
        <group ref={meshRef} rotation={[0, Math.PI / 6, 0]}>
        <mesh>
            <cylinderGeometry args={[1.6, 1.6, 0.35, 6]} />
            {/* Utilisez la couleur officielle Node.js (#3C873A) pour la base */}
            <meshStandardMaterial color="#3C873A" metalness={0.75} roughness={0.25} />
          </mesh>
          {/* Ombre/relief simulé pour les lettres "JS" */}
          <Text
            position={[0.02, -0.02, 0.19]}
            fontSize={0.7}
            anchorX="center"
            anchorY="middle"
          >
            JS
            {/* Ombre foncée pour simuler un léger relief */}
            <meshStandardMaterial color="#28562c" metalness={0.2} roughness={0.6} />
          </Text>
          <Text
            position={[0, 0, 0.21]}
            fontSize={0.7}
            anchorX="center"
            anchorY="middle"
          >
            JS
            {/* Couleur claire pour le premier plan des lettres */}
            <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.5} />
          </Text>
        </group>
      </Center>
    </animated.group>
  );
}

// OpenAI - Rosace à 6 anneaux rappelant le logo OpenAI
function OpenAILogo({ isVisible }: { isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  // Rotation lente pour donner un effet vivant à la rosace
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  const springs = useSpring({ scale: isVisible ? 1 : 0 });

  // Génère un tableau de six éléments pour créer les anneaux
  const petals = useMemo(() => Array.from({ length: 6 }), []);

  return (
    <animated.group ref={groupRef} scale={springs.scale}>
      <Center>
        {petals.map((_, i) => {
          const angle = (i * Math.PI) / 3; // 60° d'intervalle
          return (
            <mesh key={i} rotation={[Math.PI / 2, 0, angle]}>
              <torusGeometry args={[1.0, 0.12, 16, 100]} />
              <meshStandardMaterial color="#10A37F" metalness={0.3} roughness={0.5} />
            </mesh>
          );
        })}
      </Center>
    </animated.group>
  );
}

/*
 * IA/LLM - Logo personnalisé symbolisant les réseaux neuronaux.
 * Ce composant affiche une sphère centrale entourée de plusieurs petites
 * sphères en orbite, pour évoquer un réseau de neurones et la coopération
 * entre différentes unités (similaire à un modèle de langage). Les couleurs
 * violettes renforcent l’idée d’innovation et de technologie de pointe.
 */
function AiLogo({ isVisible }: { isVisible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  // Rotation lente autour de l’axe Y lorsque le logo est visible
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  // Animation d’apparition / disparition
  const springs = useSpring({
    scale: isVisible ? 1 : 0,
  });

  // Génère un tableau d’angles uniformément répartis pour positionner les nœuds
  const orbitAngles = Array.from({ length: 6 }).map((_, i) => (i / 6) * Math.PI * 2);

  return (
    <animated.group ref={groupRef} scale={springs.scale}>
      <Center>
        {/* Sphère centrale */}
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#8A2BE2" emissive="#8A2BE2" emissiveIntensity={0.3} />
        </mesh>
        {/* Sphères en orbite pour représenter les neurones */}
        {orbitAngles.map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0]}
          >
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#A987FF" emissive="#A987FF" emissiveIntensity={0.2} />
          </mesh>
        ))}
      </Center>
    </animated.group>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* 3 · Composant principal de modèle                                */
// Utiliser le type de tous les éléments de TECH_MODELS (et pas seulement
// celui du premier élément) afin de prendre en charge correctement l’entrée
// IA/LLM ajoutée ci-dessus. Le type `(typeof TECH_MODELS)[number]` crée
// une union de tous les objets du tableau.
type ModelProps = {
  model: (typeof TECH_MODELS)[number];
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
      case 'openai':
        return <OpenAILogo isVisible={isVisible} />;
      case 'nodejs':
        return <NodeJSLogo isVisible={isVisible} />;
          case 'ai':
            return <AiLogo isVisible={isVisible} />;
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
        {/* Lumière d'accentuation pour OpenAI */}
        <pointLight 
          color={0x10a37f} 
          intensity={0.5} 
          position={[0, 0, 3]}
          visible={currentModel.type === 'openai'}
        />
        {/* Lumière pour Node.js */}
        <pointLight 
          color={0x3c873a} 
          intensity={0.5} 
          position={[0, 0, 3]}
          visible={currentModel.type === 'nodejs'}
        />

            {/* Lumière violette pour le logo IA/LLM */}
            <pointLight
              color={0x8A2BE2}
              intensity={0.5}
              position={[0, 0, 3]}
              visible={currentModel.type === 'ai'}
            />

        {/* Ombres de contact au sol */}
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.3}
          scale={10}
          blur={2.5}
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
            <Bloom intensity={0.35} luminanceThreshold={0.7} luminanceSmoothing={0.05} />
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
          autoRotateSpeed={1}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
