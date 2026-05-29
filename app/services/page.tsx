import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import FadeOnView from '@/components/FadeOnView';
import CalPopupButton from '@/components/CalPopupButton';
import Section from '@/components/Section';
import { ACCENT_CLASSES, services } from './content';

const BASE_URL = 'https://victorlenain.fr';
const URL = `${BASE_URL}/services`;
const TITLE = 'Services : développement IA, applications web, audit';
const DESCRIPTION =
  'Agents IA, RAG, automatisations LLM, applications web sur mesure, refonte, audit IA. Développeur full-stack freelance à Paris, intégration IA dans vos produits.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services Victor Lenain',
    description: DESCRIPTION,
  },
};

export default function ServicesIndexPage() {
  const featured = services.filter(s => s.tier === 'featured');
  const secondary = services.filter(s => s.tier === 'secondary');

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: TITLE,
          description: DESCRIPTION,
          url: URL,
          hasPart: services.map(s => ({
            '@type': 'Service',
            name: s.title,
            url: `${BASE_URL}/services/${s.slug}`,
            description: s.metaDescription,
          })),
        })}
      </script>

      <main className="relative pt-24 sm:pt-28" id="main">
        {/* Glow accent en haut de page pour donner du caractère sans charger */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-32 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-brand-hover/[0.10] blur-[140px]" />
        </div>

        {/* Hero + premier bloc collés visuellement */}
        <Section className="pb-10">
          <FadeOnView className="max-w-3xl">
            <p className="mb-3 font-display text-sm font-medium tracking-[0.18em] text-brand-accent uppercase">
              Services
            </p>
            <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Je code la couche IA dans votre stack existante.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
              Développeur full-stack freelance à Paris. Je greffe la couche IA sur votre stack web
              (Next, Django, Rails, FastAPI) sans refonte. Trois prestations pour
              l&apos;intégration, trois autres pour le reste du produit web.
            </p>
          </FadeOnView>
        </Section>

        {/* Phares — cards directement sous le hero, séparées par un eyebrow discret */}
        <Section className="pb-14">
          <FadeOnView className="mb-6 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-brand-accent/60" />
            <p className="text-xs font-medium tracking-[0.18em] text-brand-accent uppercase">
              Intégration IA
            </p>
          </FadeOnView>

          <div className="grid gap-5 lg:grid-cols-3">
            {featured.map((s, i) => {
              const accent = ACCENT_CLASSES[s.accent];
              const Icon = s.icon;
              return (
                <FadeOnView key={s.slug} delay={0.05 + i * 0.06}>
                  <Link
                    className={`group flex h-full flex-col gap-5 rounded-2xl border border-line-2 bg-surface-1 p-7 backdrop-blur-sm transition-colors duration-300 ${accent.hoverBorder} hover:bg-surface-3`}
                    href={`/services/${s.slug}`}
                  >
                    <div
                      className={`inline-flex w-fit rounded-xl p-3 ${accent.bg} ${accent.text} transition-transform group-hover:-translate-y-0.5`}
                    >
                      <Icon aria-hidden="true" className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-white">
                        {s.shortTitle}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-gray-400">{s.tagline}</p>
                    </div>
                    <span
                      className={`mt-auto inline-flex items-center gap-1.5 text-sm font-medium ${accent.text}`}
                    >
                      Voir le service
                      <ArrowRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </FadeOnView>
              );
            })}
          </div>
        </Section>

        {/* Secondaires — plus dense, plus discret */}
        <Section className="pb-16">
          <FadeOnView className="mb-6 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-gray-600/60" />
            <p className="text-xs font-medium tracking-[0.18em] text-gray-500 uppercase">
              Au-delà de l&apos;IA
            </p>
          </FadeOnView>

          <div className="grid gap-4 sm:grid-cols-3">
            {secondary.map((s, i) => {
              const accent = ACCENT_CLASSES[s.accent];
              const Icon = s.icon;
              return (
                <FadeOnView key={s.slug} delay={0.05 + i * 0.06}>
                  <Link
                    className="group flex h-full gap-4 rounded-xl border border-line-1 bg-surface-1 p-5 transition-colors duration-300 hover:border-line-3 hover:bg-surface-2"
                    href={`/services/${s.slug}`}
                  >
                    <div
                      className={`shrink-0 ${accent.text} transition-transform group-hover:-translate-y-0.5`}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-gray-200">{s.shortTitle}</h3>
                      <p className="text-xs leading-relaxed text-gray-500">{s.tagline}</p>
                    </div>
                  </Link>
                </FadeOnView>
              );
            })}
          </div>
        </Section>

        {/* CTA */}
        <Section className="pb-24">
          <FadeOnView className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-line-2 bg-surface-1 px-6 py-14 text-center backdrop-blur-sm sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-hover/40 to-transparent"
            />
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              On en discute ?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-gray-400">
              15 minutes pour cadrer votre besoin. Je dis si l&apos;IA est la bonne réponse et vers
              quelle prestation orienter.
            </p>
            <div className="mt-8">
              <CalPopupButton
                className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
                data-umami-event="cta-services-index-cal"
              >
                <Calendar aria-hidden="true" className="h-4 w-4" />
                Réserver un échange
              </CalPopupButton>
            </div>
          </FadeOnView>
        </Section>
      </main>
    </>
  );
}
