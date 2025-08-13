/* components/ModelHeroFast.tsx */
'use client';

import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { animated, useTransition, type SpringValue } from '@react-spring/three';
import { 
  FastReactLogo3D, 
  FastNextJSLogo3D, 
  FastTypeScriptLogo3D, 
  FastNodeJSLogo3D, 
  FastAILogo3D 
} from './three/FastLogos';
import { LogoCacheProvider } from './three/LogoCacheContext';

const TECH_MODELS = [
  { name: 'React', type: 'react' as const },
  { name: 'Next.js', type: 'nextjs' as const },
  { name: 'TypeScript', type: 'typescript' as const },
  { name: 'Node.js', type: 'nodejs' as const },
  { name: 'OpenAI', type: 'openai' as const },
];

// Optimized constants
const CAMERA_Z_POSITION = 5;
const CAMERA_FOV = 50;
const DPR_MIN = 0.7;
const DPR_MAX = 1.5;
const ROTATION_INTERVAL = 8000;

type ModelProps = {
  model: (typeof TECH_MODELS)[number];
  isVisible: boolean;
  opacity: SpringValue<number> | number;
};

function FastTechModel({ model, isVisible, opacity }: ModelProps) {
  switch (model.type) {
    case 'react':
      return <FastReactLogo3D isVisible={isVisible} opacity={opacity} />;
    case 'nextjs':
      return <FastNextJSLogo3D isVisible={isVisible} opacity={opacity} />;
    case 'typescript':
      return <FastTypeScriptLogo3D isVisible={isVisible} opacity={opacity} />;
    case 'nodejs':
      return <FastNodeJSLogo3D isVisible={isVisible} opacity={opacity} />;
    case 'openai':
      return <FastAILogo3D isVisible={isVisible} opacity={opacity} />;
    default:
      return null;
  }
}

// Simple fallback component for immediate display
function SimpleFallbackLogo() {
  return (
    <mesh scale={[2, 2, 0.3]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#61DAFB"
        metalness={0.1}
        roughness={0.3}
      />
    </mesh>
  );
}

function useOptimizedModelState() {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);

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

    const interval = setInterval(() => {
      setCurrentModelIndex(prev => (prev + 1) % TECH_MODELS.length);
    }, ROTATION_INTERVAL);

    return () => { clearInterval(interval); };
  }, [prefersReducedMotion, isInView, isPageVisible]);

  // Page visibility handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    currentModelIndex,
    setCurrentModelIndex,
    prefersReducedMotion,
    isHovered,
    setIsHovered,
    isInView,
    setIsInView,
    isPageVisible,
  };
}

function ModelHeroCore() {
  const {
    currentModelIndex,
    prefersReducedMotion,
    isHovered,
    setIsHovered,
    isInView,
    setIsInView,
    isPageVisible,
  } = useOptimizedModelState();

  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer
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
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [setIsInView]);

  const currentModel = TECH_MODELS[currentModelIndex] ?? TECH_MODELS[0];

  // Fast transitions
  const transitions = useTransition(currentModel, {
    keys: m => m?.type ?? 'default',
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: prefersReducedMotion 
      ? { duration: 0 }
      : { mass: 0.6, tension: 280, friction: 30 },
    exitBeforeEnter: true,
  });

  // Optimized Canvas configuration
  const canvasConfig = useMemo(() => ({
    camera: { 
      position: [0, 0, CAMERA_Z_POSITION] as [number, number, number], 
      fov: CAMERA_FOV 
    },
    dpr: [DPR_MIN, DPR_MAX] as [number, number],
    gl: { 
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance' as const,
      preserveDrawingBuffer: false,
      stencil: false
    }
  }), []);

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
      {/* Hover label */}
      {isHovered && currentModel && (
        <div className="pointer-events-none absolute top-4 left-4 z-10">
          <div className="animate-in fade-in rounded-lg border border-white/20 bg-black/50 px-3 py-2 backdrop-blur-sm duration-100">
            <h3 className="text-sm font-medium text-white">{currentModel.name}</h3>
          </div>
        </div>
      )}

      <Canvas {...canvasConfig}>
        <Suspense fallback={<SimpleFallbackLogo />}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight intensity={1} position={[10, 10, 5]} />

          {/* Current model with immediate display */}
          {transitions((styles, item) => {
            if (!item) {
              return null;
            }
            
            return (
              <animated.group key={item.type}>
                <FastTechModel
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

export default function ModelHeroFast() {
  return (
    <LogoCacheProvider>
      <ModelHeroCore />
    </LogoCacheProvider>
  );
}