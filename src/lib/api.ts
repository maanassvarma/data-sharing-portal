import { 
  quicksightResponseSchema, 
  presignResponseSchema, 
  type FileUploadInput,
  type QuickSightResponse,
  type PresignResponse 
} from './validations'

// API base URL - in production this would come from environment variables
const API_BASE = ''

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

// QuickSight embed URL API
export async function getQuickSightEmbedUrl(): Promise<QuickSightResponse> {
  const data = await fetchApi<QuickSightResponse>('/quicksight/embed-url')
  return quicksightResponseSchema.parse(data)
}

// S3 presign URL API
export async function getPresignUrl(input: FileUploadInput): Promise<PresignResponse> {
  const data = await fetchApi<PresignResponse>('/s3/presign', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return presignResponseSchema.parse(data)
}

// Mock file upload function
export async function uploadFileToS3(
  file: File,
  presignUrl: string
): Promise<void> {
  // In a real implementation, this would upload to S3
  // For demo purposes, we'll just simulate the upload
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Mock upload completed for file: ${file.name}`)
      resolve()
    }, 1000)
  })
} 