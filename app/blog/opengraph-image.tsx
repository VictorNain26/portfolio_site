import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const alt = 'Victor Lenain - Blog Développement Web';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0e082e 0%, #1a0f4a 50%, #0e082e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Badge Blog */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
            padding: '12px 24px',
            borderRadius: '50px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            background: 'rgba(99, 102, 241, 0.1)',
          }}
        >
          <span
            style={{
              color: '#a5b4fc',
              fontSize: '22px',
              fontWeight: 500,
            }}
          >
            Blog · Articles & Tutoriels
          </span>
        </div>

        {/* Titre */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          Développement Web
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '28px',
            color: '#9ca3af',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.5,
            margin: 0,
            marginBottom: '40px',
          }}
        >
          React, Next.js, Node.js et bonnes pratiques du développement moderne
        </p>

        {/* Auteur */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            VL
          </div>
          <span
            style={{
              color: '#d1d5db',
              fontSize: '22px',
            }}
          >
            Par Victor Lenain
          </span>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            color: '#6366f1',
            fontSize: '20px',
            fontWeight: 500,
          }}
        >
          victorlenain.fr/blog
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
