import Section from '@/components/Section'

export default function About() {
  return (
    <Section id="a-propos" className="pb-28 scroll-mt-28">
      <h2 className="mb-4 text-3xl font-display font-bold text-indigo-400">
        À&nbsp;propos
      </h2>

      <p className="text-gray-300 leading-relaxed max-w-xl">
        Développeur&nbsp;full-stack&nbsp;JavaScript formé chez&nbsp;
        <span className="text-indigo-400 font-semibold">Le&nbsp;Wagon</span> puis&nbsp;
        <span className="text-indigo-400 font-semibold">OpenClassrooms</span>,
        j’ai acquis&nbsp;<span className="text-indigo-400 font-semibold">2 ans ½ d’expérience</span>{' '}
        en entreprise. Aujourd’hui, je poursuis mon apprentissage en autodidacte – nouvelles libs,
        DevOps ou IA – et j’expérimente via de nombreux
        <span className="text-indigo-400 font-semibold">&nbsp;projets open-source</span>.
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ['3 ans',      'XP&nbsp;&nbsp;Dev&nbsp;& DevOps'],
          ['Une infinité',        'de Projets&nbsp;perso'],
          ['<24h',   'Pour adopter<br />un outil'],
          ['100 %',      'Curiosité&nbsp;& énergie'],
        ].map(([val, label]) => (
          <li key={label} className="rounded-2xl bg-gray-900/60 p-4 text-center">
            <span className="block text-2xl font-bold text-indigo-400">{val}</span>
            <span
              className="text-gray-400 text-sm"
              dangerouslySetInnerHTML={{ __html: label }}
            />
          </li>
        ))}
      </ul>
    </Section>
  )
}
