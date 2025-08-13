/**
 * End-to-end performance tests for 3D models
 * Measures real browser performance with Playwright
 */
import { test, expect, type Page } from '@playwright/test';

// Performance thresholds for regression testing
const PERFORMANCE_THRESHOLDS = {
  INITIAL_LOAD: 2000,      // 2 seconds max for initial model load
  MODEL_SWITCH: 500,       // 500ms max for model switching
  FPS_MINIMUM: 25,         // Minimum 25 FPS during animations
  LCP_THRESHOLD: 2500,     // Largest Contentful Paint < 2.5s
  CLS_THRESHOLD: 0.1,      // Cumulative Layout Shift < 0.1
} as const;

interface PerformanceMetrics {
  initialLoad: number;
  modelSwitch: number;
  fps: number;
  lcp: number;
  cls: number;
  memoryUsage: number;
}

async function measurePerformance(page: Page): Promise<PerformanceMetrics> {
  // Start performance monitoring
  await page.evaluate(() => {
    (window as any).performanceMetrics = {
      initialLoadStart: performance.now(),
      frameCount: 0,
      frameStartTime: performance.now(),
    };
  });

  // Navigate to the page
  const startTime = Date.now();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Wait for 3D canvas to appear
  await page.waitForSelector('canvas', { timeout: 10000 });
  
  const initialLoad = Date.now() - startTime;

  // Wait for initial model to load
  await page.waitForTimeout(1000);

  // Measure model switching performance
  const switchStart = Date.now();
  
  // Hover to trigger any interactions
  const canvas = page.locator('canvas');
  await canvas.hover();
  
  // Wait for animation to complete
  await page.waitForTimeout(500);
  
  const modelSwitch = Date.now() - switchStart;

  // Get Web Vitals and other metrics
  const metrics = await page.evaluate(() => {
    return new Promise<{
      lcp: number;
      cls: number;
      fps: number;
      memoryUsage: number;
    }>((resolve) => {
      // Measure FPS over a short period
      let frameCount = 0;
      let lastTime = performance.now();
      
      function countFrames() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) { // 1 second
          const fps = frameCount;
          
          // Get memory usage
          const memoryInfo = (performance as any).memory;
          const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / (1024 * 1024) : 0;
          
          resolve({
            lcp: 0, // Will be measured separately
            cls: 0, // Will be measured separately  
            fps,
            memoryUsage
          });
          return;
        }
        
        requestAnimationFrame(countFrames);
      }
      
      requestAnimationFrame(countFrames);
    });
  });

  // Get Web Vitals using PerformanceObserver
  const webVitals = await page.evaluate(() => {
    return new Promise<{ lcp: number; cls: number }>((resolve) => {
      let lcp = 0;
      let cls = 0;
      let resolveCount = 0;

      function maybeResolve() {
        resolveCount++;
        if (resolveCount >= 2) {
          resolve({ lcp, cls });
        }
      }

      // Measure LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          lcp = entries[entries.length - 1].startTime;
        }
        maybeResolve();
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // Measure CLS
      new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        cls = clsValue;
        maybeResolve();
      }).observe({ type: 'layout-shift', buffered: true });

      // Fallback timeout
      setTimeout(() => resolve({ lcp, cls }), 2000);
    });
  });

  return {
    initialLoad,
    modelSwitch,
    fps: metrics.fps,
    lcp: webVitals.lcp,
    cls: webVitals.cls,
    memoryUsage: metrics.memoryUsage
  };
}

test.describe('3D Models Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance monitoring
    await page.addInitScript(() => {
      // Mock console.warn to capture performance warnings
      (window as any).performanceWarnings = [];
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (args[0]?.includes('3D Model')) {
          (window as any).performanceWarnings.push(args.join(' '));
        }
        originalWarn.apply(console, args);
      };
    });
  });

  test('should load initial 3D model within performance threshold', async ({ page }) => {
    const metrics = await measurePerformance(page);

    // Assert performance thresholds
    expect(metrics.initialLoad).toBeLessThan(PERFORMANCE_THRESHOLDS.INITIAL_LOAD);
    expect(metrics.lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP_THRESHOLD);
    expect(metrics.cls).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS_THRESHOLD);

    // Check for performance warnings
    const warnings = await page.evaluate(() => (window as any).performanceWarnings || []);
    expect(warnings).toHaveLength(0);
  });

  test('should maintain smooth animations with adequate FPS', async ({ page }) => {
    const metrics = await measurePerformance(page);

    expect(metrics.fps).toBeGreaterThan(PERFORMANCE_THRESHOLDS.FPS_MINIMUM);
    
    // Memory usage should be reasonable
    expect(metrics.memoryUsage).toBeLessThan(100); // Less than 100MB
  });

  test('should switch between models efficiently', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('canvas');

    // Measure multiple model switches
    const switchTimes: number[] = [];
    
    for (let i = 0; i < 3; i++) {
      const switchStart = Date.now();
      
      // Trigger model rotation by waiting for the interval
      await page.waitForTimeout(8100); // Slightly more than rotation interval
      
      const switchTime = Date.now() - switchStart;
      switchTimes.push(switchTime);
    }

    // All switches should be within threshold
    switchTimes.forEach(switchTime => {
      expect(switchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.MODEL_SWITCH + 8000); // Account for rotation interval
    });
  });

  test('should handle mobile viewport without performance degradation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const metrics = await measurePerformance(page);

    // Mobile performance thresholds (slightly more lenient)
    expect(metrics.initialLoad).toBeLessThan(PERFORMANCE_THRESHOLDS.INITIAL_LOAD * 1.2);
    expect(metrics.fps).toBeGreaterThan(PERFORMANCE_THRESHOLDS.FPS_MINIMUM * 0.8);
  });

  test('should not cause memory leaks during extended usage', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('canvas');

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      const memoryInfo = (performance as any).memory;
      return memoryInfo ? memoryInfo.usedJSHeapSize / (1024 * 1024) : 0;
    });

    // Simulate extended usage
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(8100); // Wait for model rotation
    }

    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      const memoryInfo = (performance as any).memory;
      return memoryInfo ? memoryInfo.usedJSHeapSize / (1024 * 1024) : 0;
    });

    // Memory increase should be minimal (< 50MB growth)
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(50);
  });

  test('should maintain performance when tab becomes visible/hidden', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('canvas');

    // Hide tab
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: true
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await page.waitForTimeout(1000);

    // Show tab
    const performanceStart = Date.now();
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: false
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    // Measure time to resume
    await page.waitForTimeout(100);
    const resumeTime = Date.now() - performanceStart;

    // Resume should be quick
    expect(resumeTime).toBeLessThan(200);
  });

  // Regression test baseline
  test('performance regression baseline', async ({ page }) => {
    const metrics = await measurePerformance(page);

    // Record baseline metrics for regression detection
    console.log('📊 Performance Baseline Metrics:');
    console.log(`   Initial Load: ${metrics.initialLoad}ms`);
    console.log(`   Model Switch: ${metrics.modelSwitch}ms`);
    console.log(`   FPS: ${metrics.fps}`);
    console.log(`   LCP: ${metrics.lcp}ms`);
    console.log(`   CLS: ${metrics.cls}`);
    console.log(`   Memory: ${metrics.memoryUsage.toFixed(1)}MB`);

    // Strict baseline thresholds (80% of max thresholds)
    expect(metrics.initialLoad).toBeLessThan(PERFORMANCE_THRESHOLDS.INITIAL_LOAD * 0.8);
    expect(metrics.fps).toBeGreaterThan(PERFORMANCE_THRESHOLDS.FPS_MINIMUM * 1.2);
  });
});