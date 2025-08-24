import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MockedProvider } from '@apollo/client/testing'
import { AdminTab } from '../AdminTab'
import { useToast } from '@/hooks/use-toast'
import { LIST_THINGS, CREATE_THING } from '@/graphql/queries'

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}))

const mockToast = vi.fn()

const mockThings = [
  {
    id: '1',
    name: 'Test Thing 1',
    status: 'ACTIVE',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Test Thing 2',
    status: 'INACTIVE',
    created_at: '2024-01-16T14:45:00Z',
  },
]

const mocks = [
  {
    request: {
      query: LIST_THINGS,
    },
    result: {
      data: {
        listThings: mockThings,
      },
    },
  },
  {
    request: {
      query: CREATE_THING,
      variables: { name: 'New Test Thing' },
    },
    result: {
      data: {
        createThing: {
          id: '3',
          name: 'New Test Thing',
          status: 'ACTIVE',
          created_at: '2024-01-17T09:15:00Z',
        },
      },
    },
  },
]

describe('AdminTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useToast as any).mockReturnValue({ toast: mockToast })
  })

  it('renders admin titles and descriptions', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminTab />
      </MockedProvider>
    )
    
    expect(screen.getByText('Create New Thing')).toBeInTheDocument()
    expect(screen.getByText('Add a new thing to the system')).toBeInTheDocument()
    expect(screen.getByText('Things')).toBeInTheDocument()
    expect(screen.getByText('Manage your things in the system')).toBeInTheDocument()
  })

  it('has input field with proper accessibility', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminTab />
      </MockedProvider>
    )
    
    const nameInput = screen.getByLabelText('Name')
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveAttribute('placeholder', 'Enter thing name...')
  })

  it('disables create button when input is empty', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminTab />
      </MockedProvider>
    )
    
    const createButton = screen.getByLabelText('Create new thing')
    expect(createButton).toBeDisabled()
  })

  it('enables create button when input has value', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminTab />
      </MockedProvider>
    )
    
    const nameInput = screen.getByLabelText('Name')
    fireEvent.change(nameInput, { target: { value: 'Test Thing' } })
    
    const createButton = screen.getByLabelText('Create new thing')
    expect(createButton).not.toBeDisabled()
  })

  it('displays things list when data is loaded', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminTab />
      </MockedProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test Thing 1')).toBeInTheDocument()
      expect(screen.getByText('Test Thing 2')).toBeInTheDocument()
    })
  })

  it('shows loading state while fetching data', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AdminTab />
      </MockedProvider>
    )
    
    expect(screen.getByText('Loading things...')).toBeInTheDocument()
  })

  it('shows empty state when no things exist', async () => {
    const emptyMocks = [
      {
        request: {
          query: LIST_THINGS,
        },
        result: {
          data: {
            listThings: [],
          },
        },
      },
    ]

    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <AdminTab />
      </MockedProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByText(/No things found/)).toBeInTheDocument()
    })
  })

  it('creates new thing when form is submitted', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdminTab />
      </MockedProvider>
    )
    
    const nameInput = screen.getByLabelText('Name')
    fireEvent.change(nameInput, { target: { value: 'New Test Thing' } })
    
    const createButton = screen.getByLabelText('Create new thing')
    fireEvent.click(createButton)
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Thing created',
        description: 'New thing has been created successfully.',
      })
    })
  })
}) 