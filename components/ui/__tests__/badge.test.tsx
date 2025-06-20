import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '../badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>hello</Badge>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('applies secondary variant', () => {
    render(<Badge variant="secondary">test</Badge>)
    const badge = screen.getByText('test')
    expect(badge).toHaveClass('bg-gray-700')
  })
})
