import { MessageCircle, FileText, Code, Rocket } from 'lucide-react';
import Section from '@/components/Section';
import SectionHeading from '@/components/SectionHeading';
import FadeOnView from '@/components/FadeOnView';

const steps = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'Échange',
    duration: '15 min',
    description:
      'Un appel de 15 min pour cadrer le besoin, la stack en place et la contrainte qui vous bloque. Vous repartez avec un premier avis, gratuit.',
  },
  {
    icon: FileText,
    number: '02',
    title: 'Proposition',
    duration: '48 h',
    description:
      'Devis chiffré sous 48 h : périmètre, jalons, livrables, budget fixe ou TJM. Vous savez à quoi ressemble le mois 1 avant de signer.',
  },
  {
    icon: Code,
    number: '03',
    title: 'Développement',
    duration: 'Itératif',
    description:
      "Livraisons hebdo en environnement de staging, avec eval branchée dès qu'il y a de l'IA dans la boucle. Vous voyez les régressions avant moi.",
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Mise en ligne',
    duration: '+ suivi',
    description:
      "Mise en prod accompagnée, passation du code et du monitoring (coûts tokens, latence, taux d'erreur). Deux semaines de garantie incluses.",
  },
] as const;

export default function Process() {
  return (
    <Section className="scroll-mt-28 pb-28" id="process">
      <SectionHeading index="03" label="Méthode" title="Quatre étapes, pas de zone d'ombre." />

      {/* Mobile : vertical timeline ; Desktop : 4 cards alignées en grid avec gap large */}
      <ol className="relative grid gap-y-10 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-0">
        {/* Rail vertical (mobile only) */}
        <div
          aria-hidden="true"
          className="absolute top-6 bottom-6 left-6 w-px bg-gradient-to-b from-brand-hover/40 via-brand-hover/15 to-transparent lg:hidden"
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <FadeOnView
              key={step.number}
              as="li"
              className="relative pl-20 lg:pl-0"
              delay={0.05 + index * 0.08}
            >
              {/* Node icon */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-full border border-brand-hover/30 bg-background text-brand-light shadow-glow-xs lg:relative lg:mb-6"
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Connector arrow desktop only, between cards */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute top-6 left-14 hidden h-px w-[calc(100%-3.5rem)] lg:block"
                >
                  <div className="h-full bg-gradient-to-r from-brand-hover/30 to-brand-hover/0" />
                </div>
              )}

              <div className="flex items-baseline gap-3">
                <span className="label-mono text-brand-accent">{step.number}</span>
                <span className="label-mono text-warm/80">{step.duration}</span>
              </div>

              <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
                {step.description}
              </p>
            </FadeOnView>
          );
        })}
      </ol>
    </Section>
  );
}
