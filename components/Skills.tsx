'use client';

import { useState } from 'react';
import { Reorder } from 'framer-motion';
import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';

type Cat = { category: string; items: string[] };

const initial: Cat[] = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express', 'GraphQL', 'PostgreSQL'],
  },
  {
    category: 'DevOps',
    items: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
  },
];

export default function Skills() {
  const [skills, setSkills] = useState<Cat[]>(initial);
  const [filter, setFilter] = useState<string | null>(null);

  const onReorder = (cat: string) => (items: string[]) =>
    setSkills(prev =>
      prev.map(c => (c.category === cat ? { ...c, items } : c))
    );

  return (
    <Section id="competences" className="pb-20">
      <h2 className="mb-6 font-display text-3xl font-bold text-indigo-400">
        Compétences
      </h2>

      {/* filtres */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { label: 'Tous', value: null },
          ...initial.map(c => ({ label: c.category, value: c.category })),
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setFilter(value)}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              filter === value
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* grille ré-ordonnable */}
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
                    drag
                    whileDrag={{ scale: 1.1, zIndex: 10 }}
                    className="cursor-grab select-none active:cursor-grabbing"
                  >
                    <Badge className="bg-indigo-700/30 px-4 py-2 text-sm text-indigo-200 shadow-md backdrop-blur transition-colors hover:bg-indigo-700/50">
                      {skill}
                    </Badge>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          ))}
      </div>
    </Section>
  );
}
