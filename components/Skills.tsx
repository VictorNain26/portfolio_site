'use client'
import { useState } from 'react'
import clsx from 'clsx'
import Section from '@/components/Section'
import { Badge } from '@/components/ui/badge'

const skills = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Backend',  items: ['Node.js', 'Express', 'GraphQL', 'PostgreSQL'] },
  { category: 'DevOps',   items: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'] },
]

export default function Skills() {
  const [filter, setFilter] = useState<string | null>(null)

  return (
    <Section id="competences" className="max-w-5xl mx-auto px-4 pb-28 scroll-mt-28">
      <h2 className="mb-8 text-3xl font-display font-bold text-indigo-400">Compétences</h2>

      {/* Pills */}
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter(null)}
          className={clsx(
            'px-3 py-1.5 rounded-full text-sm transition-colors',
            filter === null
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/60'
          )}
        >
          Tous
        </button>

        {skills.map(({ category }) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={clsx(
              'px-3 py-1.5 rounded-full text-sm transition-colors',
              filter === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/60'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Liste filtrée */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {skills
          .filter(s => !filter || s.category === filter)
          .map(({ category, items }) => (
            <div key={category}>
              <h3 className="mb-3 font-semibold text-indigo-300">{category}</h3>
              <ul className="flex flex-wrap gap-2">
                {items.map(item => (
                  <li key={item}>
                    <Badge className="bg-indigo-700/30 text-indigo-200">{item}</Badge>
                  </li>
                ))}
              </ul>
            </div>
        ))}
      </div>
    </Section>
  )
}
