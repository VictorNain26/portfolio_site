/**
 * Performance monitoring hook for 3D models
 * Tracks loading times and frame rates
 */
import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number | null;
  renderTime: number | null;
  frameRate: number;
  memoryUsage: number | null;
  isLoading: boolean;
}

interface PerformanceThresholds {
  maxLoadTime: number;
  maxRenderTime: number;
  minFrameRate: number;
  maxMemoryUsage: number;
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  maxLoadTime: 1000,    // 1 second
  maxRenderTime: 100,   // 100ms
  minFrameRate: 30,     // 30 FPS minimum
  maxMemoryUsage: 50,   // 50MB
};

export function usePerformanceMetrics(thresholds: Partial<PerformanceThresholds> = {}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: null,
    renderTime: null,
    frameRate: 0,
    memoryUsage: null,
    isLoading: true,
  });

  const loadStartRef = useRef<number | null>(null);
  const renderStartRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const finalThresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };

  // Start performance tracking
  const startLoadTracking = useCallback(() => {
    loadStartRef.current = performance.now();
    setMetrics(prev => ({ ...prev, isLoading: true }));
  }, []);

  const startRenderTracking = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // End performance tracking
  const endLoadTracking = useCallback(() => {
    if (loadStartRef.current) {
      const loadTime = performance.now() - loadStartRef.current;
      setMetrics(prev => ({
        ...prev,
        loadTime,
        isLoading: false,
      }));
      loadStartRef.current = null;
    }
  }, []);

  const endRenderTracking = useCallback(() => {
    if (renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current;
      setMetrics(prev => ({ ...prev, renderTime }));
      renderStartRef.current = null;
    }
  }, []);

  // Frame rate tracking
  const trackFrame = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTimeRef.current;
    
    if (deltaTime > 0) {
      const currentFps = 1000 / deltaTime;
      frameCountRef.current++;
      
      // Smoothed frame rate calculation
      setMetrics(prev => ({
        ...prev,
        frameRate: prev.frameRate === 0 
          ? currentFps 
          : (prev.frameRate * 0.9 + currentFps * 0.1)
      }));
    }
    
    lastFrameTimeRef.current = currentTime;
  }, []);

  // Memory usage tracking
  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      if (memInfo) {
        const memoryUsage = memInfo.usedJSHeapSize / (1024 * 1024); // Convert to MB
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    }
  }, []);

  // Periodic updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateMemoryUsage();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateMemoryUsage]);

  // Performance warnings
  useEffect(() => {
    const { loadTime, renderTime, frameRate, memoryUsage } = metrics;

    if (process.env.NODE_ENV === 'development') {
      if (loadTime && loadTime > finalThresholds.maxLoadTime) {
        console.warn(`⚠️  3D Model load time exceeded threshold: ${loadTime.toFixed(2)}ms > ${finalThresholds.maxLoadTime}ms`);
      }
      
      if (renderTime && renderTime > finalThresholds.maxRenderTime) {
        console.warn(`⚠️  3D Model render time exceeded threshold: ${renderTime.toFixed(2)}ms > ${finalThresholds.maxRenderTime}ms`);
      }
      
      if (frameRate > 0 && frameRate < finalThresholds.minFrameRate) {
        console.warn(`⚠️  3D Model frame rate below threshold: ${frameRate.toFixed(2)} FPS < ${finalThresholds.minFrameRate} FPS`);
      }
      
      if (memoryUsage && memoryUsage > finalThresholds.maxMemoryUsage) {
        console.warn(`⚠️  3D Model memory usage exceeded threshold: ${memoryUsage.toFixed(2)}MB > ${finalThresholds.maxMemoryUsage}MB`);
      }
    }
  }, [metrics, finalThresholds]);

  // Performance report
  const getPerformanceReport = useCallback(() => {
    const { loadTime, renderTime, frameRate, memoryUsage } = metrics;
    
    return {
      metrics,
      thresholds: finalThresholds,
      status: {
        loadTime: loadTime ? (loadTime <= finalThresholds.maxLoadTime ? '✅' : '❌') : '⏳',
        renderTime: renderTime ? (renderTime <= finalThresholds.maxRenderTime ? '✅' : '❌') : '⏳',
        frameRate: frameRate > 0 ? (frameRate >= finalThresholds.minFrameRate ? '✅' : '❌') : '⏳',
        memoryUsage: memoryUsage ? (memoryUsage <= finalThresholds.maxMemoryUsage ? '✅' : '❌') : '⏳',
      }
    };
  }, [metrics, finalThresholds]);

  return {
    metrics,
    startLoadTracking,
    endLoadTracking,
    startRenderTracking,
    endRenderTracking,
    trackFrame,
    getPerformanceReport,
  };
}

// Development-only performance monitor component
export function PerformanceMonitor({ enabled = process.env.NODE_ENV === 'development' }: { enabled?: boolean }) {
  const { metrics, getPerformanceReport } = usePerformanceMetrics();

  if (!enabled) return null;

  const report = getPerformanceReport();

  return (
    <div 
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        minWidth: '200px'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🚀 3D Performance</div>
      <div>Load Time: {metrics.loadTime?.toFixed(2) || 'N/A'}ms {report.status.loadTime}</div>
      <div>Render Time: {metrics.renderTime?.toFixed(2) || 'N/A'}ms {report.status.renderTime}</div>
      <div>Frame Rate: {metrics.frameRate.toFixed(1)} FPS {report.status.frameRate}</div>
      <div>Memory: {metrics.memoryUsage?.toFixed(1) || 'N/A'}MB {report.status.memoryUsage}</div>
      <div>Status: {metrics.isLoading ? '⏳ Loading...' : '✅ Ready'}</div>
    </div>
  );
}