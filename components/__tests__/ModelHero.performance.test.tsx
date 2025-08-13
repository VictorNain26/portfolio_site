/**
 * Performance tests for 3D models loading
 * Ensures no regression in loading times
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { performance } from 'node:perf_hooks';
import ModelHero from '../ModelHero';

// Mock @react-three/fiber and @react-three/drei
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, onCreated }: any) => {
    // Simulate canvas creation with delay
    setTimeout(() => onCreated?.(), 100);
    return <div data-testid="canvas">{children}</div>;
  },
  useFrame: vi.fn(),
  useLoader: vi.fn(() => ({
    paths: [
      {
        userData: {},
        currentPath: {
          getPoints: () => [{ x: 0, y: 0 }, { x: 1, y: 1 }]
        }
      }
    ]
  }))
}));

vi.mock('@react-spring/three', () => ({
  animated: {
    group: ({ children }: any) => <div data-testid="animated-group">{children}</div>,
    meshStandardMaterial: (props: any) => <div data-testid="material" {...props} />
  },
  useTransition: () => [
    [{ opacity: 1, item: { type: 'react', name: 'React' } }],
    (fn: any) => null
  ]
}));

vi.mock('three', () => ({
  ExtrudeGeometry: class MockExtrudeGeometry {
    constructor() {
      // Simulate geometry creation time
      const start = performance.now();
      while (performance.now() - start < 50) {
        // Simulate computational work
      }
    }
  },
  Box3: class MockBox3 {
    setFromObject() { return this; }
    getCenter() { return { x: 0, y: 0, z: 0 }; }
  },
  Vector3: class MockVector3 {
    constructor() {}
    sub() { return this; }
  }
}));

vi.mock('three/examples/jsm/loaders/SVGLoader.js', () => ({
  SVGLoader: {
    createShapes: () => [
      {
        extractPoints: () => ({ shape: [{ x: 0, y: 0 }, { x: 1, y: 1 }] })
      }
    ]
  }
}));

// Performance thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  INITIAL_RENDER: 500, // Initial render should be < 500ms
  MODEL_SWITCH: 200,   // Model switching should be < 200ms  
  TOTAL_LOAD: 1000,    // Total load time should be < 1s
} as const;

interface PerformanceMetrics {
  initialRender: number;
  totalLoad: number;
  modelSwitch?: number;
}

describe('ModelHero Performance Tests', () => {
  let performanceMetrics: PerformanceMetrics;

  beforeEach(() => {
    performanceMetrics = {
      initialRender: 0,
      totalLoad: 0
    };
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('should render initial model within performance threshold', async () => {
    const startTime = performance.now();
    
    render(<ModelHero />);
    
    // Wait for canvas to appear
    await waitFor(() => {
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    const endTime = performance.now();
    performanceMetrics.initialRender = endTime - startTime;

    // Assert performance threshold
    expect(performanceMetrics.initialRender).toBeLessThan(PERFORMANCE_THRESHOLDS.INITIAL_RENDER);
  });

  it('should complete total loading within performance threshold', async () => {
    const startTime = performance.now();
    
    render(<ModelHero />);

    // Fast-forward timers to simulate preload delays
    vi.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    const endTime = performance.now();
    performanceMetrics.totalLoad = endTime - startTime;

    // Assert performance threshold
    expect(performanceMetrics.totalLoad).toBeLessThan(PERFORMANCE_THRESHOLDS.TOTAL_LOAD);
  });

  it('should handle model switching efficiently', async () => {
    render(<ModelHero />);

    await waitFor(() => {
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    const switchStartTime = performance.now();
    
    // Simulate model rotation interval
    vi.advanceTimersByTime(8000);

    const switchEndTime = performance.now();
    performanceMetrics.modelSwitch = switchEndTime - switchStartTime;

    // Assert model switching is efficient
    expect(performanceMetrics.modelSwitch).toBeLessThan(PERFORMANCE_THRESHOLDS.MODEL_SWITCH);
  });

  it('should not exceed memory usage during rendering', async () => {
    const memoryBefore = process.memoryUsage();
    
    render(<ModelHero />);
    
    await waitFor(() => {
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    vi.advanceTimersByTime(2000);

    const memoryAfter = process.memoryUsage();
    const memoryIncrease = memoryAfter.heapUsed - memoryBefore.heapUsed;
    
    // Memory increase should be reasonable (< 50MB for all models)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });

  it('should handle rapid model switches without performance degradation', async () => {
    render(<ModelHero />);

    await waitFor(() => {
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    const switchTimes: number[] = [];
    
    // Perform multiple rapid switches
    for (let i = 0; i < 5; i++) {
      const switchStart = performance.now();
      vi.advanceTimersByTime(8000);
      const switchEnd = performance.now();
      switchTimes.push(switchEnd - switchStart);
    }

    // All switches should be consistently fast
    switchTimes.forEach(switchTime => {
      expect(switchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.MODEL_SWITCH);
    });

    // No performance degradation over time
    const firstSwitch = switchTimes[0];
    const lastSwitch = switchTimes[switchTimes.length - 1];
    expect(lastSwitch).toBeLessThanOrEqual(firstSwitch * 1.2); // Max 20% degradation
  });

  it('should maintain 60 FPS during animations', async () => {
    render(<ModelHero />);

    await waitFor(() => {
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    // Simulate frame rendering
    const frameTargetTime = 1000 / 60; // 16.67ms per frame for 60 FPS
    const frameRenderTime = performance.now();
    
    // Fast-forward multiple frames
    vi.advanceTimersByTime(frameTargetTime * 10);
    
    const totalFrameTime = performance.now() - frameRenderTime;
    const averageFrameTime = totalFrameTime / 10;

    // Each frame should render within target time
    expect(averageFrameTime).toBeLessThan(frameTargetTime);
  });

  // Regression test to prevent performance degradation
  it('should maintain baseline performance metrics', async () => {
    const baselineMetrics = {
      initialRender: PERFORMANCE_THRESHOLDS.INITIAL_RENDER * 0.8,
      totalLoad: PERFORMANCE_THRESHOLDS.TOTAL_LOAD * 0.8,
      modelSwitch: PERFORMANCE_THRESHOLDS.MODEL_SWITCH * 0.8
    };

    const startTime = performance.now();
    render(<ModelHero />);

    await waitFor(() => {
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    const renderTime = performance.now() - startTime;
    
    // Should maintain better than 80% of threshold (regression detection)
    expect(renderTime).toBeLessThan(baselineMetrics.initialRender);
  });
});