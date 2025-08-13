import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('flex', 'items-center', 'justify-center');
    expect(result).toBe('flex items-center justify-center');
  });

  it('handles conditional classes', () => {
    const isEnabled = Math.random() > 0.5;
    const isDisabled = !isEnabled;
    const result = cn('base-class', isEnabled && 'conditional-class', isDisabled && 'hidden-class');
    const expected = isEnabled ? 'base-class conditional-class' : 'base-class hidden-class';
    expect(result).toBe(expected);
  });

  it('merges Tailwind classes correctly', () => {
    // p-2 should override p-4 due to Tailwind merge logic
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });

  it('handles objects with conditional values', () => {
    const result = cn({
      'text-red-500': true,
      'text-blue-500': false,
      'font-bold': true,
    });
    expect(result).toBe('text-red-500 font-bold');
  });

  it('handles arrays of classes', () => {
    const result = cn(['flex', 'items-center'], ['justify-center', 'gap-2']);
    expect(result).toBe('flex items-center justify-center gap-2');
  });

  it('handles mixed input types', () => {
    const result = cn(
      'base',
      ['array-class'],
      { 'object-class': true, 'false-class': false },
      undefined,
      null,
      'final-class'
    );
    expect(result).toBe('base array-class object-class final-class');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn(undefined, null)).toBe('');
  });

  it('deduplicates identical classes', () => {
    const result = cn('flex', 'flex', 'items-center', 'items-center');
    expect(result).toBe('flex items-center');
  });

  it('handles Tailwind responsive classes', () => {
    const result = cn('p-4', 'md:p-6', 'lg:p-8');
    expect(result).toBe('p-4 md:p-6 lg:p-8');
  });

  it('handles Tailwind state variants', () => {
    const result = cn('bg-blue-500', 'hover:bg-blue-600', 'focus:bg-blue-700');
    expect(result).toBe('bg-blue-500 hover:bg-blue-600 focus:bg-blue-700');
  });

  it('merges conflicting Tailwind classes intelligently', () => {
    // twMerge should keep the last conflicting class
    const result = cn('bg-red-500', 'bg-blue-500', 'text-white');
    expect(result).toBe('bg-blue-500 text-white');
  });
});