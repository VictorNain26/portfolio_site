'use client'

import { useState, useRef, Suspense, useCallback } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Loader as DreiLoader } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Mesh } from 'three'
import { Spinner } from '@/components/ui/spinner'

/* ------------------------------------------------------------------ */
/* • TorusKnot par défaut (fallback rapide)                            */
/* ------------------------------------------------------------------ */
function DefaultKnot() {
  const ref = useRef<Mesh>(null!)
  useFrame((_, d) => {
    ref.current.rotation.x += d * 0.5
    ref.current.rotation.y += d * 0.5
  })
  return (
    <mesh ref={ref} scale={1}>
      <torusKnotGeometry args={[0.8, 0.3, 128, 32]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* • Affiche la scène chargée dynamiquement                            */
/* ------------------------------------------------------------------ */
function RemoteModel({ url }: { url: string }) {
  // le loader R3F met en cache ; pas de fetch répété
  const { scene } = useLoader(GLTFLoader, url)
  return <primitive object={scene} dispose={null} />
}

/* ------------------------------------------------------------------ */
/* • Composant principal                                               */
/* ------------------------------------------------------------------ */
export default function PromptModelHero() {
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ----- Envoi du prompt vers l'API -------------------------------- */
  const generate = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate-model', {
        method: 'POST',                          // 👈 indispensable
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(await res.text())

      // L’API renvoie le fichier directement.
      const blob = await res.blob()

      // Si c’est un .zip, décompression rapide côté client
      // (JSZip 3.x  — 1 ko min ; tu peux l’installer avec `bun add jszip`)
      let finalBlob = blob
      if (res.headers.get('content-type')?.includes('zip')) {
        const JSZip = (await import('jszip')).default
        const zip = await JSZip.loadAsync(blob)
        // Shap-E place le .glb à la racine
        const glbFile = zip.file(/\.glb$/i)?.[0]
        if (!glbFile) throw new Error('GLB not found in zip')
        const glbArrayBuffer = await glbFile.async('arraybuffer')
        finalBlob = new Blob([glbArrayBuffer], { type: 'model/gltf-binary' })
      }

      const url = URL.createObjectURL(finalBlob)
      setModelUrl(url)         // déclenche le re-render dans le <Canvas>
    } catch (e) {
      console.error(e)
      setError('Erreur lors de la génération.')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      {/* --- Champ prompt + bouton ----------------------------------- */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          generate(fd.get('prompt') as string)
        }}
        className="flex w-full max-w-sm"
      >
        <input
          name="prompt"
          placeholder="Ex. : futuristic blue dragon"
          className="flex-1 rounded-l-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-r-md bg-primary px-4 text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? '…' : 'Go'}
        </button>
      </form>

      {/* --- Canvas R3F --------------------------------------------- */}
      <div className="aspect-square w-full max-w-[340px] sm:max-w-md md:max-w-xl">
        <Canvas camera={{ position: [2.5, 2, 2.5], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 5]} intensity={0.8} />
          <Suspense fallback={null}>
            {modelUrl ? <RemoteModel url={modelUrl} /> : <DefaultKnot />}
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
        <DreiLoader />
        {loading && <Spinner className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2" />}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
