import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '../Header'

describe('Header', () => {
  it('renders the site title', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Dynamic Healing Network')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getByText('Experts')).toBeInTheDocument()
  })
}) 