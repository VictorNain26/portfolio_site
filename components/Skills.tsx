'use client'

import { useState } from 'react'
import { Reorder } from 'framer-motion'
import Section from '@/components/Section'
import { Badge } from '@/components/ui/badge'
import { GripVertical } from 'lucide-react'

type Cat = { category: string; items: string[] }

const initial: Cat[] = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Backend',  items: ['Node.js', 'Express', 'GraphQL', 'PostgreSQL'] },
  { category: 'DevOps',   items: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'] },
]

export default function Skills() {
  const [skills, setSkills] = useState<Cat[]>(initial)
  const [filter, setFilter] = useState<string | null>(null)

  const handleReorder = (cat: string) => (items: string[]) =>
    setSkills(prev =>
      prev.map(c => (c.category === cat ? { ...c, items } : c)),
    )

  return (
    <Section id="competences" className="max-w-6xl mx-auto px-4 pb-20">

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {skills
          .filter(c => !filter || c.category === filter)
          .map(({ category, items }) => (
            <div key={category}>
              <h3 className="mb-3 font-semibold text-indigo-300">{category}</h3>

              <Reorder.Group
                values={items}
                onReorder={handleReorder(category)}
                className="flex flex-wrap gap-2"
                layoutScroll
              >
                {items.map(skill => (
                  <Reorder.Item
                    key={skill}
                    value={skill}
                    drag
                    whileDrag={{ scale: 1.1, zIndex: 10 }}
                    className="cursor-grab active:cursor-grabbing select-none"
                  >
                    <Badge className="
                      flex items-center gap-1.5
                      bg-indigo-700/30 text-indigo-200 backdrop-blur
                      px-4 py-2 text-sm shadow-md
                      hover:bg-indigo-700/50 transition-colors
                    ">
                      <GripVertical
                        className="h-4 w-4 opacity-60 shrink-0"
                        aria-hidden
                      />
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
