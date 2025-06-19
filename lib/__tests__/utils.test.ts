import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn', () => {
  it('merges tailwind classes', () => {
    expect(cn('p-2', 'p-3')).toBe('p-3')
  })

  it('ignores falsy values', () => {
    expect(cn('bg-red-500', null, undefined, 'text-xl')).toBe('bg-red-500 text-xl')
  })
})
