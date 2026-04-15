import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renderiza o título corretamente', () => {
    render(<App />)
    expect(screen.getByText('Vite + React')).toBeInTheDocument()
  })

  it('incrementa o contador ao clicar no botão', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /count is/i })
    expect(button).toHaveTextContent('count is 0')

    await user.click(button)
    expect(button).toHaveTextContent('count is 1')
  })
})
