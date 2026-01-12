import { ImageResponse } from '@vercel/og';
import { allPosts } from 'content-collections';

export const runtime = 'edge';
export const alt = 'Victor Lenain - Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);

  const title = post?.title ?? 'Victor Lenain - Blog';
  const summary = post?.summary ?? 'Articles et tutoriels sur le développement web';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0e082e 0%, #1a0f4a 50%, #0e082e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top: Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
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
              fontSize: '24px',
              fontWeight: 500,
            }}
          >
            victorlenain.fr/blog
          </span>
        </div>

        {/* Center: Title & Summary */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2,
              margin: 0,
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#9ca3af',
              lineHeight: 1.4,
              margin: 0,
              maxWidth: '800px',
            }}
          >
            {summary}
          </p>
        </div>

        {/* Bottom: Author */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 700,
              }}
            >
              VL
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 600,
                }}
              >
                Victor Lenain
              </span>
              <span
                style={{
                  color: '#6366f1',
                  fontSize: '18px',
                }}
              >
                Développeur Full-Stack JavaScript
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
