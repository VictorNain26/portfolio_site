'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Loader } from '@react-three/drei'
import { useRef } from 'react'
import type { Mesh } from 'three'

function TorusKnot() {
  const mesh = useRef<Mesh>(null!)

  useFrame((_, delta) => {
    mesh.current.rotation.x += delta * 0.5
    mesh.current.rotation.y += delta * 0.5
  })

  return (
    <mesh ref={mesh} scale={1}>
      <torusKnotGeometry args={[0.8, 0.3, 128, 32]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  )
}

export default function ThreeHero() {
  return (
    <>
      <Canvas
        className="w-full h-full"
        camera={{ position: [2.5, 2, 2.5], fov: 60 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} />
        <TorusKnot />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      <Loader />
    </>
  )
}
