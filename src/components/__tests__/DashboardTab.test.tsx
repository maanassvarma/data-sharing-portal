import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DashboardTab } from '../DashboardTab'
import { useToast } from '@/hooks/use-toast'
import { getQuickSightEmbedUrl } from '@/lib/api'

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}))

// Mock the API function
vi.mock('@/lib/api', () => ({
  getQuickSightEmbedUrl: vi.fn(),
}))

const mockToast = vi.fn()

describe('DashboardTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useToast as any).mockReturnValue({ toast: mockToast })
  })

  it('renders dashboard title and description', () => {
    render(<DashboardTab />)
    
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
    expect(screen.getByText(/View your business metrics/)).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    ;(getQuickSightEmbedUrl as any).mockImplementation(() => new Promise(() => {}))
    
    render(<DashboardTab />)
    
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument()
  })

  it('displays dashboard iframe when embed URL is loaded', async () => {
    const mockUrl = 'https://example-dashboard.com/embed'
    ;(getQuickSightEmbedUrl as any).mockResolvedValue({ url: mockUrl })
    
    render(<DashboardTab />)
    
    await waitFor(() => {
      const iframe = screen.getByTitle('Analytics Dashboard')
      expect(iframe).toBeInTheDocument()
      expect(iframe).toHaveAttribute('src', mockUrl)
    })
  })

  it('shows error message when API call fails', async () => {
    const errorMessage = 'Failed to load dashboard'
    ;(getQuickSightEmbedUrl as any).mockRejectedValue(new Error(errorMessage))
    
    render(<DashboardTab />)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
  })

  it('has refresh button with proper accessibility', () => {
    render(<DashboardTab />)
    
    const refreshButton = screen.getByLabelText('Refresh dashboard')
    expect(refreshButton).toBeInTheDocument()
    expect(refreshButton).toHaveAttribute('aria-label', 'Refresh dashboard')
  })
}) 