import { MessageCircle, FileText, Code, Rocket } from 'lucide-react';
import Section from '@/components/Section';
import FadeOnView from '@/components/FadeOnView';

const steps = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'Échange',
    duration: '15 min',
    description:
      "Un appel de 15 min pour cadrer le besoin, la stack en place et la contrainte qui vous bloque. Vous repartez avec un premier avis, gratuit.",
  },
  {
    icon: FileText,
    number: '02',
    title: 'Proposition',
    duration: '48 h',
    description:
      "Devis chiffré sous 48 h : périmètre, jalons, livrables, budget fixe ou TJM. Vous savez à quoi ressemble le mois 1 avant de signer.",
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
      <FadeOnView className="mb-16 max-w-2xl">
        <p className="font-display mb-3 text-sm font-medium uppercase tracking-[0.18em] text-indigo-400">
          Comment ça démarre
        </p>
        <h2 className="font-display text-3xl font-bold leading-[1.1] text-white sm:text-4xl lg:text-5xl">
          Quatre étapes, pas de zone d&apos;ombre.
        </h2>
      </FadeOnView>

      {/* Mobile : vertical timeline ; Desktop : 4 cards alignées en grid avec gap large */}
      <ol className="relative grid gap-y-10 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-0">
        {/* Rail vertical (mobile only) */}
        <div
          aria-hidden="true"
          className="absolute top-6 bottom-6 left-6 w-px bg-gradient-to-b from-indigo-500/40 via-indigo-500/15 to-transparent lg:hidden"
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
                className="absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-full border border-indigo-500/30 bg-[#0e082e] text-indigo-300 shadow-[0_0_24px_-6px_rgba(99,102,241,0.4)] lg:relative lg:mb-6"
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Connector arrow desktop only, between cards */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute top-6 left-14 hidden h-px w-[calc(100%-3.5rem)] lg:block"
                >
                  <div className="h-full bg-gradient-to-r from-indigo-500/30 to-indigo-500/0" />
                </div>
              )}

              <div className="flex items-baseline gap-3">
                <span className="font-display text-xs font-semibold tracking-[0.18em] text-indigo-400">
                  {step.number}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-amber-400/80">
                  {step.duration}
                </span>
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
