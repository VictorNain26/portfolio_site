'use client'

import { useState } from 'react'
import clsx from 'clsx'
import Section from '@/components/Section'
import { Badge } from '@/components/ui/badge'
import { GripVertical } from 'lucide-react'
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
  type UniqueIdentifier,
  type DragStartEvent,
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
/* Données                                                                    */
/* -------------------------------------------------------------------------- */
type Cat = { category: string; items: string[] }

const initialSkills: Cat[] = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Backend',  items: ['Node.js', 'Express', 'GraphQL', 'PostgreSQL'] },
  { category: 'DevOps',   items: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'] },
]

const makeId     = (cat: string, skill: string) => `${cat}|${skill}`
const parseCat   = (id: UniqueIdentifier) => String(id).split('|')[0]
const parseSkill = (id: UniqueIdentifier) => String(id).split('|')[1]

/* -------------------------------------------------------------------------- */
/* Badge sortable                                                             */
/* -------------------------------------------------------------------------- */
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
    animateLayoutChanges: () => true,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? 'none' : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing select-none"
      {...attributes}
      {...listeners}
    >
      <Badge
        className="
          flex items-center gap-1.5
          bg-indigo-700/30 text-indigo-200 backdrop-blur
          px-4 py-2 text-sm shadow-md
          transition-colors hover:bg-indigo-700/50
        "
      >
        <GripVertical className="h-4 w-4 opacity-60 shrink-0" />
        {label}
      </Badge>
    </div>
  )
}

/* Overlay qui suit le doigt / curseur */
function DraggedBadge({ label }: { label: string }) {
  return (
    <div className="scale-[1.12] rotate-3 shadow-2xl">
      <Badge className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 text-sm">
        <GripVertical className="h-4 w-4 opacity-60 shrink-0" />
        {label}
      </Badge>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Composant principal                                                        */
/* -------------------------------------------------------------------------- */
export default function Skills() {
  const [skills, setSkills]   = useState<Cat[]>(initialSkills)
  const [filter, setFilter]   = useState<string | null>(null)
  const [activeId, setActive] = useState<UniqueIdentifier | null>(null)

  /* Sensors : pointer (desktop) + touch (mobile) */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 8 } }),
  )

  const handleDragStart = (e: DragStartEvent) => setActive(e.active.id)

  const handleDragEnd   = ({ active, over }: DragEndEvent) => {
    setActive(null)
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
    <Section id="competences" className="max-w-6xl mx-auto px-4 pb-20">
      <h2 className="mb-6 text-3xl font-display font-bold text-indigo-400">
        Compétences
      </h2>

      {/* Filtres */}
      <div className="mb-6 flex flex-wrap gap-3">
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

      {/* Grid + DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skills
            .filter(c => !filter || c.category === filter)
            .map(({ category, items }) => (
              <div key={category}>
                <h3 className="mb-3 font-semibold text-indigo-300">{category}</h3>

                <SortableContext
                  items={items.map(skill => makeId(category, skill))}
                  strategy={rectSortingStrategy}
                >
                  <div className="flex flex-wrap gap-2">
                    {items.map(skill => (
                      <SortableBadge key={skill} id={makeId(category, skill)} label={skill} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 160 }}>
          {activeId && <DraggedBadge label={parseSkill(activeId)} />}
        </DragOverlay>
      </DndContext>
    </Section>
  )
}
