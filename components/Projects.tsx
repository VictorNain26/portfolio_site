'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const projects = [
  {
    title: 'Plateforme e-commerce headless',
    description:
      'Stack Next.js + GraphQL + Stripe, déploiement Vercel, tests E2E.',
    image: '/images/hero-bg.jpg',
    href: 'https://example.com',
  },
  {
    title: 'Infrastructure Kubernetes multi-cloud',
    description:
      'IaC Terraform, GitOps ArgoCD, monitoring Prometheus + Grafana.',
    image: '/images/hero-bg.jpg',
    href: '#',
  },
]

export default function Projects() {
  return (
    <section id="projets" className="max-w-6xl mx-auto px-4 scroll-mt-28">
      <h2 className="text-3xl font-display font-bold mb-10 text-indigo-400">
        Projets
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.a
            key={p.title}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="overflow-hidden rounded-xl bg-gray-800/60 border border-gray-700/50 shadow-sm hover:bg-gray-700/50 transition-colors">
              <Image
                src={p.image}
                alt={p.title}
                width={800}
                height={450}
                className="transition-transform group-hover:scale-105 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold text-indigo-300 mb-2">
                  {p.title}
                </h3>
                <p className="text-gray-300">{p.description}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
