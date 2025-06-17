export default function About() {
  return (
    <section
      id="a-propos"
      className="max-w-4xl mx-auto px-4 scroll-mt-20 leading-relaxed"
    >
      <h2 className="text-3xl font-display font-bold mb-6">À propos</h2>
      <p className="text-gray-300">
        Passionné par l’automatisation, j’ai{' '}
        <span className="text-primary">5+ années</span>{' '}
        d’expérience à concevoir des pipelines CI/CD, migrer des workloads
        vers Kubernetes et coder des interfaces web accessibles.
      </p>
    </section>
  )
}
