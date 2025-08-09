/* components/three/RoomEnv.tsx */
'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export default function RoomEnv() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const envRT = pmrem.fromScene(envScene, 0.04);
    const prevEnv = scene.environment;
    scene.environment = envRT.texture;

    return () => {
      scene.environment = prevEnv;
      envRT.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}

