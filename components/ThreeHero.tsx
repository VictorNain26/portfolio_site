'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'

function Box() {
  const mesh = useRef<Mesh>(null)
  const scale = useRef(0)
  useFrame((_, delta) => {
    if (mesh.current) {
      if (scale.current < 1) {
        scale.current = Math.min(scale.current + delta, 1)
        mesh.current.scale.setScalar(scale.current)
      }
      mesh.current.rotation.x += 0.01
      mesh.current.rotation.y += 0.01
    }
  })
  return (
    <mesh ref={mesh} scale={0}>
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
