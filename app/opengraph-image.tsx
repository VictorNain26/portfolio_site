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
        {/* Badge disponible */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
            padding: '12px 24px',
            borderRadius: '50px',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            background: 'rgba(34, 197, 94, 0.1)',
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
              color: '#4ade80',
              fontSize: '22px',
              fontWeight: 500,
            }}
          >
            Disponible pour une mission
          </span>
        </div>

        {/* Proposition de valeur - centrée client */}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          Votre application web,{' '}
          <span style={{ color: '#818cf8' }}>livrée et maintenue</span>
        </h1>

        {/* Expérience */}
        <p
          style={{
            fontSize: '28px',
            color: '#d1d5db',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Développeur Full-Stack · 2 ans d&apos;expérience en agence
        </p>

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
