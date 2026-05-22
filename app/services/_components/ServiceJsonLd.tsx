import type { Service } from '../content';

const BASE_URL = 'https://victorlenain.fr';

/**
 * JSON-LD structured data for a Service page (Service + FAQPage + Breadcrumb).
 * Static, trusted data from the `services` content collection. We follow the
 * same pattern as `BlogPostJsonLd` (Next.js documented approach for inline
 * JSON-LD) so React handles escaping of `</script>` and other edge cases.
 */
export default function ServiceJsonLd({ service }: { service: Service }) {
  const url = `${BASE_URL}/services/${service.slug}`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.metaDescription,
    url,
    serviceType: service.shortTitle,
    areaServed: [
      { '@type': 'City', name: 'Paris' },
      { '@type': 'AdministrativeArea', name: 'Île-de-France' },
      { '@type': 'Country', name: 'France' },
    ],
    provider: {
      '@type': 'Person',
      '@id': `${BASE_URL}/#person`,
      name: 'Victor Lenain',
      url: BASE_URL,
      jobTitle: 'Développeur full-stack freelance',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ivry-sur-Seine',
        addressRegion: 'Île-de-France',
        addressCountry: 'FR',
      },
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: 500,
        priceCurrency: 'EUR',
        referenceQuantity: {
          '@type': 'QuantitativeValue',
          value: 1,
          unitCode: 'DAY',
        },
        description: 'TJM démarrant à 500 € selon complexité',
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
      { '@type': 'ListItem', position: 3, name: service.shortTitle, item: url },
    ],
  };

  const faqSchema =
    service.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: service.faq.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  const schemas: object[] = [serviceSchema, breadcrumbSchema];
  if (faqSchema) schemas.push(faqSchema);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          type="application/ld+json"
        />
      ))}
    </>
  );
}
