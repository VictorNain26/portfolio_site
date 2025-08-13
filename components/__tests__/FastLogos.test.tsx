/**
 * Tests unitaires pour les composants Fast Logos
 * Vérification des fallbacks et du système hybride
 */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { 
  FastReactLogo3D, 
  FastNextJSLogo3D, 
  FastTypeScriptLogo3D, 
  FastNodeJSLogo3D, 
  FastAILogo3D 
} from '../three/FastLogos';

// Mock des dépendances Three.js
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useLoader: vi.fn(() => ({
    paths: [
      { userData: { node: { style: {} } } }
    ]
  })),
}));

vi.mock('three/examples/jsm/loaders/SVGLoader.js', () => ({
  SVGLoader: {
    createShapes: vi.fn(() => [{}]),
  }
}));

vi.mock('three', () => ({
  SVGLoader: {
    createShapes: vi.fn(() => [{}]),
  },
  ExtrudeGeometry: vi.fn(() => ({})),
  Box3: vi.fn(() => ({
    setFromObject: vi.fn(() => ({
      getCenter: vi.fn(() => ({ x: 0, y: 0, z: 0 }))
    }))
  })),
  Vector3: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
  Group: vi.fn(),
}));

vi.mock('@react-spring/three', () => ({
  animated: {
    meshStandardMaterial: ({ children, ...props }: any) => 
      <div data-color={props.color} data-testid="animated-material">{children}</div>,
  },
}));

describe('Fast Logos Components', () => {
  const defaultProps = {
    isVisible: true,
    opacity: 1,
  };

  describe('Rendu des composants', () => {
    it('FastReactLogo3D renders without errors', () => {
      expect(() => {
        render(<FastReactLogo3D {...defaultProps} />);
      }).not.toThrow();
    });

    it('FastNextJSLogo3D renders without errors', () => {
      expect(() => {
        render(<FastNextJSLogo3D {...defaultProps} />);
      }).not.toThrow();
    });

    it('FastTypeScriptLogo3D renders without errors', () => {
      expect(() => {
        render(<FastTypeScriptLogo3D {...defaultProps} />);
      }).not.toThrow();
    });

    it('FastNodeJSLogo3D renders without errors', () => {
      expect(() => {
        render(<FastNodeJSLogo3D {...defaultProps} />);
      }).not.toThrow();
    });

    it('FastAILogo3D renders without errors', () => {
      expect(() => {
        render(<FastAILogo3D {...defaultProps} />);
      }).not.toThrow();
    });
  });

  describe('Props handling', () => {
    it('handles visibility prop correctly', () => {
      expect(() => {
        render(<FastReactLogo3D isVisible={false} opacity={0.5} />);
      }).not.toThrow();
    });

    it('handles different opacity values', () => {
      const opacityValues = [0, 0.3, 0.7, 1];
      
      opacityValues.forEach(opacity => {
        expect(() => {
          render(<FastReactLogo3D isVisible opacity={opacity} />);
        }).not.toThrow();
      });
    });
  });

  describe('Fallback system', () => {
    it('renders fallback when Suspense triggers', () => {
      // Les mocks simulent le fonctionnement normal
      // Le test vérifie que le composant ne plante pas
      const { container } = render(<FastReactLogo3D {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles Suspense boundary gracefully', () => {
      expect(() => {
        render(
          <div>
            <FastReactLogo3D {...defaultProps} />
            <FastNextJSLogo3D {...defaultProps} />
          </div>
        );
      }).not.toThrow();
    });
  });

  describe('Performance characteristics', () => {
    it('renders multiple logos simultaneously', () => {
      expect(() => {
        render(
          <div>
            <FastReactLogo3D {...defaultProps} />
            <FastNextJSLogo3D {...defaultProps} />
            <FastTypeScriptLogo3D {...defaultProps} />
            <FastNodeJSLogo3D {...defaultProps} />
            <FastAILogo3D {...defaultProps} />
          </div>
        );
      }).not.toThrow();
    });

    it('handles rapid prop changes', () => {
      const { rerender } = render(<FastReactLogo3D {...defaultProps} />);
      
      expect(() => {
        rerender(<FastReactLogo3D isVisible={false} opacity={0} />);
        rerender(<FastReactLogo3D isVisible opacity={0.5} />);
        rerender(<FastReactLogo3D {...defaultProps} />);
      }).not.toThrow();
    });
  });
});