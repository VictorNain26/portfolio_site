/* components/ModelHero.tsx */
'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html, ContactShadows, Environment } from '@react-three/drei';
import { animated, useTransition, type SpringValue } from '@react-spring/three';
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from '@react-three/postprocessing';
import { ReactLogo3D, NextJSLogo3D, TypeScriptLogo3D, NodeJSLogo3D, AILogo3D } from './three/Logos';

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
    name: 'Node.js',
    type: 'nodejs' as const,
    color: '#339933',
    scale: 1.0,
  },
  {
    name: 'OpenAI',
    type: 'openai' as const,
    color: '#10A37F',
    scale: 1.0,
  },
];

/* ──────────────────────────────────────────────────────────────── */
/* 2 · Modèles 3D importés (refacto)                               */

// React - Atome avec noyau, orbites elliptiques et léger glow
// Old inline logo components removed in refactor (see components/three/Logos.tsx)

// Next.js - Disque noir glossy avec trait diagonal minimaliste
// (refacto)

// TypeScript - Plaque bleue arrondie avec lettrage "TS" extrudé
// (refacto)

/*
 * La fonction TailwindLogo a été retirée car le logo Tailwind a été remplacé
 * par le logo OpenAI dans le carrousel. Si vous souhaitez réintroduire
 * Tailwind plus tard, réimplémentez ici un composant similaire.
 */

// Node.js - Hexagone glossy + lettrage "JS"
// (refacto)

// (refacto) OpenAI inline logo removed; see components/three/Logos.tsx

/*
 * IA/LLM - Logo personnalisé symbolisant les réseaux neuronaux.
 * Ce composant affiche une sphère centrale entourée de plusieurs petites
 * sphères en orbite, pour évoquer un réseau de neurones et la coopération
 * entre différentes unités (similaire à un modèle de langage). Les couleurs
 * violettes renforcent l’idée d’innovation et de technologie de pointe.
 */
// (refacto) AI inline logo removed; see components/three/Logos.tsx

/* ──────────────────────────────────────────────────────────────── */
/* 3 · Composant principal de modèle                                */
// Utiliser le type de tous les éléments de TECH_MODELS (et pas seulement
// celui du premier élément) afin de prendre en charge correctement l’entrée
// IA/LLM ajoutée ci-dessus. Le type `(typeof TECH_MODELS)[number]` crée
// une union de tous les objets du tableau.
type ModelProps = {
  model: (typeof TECH_MODELS)[number];
  isVisible: boolean;
  opacity: number | SpringValue<number>;
};

function TechModel({ model, isVisible, opacity }: ModelProps) {
  const renderLogo = () => {
    switch (model.type) {
      case 'react':
        return <ReactLogo3D isVisible={isVisible} opacity={opacity} />;
      case 'nextjs':
        return <NextJSLogo3D isVisible={isVisible} opacity={opacity} />;
      case 'typescript':
        return <TypeScriptLogo3D isVisible={isVisible} opacity={opacity} />;
      case 'nodejs':
        return <NodeJSLogo3D isVisible={isVisible} opacity={opacity} />;
      case 'openai':
        return <AILogo3D isVisible={isVisible} opacity={opacity} />;
      default:
        return null;
    }
  };

  // Retourne seulement le logo (le Float est géré au niveau supérieur pour éviter les doubles flottements)
  return renderLogo();
}

/* 4 · Canvas simplifié avec rotation automatique uniquement        */
export default function ModelHero() {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Défilement automatique sans contrôles manuels
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentModelIndex((prev) => (prev + 1) % TECH_MODELS.length);
    }, 4500);
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

  // Transitions entre modèles 3D (entrées/sorties fluides)
  const transitions = useTransition(currentModel, {
    keys: (m) => m.type,
    from:  { s: 0.9,  px: 0, py: -0.06, pz: -0.18, rx: 0, ry: -0.18, rz: 0, o: 0 },
    enter: { s: 1.0, px: 0, py: 0,     pz: 0,     rx: 0, ry: 0,      rz: 0, o: 1 },
    leave: { s: 0.9,  px: 0, py: 0.06, pz: 0.18,  rx: 0, ry: 0.18,  rz: 0, o: 0 },
    config: { mass: 1, tension: 200, friction: 26, precision: 0.001 },
    exitBeforeEnter: false,
  });

  return (
    <div className="relative w-full h-full">
      {/* Légende permanente */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="rounded-lg bg-black/40 backdrop-blur-sm px-3 py-2 border border-white/20">
          <h3 className="text-sm font-medium text-white">{currentModel.name}</h3>
        </div>
      </div>

      <Canvas
        className="!bg-transparent"
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        shadows
      >
        {/* ÉCLAIRAGE selon les spécifications recommandées */}
        {/* Lumière ambiante douce */}
        <ambientLight color={0xffffff} intensity={0.6} />
        
        {/* Lumière hémisphérique douce (ciel/sol) */}
        <hemisphereLight
          color={0xffffff}
          groundColor={0x222222 as unknown as string}
          intensity={0.5}
          position={[0, 1, 0]}
        />

        {/* Lumière directionnelle principale (ombres) */}
        <directionalLight
          color={0xffffff}
          intensity={1.15}
          position={[5, 8, 6]}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />

        {/* Rim/back light pour révéler l'épaisseur */}
        <directionalLight
          color={0xffffff}
          intensity={0.4}
          position={[-6, -2, -6]}
        />
        
        {/* Lumières d'accentuation pour certains logos */}
        <pointLight 
          color={0x61dafb} 
          intensity={0.5} 
          position={[0, 0, 3]}
          visible={currentModel.type === 'react'}
        />
        {/* Lumière pour Node.js */}
        <pointLight 
          color={0x3c873a} 
          intensity={0.5} 
          position={[0, 0, 3]}
          visible={currentModel.type === 'nodejs'}
        />
        {/* Lumière OpenAI */}
        <pointLight 
          color={0x10a37f} 
          intensity={0.5} 
          position={[0, 0, 3]}
          visible={currentModel.type === 'openai'}
        />

        {/* Ombres de contact au sol */}
        <ContactShadows position={[0, -1.4, 0]} opacity={0.35} scale={10} blur={2.0} far={3.5} />

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
            <Bloom intensity={0.3} luminanceThreshold={0.7} luminanceSmoothing={0.06} />
            <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={2.0} height={480} />
            <Vignette eskil={false} offset={0.12} darkness={0.5} />
            <Noise opacity={0.03} />
          </EffectComposer>

          {transitions((styles, item) => (
            <Float key={item.type} speed={1.1} rotationIntensity={0.15} floatIntensity={0.22}>
              <animated.group
                scale={styles.s}
                position-x={styles.px}
                position-y={styles.py}
                position-z={styles.pz}
                rotation-x={styles.rx}
                rotation-y={styles.ry}
                rotation-z={styles.rz}
              >
                <TechModel model={item} isVisible={!isLoading} opacity={styles.o} />
              </animated.group>
            </Float>
          ))}
        </Suspense>

        {/* Rotation automatique légère (pan désactivé) */}
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
