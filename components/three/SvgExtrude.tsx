/* components/three/SvgExtrude.tsx */
'use client';

import { useMemo, useLayoutEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three';
import type { Group } from 'three';
import { animated as a, type SpringValue } from '@react-spring/three';

export type SvgExtrudeProps = {
  src: string;
  color: string;
  opacity?: SpringValue<number> | number | undefined;
};

// Geometry cache to avoid recreating geometries
const geometryCache = new Map<string, THREE.ExtrudeGeometry[]>();

export function SvgExtrude({ src, color, opacity = 1 }: SvgExtrudeProps) {
  const data = useLoader(SVGLoader, src);
  const groupRef = useRef<Group>(null);

  // Memoized geometry creation with caching
  const geometries = useMemo(() => {
    const cacheKey = src;
    
    if (geometryCache.has(cacheKey)) {
      const cached = geometryCache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Optimized extrude settings for better performance
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      // Reduced from 4 to 2 for better performance
      bevelSegments: 2,
      // Reduced from 12 to 6 for better performance
      curveSegments: 6,
    };

    const newGeometries = data.paths
      .map(path => {
        const shapes = SVGLoader.createShapes(path);
        return shapes.map(shape => {
          return new THREE.ExtrudeGeometry(shape, extrudeSettings);
        });
      })
      .flat();

    // Cache the geometries for reuse
    geometryCache.set(cacheKey, newGeometries);
    return newGeometries;
  }, [data.paths, src]);

  // Memoized meshes using cached geometries
  const meshes = useMemo(() => {
    return geometries.map((geometry, index) => {
      const key = `geometry-${src}-${index.toString()}`;
      return (
        <mesh
          key={key}
          castShadow
          receiveShadow
          geometry={geometry}
        >
          <a.meshStandardMaterial
            transparent
            color={color}
            metalness={0.0}
            opacity={opacity}
            roughness={0.1}
          />
        </mesh>
      );
    });
  }, [geometries, color, opacity, src]);

  useLayoutEffect(() => {
    if (!groupRef.current) {
      return;
    }

    // Center the geometry
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = box.getCenter(new THREE.Vector3());
    groupRef.current.position.sub(center);
  }, [meshes]);

  return (
    <group ref={groupRef} scale={0.12}>
      <group scale={[1, -1, 1]}>{meshes}</group>
    </group>
  );
}

export default SvgExtrude;
