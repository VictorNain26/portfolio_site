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

const CAMERA_Z_POSITION = 5;
const CAMERA_FOV = 50;
const DPR_MIN = 1;
const DPR_MAX = 1.5;
const AMBIENT_LIGHT_INTENSITY = 0.6;
const DIRECTIONAL_LIGHT_INTENSITY = 1;
const DIRECTIONAL_LIGHT_X = 10;
const DIRECTIONAL_LIGHT_Y = 10;
const DIRECTIONAL_LIGHT_Z = 5;

type ModelProps = {
  model: (typeof TECH_MODELS)[number];
  isVisible: boolean;
  opacity: SpringValue<number> | number;
};

function TechModel({ model, isVisible, opacity }: ModelProps) {
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
}

export default function ModelHero() {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);
    const handler = () => {
      setPrefersReducedMotion(media.matches);
    };
    media.addEventListener('change', handler);
    return () => {
      media.removeEventListener('change', handler);
    };
  }, []);

  // Auto-rotate models
  useEffect(() => {
    if (prefersReducedMotion || !isInView || !isPageVisible) {
      return;
    }

    const ROTATION_INTERVAL = 8000;
    const interval = setInterval(() => {
      setCurrentModelIndex(prev => {
        const nextIndex = (prev + 1) % TECH_MODELS.length;
        return nextIndex;
      });
    }, ROTATION_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [prefersReducedMotion, isInView, isPageVisible]);

  // Page Visibility API to handle tab changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsPageVisible(visible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Intersection Observer to pause when not in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsInView(entry.isIntersecting);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Ensure we always have a valid model
  const safeIndex = Math.max(0, Math.min(currentModelIndex, TECH_MODELS.length - 1));
  const currentModel = TECH_MODELS[safeIndex];

  // Recovery mechanism - reset if model becomes invalid
  useEffect(() => {
    if (!currentModel || !TECH_MODELS[safeIndex]) {
      setCurrentModelIndex(0);
    }
  }, [currentModel, safeIndex]);

  // Simple fade transition
  const transitions = useTransition(currentModel, {
    keys: m => m?.type ?? 'default',
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 280, friction: 40 },
    exitBeforeEnter: true,
  });

  return (
    <div
      ref={containerRef}
      aria-label={`3D model: ${currentModel?.name ?? 'Loading'}`}
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {/* Hover label - shows current model name */}
      {isHovered && (
        <div className="pointer-events-none absolute top-4 left-4 z-10">
          <div className="animate-in fade-in rounded-lg border border-white/20 bg-black/50 px-3 py-2 backdrop-blur-sm duration-200">
            <h3 className="text-sm font-medium text-white">{currentModel?.name}</h3>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, CAMERA_Z_POSITION], fov: CAMERA_FOV }}
        dpr={[DPR_MIN, DPR_MAX]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Simple lighting setup */}
          <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
          <directionalLight intensity={DIRECTIONAL_LIGHT_INTENSITY} position={[DIRECTIONAL_LIGHT_X, DIRECTIONAL_LIGHT_Y, DIRECTIONAL_LIGHT_Z]} />
          <Environment preset="city" />

          {/* Preload all models invisibly */}
          {isPageVisible
            && TECH_MODELS.map(model => (
              <group key={`preload-${model.type}`} visible={false}>
                <TechModel isVisible={isInView && isPageVisible} model={model} opacity={0} />
              </group>
            ))}

          {/* Current visible model */}
          {transitions((styles, item) => {
            if (!item) {
              return null;
            }
            return (
              <animated.group key={item.type}>
                <TechModel
                  isVisible={isInView && isPageVisible}
                  model={item}
                  opacity={styles.opacity}
                />
              </animated.group>
            );
          })}
        </Suspense>
      </Canvas>
    </div>
  );
}
