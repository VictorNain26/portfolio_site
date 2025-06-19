import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '../button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>click</Button>)
    expect(screen.getByText('click')).toBeInTheDocument()
  })

  it('applies variant and size classes', () => {
    render(
      <Button variant="secondary" size="lg">
        click
      </Button>
    )
    const button = screen.getByRole('button', { name: 'click' })
    expect(button).toHaveClass('bg-secondary')
    expect(button).toHaveClass('px-6')
  })
})
