import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TagChip from '../TagChip';

describe('TagChip', () => {
  it('renders tag with hash prefix', () => {
    render(<TagChip tag="react" />);
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<TagChip tag="typescript" />);
    const badge = screen.getByText('#typescript');
    expect(badge).toHaveClass(
      'rounded-full',
      'bg-indigo-700/25',
      'px-3',
      'py-1',
      'text-xs',
      'font-medium',
      'text-indigo-200'
    );
  });

  it('includes hover styles', () => {
    render(<TagChip tag="nextjs" />);
    const badge = screen.getByText('#nextjs');
    expect(badge).toHaveClass('hover:bg-indigo-700/40');
  });

  it('handles different tag values', () => {
    render(<TagChip tag="vue.js" />);
    expect(screen.getByText('#vue.js')).toBeInTheDocument();
  });

  it('handles tags with numbers', () => {
    render(<TagChip tag="next15" />);
    expect(screen.getByText('#next15')).toBeInTheDocument();
  });

  it('handles tags with special characters', () => {
    render(<TagChip tag="styled-components" />);
    expect(screen.getByText('#styled-components')).toBeInTheDocument();
  });

  it('renders as a Badge component', () => {
    const { container } = render(<TagChip tag="test" />);
    const badge = container.firstChild;
    // Badge component default class
    expect(badge).toHaveClass('inline-flex');
  });
});