import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../../ui/atoms/Badge.jsx'

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge>Elemental</Badge>)
    expect(screen.getByText('Elemental')).toBeTruthy()
  })

  it('renders with default variant', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default').className).toContain('teal')
  })

  it('renders with amber variant', () => {
    render(<Badge variant="amber">Warning</Badge>)
    expect(screen.getByText('Warning').className).toContain('amber')
  })

  it('renders with purple variant', () => {
    render(<Badge variant="purple">Demo</Badge>)
    expect(screen.getByText('Demo').className).toContain('purple')
  })
})
