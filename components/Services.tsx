export default function Services() {
  const services = [
    {
      title: 'Développement front-end',
      desc: 'UIs réactives, accessibles, performantes.',
    },
    {
      title: 'Architecture & DevOps',
      desc: 'CI/CD, conteneurisation, IaC, monitoring.',
    },
    {
      title: 'Coaching & Formation',
      desc: 'Mentorat d’équipes, ateliers hands-on.',
    },
  ]
  return (
    <section id="services" className="max-w-4xl mx-auto px-4 scroll-mt-20">
      <h2 className="text-3xl font-display font-bold mb-10">Services</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s.title}
            className="border border-border rounded-2xl p-6 hover:border-primary transition"
          >
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-gray-200 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
