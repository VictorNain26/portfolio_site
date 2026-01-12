import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const alt = 'Victor Lenain - Développeur Full-Stack JavaScript';
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
        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
            padding: '12px 24px',
            borderRadius: '50px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            background: 'rgba(99, 102, 241, 0.1)',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#22c55e',
            }}
          />
          <span
            style={{
              color: '#a5b4fc',
              fontSize: '22px',
              fontWeight: 500,
            }}
          >
            Disponible pour des missions
          </span>
        </div>

        {/* Name */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            margin: 0,
            marginBottom: '16px',
          }}
        >
          Victor Lenain
        </h1>

        {/* Title */}
        <p
          style={{
            fontSize: '36px',
            fontWeight: 600,
            color: '#a5b4fc',
            margin: 0,
            marginBottom: '24px',
          }}
        >
          Développeur Full-Stack JavaScript
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: '24px',
            color: '#9ca3af',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.5,
            margin: 0,
            marginBottom: '40px',
          }}
        >
          Applications web sur mesure, automatisation et intégration IA pour booster votre activité
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '48px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#9ca3af',
              fontSize: '20px',
            }}
          >
            <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '24px' }}>3+</span>
            ans d&apos;expérience
          </div>
          <div
            style={{
              width: '1px',
              height: '24px',
              background: '#374151',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#9ca3af',
              fontSize: '20px',
            }}
          >
            <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '24px' }}>20+</span>
            projets réalisés
          </div>
          <div
            style={{
              width: '1px',
              height: '24px',
              background: '#374151',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#9ca3af',
              fontSize: '20px',
            }}
          >
            Formation
            <span style={{ fontWeight: 600, color: '#a5b4fc' }}>Le Wagon</span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            color: '#6366f1',
            fontSize: '22px',
            fontWeight: 500,
          }}
        >
          victorlenain.fr
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
