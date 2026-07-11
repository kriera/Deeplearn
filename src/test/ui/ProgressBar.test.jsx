import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from '../../ui/atoms/ProgressBar.jsx'

describe('ProgressBar', () => {
  it('renders with correct progress', () => {
    render(<ProgressBar current={2} total={5} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toBeTruthy()
  })

  it('shows correct percentage text', () => {
    render(<ProgressBar current={3} total={5} />)
    expect(screen.getByText('3/5')).toBeTruthy()
  })

  it('handles zero total gracefully', () => {
    render(<ProgressBar current={0} total={0} />)
    expect(screen.getByRole('progressbar')).toBeTruthy()
  })
})
