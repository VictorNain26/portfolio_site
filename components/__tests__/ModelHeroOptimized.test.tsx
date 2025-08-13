/**
 * Tests for the optimized 3D models
 * Ensures ultra-fast performance and no regressions
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { performance } from 'node:perf_hooks';
import ModelHeroOptimized from '../ModelHeroOptimized';

// Mock the optimized components
vi.mock('../three/OptimizedLogo3D', () => ({
  OptimizedReactLogo: ({ isVisible, opacity }: any) => (
    <div data-testid="optimized-react" data-visible={isVisible} data-opacity={opacity} />
  ),
  OptimizedNextJSLogo: ({ isVisible, opacity }: any) => (
    <div data-testid="optimized-nextjs" data-visible={isVisible} data-opacity={opacity} />
  ),
  OptimizedTypeScriptLogo: ({ isVisible, opacity }: any) => (
    <div data-testid="optimized-typescript" data-visible={isVisible} data-opacity={opacity} />
  ),
  OptimizedNodeJSLogo: ({ isVisible, opacity }: any) => (
    <div data-testid="optimized-nodejs" data-visible={isVisible} data-opacity={opacity} />
  ),
  OptimizedAILogo: ({ isVisible, opacity }: any) => (
    <div data-testid="optimized-openai" data-visible={isVisible} data-opacity={opacity} />
  ),
}));

vi.mock('../../hooks/usePerformanceMetrics', () => ({
  usePerformanceMetrics: () => ({
    startLoadTracking: vi.fn(),
    endLoadTracking: vi.fn(),
    startRenderTracking: vi.fn(),
    endRenderTracking: vi.fn(),
  }),
  PerformanceMonitor: () => <div data-testid="performance-monitor" />,
}));

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, onCreated }: any) => {
    // Simulate instant canvas creation
    setTimeout(() => onCreated?.(), 10);
    return <div data-testid="optimized-canvas">{children}</div>;
  },
  useFrame: vi.fn(),
}));

vi.mock('@react-spring/three', () => ({
  animated: {
    group: ({ children }: any) => <div data-testid="animated-group">{children}</div>,
  },
  useTransition: () => [
    [{ opacity: 1, item: { type: 'react', name: 'React' } }],
  ]
}));

// Ultra-strict performance thresholds for optimized version
const OPTIMIZED_THRESHOLDS = {
  INITIAL_RENDER: 100,   // 100ms max
  TOTAL_LOAD: 300,       // 300ms max
  MODEL_SWITCH: 50,      // 50ms max
} as const;

describe('ModelHeroOptimized Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('should render optimized model instantly', async () => {
    const startTime = performance.now();
    
    render(<ModelHeroOptimized />);
    
    // Should find canvas immediately
    await waitFor(() => {
      expect(screen.getByTestId('optimized-canvas')).toBeInTheDocument();
    });

    const renderTime = performance.now() - startTime;

    // Ultra-fast rendering
    expect(renderTime).toBeLessThan(OPTIMIZED_THRESHOLDS.INITIAL_RENDER);
  });

  it('should complete loading under ultra-strict threshold', async () => {
    const startTime = performance.now();
    
    render(<ModelHeroOptimized />);

    // Fast-forward minimal timers
    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(screen.getByTestId('optimized-canvas')).toBeInTheDocument();
    });

    const totalTime = performance.now() - startTime;

    // Total load should be under 300ms
    expect(totalTime).toBeLessThan(OPTIMIZED_THRESHOLDS.TOTAL_LOAD);
  });

  it('should switch models ultra-fast', async () => {
    render(<ModelHeroOptimized />);

    await waitFor(() => {
      expect(screen.getByTestId('optimized-canvas')).toBeInTheDocument();
    });

    const switchStart = performance.now();
    
    // Simulate model rotation (6 seconds)
    vi.advanceTimersByTime(6000);

    const switchTime = performance.now() - switchStart;

    // Model switching should be instant
    expect(switchTime).toBeLessThan(OPTIMIZED_THRESHOLDS.MODEL_SWITCH);
  });

  it('should include performance monitor', () => {
    render(<ModelHeroOptimized />);
    
    expect(screen.getByTestId('performance-monitor')).toBeInTheDocument();
  });

  it('should use optimized components only', async () => {
    render(<ModelHeroOptimized />);

    await waitFor(() => {
      expect(screen.getByTestId('optimized-canvas')).toBeInTheDocument();
    });

    // Should find optimized react component
    expect(screen.getByTestId('optimized-react')).toBeInTheDocument();
  });

  it('should handle visibility changes efficiently', async () => {
    render(<ModelHeroOptimized />);

    await waitFor(() => {
      expect(screen.getByTestId('optimized-canvas')).toBeInTheDocument();
    });

    // Simulate visibility change
    const visibilityStart = performance.now();
    
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: true
    });
    document.dispatchEvent(new Event('visibilitychange'));

    const visibilityTime = performance.now() - visibilityStart;

    // Visibility handling should be instant
    expect(visibilityTime).toBeLessThan(10);
  });

  it('should maintain consistent performance across multiple renders', async () => {
    const renderTimes: number[] = [];

    // Render multiple times
    for (let i = 0; i < 5; i++) {
      const startTime = performance.now();
      
      const { unmount } = render(<ModelHeroOptimized />);
      
      await waitFor(() => {
        expect(screen.getByTestId('optimized-canvas')).toBeInTheDocument();
      });

      const renderTime = performance.now() - startTime;
      renderTimes.push(renderTime);
      
      unmount();
    }

    // All renders should be consistently fast
    renderTimes.forEach(renderTime => {
      expect(renderTime).toBeLessThan(OPTIMIZED_THRESHOLDS.INITIAL_RENDER);
    });

    // Performance should not degrade
    const firstRender = renderTimes[0];
    const lastRender = renderTimes[renderTimes.length - 1];
    expect(lastRender).toBeLessThanOrEqual(firstRender * 1.1); // Max 10% variation
  });

  // Strict regression baseline
  it('optimized performance baseline', async () => {
    const startTime = performance.now();
    
    render(<ModelHeroOptimized />);
    
    await waitFor(() => {
      expect(screen.getByTestId('optimized-canvas')).toBeInTheDocument();
    });

    const totalTime = performance.now() - startTime;

    console.log(`🚀 Optimized Performance: ${totalTime.toFixed(2)}ms`);

    // Should be under 50ms for the optimized version
    expect(totalTime).toBeLessThan(50);
  });
});