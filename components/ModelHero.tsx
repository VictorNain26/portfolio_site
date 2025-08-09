/* components/ModelHero.tsx */
'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Html, ContactShadows } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
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
};

function TechModel({ model, isVisible }: ModelProps) {
  const renderLogo = () => {
    switch (model.type) {
      case 'react':
        return <ReactLogo3D isVisible={isVisible} />;
      case 'nextjs':
        return <NextJSLogo3D isVisible={isVisible} />;
      case 'typescript':
        return <TypeScriptLogo3D isVisible={isVisible} />;
      case 'nodejs':
        return <NodeJSLogo3D isVisible={isVisible} />;
      case 'openai':
      case 'ai':
        return <AILogo3D isVisible={isVisible} />;
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
