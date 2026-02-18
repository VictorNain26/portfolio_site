import {
  personJsonLd,
  websiteJsonLd,
  professionalServiceJsonLd,
  faqJsonLd,
} from '../metadata-config';

/**
 * JSON-LD structured data for SEO and AEO.
 * Uses inline script tags (not next/script with afterInteractive)
 * to ensure crawlers and AI engines can read the data immediately.
 * Data is static and trusted from metadata-config.ts.
 */
export default function JsonLdScripts() {
  // All data is static from metadata-config.ts, safe for inline rendering
  const schemas = [personJsonLd, websiteJsonLd, professionalServiceJsonLd, faqJsonLd];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          type="application/ld+json"
        />
      ))}
    </>
  );
}