import { Badge } from '@/components/ui/badge'

const skills = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Backend',  items: ['Node.js', 'Express', 'GraphQL', 'PostgreSQL'] },
  { category: 'DevOps',   items: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'] },
]

export default function Skills() {
  return (
    <section id="competences" className="max-w-4xl mx-auto px-4 scroll-mt-28">
      <h2 className="text-3xl font-display font-bold mb-6 text-indigo-400">
        Compétences
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {skills.map(({ category, items }) => (
          <div key={category}>
            <h3 className="font-semibold text-indigo-400 mb-2">{category}</h3>

            <ul className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <li key={skill}>
                  <Badge className="bg-indigo-700/30 text-indigo-200">
                    {skill}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
