import Section from '@/components/Section'

export default function About() {
  return (
    <Section
      id="a-propos"
      className="max-w-4xl mx-auto px-4 pb-28 scroll-mt-28"
    >
      <h2 className="mb-4 text-3xl font-display font-bold text-indigo-400">
        À&nbsp;propos
      </h2>

      <p className="text-gray-300 leading-relaxed max-w-xl">
        Développeur&nbsp;full-stack&nbsp;JavaScript formé chez&nbsp;
        <span className="text-indigo-400 font-semibold">Le&nbsp;Wagon</span> puis&nbsp;
        <span className="text-indigo-400 font-semibold">OpenClassrooms</span>,
        j’ai ensuite acquis&nbsp;
        <span className="text-indigo-400 font-semibold">2 ans ½ d’expérience professionnelle</span>{' '}
        en entreprise. Je poursuis aujourd’hui mon apprentissage en autodidacte –
        nouvelles libs, DevOps ou IA – et j’expérimente via de nombreux
        <span className="text-indigo-400 font-semibold">&nbsp;projets personnels</span>{' '}
        open-source.
      </p>

      {/* Stat bricks */}
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ['3 ans', 'XP&nbsp;pro&nbsp;Dev&nbsp;& DevOps'],
          ['30+', 'Projets&nbsp;perso / OSS'],
          ['<24h', 'Pour adopter<br />un nouvel outil'],
          ['100%', 'Curiosité&nbsp;& énergie'],
        ].map(([val, label]) => (
          <li
            key={label}
            className="rounded-2xl bg-gray-900/60 p-4 text-center"
          >
            <span className="block text-2xl font-bold text-indigo-400">
              {val}
            </span>
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
