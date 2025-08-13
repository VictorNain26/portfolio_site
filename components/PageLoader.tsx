'use client';

import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark page as loaded after critical resources
    const handleLoad = () => {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoaded(true);
      }, 100);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    // Add classes to body for loading state management
    const { body } = document;
    
    if (isLoaded) {
      body.classList.remove('js-loading');
      body.classList.add('js-loaded');
    } else {
      body.classList.add('js-loading');
      body.classList.remove('js-loaded');
    }

    return () => {
      body.classList.remove('js-loading', 'js-loaded');
    };
  }, [isLoaded]);

  // Render loading indicator for initial page load
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return null;
}