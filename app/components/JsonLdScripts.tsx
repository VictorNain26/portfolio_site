import Script from 'next/script';
import { personJsonLd, websiteJsonLd, professionalServiceJsonLd } from '../metadata-config';

export default function JsonLdScripts() {
  return (
    <>
      {/* JSON-LD for Person */}
      <Script
        id="ld-person"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd),
        }}
      />

      {/* JSON-LD for Website */}
      <Script
        id="ld-website"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />

      {/* JSON-LD for Professional Service */}
      <Script
        id="ld-professional-service"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceJsonLd),
        }}
      />
    </>
  );
}