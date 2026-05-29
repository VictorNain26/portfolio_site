'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Section from '@/components/Section';
import SectionHeading from '@/components/SectionHeading';
import FadeOnView from '@/components/FadeOnView';
import { cn } from '@/lib/utils';
import { faqItems } from '@/app/faq-data';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section className="scroll-mt-28" id="faq">
      <SectionHeading
        index="04"
        label="FAQ"
        title="Les réponses aux questions que vous vous posez probablement."
      />

      <div className="mx-auto max-w-3xl space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <FadeOnView
              key={item.question}
              className="rounded-xl border border-line-2 bg-surface-1 backdrop-blur-sm transition-colors hover:border-brand-hover/20"
              delay={0.05 + index * 0.04}
            >
              <button
                aria-controls={`faq-answer-${index.toString()}`}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                id={`faq-btn-${index.toString()}`}
                type="button"
                onClick={() => {
                  toggle(index);
                }}
              >
                <h3 className="pr-4 text-sm font-semibold text-white sm:text-base">
                  {item.question}
                </h3>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'h-5 w-5 shrink-0 text-brand-accent transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
              <div
                aria-labelledby={`faq-btn-${index.toString()}`}
                className="grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none"
                id={`faq-answer-${index.toString()}`}
                role="region"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-4 text-sm leading-relaxed text-gray-400">{item.answer}</p>
                </div>
              </div>
            </FadeOnView>
          );
        })}
      </div>
    </Section>
  );
}
