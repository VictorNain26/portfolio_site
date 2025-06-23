'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Section from '@/components/Section'

const projects = [
  {
    title: 'Plateforme e-commerce headless',
    description: 'Next.js · GraphQL · Stripe · Vercel · tests E2E',
    image: '/images/hero-bg.jpg',
    href: 'https://example.com',
  },
  {
    title: 'Infrastructure Kubernetes multi-cloud',
    description: 'Terraform · ArgoCD · Prometheus · Grafana',
    image: '/images/hero-bg.jpg',
    href: '#',
  },
]

export default function Projects() {
  return (
    <Section id="projets" className="pb-28 scroll-mt-28">
      <h2 className="mb-10 text-3xl font-display font-bold text-indigo-400">Projets</h2>

      <div className="overflow-x-auto pb-4 md:overflow-visible">
        <ul className="flex gap-6 snap-x snap-mandatory md:grid md:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.title} className="w-[80%] shrink-0 snap-start md:w-auto">
              <motion.a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/60 shadow-md transition-transform duration-200 group-hover:-translate-y-1">
                  <div className="relative">
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={800}
                      height={450}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
                  </div>

                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-semibold text-indigo-300">
                      {p.title}
                    </h3>
                    <p className="text-gray-300">{p.description}</p>
                  </div>
                </div>
              </motion.a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
