/* components/three/FastSvgExtrude.tsx */
'use client';

import { useMemo, useLayoutEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three';
import type { Group } from 'three';
import { animated as a, type SpringValue } from '@react-spring/three';

export type FastSvgExtrudeProps = {
  src: string;
  color: string;
  opacity?: SpringValue<number> | number | undefined;
};

// Cache for preloaded geometries
const geometryCache = new Map<string, THREE.ExtrudeGeometry[]>();

export function FastSvgExtrude({ src, color, opacity = 1 }: FastSvgExtrudeProps) {
  const data = useLoader(SVGLoader, src);
  const groupRef = useRef<Group>(null);
  const [isReady, setIsReady] = useState(false);

  const meshes = useMemo(() => {
    // Check cache first
    const cached = geometryCache.get(src);
    if (cached) {
      setIsReady(true);
      return cached.map((geometry, index) => (
        <mesh
          key={`cached-${index.toString()}`}
          castShadow
          receiveShadow
          geometry={geometry}
        >
          <a.meshStandardMaterial
            transparent
            color={color}
            metalness={0.0}
            opacity={opacity}
            roughness={0.2}
          />
        </mesh>
      ));
    }

    // Optimized extrude settings for faster processing
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.008,
      // Minimal segments for speed
      bevelSegments: 1,
      curveSegments: 3,
    };

    const geometries: THREE.ExtrudeGeometry[] = [];
    
    const meshElements = data.paths
      .map((path, pathIndex) => {
        const shapes = SVGLoader.createShapes(path);
        return shapes.map((shape, shapeIndex) => {
          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          geometries.push(geometry);

          return (
            <mesh
              key={`${pathIndex.toString()}-${shapeIndex.toString()}`}
              castShadow
              receiveShadow
              geometry={geometry}
            >
              <a.meshStandardMaterial
                transparent
                color={color}
                metalness={0.0}
                opacity={opacity}
                roughness={0.2}
              />
            </mesh>
          );
        });
      })
      .flat();

    // Cache the geometries for future use
    geometryCache.set(src, geometries);
    setIsReady(true);
    
    return meshElements;
  }, [data.paths, color, opacity, src]);

  useLayoutEffect(() => {
    if (!groupRef.current || !isReady) {
      return;
    }

    // Center the geometry
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = box.getCenter(new THREE.Vector3());
    groupRef.current.position.sub(center);
  }, [meshes, isReady]);

  return (
    <group ref={groupRef} scale={0.12}>
      <group scale={[1, -1, 1]}>{meshes}</group>
    </group>
  );
}

export default FastSvgExtrude;