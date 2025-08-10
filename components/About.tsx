import Section from '@/components/Section';

export default function About() {
  return (
    <Section className="scroll-mt-28 pb-28" id="a-propos">
      <h2 className="font-display mb-4 text-3xl font-bold text-indigo-400">À&nbsp;propos</h2>

      <p className="max-w-xl leading-relaxed text-gray-300">
        Développeur&nbsp;full‑stack&nbsp;JavaScript diplômé du&nbsp;
        <span className="font-semibold text-indigo-400">Wagon</span> et d&apos;&nbsp;
        <span className="font-semibold text-indigo-400">OpenClassrooms</span>, avec&nbsp;
        <span className="font-semibold text-indigo-400">3&nbsp;années d&apos;expérience</span> en
        développement web. Spécialisé dans les technologies modernes et l’intégration de l’
        <span className="font-semibold text-indigo-400">IA et des modèles de langage (LLM)</span>,
        je conçois des interfaces dynamiques, des expériences&nbsp;3D et des solutions
        conversationnelles. Je développe continuellement mes compétences à travers des&nbsp;
        <span className="font-semibold text-indigo-400">projets open‑source</span>.
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
          <li key={label} className="rounded-2xl bg-gray-900/60 p-4 text-center">
            <span className="block text-2xl font-bold text-indigo-400">{val}</span>
            <span className="text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: label }} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
