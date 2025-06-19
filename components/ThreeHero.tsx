'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'

function Box() {
  const mesh = useRef<Mesh>(null)
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01
      mesh.current.rotation.y += 0.01
    }
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
    <Canvas className="w-full h-96" camera={{ position: [2, 2, 2] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Box />
      <OrbitControls />
    </Canvas>
  )
}
