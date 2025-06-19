'use client'
import { useEffect } from 'react'

export default function IdleThreeHeroLoader() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(() => {
        import('@/components/ThreeHero')
      })
    }
  }, [])
  return null
}
