/**
 * Unit tests for 3D model components - Testing individual optimized components
 */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { 
  OptimizedReactLogo, 
  OptimizedNextJSLogo,
  OptimizedTypeScriptLogo,
  OptimizedNodeJSLogo,
  OptimizedAILogo,
  OptimizedLogo3D
} from '../three/OptimizedLogo3D';

// Mock Three.js dependencies
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

vi.mock('three', () => ({
  PlaneGeometry: vi.fn(() => ({})),
  MeshBasicMaterial: vi.fn(() => ({
    opacity: 1,
    needsUpdate: false,
  })),
  DoubleSide: 'DoubleSide',
  Group: vi.fn(),
}));

// Mock React hooks
const mockRef = { current: null };
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: () => mockRef,
    useMemo: (fn: any) => fn(),
    useEffect: vi.fn(),
  };
});

describe('OptimizedLogo3D Component', () => {
  const defaultProps = {
    type: 'react' as const,
    isVisible: true,
    opacity: 1,
  };

  it('renders without throwing errors', () => {
    expect(() => {
      render(<OptimizedLogo3D {...defaultProps} />);
    }).not.toThrow();
  });

  it('accepts all supported logo types', () => {
    const types = ['react', 'nextjs', 'typescript', 'nodejs', 'openai'] as const;
    
    types.forEach(type => {
      expect(() => {
        render(<OptimizedLogo3D {...defaultProps} type={type} />);
      }).not.toThrow();
    });
  });

  it('handles visibility prop correctly', () => {
    expect(() => {
      render(<OptimizedLogo3D {...defaultProps} isVisible={false} />);
    }).not.toThrow();
  });

  it('handles opacity as number', () => {
    expect(() => {
      render(<OptimizedLogo3D {...defaultProps} opacity={0.5} />);
    }).not.toThrow();
  });
});

describe('Individual Optimized Logo Components', () => {
  const commonProps = {
    isVisible: true,
    opacity: 1,
  };

  it('OptimizedReactLogo renders without errors', () => {
    expect(() => {
      render(<OptimizedReactLogo {...commonProps} />);
    }).not.toThrow();
  });

  it('OptimizedNextJSLogo renders without errors', () => {
    expect(() => {
      render(<OptimizedNextJSLogo {...commonProps} />);
    }).not.toThrow();
  });

  it('OptimizedTypeScriptLogo renders without errors', () => {
    expect(() => {
      render(<OptimizedTypeScriptLogo {...commonProps} />);
    }).not.toThrow();
  });

  it('OptimizedNodeJSLogo renders without errors', () => {
    expect(() => {
      render(<OptimizedNodeJSLogo {...commonProps} />);
    }).not.toThrow();
  });

  it('OptimizedAILogo renders without errors', () => {
    expect(() => {
      render(<OptimizedAILogo {...commonProps} />);
    }).not.toThrow();
  });
});

describe('Logo Component Props Validation', () => {
  it('handles different opacity values', () => {
    const opacityValues = [0, 0.5, 1];
    
    opacityValues.forEach(opacity => {
      expect(() => {
        render(
          <OptimizedReactLogo 
            isVisible
            opacity={opacity} 
          />
        );
      }).not.toThrow();
    });
  });

  it('handles visibility states', () => {
    [true, false].forEach(isVisible => {
      expect(() => {
        render(
          <OptimizedReactLogo 
            isVisible={isVisible}
            opacity={1} 
          />
        );
      }).not.toThrow();
    });
  });
});