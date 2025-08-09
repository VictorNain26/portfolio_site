/* components/ModelHero.tsx */
'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { animated, useTransition, type SpringValue } from '@react-spring/three';
import { ReactLogo3D, NextJSLogo3D, TypeScriptLogo3D, NodeJSLogo3D, AILogo3D } from './three/Logos';

const TECH_MODELS = [
  { name: 'React', type: 'react' as const },
  { name: 'Next.js', type: 'nextjs' as const },
  { name: 'TypeScript', type: 'typescript' as const },
  { name: 'Node.js', type: 'nodejs' as const },
  { name: 'OpenAI', type: 'openai' as const },
];

type ModelProps = {
  model: typeof TECH_MODELS[number];
  isVisible: boolean;
  opacity: number | SpringValue<number>;
};

function TechModel({ model, isVisible, opacity }: ModelProps) {
  switch (model.type) {
    case 'react': return <ReactLogo3D isVisible={isVisible} opacity={opacity} />;
    case 'nextjs': return <NextJSLogo3D isVisible={isVisible} opacity={opacity} />;
    case 'typescript': return <TypeScriptLogo3D isVisible={isVisible} opacity={opacity} />;
    case 'nodejs': return <NodeJSLogo3D isVisible={isVisible} opacity={opacity} />;
    case 'openai': return <AILogo3D isVisible={isVisible} opacity={opacity} />;
    default: return null;
  }
}

export default function ModelHero() {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);
    const handler = () => setPrefersReducedMotion(media.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Auto-rotate models
  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentModelIndex((prev) => (prev + 1) % TECH_MODELS.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const currentModel = TECH_MODELS[currentModelIndex];

  // Simple fade transition
  const transitions = useTransition(currentModel, {
    keys: (m) => m?.type || '',
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 180, friction: 30 },
    exitBeforeEnter: true,
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      aria-label={`3D model: ${currentModel?.name || 'Loading'}`}
      onMouseEnter={() => setHoveredModel(currentModel?.type || null)}
      onMouseLeave={() => setHoveredModel(null)}
    >
      {/* Hover label */}
      {hoveredModel && (
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 animate-in fade-in duration-200">
            <h3 className="text-sm font-medium text-white">
              {TECH_MODELS.find(m => m.type === hoveredModel)?.name}
            </h3>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Simple lighting setup */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Environment preset="city" />

          {/* Preload all models invisibly */}
          {!isLoading && TECH_MODELS.map((model) => (
            <group key={`preload-${model.type}`} visible={false}>
              <TechModel model={model} isVisible={true} opacity={0} />
            </group>
          ))}
          
          {/* Current visible model */}
          {transitions((styles, item) => 
            item ? (
              <animated.group key={item.type}>
                <TechModel model={item} isVisible={true} opacity={styles.opacity} />
              </animated.group>
            ) : null
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}