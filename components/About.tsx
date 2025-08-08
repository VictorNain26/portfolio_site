import Section from '@/components/Section';

export default function About() {
  return (
    <Section id="a-propos" className="scroll-mt-28 pb-28 transition-colors duration-300">
      <h2 className="mb-4 font-display text-3xl font-bold text-soft-blue-300 transition-colors duration-300">
        À&nbsp;propos
      </h2>

      <p className="max-w-xl leading-relaxed text-soft-gray-300 transition-colors duration-300">
        Développeur&nbsp;full-stack&nbsp;JavaScript curieux et discret,
        diplômé du&nbsp;
        <span className="font-semibold text-soft-blue-300 transition-colors duration-300">
          Wagon
        </span> et
        d&apos;&nbsp;
        <span className="font-semibold text-soft-blue-300 transition-colors duration-300">OpenClassrooms</span>,
        avec&nbsp;
        <span className="font-semibold text-soft-blue-300 transition-colors duration-300">
          3 années d&apos;expérience
        </span>{' '}
        en développement web. Calme et raisonné, je me spécialise dans les
        technologies modernes et l&apos;intégration de solutions
        d&apos;intelligence artificielle, tout en développant continuellement mes
        compétences à travers des&nbsp;
        <span className="font-semibold text-soft-blue-300 transition-colors duration-300">
          projets open-source
        </span>
        .
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(
          [
            ['3 ans', 'd&apos;Expérience&nbsp;professionnelle'],
            ['20+', 'Projets&nbsp;réalisés'],
            ['48h', 'Adaptation&nbsp;rapide<br />aux nouvelles&nbsp;technologies'],
            ['100 %', 'Engagement&nbsp;& rigueur'],
          ] as const
        ).map(([val, label]) => (
          <li
            key={label}
            className="rounded-2xl bg-soft-blue-100/50 p-4 text-center transition-colors duration-300"
          >
            <span className="block text-2xl font-bold text-soft-blue-300 transition-colors duration-300">
              {val}
            </span>
            <span
              className="text-sm text-soft-gray-300 transition-colors duration-300"
              dangerouslySetInnerHTML={{ __html: label ?? '' }}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
