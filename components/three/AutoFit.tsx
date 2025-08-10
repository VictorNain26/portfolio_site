/* components/three/AutoFit.tsx */
'use client';

import { useThree } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type AutoFitProps = {
  children: React.ReactNode;
  /** Fraction of the shortest viewport dimension to use as max size (0..1). */
  fit?: number;
  /** Optional minimum and maximum clamp for the computed scale. */
  minScale?: number;
  maxScale?: number;
};

/**
 * AutoFit measures its children and applies a uniform scale so that the
 * model fits within the viewport (by default 80% of the shortest side).
 */
export function AutoFit({ children, fit = 0.65, minScale = 0.1, maxScale = 2 }: AutoFitProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { size, viewport } = useThree();
  const [scale, setScale] = useState(1);
  const lastMeasurement = useRef<number>(0);

  const targetMax = useMemo(() => {
    // 3D units for the current camera at the scene center
    const w = viewport.width;
    const h = viewport.height;
    return Math.min(w, h) * fit;
  }, [viewport.width, viewport.height, fit]);

  useLayoutEffect(() => {
    const grp = groupRef.current;
    if (!grp) {
      return;
    }

    // Measure current bounding box in world units
    const box = new THREE.Box3().setFromObject(grp);
    const sizeVec = new THREE.Vector3();
    box.getSize(sizeVec);
    const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);

    if (maxDim > 0) {
      const s = THREE.MathUtils.clamp(targetMax / maxDim, minScale, maxScale);
      // Only update if significant change to prevent constant rescaling
      if (Math.abs(s - lastMeasurement.current) > 0.05) {
        lastMeasurement.current = s;
        setScale(s);
      }
    }
  }, [size.width, size.height, targetMax, minScale, maxScale]);

  return (
    <group ref={groupRef} scale={scale}>
      {children}
    </group>
  );
}

export default AutoFit;
