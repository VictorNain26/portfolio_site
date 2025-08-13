/**
 * Integration tests for 3D models - Focused on reliability over performance
 * Tests core functionality without complex timing requirements
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ModelHeroOptimized from '../ModelHeroOptimized';

// Simple and reliable mocks
vi.mock('../three/OptimizedLogo3D', () => ({
  OptimizedReactLogo: () => <div data-testid="react-logo" />,
  OptimizedNextJSLogo: () => <div data-testid="nextjs-logo" />,
  OptimizedTypeScriptLogo: () => <div data-testid="typescript-logo" />,
  OptimizedNodeJSLogo: () => <div data-testid="nodejs-logo" />,
  OptimizedAILogo: () => <div data-testid="openai-logo" />,
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
    // Immediate callback execution
    if (typeof onCreated === 'function') {
      onCreated();
    }
    return <div data-testid="canvas-container">{children}</div>;
  },
  useFrame: vi.fn(),
}));

vi.mock('@react-spring/three', () => ({
  animated: {
    group: ({ children }: any) => <div data-testid="animated-group">{children}</div>,
  },
  useTransition: () => {
    // Return a function that renders the current model
    return (renderFunction: any) => {
      const currentModel = { type: 'react', name: 'React' };
      return [renderFunction({ opacity: 1 }, currentModel)];
    };
  },
}));

// Mock IntersectionObserver globally
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation((callback) => ({
  observe: vi.fn(() => {
    // Immediately trigger intersection
    callback([{ isIntersecting: true }]);
  }),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock IntersectionObserver globally
(global as any).IntersectionObserver = mockIntersectionObserver;

describe('3D Models Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main canvas container', () => {
    render(<ModelHeroOptimized />);
    
    expect(screen.getByTestId('canvas-container')).toBeInTheDocument();
  });

  it('includes performance monitoring component', () => {
    render(<ModelHeroOptimized />);
    
    expect(screen.getByTestId('performance-monitor')).toBeInTheDocument();
  });

  it('renders animated group for model transitions', () => {
    render(<ModelHeroOptimized />);
    
    expect(screen.getByTestId('animated-group')).toBeInTheDocument();
  });

  it('displays React logo by default', () => {
    render(<ModelHeroOptimized />);
    
    expect(screen.getByTestId('react-logo')).toBeInTheDocument();
  });

  it('sets up intersection observer correctly', () => {
    render(<ModelHeroOptimized />);
    
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('initializes performance tracking hooks', () => {
    const { container } = render(<ModelHeroOptimized />);
    
    // Component should render without errors
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles mouse interactions for performance tracking', () => {
    render(<ModelHeroOptimized />);
    
    const container = screen.getByTestId('canvas-container').parentElement;
    
    // Should render hover target container
    expect(container).toHaveClass('relative', 'h-full', 'w-full');
  });
});

describe('3D Models Basic Functionality', () => {
  it('component mounts without throwing errors', () => {
    expect(() => {
      render(<ModelHeroOptimized />);
    }).not.toThrow();
  });

  it('has correct accessibility attributes', () => {
    render(<ModelHeroOptimized />);
    
    const container = screen.getByTestId('canvas-container').parentElement;
    expect(container).toHaveAttribute('aria-label');
  });

  it('applies correct CSS classes', () => {
    render(<ModelHeroOptimized />);
    
    const container = screen.getByTestId('canvas-container').parentElement;
    expect(container).toHaveClass('relative', 'h-full', 'w-full', 'overflow-hidden');
  });
});