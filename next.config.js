import { withContentCollections } from '@content-collections/next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Partial Prerendering for better performance
    ppr: true,
    // React compiler for better optimization
    reactCompiler: true,
    // Optimized package imports
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-slot',
    ],
    // Bundle size optimization
    bundlePagesRouterDependencies: true,
    // CSS optimization
    cssChunking: 'strict',
    // Parallel build
    parallelServerBuildTraces: true,
    // Memory optimization
    memoryBasedWorkersCount: true,
  },

  // TypeScript configuration
  typescript: {
    // Fail build on TypeScript errors
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Fail build on ESLint errors
    ignoreDuringBuilds: false,
  },

  // Performance optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    // Modern image formats
    formats: ['image/avif', 'image/webp'],
    // Optimize images
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },

  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload',
        },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https://images.unsplash.com https://raw.githubusercontent.com",
            "connect-src 'self' https://api.github.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
        },
      ],
    },
  ],

  // Compression
  compress: true,

  // Power optimizations
  poweredByHeader: false,

  // Redirect trailing slashes
  trailingSlash: false,

  // Generate ETags
  generateEtags: true,

  // Output configuration
  output: 'standalone',

  // Logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // Dev indicators
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Remove unused CSS
    modularizeImports: {
      'lucide-react': {
        transform: 'lucide-react/dist/esm/icons/{{member}}',
      },
    },
  }),
};

export default withBundleAnalyzer(withContentCollections(nextConfig));
