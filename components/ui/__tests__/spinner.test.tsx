import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner } from '../spinner';

describe('Spinner', () => {
  it('renders spinner SVG', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  it('has correct SVG attributes', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    expect(spinner).toHaveAttribute('viewBox', '0 0 24 24');
    expect(spinner).toHaveAttribute('fill', 'none');
  });

  it('applies default classes', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('text-primary', 'animate-spin');
  });

  it('applies custom className', () => {
    const { container } = render(<Spinner className="custom-spinner" />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('custom-spinner', 'text-primary', 'animate-spin');
  });

  it('passes through SVG props', () => {
    const { container } = render(<Spinner height={32} width={32} />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveAttribute('width', '32');
    expect(spinner).toHaveAttribute('height', '32');
  });

  it('includes data-slot attribute', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveAttribute('data-slot', 'spinner');
  });

  it('contains circle and path elements', () => {
    const { container } = render(<Spinner />);
    const circle = container.querySelector('circle');
    const path = container.querySelector('path');
    
    expect(circle).toBeInTheDocument();
    expect(path).toBeInTheDocument();
    
    // Test circle attributes
    expect(circle).toHaveAttribute('cx', '12');
    expect(circle).toHaveAttribute('cy', '12');
    expect(circle).toHaveAttribute('r', '10');
    expect(circle).toHaveClass('opacity-25');
    
    // Test path attributes
    expect(path).toHaveClass('opacity-75');
    expect(path).toHaveAttribute('d', 'M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z');
  });
});