import { withContentCollections } from '@content-collections/next';

const isDev = process.env.NODE_ENV !== 'production';

// React dev mode and Turbopack HMR require dynamic code execution to
// reconstruct stack traces and run module updates. This is a dev-only need
// and is explicitly gated by NODE_ENV so production CSP stays strict.
const devOnlyScriptSrcExtras = isDev ? " 'unsafe-eval'" : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable X-Powered-By header
  poweredByHeader: false,

  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            `script-src 'self' 'unsafe-inline'${devOnlyScriptSrcExtras} https://cloud.umami.is`,
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data:",
            "connect-src 'self' https://api.github.com https://cloud.umami.is",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "object-src 'none'",
            'upgrade-insecure-requests',
          ].join('; '),
        },
      ],
    },
  ],
};

export default withContentCollections(nextConfig);
