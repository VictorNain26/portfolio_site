import { withContentCollections } from '@content-collections/next';

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
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is https://app.cal.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://app.cal.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https://app.cal.com",
            "connect-src 'self' https://api.github.com https://cloud.umami.is https://app.cal.com",
            "frame-src https://app.cal.com",
            "frame-ancestors 'none'",
          ].join('; '),
        },
      ],
    },
  ],
};

export default withContentCollections(nextConfig);
