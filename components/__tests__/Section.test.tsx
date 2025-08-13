import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Section from '../Section';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, className, ...props }: any) => (
      <section className={className} {...props}>
        {children}
      </section>
    ),
  },
  useReducedMotion: vi.fn(() => false),
}));

describe('Section', () => {
  it('renders children correctly', () => {
    render(<Section>Test content</Section>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies default container classes', () => {
    render(<Section>Content</Section>);
    const section = screen.getByText('Content').closest('section');
    expect(section).toHaveClass('mx-auto', 'max-w-7xl', 'px-4', 'sm:px-8', 'lg:px-20');
  });

  it('applies custom className', () => {
    render(<Section className="custom-class">Content</Section>);
    const section = screen.getByText('Content').closest('section');
    expect(section).toHaveClass('custom-class', 'mx-auto', 'max-w-7xl');
  });

  it('passes through motion props', () => {
    render(
      <Section data-testid="motion-section" id="test-section">
        Content
      </Section>
    );
    const section = screen.getByTestId('motion-section');
    expect(section).toHaveAttribute('id', 'test-section');
  });

  it('renders as a section element', () => {
    render(<Section>Content</Section>);
    const section = screen.getByText('Content').closest('section');
    expect(section?.tagName).toBe('SECTION');
  });
});