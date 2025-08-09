/* components/three/SvgExtrude.tsx */
"use client";

import { useMemo, useLayoutEffect, useRef, type ReactElement } from 'react';
import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three';
import type { Group } from 'three';
import { animated as a, type SpringValue } from '@react-spring/three';

export type SvgExtrudeProps = {
  src: string; // e.g. '/logos/react.svg'
  depth?: number; // extrusion depth
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelSegments?: number;
  material?: Partial<THREE.MeshStandardMaterialParameters>;
  scale?: number; // uniform scale to apply to the whole group
  flipY?: boolean; // flip Y to match SVG coordinates
  opacity?: number | SpringValue<number> | undefined; // allow crossfade
};

export function SvgExtrude({
  src,
  depth = 0.18,
  bevelEnabled = true,
  bevelThickness = 0.04,
  bevelSize = 0.02,
  bevelSegments = 2,
  material,
  scale = 0.02,
  flipY = true,
  opacity,
  }: SvgExtrudeProps) {
  const data = useLoader(SVGLoader, src) as ReturnType<typeof SVGLoader.prototype.parse>;
  const rootRef = useRef<Group>(null);

  const meshes = useMemo(() => {
    const group: ReactElement[] = [];
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth,
      bevelEnabled,
      bevelThickness,
      bevelSize,
      bevelSegments,
      curveSegments: 24,
    };
    for (const path of data.paths) {
      const shapes = SVGLoader.createShapes(path);
      for (const shape of shapes) {
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        // Compute brand face color and a slightly darker side color for better 3D legibility
        const faceColor = new THREE.Color(
          (material?.color as THREE.ColorRepresentation) ?? (path.color || '#000')
        );
        const sideColor = faceColor.clone();
        // Darken sides by ~30% for clearer depth
        const hsl = { h: 0, s: 0, l: 0 } as { h: number; s: number; l: number };
        faceColor.getHSL(hsl);
        sideColor.setHSL(hsl.h, hsl.s, Math.max(0, hsl.l - 0.3));

        group.push(
          <mesh key={`${group.length}`} geometry={geom} castShadow receiveShadow>
            {/* Side walls (group 0) in ExtrudeGeometry */}
            <a.meshPhysicalMaterial
              attach="material-0"
              color={sideColor as unknown as THREE.ColorRepresentation}
              metalness={material?.metalness ?? 0.2}
              roughness={(material?.roughness ?? 0.35) + 0.2}
              clearcoat={0.5}
              clearcoatRoughness={0.5}
              envMapIntensity={1.0}
              side={THREE.DoubleSide}
              transparent
              opacity={opacity ?? 1}
              depthWrite={true}
            />
            {/* Front/back faces (group 1) in ExtrudeGeometry */}
            <a.meshPhysicalMaterial
              attach="material-1"
              color={faceColor as unknown as THREE.ColorRepresentation}
              metalness={material?.metalness ?? 0.2}
              roughness={material?.roughness ?? 0.35}
              clearcoat={0.8}
              clearcoatRoughness={0.35}
              envMapIntensity={1.2}
              side={THREE.FrontSide}
              transparent
              opacity={opacity ?? 1}
              depthWrite={true}
            />
          </mesh>
        );
      }
    }
    return group;
  }, [data.paths, depth, bevelEnabled, bevelThickness, bevelSize, bevelSegments, material, opacity]);

  useLayoutEffect(() => {
    const grp = rootRef.current;
    if (!grp) {
      return;
    }
    // Center the group by its bounding box
    const box = new THREE.Box3().setFromObject(grp);
    const center = new THREE.Vector3();
    box.getCenter(center);
    grp.position.x -= center.x;
    grp.position.y -= center.y;
    // Pull slightly forward so depth extrudes backwards
    grp.position.z -= depth / 2;
  }, [meshes, depth]);

  return (
    <group scale={scale}>
      <group ref={rootRef} scale={[1, flipY ? -1 : 1, 1] as [number, number, number]}>{meshes}</group>
    </group>
  );
}

export default SvgExtrude;
