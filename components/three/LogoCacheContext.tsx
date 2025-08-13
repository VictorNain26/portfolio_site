/* components/three/LogoCacheContext.tsx */
'use client';

import { createContext, useContext, useCallback, useRef, useEffect } from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

type LogoCacheContextType = {
  preloadLogo: (src: string) => Promise<any>;
  isPreloaded: (src: string) => boolean;
  preloadAll: () => Promise<void>;
};

const LogoCacheContext = createContext<LogoCacheContextType | null>(null);

const LOGO_SOURCES = [
  '/logos/react.svg',
  '/logos/nextjs.svg', 
  '/logos/typescript.svg',
  '/logos/nodejs.svg',
  '/logos/openai.svg',
];

export function LogoCacheProvider({ children }: { children: React.ReactNode }) {
  const preloadedCache = useRef(new Set<string>());
  const preloadPromises = useRef(new Map<string, Promise<any>>());

  const preloadLogo = useCallback(async (src: string) => {
    // Si déjà préchargé, retourner immédiatement
    if (preloadedCache.current.has(src)) {
      return Promise.resolve();
    }

    // Si déjà en cours de preload, retourner la promesse existante
    if (preloadPromises.current.has(src)) {
      return preloadPromises.current.get(src);
    }

    // Démarrer le preload
    const promise = new Promise((resolve, reject) => {
      try {
        // Simuler le chargement SVG avec useLoader logic
        const loader = new SVGLoader();
        loader.load(
          src,
          (data) => {
            preloadedCache.current.add(src);
            preloadPromises.current.delete(src);
            resolve(data);
          },
          undefined,
          (error) => {
            preloadPromises.current.delete(src);
            reject(error);
          }
        );
      } catch (error) {
        preloadPromises.current.delete(src);
        reject(error);
      }
    });

    preloadPromises.current.set(src, promise);
    return promise;
  }, []);

  const isPreloaded = useCallback((src: string) => {
    return preloadedCache.current.has(src);
  }, []);

  const preloadAll = useCallback(async () => {
    const promises = LOGO_SOURCES.map(async src => preloadLogo(src));
    await Promise.allSettled(promises);
  }, [preloadLogo]);

  // Preload immédiat au montage
  useEffect(() => {
    // Démarrer le preload en arrière-plan
    preloadAll().catch(console.warn);
  }, [preloadAll]);

  const contextValue: LogoCacheContextType = {
    preloadLogo,
    isPreloaded,
    preloadAll,
  };

  return (
    <LogoCacheContext.Provider value={contextValue}>
      {children}
    </LogoCacheContext.Provider>
  );
}

export function useLogoCache() {
  const context = useContext(LogoCacheContext);
  if (!context) {
    throw new Error('useLogoCache must be used within LogoCacheProvider');
  }
  return context;
}

// Hook pour le preload intelligent
export function useSmartPreload() {
  const { preloadAll, isPreloaded } = useLogoCache();

  const preloadWithPriority = useCallback(async () => {
    // Preload immédiat des logos critiques
    const criticalLogos = ['/logos/react.svg', '/logos/nextjs.svg'];
    
    const criticalPromises = criticalLogos.map(async (src) => {
      if (!isPreloaded(src)) {
        return preloadAll();
      }
    });

    await Promise.allSettled(criticalPromises);
    
    // Preload des autres en arrière-plan
    preloadAll().catch(console.warn);
  }, [preloadAll, isPreloaded]);

  return { preloadWithPriority, isPreloaded };
}