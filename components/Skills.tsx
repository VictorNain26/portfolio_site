'use client';

import { useState, useCallback } from 'react';
import { Reorder } from 'framer-motion';
import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';

const HOVER_SCALE_DRAGGING = 1.08;
const HOVER_SCALE_NORMAL = 1.02;

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
  {
    // Nouvelle catégorie pour mettre en avant les compétences en IA et LLM.
    // Ces technologies permettent de créer des assistants virtuels, de la
    // génération de contenu et des intégrations conversationnelles dans vos
    // applications web. Ajoutez ici les outils et frameworks que vous maîtrisez.
    category: 'IA & LLM',
    items: ['OpenAI', 'LangChain', 'Hugging Face', 'Vector Databases'],
  },
];

export default function Skills() {
  const [skills, setSkills] = useState<Cat[]>(initial);
  const [filter, setFilter] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const onReorder = useCallback(
    (cat: string) => (items: string[]) => {
      setSkills(prev => prev.map(c => (c.category === cat ? { ...c, items } : c)));
      setIsDragging(null);
    },
    [],
  );

  return (
    <Section className="pb-20" id="competences">
      <h2 className="font-display mb-6 text-3xl font-bold text-indigo-400">Compétences</h2>

      {/* filtres */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { label: 'Tous', value: null },
          ...initial.map(c => ({ label: c.category, value: c.category })),
        ].map(({ label, value }) => (
          <button
            key={label}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              filter === value
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/60'
            }`}
            onClick={() => {
              setFilter(value);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* grille ré-ordonnable */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {skills
          .filter(c => filter === null || c.category === filter)
          .map(({ category, items }) => (
            <div key={category}>
              <h3 className="mb-3 font-semibold text-indigo-300">{category}</h3>

              <Reorder.Group
                className="flex flex-wrap gap-2"
                layoutScroll={false}
                values={items}
                onReorder={onReorder(category)}
              >
                {items.map(skill => (
                  <Reorder.Item
                    key={skill}
                    drag
                    className="cursor-grab select-none active:cursor-grabbing"
                    dragElastic={0.1}
                    dragMomentum={false}
                    initial={{ rotate: 0, scale: 1 }}
                    value={skill}
                    whileHover={{ scale: isDragging === skill ? HOVER_SCALE_DRAGGING : HOVER_SCALE_NORMAL }}
                    animate={{
                      rotate: isDragging === skill ? 0 : 0,
                      scale: isDragging === skill ? 1 : 1,
                      transition: { duration: 0.2, ease: 'easeOut' },
                    }}
                    dragTransition={{
                      bounceStiffness: 400,
                      bounceDamping: 40,
                    }}
                    style={{
                      touchAction: 'none',
                    }}
                    whileDrag={{
                      scale: 1.08,
                      zIndex: 1000,
                      rotate: 3,
                      boxShadow:
                        '0 15px 35px rgba(99, 102, 241, 0.4), 0 5px 15px rgba(0, 0, 0, 0.3)',
                    }}
                    onDragEnd={() => {
                      setIsDragging(null);
                    }}
                    onDragStart={() => {
                      setIsDragging(skill);
                    }}
                  >
                    <Badge className="bg-indigo-700/30 px-4 py-2 text-sm text-indigo-200 shadow-md backdrop-blur transition-colors duration-200 hover:bg-indigo-700/50 hover:shadow-lg hover:shadow-indigo-500/20">
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
