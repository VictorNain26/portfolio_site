'use client'

import { useState } from 'react'
import { Reorder } from 'framer-motion'
import Section from '@/components/Section'
import { Badge } from '@/components/ui/badge'

type Cat = { category: string; items: string[] }

const initial: Cat[] = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Backend',  items: ['Node.js', 'Express', 'GraphQL', 'PostgreSQL'] },
  { category: 'DevOps',   items: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'] },
]

export default function Skills() {
  const [skills, setSkills] = useState<Cat[]>(initial)
  const [filter, setFilter] = useState<string | null>(null)

  const onReorder = (cat: string) => (items: string[]) =>
    setSkills(prev =>
      prev.map(c => (c.category === cat ? { ...c, items } : c)),
    )

  return (
    <Section id="competences" className="max-w-6xl mx-auto px-4 pb-20">
      {/* ── Titre ─────────────────────────────────────────────────────── */}
      <h2 className="mb-6 text-3xl font-display font-bold text-indigo-400">
        Compétences
      </h2>

      {/* ── Filtres ───────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[{ label: 'Tous', value: null }, ...initial.map(c => ({ label: c.category, value: c.category }))].map(
          ({ label, value }) => (
            <button
              key={label}
              onClick={() => setFilter(value)}
              className={`
                px-3 py-1.5 rounded-full text-sm transition-colors
                ${filter === value
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/60'}
              `}
            >
              {label}
            </button>
          ),
        )}
      </div>

      {/* ── Grille ré-ordonnable ─────────────────────────────────────── */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {skills
          .filter(c => !filter || c.category === filter)
          .map(({ category, items }) => (
            <div key={category}>
              <h3 className="mb-3 font-semibold text-indigo-300">{category}</h3>

              <Reorder.Group
                values={items}
                onReorder={onReorder(category)}
                className="flex flex-wrap gap-2"
                layoutScroll
              >
                {items.map(skill => (
                  <Reorder.Item
                    key={skill}
                    value={skill}
                    drag                      /* libre X & Y */
                    whileDrag={{ scale: 1.1, zIndex: 10 }}
                    className="cursor-grab active:cursor-grabbing select-none"
                  >
                    <Badge
                      className="
                        flex items-center gap-1.5
                        bg-indigo-700/30 text-indigo-200 backdrop-blur
                        px-4 py-2 text-sm shadow-md
                        hover:bg-indigo-700/50 transition-colors
                      "
                    >
                      {skill}
                    </Badge>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          ))}
      </div>
    </Section>
  )
}
