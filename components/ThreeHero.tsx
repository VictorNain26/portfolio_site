'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Loader } from '@react-three/drei'
import { useRef } from 'react'
import type { Mesh } from 'three'

function Box() {
  const mesh = useRef<Mesh>(null!)

  useFrame((_, delta) => {
    mesh.current.rotation.x += delta * 0.6
    mesh.current.rotation.y += delta * 0.6
  })

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function ThreeHero() {
  return (
    <>
      <Canvas className="w-full h-full" camera={{ position: [2, 2, 2] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Box />
        <OrbitControls />
      </Canvas>

      {/* Overlay de chargement (progress bar ou spinner),
          fourni par @react-three/drei */}
      <Loader />
    </>
  )
}
