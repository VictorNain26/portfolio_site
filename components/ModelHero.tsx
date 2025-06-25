/* components/ModelHero.tsx */
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Float,
  Html,
  useGLTF,
  Sparkles,
  ContactShadows,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

/* ──────────────────────────────────────────────────────────────── */
/* 1 · URL du modèle — change-la si tu préfères un autre objet      */
const MODEL_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Laptop/glTF-Binary/Laptop.glb';

/* 2 · Pré-chargement + composant                                   */
function RemoteModel() {
  const { scene } = useGLTF(MODEL_URL) as unknown as { scene: THREE.Object3D };
  return <primitive object={scene} dispose={null} />;
}
useGLTF.preload(MODEL_URL);

/* 3 · Canvas complet                                               */
export default function ModelHero() {
  return (
    <div className="relative aspect-square w-full max-w-[340px] sm:max-w-md md:max-w-xl">
      <Canvas camera={{ position: [2.8, 2, 2.8], fov: 55 }} dpr={[1, 2]} shadows>
        {/* LIGHTS */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} castShadow />

        {/* ENV + CONTENT */}
        <Suspense
          fallback={
            <Html center className="text-indigo-200 text-sm">
              Chargement&nbsp;…
            </Html>
          }
        >
          <Environment preset="city" />
          <Float speed={2} rotationIntensity={0.4} floatIntensity={0.9}>
            <RemoteModel />
            <Sparkles count={50} scale={4} size={2} speed={0.7} />
          </Float>
        </Suspense>

        {/* SHADOW + POSTFX */}
        <ContactShadows position={[0, -0.8, 0]} opacity={0.35} blur={2.5} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.3} mipmapBlur />
        </EffectComposer>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
