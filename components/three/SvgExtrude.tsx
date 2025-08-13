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

export function SvgExtrude({ src, color, opacity = 1 }: SvgExtrudeProps) {
  const data = useLoader(SVGLoader, src);
  const groupRef = useRef<Group>(null);

  const meshes = useMemo(() => {
    // Optimized but simpler extrude settings
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
      bevelSegments: 1, // Minimal bevel for performance
      curveSegments: 4, // Reduced for performance
    };

    return data.paths
      .map((path, pathIndex) => {
        const shapes = SVGLoader.createShapes(path);
        return shapes.map((shape, shapeIndex) => {
          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

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
  }, [data.paths, color, opacity]);

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
