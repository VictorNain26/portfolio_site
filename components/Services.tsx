import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Section from '@/components/Section';
import SectionHeading from '@/components/SectionHeading';
import FadeOnView from '@/components/FadeOnView';
import { services } from '@/app/services/content';

/* Grille équilibrée 3 colonnes pour les services phares. Le bento
 * asymétrique testé précédemment laissait trop de vide sur la 3e card
 * full-width ; 3 colonnes égales donnent un rythme visuel plus pro. */

export default function Services() {
  const featured = services.filter((s) => s.tier === 'featured');
  const secondary = services.filter((s) => s.tier === 'secondary');

  return (
    <Section className="scroll-mt-28 pb-28" id="services">
      <SectionHeading
        index="01"
        label="Services"
        lead="Vous tournez sur Django, Rails, Next, Node ou FastAPI. J'ajoute la couche IA dessus sans refonte et je mesure ce qui sort. Trois prestations IA, trois prestations web, le même code applicatif derrière."
        title="Je code la couche IA dans votre stack existante."
      />

      {/* 3 services IA phares, colonnes égales */}
      <div className="grid gap-5 lg:grid-cols-3">
        {featured.map((service, index) => {
          const Icon = service.icon;
          return (
            <FadeOnView
              key={service.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-line-2 bg-surface-1 backdrop-blur-sm transition-colors duration-300 hover:border-indigo-400/30 hover:bg-surface-3"
              delay={0.05 + index * 0.05}
            >
              <Link
                aria-label={`En savoir plus sur ${service.shortTitle}`}
                className="flex h-full flex-col p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                href={`/services/${service.slug}`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="mb-5 inline-flex w-fit rounded-xl bg-indigo-500/10 p-3 text-brand-accent transition-colors group-hover:bg-indigo-500/20">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-white">{service.shortTitle}</h3>
                <p className="mb-6 text-sm leading-relaxed text-gray-400">{service.tagline}</p>

                <ul className="mb-6 flex flex-wrap gap-x-4 gap-y-2">
                  {service.highlights.slice(0, 3).map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-1.5 text-xs font-medium text-indigo-300/90"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 rounded-full bg-amber-400/80"
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-light transition-colors group-hover:text-brand-lighter">
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

      {/* Secondaires : plus discret, plus dense */}
      <FadeOnView className="mt-12" delay={0.2}>
        <p className="label-mono mb-5 text-gray-500">Aussi disponible pour</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {secondary.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.slug}
                className="group flex gap-4 rounded-xl border border-line-1 bg-surface-1 p-5 transition-colors duration-300 hover:border-line-3 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                href={`/services/${service.slug}`}
              >
                <div className="shrink-0 text-gray-500 transition-colors group-hover:text-brand-light">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-200">
                    {service.shortTitle}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-500">{service.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </FadeOnView>

      <FadeOnView className="mt-12 text-center" delay={0.3}>
        <Link
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-brand-accent"
          href="/services"
        >
          Voir tous les services en détail
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </FadeOnView>
    </Section>
  );
}
