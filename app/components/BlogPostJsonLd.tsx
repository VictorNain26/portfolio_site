const BASE_URL = 'https://victorlenain.fr';

type Props = {
  title: string;
  summary: string;
  publishedAt: string;
  slug: string;
  tags: string[];
  wordCount: number;
};

export default function BlogPostJsonLd({
  title,
  summary,
  publishedAt,
  slug,
  tags,
  wordCount,
}: Props) {
  const url = `${BASE_URL}/blog/${slug}`;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: summary,
    url,
    datePublished: publishedAt,
    dateModified: publishedAt,
    wordCount,
    inLanguage: 'fr-FR',
    author: {
      '@type': 'Person',
      name: 'Victor Lenain',
      url: BASE_URL,
      jobTitle: 'Développeur Full-Stack Freelance',
      sameAs: [
        'https://www.linkedin.com/in/victor-lenain/',
        'https://github.com/victornain26',
      ],
    },
    publisher: {
      '@type': 'Person',
      name: 'Victor Lenain',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: `${url}/opengraph-image`,
    keywords: tags.join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${BASE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: url,
      },
    ],
  };

  const schemas = [blogPostingSchema, breadcrumbSchema];

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
