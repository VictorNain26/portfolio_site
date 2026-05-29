import { ImageResponse } from 'next/og';

export const alt = 'Victor Lenain - Développeur full-stack · Intégration IA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #0B0B1C 0%, #15153a 50%, #0B0B1C 100%)',
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
        La couche IA sur votre <span style={{ color: '#818cf8' }}>stack existante</span>
      </h1>

      {/* Sous-titre */}
      <p
        style={{
          fontSize: '28px',
          color: '#d1d5db',
          textAlign: 'center',
          maxWidth: '900px',
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        Développeur full-stack · Intégration IA · Freelance · Paris
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
    </div>,
    {
      ...size,
    },
  );
}
