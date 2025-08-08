'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

type LogoProps = {
  url: string;
  position: [number, number, number];
};

function Logo({ url, position }: LogoProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} />;
}

export default function TechLogos3D() {
  return (
    <div className="h-32 w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight />
        <directionalLight position={[2, 2, 5]} />
        <Logo url="/models/react.gltf" position={[-1.5, 0, 0]} />
        <Logo url="/models/node.gltf" position={[1.5, 0, 0]} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/react.gltf');
useGLTF.preload('/models/node.gltf');
