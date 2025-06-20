export default function Services() {
  const services = [
    { title: 'Développement front-end', desc: 'UIs réactives, accessibles, performantes.' },
    { title: 'Architecture & DevOps',   desc: 'CI/CD, conteneurisation, IaC, monitoring.' },
    { title: 'Coaching & Formation',    desc: 'Mentorat d’équipes, ateliers hands-on.' },
  ]

  return (
    <section id="services" className="max-w-4xl mx-auto px-4 scroll-mt-28">
      <h2 className="text-3xl font-display font-bold mb-10 text-indigo-400">
        Services
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.title}
            className="
              rounded-2xl border border-gray-700/50 bg-gray-800/60
              p-6 transition-colors hover:bg-gray-700/50
            "
          >
            <h3 className="font-semibold text-indigo-300">{s.title}</h3>
            <p className="text-gray-300 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
