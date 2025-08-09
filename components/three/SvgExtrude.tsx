/* components/three/SvgExtrude.tsx */
"use client";

import { useMemo, useLayoutEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three';
import type { Group } from 'three';
import { animated as a, type SpringValue } from '@react-spring/three';

export type SvgExtrudeProps = {
  src: string;
  color: string;
  opacity?: number | SpringValue<number> | undefined;
};

export function SvgExtrude({ src, color, opacity = 1 }: SvgExtrudeProps) {
  const data = useLoader(SVGLoader, src);
  const groupRef = useRef<Group>(null);

  const meshes = useMemo(() => {
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.25,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.03,
      bevelSegments: 4,
      curveSegments: 12,
    };

    return data.paths.map((path, pathIndex) => {
      const shapes = SVGLoader.createShapes(path);
      return shapes.map((shape, shapeIndex) => {
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        return (
          <mesh 
            key={`${pathIndex}-${shapeIndex}`} 
            geometry={geometry}
            castShadow
            receiveShadow
          >
            <a.meshStandardMaterial
              color={color}
              transparent
              opacity={opacity}
              roughness={0.1}
              metalness={0.0}
            />
          </mesh>
        );
      });
    }).flat();
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