import Section from '@/components/Section';

export default function About() {
  return (
    <Section id="a-propos" className="scroll-mt-28 pb-28">
      <h2 className="mb-4 font-display text-3xl font-bold text-indigo-400">
        À&nbsp;propos
      </h2>

      <p className="max-w-xl leading-relaxed text-gray-300">
        Développeur&nbsp;full-stack&nbsp;JavaScript formé chez&nbsp;
        <span className="font-semibold text-indigo-400">
          Le&nbsp;Wagon
        </span>{' '}
        puis&nbsp;
        <span className="font-semibold text-indigo-400">OpenClassrooms</span>,
        j’ai acquis&nbsp;
        <span className="font-semibold text-indigo-400">
          2 ans ½ d’expérience
        </span>{' '}
        en entreprise. Aujourd’hui, je poursuis mon apprentissage en autodidacte
        – nouvelles libs, DevOps ou IA – et j’expérimente via de nombreux
        <span className="font-semibold text-indigo-400">
          &nbsp;projets open-source
        </span>
        .
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(
          [
            ['3 ans', 'XP&nbsp;&nbsp;Dev&nbsp;& DevOps'],
            ['Une infinité', 'de Projets&nbsp;perso'],
            ['<24h', 'Pour adopter<br />un outil'],
            ['100 %', 'Curiosité&nbsp;& énergie'],
          ] as const
        ).map(([val, label]) => (
          <li
            key={label}
            className="rounded-2xl bg-gray-900/60 p-4 text-center"
          >
            <span className="block text-2xl font-bold text-indigo-400">
              {val}
            </span>
            <span
              className="text-sm text-gray-400"
              dangerouslySetInnerHTML={{ __html: label ?? '' }}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
