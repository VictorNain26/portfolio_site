/* components/ModelHeroOptimized.tsx */
'use client';

import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { animated, useTransition, type SpringValue } from '@react-spring/three';
import { 
  OptimizedReactLogo, 
  OptimizedNextJSLogo, 
  OptimizedTypeScriptLogo, 
  OptimizedNodeJSLogo, 
  OptimizedAILogo 
} from './three/OptimizedLogo3D';
import { usePerformanceMetrics, PerformanceMonitor } from '../hooks/usePerformanceMetrics';

const TECH_MODELS = [
  { name: 'React', type: 'react' as const },
  { name: 'Next.js', type: 'nextjs' as const },
  { name: 'TypeScript', type: 'typescript' as const },
  { name: 'Node.js', type: 'nodejs' as const },
  { name: 'OpenAI', type: 'openai' as const },
];

// Ultra-optimized constants
const CAMERA_Z_POSITION = 4;
const CAMERA_FOV = 45;
// Faster rotation
const ROTATION_INTERVAL = 6000;
const DPR_MIN = 0.8;
const DPR_MAX = 1.2;
const LIGHT_POSITION_X = 5;
const LIGHT_POSITION_Y = 5;
const LIGHT_POSITION_Z = 5;

type ModelProps = {
  model: (typeof TECH_MODELS)[number];
  isVisible: boolean;
  opacity: SpringValue<number> | number;
};

// Optimized model component with zero dependencies on heavy loaders
function OptimizedTechModel({ model, isVisible, opacity }: ModelProps) {
  switch (model.type) {
    case 'react':
      return <OptimizedReactLogo isVisible={isVisible} opacity={opacity} />;
    case 'nextjs':
      return <OptimizedNextJSLogo isVisible={isVisible} opacity={opacity} />;
    case 'typescript':
      return <OptimizedTypeScriptLogo isVisible={isVisible} opacity={opacity} />;
    case 'nodejs':
      return <OptimizedNodeJSLogo isVisible={isVisible} opacity={opacity} />;
    case 'openai':
      return <OptimizedAILogo isVisible={isVisible} opacity={opacity} />;
    default:
      return null;
  }
}

// Minimal state management for ultra-fast performance
function useOptimizedModelState() {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  
  // Simplified rotation logic
  useEffect(() => {
    if (!isInView || !isPageVisible) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentModelIndex(prev => (prev + 1) % TECH_MODELS.length);
    }, ROTATION_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [isInView, isPageVisible]);

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
    isInView,
    setIsInView,
    isPageVisible,
  };
}

export default function ModelHeroOptimized() {
  const {
    currentModelIndex,
    setIsInView,
  } = useOptimizedModelState();

  const containerRef = useRef<HTMLDivElement>(null);
  // Immediate rendering - no loading state needed
  const [isHovered, setIsHovered] = useState(false);

  // Performance tracking
  const {
    startLoadTracking,
    endLoadTracking,
    startRenderTracking,
    endRenderTracking,
  } = usePerformanceMetrics({
    // Ultra-strict: 500ms max
    maxLoadTime: 500,
    // Ultra-strict: 50ms max
    maxRenderTime: 50,
    // Higher minimum FPS
    minFrameRate: 45,
  });

  // Start performance tracking
  useEffect(() => {
    startLoadTracking();
  }, [startLoadTracking]);

  // Intersection Observer for visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry?.isIntersecting ?? false);
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [setIsInView]);

  const currentModel = TECH_MODELS[currentModelIndex];

  // Ultra-fast transitions with minimal config
  const transitions = useTransition(currentModel, {
    keys: m => m?.type ?? 'default',
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    // Super fast transitions
    config: { duration: 200 },
    exitBeforeEnter: true,
  });

  // Memoized Canvas configuration for zero re-renders
  const canvasConfig = useMemo(() => ({
    camera: { position: [0, 0, CAMERA_Z_POSITION] as [number, number, number], fov: CAMERA_FOV },
    dpr: [DPR_MIN, DPR_MAX] as [number, number],
    gl: { 
      alpha: true,
      // Disabled for max performance
      antialias: false,
      powerPreference: 'high-performance' as const,
      preserveDrawingBuffer: false,
      stencil: false,
    }
  }), []);

  const handleCanvasCreated = () => {
    // Canvas is ready, performance tracking
    endLoadTracking();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    startRenderTracking();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    endRenderTracking();
  };

  return (
    <>
      <PerformanceMonitor />
      <div
        ref={containerRef}
        aria-label={`3D model: ${currentModel?.name ?? 'Loading'}`}
        className="relative h-full w-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Ultra-minimal hover label */}
        {isHovered && currentModel && (
          <div className="pointer-events-none absolute top-4 left-4 z-10">
            <div className="animate-in fade-in rounded-lg border border-white/20 bg-black/50 px-3 py-2 backdrop-blur-sm duration-100">
              <h3 className="text-sm font-medium text-white">{currentModel.name}</h3>
            </div>
          </div>
        )}

        <Canvas {...canvasConfig} onCreated={handleCanvasCreated}>
          <Suspense fallback={null}>
            {/* Minimal lighting for max performance */}
            <ambientLight intensity={0.8} />
            <directionalLight intensity={0.6} position={[LIGHT_POSITION_X, LIGHT_POSITION_Y, LIGHT_POSITION_Z]} />

            {/* Render current model immediately */}
            {transitions((styles, item) => {
              if (!item) {
                return null;
              }
              
              return (
                <animated.group key={item.type}>
                  <OptimizedTechModel
                    isVisible
                    model={item}
                    opacity={styles.opacity}
                  />
                </animated.group>
              );
            })}
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}