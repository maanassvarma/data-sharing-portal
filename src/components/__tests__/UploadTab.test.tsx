import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { UploadTab } from '../UploadTab'
import { useToast } from '@/hooks/use-toast'
import { getPresignUrl, uploadFileToS3 } from '@/lib/api'

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}))

// Mock the API functions
vi.mock('@/lib/api', () => ({
  getPresignUrl: vi.fn(),
  uploadFileToS3: vi.fn(),
}))

const mockToast = vi.fn()

describe('UploadTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useToast as any).mockReturnValue({ toast: mockToast })
  })

  it('renders upload title and description', () => {
    render(<UploadTab />)
    
    expect(screen.getByText('Upload Data')).toBeInTheDocument()
    expect(screen.getByText(/Upload files to your S3 storage bucket/)).toBeInTheDocument()
  })

  it('has file input with proper accessibility', () => {
    render(<UploadTab />)
    
    const fileInput = screen.getByLabelText('Select File')
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('type', 'file')
  })

  it('shows file info when file is selected', () => {
    render(<UploadTab />)
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen.getByLabelText('Select File')
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText('test.txt')).toBeInTheDocument()
    expect(screen.getByText(/11 Bytes/)).toBeInTheDocument()
  })

  it('disables upload button when no file is selected', () => {
    render(<UploadTab />)
    
    const uploadButton = screen.getByText('Upload File')
    expect(uploadButton).toBeDisabled()
  })

  it('enables upload button when file is selected', () => {
    render(<UploadTab />)
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen.getByLabelText('Select File')
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const uploadButton = screen.getByText('Upload File')
    expect(uploadButton).not.toBeDisabled()
  })

  it('shows success message after successful upload', async () => {
    const mockPresignResponse = {
      uploadUrl: 'https://example.com/upload',
      fileKey: 'uploads/test.txt',
      expiresAt: new Date().toISOString(),
    }
    
    ;(getPresignUrl as any).mockResolvedValue(mockPresignResponse)
    ;(uploadFileToS3 as any).mockResolvedValue(undefined)
    
    render(<UploadTab />)
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen.getByLabelText('Select File')
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const uploadButton = screen.getByText('Upload File')
    fireEvent.click(uploadButton)
    
    await waitFor(() => {
      expect(screen.getByText('Upload completed successfully!')).toBeInTheDocument()
    })
  })

  it('shows error message when upload fails', async () => {
    const errorMessage = 'Upload failed'
    ;(getPresignUrl as any).mockRejectedValue(new Error(errorMessage))
    
    render(<UploadTab />)
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen.getByLabelText('Select File')
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const uploadButton = screen.getByText('Upload File')
    fireEvent.click(uploadButton)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })
}) 