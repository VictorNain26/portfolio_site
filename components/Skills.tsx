'use client'

import { useState } from 'react'
import clsx from 'clsx'
import Section from '@/components/Section'
import { Badge } from '@/components/ui/badge'
import { GripVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type UniqueIdentifier,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/* -------------------------------------------------------------------------- */
/* Données initiales                                                          */
/* -------------------------------------------------------------------------- */
type Cat = { category: string; items: string[] }

const initialSkills: Cat[] = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Backend',  items: ['Node.js', 'Express', 'GraphQL', 'PostgreSQL'] },
  { category: 'DevOps',   items: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'] },
]

/* Helpers — IDs uniques sûrs pour TypeScript --------------------------------*/
const makeId     = (cat: string, skill: string) => `${cat}|${skill}`
const parseCat   = (id: UniqueIdentifier) => String(id).split('|')[0]
const parseSkill = (id: UniqueIdentifier) => String(id).split('|')[1]

/* -------------------------------------------------------------------------- */
/* Badge sortable avec animations                                             */
/* -------------------------------------------------------------------------- */
function SortableBadge({ id, label }: { id: string; label: string }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      whileDrag={{ scale: 1.12, rotate: 2 }}
      className={clsx(
        'cursor-grab active:cursor-grabbing select-none',
        isDragging && 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-black/40',
      )}
      {...attributes}
      {...listeners}
    >
      <Badge
        className="
          flex items-center gap-1.5
          bg-indigo-700/30 text-indigo-200
          px-4 py-2 text-sm shadow-md backdrop-blur
        "
      >
        <GripVertical className="h-4 w-4 opacity-60 shrink-0" />
        {label}
      </Badge>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Composant principal                                                        */
/* -------------------------------------------------------------------------- */
export default function Skills() {
  const [skills, setSkills] = useState<Cat[]>(initialSkills)
  const [filter, setFilter] = useState<string | null>(null)

  /* Un seul capteur pour tout le DnD */
  const sensors = useSensors(useSensor(PointerSensor))

  /* Handler global : réordonne uniquement dans la même catégorie */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeCat = parseCat(active.id)
    const overCat   = parseCat(over.id)
    if (activeCat !== overCat) return                // bloque inter-colonne

    setSkills(prev =>
      prev.map(cat =>
        cat.category === activeCat
          ? {
              ...cat,
              items: arrayMove(
                cat.items,
                cat.items.indexOf(parseSkill(active.id)),
                cat.items.indexOf(parseSkill(over.id)),
              ),
            }
          : cat,
      ),
    )
  }

  return (
    <Section id="competences" className="max-w-6xl mx-auto px-4 pb-28 scroll-mt-28">
      {/* Titre */}
      <h2 className="mb-8 text-3xl font-display font-bold text-indigo-400">
        Compétences
      </h2>

      {/* Filtres */}
      <div className="mb-8 flex flex-wrap gap-3">
        {[{ label: 'Tous', value: null }, ...skills.map(c => ({ label: c.category, value: c.category }))].map(
          ({ label, value }) => (
            <button
              key={label}
              onClick={() => setFilter(value)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm transition-colors',
                filter === value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/60',
              )}
            >
              {label}
            </button>
          ),
        )}
      </div>

      {/* Grid + DndContext global */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {skills
            .filter(c => !filter || c.category === filter)
            .map(({ category, items }) => (
              <div key={category}>
                <h3 className="mb-4 font-semibold text-indigo-300">{category}</h3>

                <SortableContext
                  items={items.map(skill => makeId(category, skill))}
                  strategy={rectSortingStrategy}
                >
                  <div className="flex flex-wrap gap-2">
                    {items.map(skill => (
                      <SortableBadge
                        key={skill}
                        id={makeId(category, skill)}
                        label={skill}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            ))}
        </div>
      </DndContext>
    </Section>
  )
}
