import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Check, ChevronRight } from 'lucide-react';
import FadeOnView from '@/components/FadeOnView';
import CalPopupButton from '@/components/CalPopupButton';
import Section from '@/components/Section';
import { ACCENT_CLASSES, getService, services } from '../content';
import ServiceJsonLd from '../_components/ServiceJsonLd';

const BASE_URL = 'https://victorlenain.fr';

export function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const url = `${BASE_URL}/services/${service.slug}`;
  return {
    title: service.title,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: service.title,
      description: service.metaDescription,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.shortTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const accent = ACCENT_CLASSES[service.accent];
  const Icon = service.icon;

  return (
    <>
      <ServiceJsonLd service={service} />

      <main className="relative pt-24 sm:pt-28" id="main">
        {/* Glow accent en haut de page selon la couleur du service */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden"
        >
          <div
            className={`absolute -top-32 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full blur-[140px] ${accent.glow}`}
          />
        </div>

        {/* Breadcrumb */}
        <Section className="mb-8">
          <nav
            aria-label="Fil d'Ariane"
            className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500"
          >
            <Link className="transition-colors hover:text-gray-300" href="/">
              Accueil
            </Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3" />
            <Link className="transition-colors hover:text-gray-300" href="/services">
              Services
            </Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3" />
            <span className={accent.text}>{service.shortTitle}</span>
          </nav>
        </Section>

        {/* Hero */}
        <Section className="pb-16">
          <FadeOnView className="max-w-3xl">
            <div
              className={`mb-6 inline-flex items-center gap-3 rounded-full border px-4 py-2 ${accent.border} ${accent.bg}`}
            >
              <Icon aria-hidden="true" className={`h-4 w-4 ${accent.text}`} />
              <span className={`label-mono ${accent.text}`}>{service.shortTitle}</span>
            </div>
            <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {service.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
              {service.tagline}
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {service.highlights.map(h => (
                <li
                  key={h}
                  className="flex items-start gap-2 rounded-xl border border-line-2 bg-surface-1 p-4 text-sm text-gray-300"
                >
                  <Check aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${accent.text}`} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CalPopupButton
                className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-glow-lg focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
                data-umami-event={`cta-service-${service.slug}-cal`}
              >
                <Calendar aria-hidden="true" className="h-4 w-4" />
                {service.ctaLabel}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </CalPopupButton>
              <Link
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                href="/services"
              >
                ← Voir tous les services
              </Link>
            </div>
          </FadeOnView>
        </Section>

        {/* Problem + Approach split */}
        <Section className="pb-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <FadeOnView delay={0.05}>
              <p className="label-mono mb-3 text-warm/80">Le contexte</p>
              <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Pourquoi c&apos;est dur à bien faire
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-300">
                {service.problem.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </FadeOnView>

            <FadeOnView delay={0.1}>
              <p className={`label-mono mb-3 ${accent.text}`}>Mon approche</p>
              <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Comment je le fais
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-300">
                {service.approach.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </FadeOnView>
          </div>
        </Section>

        {/* Stack */}
        <Section className="pb-16">
          <FadeOnView className="max-w-3xl">
            <p className="label-mono mb-3 text-gray-500">Stack & outils</p>
            <div className="flex flex-wrap gap-2">
              {service.stack.map(t => (
                <span
                  key={t}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium ${accent.chip}`}
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Repères, pas une liste de prérequis. Je m&apos;adapte à votre stack et à vos outils en
              place.
            </p>
          </FadeOnView>
        </Section>

        {/* Use cases */}
        <Section className="pb-16">
          <FadeOnView className="mb-10 max-w-2xl">
            <p className={`label-mono mb-3 ${accent.text}`}>Cas d&apos;usage</p>
            <h2 className="heading-2 text-white">Ce que ça donne en vrai</h2>
          </FadeOnView>

          <div className="grid gap-6 lg:grid-cols-3">
            {service.useCases.map((uc, i) => (
              <FadeOnView
                key={uc.title}
                className="flex flex-col gap-3 rounded-2xl border border-line-2 bg-surface-1 p-6 backdrop-blur-sm"
                delay={0.05 + i * 0.06}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold ${accent.border} ${accent.text}`}
                >
                  {i + 1}
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{uc.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{uc.description}</p>
              </FadeOnView>
            ))}
          </div>
        </Section>

        {/* FAQ */}
        {service.faq.length > 0 && (
          <Section className="pb-16">
            <FadeOnView className="mb-10 max-w-2xl">
              <p className="label-mono mb-3 text-brand-accent">Questions fréquentes</p>
              <h2 className="heading-2 text-white">Ce qu&apos;on me demande sur ce sujet</h2>
            </FadeOnView>

            <div className="mx-auto max-w-3xl space-y-3">
              {service.faq.map((f, i) => (
                <FadeOnView
                  key={f.question}
                  className="rounded-xl border border-line-2 bg-surface-1 p-6 backdrop-blur-sm"
                  delay={0.05 + i * 0.04}
                >
                  <h3 className="text-sm font-semibold text-white sm:text-base">{f.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{f.answer}</p>
                </FadeOnView>
              ))}
            </div>
          </Section>
        )}

        {/* Maillage inter-services : si ce service n'est pas le bon fit, le
         * visiteur garde un chemin vers les autres prestations sans repasser
         * par l'index. */}
        <Section className="pb-16">
          <FadeOnView className="mb-8 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-gray-600/60" />
            <p className="label-mono text-gray-500">Autres prestations</p>
          </FadeOnView>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services
              .filter(s => s.slug !== service.slug)
              .map((s, i) => {
                const a = ACCENT_CLASSES[s.accent];
                const SIcon = s.icon;
                return (
                  <FadeOnView key={s.slug} delay={0.04 * i}>
                    <Link
                      className={`group flex h-full gap-4 rounded-xl border border-line-1 bg-surface-1 p-5 transition-colors duration-300 ${a.hoverBorder} hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none`}
                      data-umami-event={`xlink-${service.slug}-to-${s.slug}`}
                      href={`/services/${s.slug}`}
                    >
                      <div
                        className={`shrink-0 ${a.text} transition-transform group-hover:-translate-y-0.5`}
                      >
                        <SIcon aria-hidden="true" className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-semibold text-gray-200">{s.shortTitle}</h3>
                        <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                          {s.tagline}
                        </p>
                      </div>
                    </Link>
                  </FadeOnView>
                );
              })}
          </div>
        </Section>

        {/* CTA bottom */}
        <Section className="pb-24">
          <FadeOnView className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-line-2 bg-surface-1 px-6 py-14 text-center backdrop-blur-sm sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-hover/40 to-transparent"
            />
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              On en parle ?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-gray-400">
              Premier échange gratuit, sans engagement. On regarde ensemble si ce service est le bon
              pour votre besoin.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <CalPopupButton
                className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
                data-umami-event={`cta-service-${service.slug}-cal-bottom`}
              >
                <Calendar aria-hidden="true" className="h-4 w-4" />
                Réserver 15 min
              </CalPopupButton>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface-2 px-5 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-line-5 hover:text-white"
                href="/services"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Voir tous les services
              </Link>
            </div>
          </FadeOnView>
        </Section>
      </main>
    </>
  );
}
