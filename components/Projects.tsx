'use client'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const projects = [
  {
    title: 'Plateforme e-commerce headless',
    description:
      'Stack Next.js + GraphQL + Stripe, déploiement sur Vercel avec tests e2e.',
    image: '/images/ecommerce.png',
    href: 'https://example.com',
  },
  {
    title: 'Infrastructure Kubernetes multi-cloud',
    description:
      'IaC avec Terraform, GitOps ArgoCD, monitoring Prometheus + Grafana.',
    image: '/images/k8s.png',
    href: '#',
  },
]

export default function Projects() {
  return (
    <section id="projets" className="max-w-6xl mx-auto px-4 scroll-mt-20">
      <h2 className="text-3xl font-display font-bold mb-10">Projets</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <motion.a
            key={project.title}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden">
              <Image
                src={project.image}
                alt=""
                width={800}
                height={450}
                className="transition-transform group-hover:scale-105"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-400">{project.description}</p>
              </CardContent>
            </Card>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
