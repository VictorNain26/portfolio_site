'use client';

import { useEffect, useState } from 'react';

const MAX_LOADING_TIME = 1000; // Force show content after 1s max

export default function PageLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const markAsLoaded = () => {
      setIsLoaded(true);
    };

    // Fallback: always show content after MAX_LOADING_TIME
    const fallbackTimer = setTimeout(markAsLoaded, MAX_LOADING_TIME);

    // Ideal: show when page is fully loaded
    const handleLoad = () => {
      clearTimeout(fallbackTimer);
      // Small delay for smooth transition
      setTimeout(markAsLoaded, 100);
    };

    if (document.readyState === 'complete') {
      clearTimeout(fallbackTimer);
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    const { body } = document;

    if (isLoaded) {
      body.classList.remove('js-loading');
      body.classList.add('js-loaded');
    }

    return () => {
      body.classList.remove('js-loading', 'js-loaded');
    };
  }, [isLoaded]);

  // No visible loader - just manages the fade-in transition
  return null;
}