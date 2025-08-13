import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SocialIconButton } from '../social-icon-button';

describe('SocialIconButton', () => {
  it('renders as anchor element by default', () => {
    render(<SocialIconButton href="/test">GitHub</SocialIconButton>);
    const link = screen.getByText('GitHub');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders children correctly', () => {
    render(<SocialIconButton>GitHub</SocialIconButton>);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('applies default medium size', () => {
    render(<SocialIconButton>Test</SocialIconButton>);
    const button = screen.getByText('Test');
    expect(button).toHaveClass('p-2.5', 'sm:p-3');
  });

  it('applies small size correctly', () => {
    render(<SocialIconButton size="sm">Small</SocialIconButton>);
    const button = screen.getByText('Small');
    expect(button).toHaveClass('p-2');
  });

  it('applies large size correctly', () => {
    render(<SocialIconButton size="lg">Large</SocialIconButton>);
    const button = screen.getByText('Large');
    expect(button).toHaveClass('p-3', 'sm:p-4');
  });

  it('applies base styling classes', () => {
    render(<SocialIconButton>Test</SocialIconButton>);
    const button = screen.getByText('Test');
    expect(button).toHaveClass(
      'group',
      'rounded-full',
      'border',
      'bg-black/5',
      'shadow-sm',
      'transition-colors'
    );
  });

  it('applies custom className', () => {
    render(<SocialIconButton className="custom-class">Custom</SocialIconButton>);
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('custom-class');
  });

  it('includes data-slot attribute', () => {
    render(<SocialIconButton>Test</SocialIconButton>);
    const button = screen.getByText('Test');
    expect(button).toHaveAttribute('data-slot', 'social-icon-button');
  });

  it('passes through anchor props', () => {
    render(
      <SocialIconButton href="https://github.com" rel="noopener" target="_blank">
        GitHub
      </SocialIconButton>
    );
    const link = screen.getByText('GitHub');
    expect(link).toHaveAttribute('href', 'https://github.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  it('renders as child component when asChild is true', () => {
    render(
      <SocialIconButton asChild>
        <button type="button">Custom Button</button>
      </SocialIconButton>
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('group', 'rounded-full');
  });

  it('applies focus styles', () => {
    render(<SocialIconButton>Test</SocialIconButton>);
    const button = screen.getByText('Test');
    expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
  });

  it('has proper SVG styling classes', () => {
    render(<SocialIconButton size="md">Test</SocialIconButton>);
    const button = screen.getByText('Test');
    expect(button).toHaveClass('[&_svg]:pointer-events-none', '[&_svg]:h-5', '[&_svg]:w-5');
  });
});