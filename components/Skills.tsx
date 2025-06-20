'use client'

import { useState } from 'react'
import clsx from 'clsx'
import Section from '@/components/Section'
import { Badge } from '@/components/ui/badge'
import { GripVertical } from 'lucide-react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
  type UniqueIdentifier,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/* ─── Data ─────────────────────────────────────────────────────────────── */
type Cat = { category: string; items: string[] }

const initialSkills: Cat[] = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Backend',  items: ['Node.js', 'Express', 'GraphQL', 'PostgreSQL'] },
  { category: 'DevOps',   items: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'] },
]

/* IDs helpers ------------------------------------------------------------ */
const makeId     = (cat: string, skill: string) => `${cat}|${skill}`
const parseCat   = (id: UniqueIdentifier) => String(id).split('|')[0]
const parseSkill = (id: UniqueIdentifier) => String(id).split('|')[1]

/* ─── Sortable badge (position animée) ─────────────────────────────────── */
function SortableBadge({ id, label }: { id: string; label: string }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges: () => true,   // <— anime le replacemenent
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,      // on garde une trace mais plus légère
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'cursor-grab active:cursor-grabbing select-none',
        'transition-opacity',
      )}
      {...attributes}
      {...listeners}
    >
      <Badge
        className="
          flex items-center gap-1.5
          bg-indigo-700/30 text-indigo-200
          px-4 py-2 text-sm shadow-md backdrop-blur
          hover:bg-indigo-700/50 transition-colors
        "
      >
        <GripVertical className="h-4 w-4 opacity-60 shrink-0" />
        {label}
      </Badge>
    </div>
  )
}

/* ─── Overlay durant le drag — effet de zoom/ombre ─────────────────────── */
function DraggedBadge({ label }: { label: string }) {
  return (
    <div className="scale-105 shadow-xl">
      <Badge
        className="
          flex items-center gap-1.5
          bg-indigo-600 text-white
          px-4 py-2 text-sm
        "
      >
        <GripVertical className="h-4 w-4 opacity-60 shrink-0" />
        {label}
      </Badge>
    </div>
  )
}

/* ─── Component principal ──────────────────────────────────────────────── */
export default function Skills() {
  const [skills, setSkills] = useState<Cat[]>(initialSkills)
  const [filter, setFilter] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id)
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const src = parseCat(active.id)
    const dst = parseCat(over.id)
    if (src !== dst) return

    setSkills(prev =>
      prev.map(cat =>
        cat.category === src
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
    <Section id="competences" className="max-w-6xl mx-auto px-4 pb-28">
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
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/60',
              )}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
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

        {/* Overlay : badge suit le curseur, sans décaler la grille */}
        <DragOverlay dropAnimation={{ duration: 150 }}>
          {activeId ? (
            <DraggedBadge label={parseSkill(activeId)} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Section>
  )
}
