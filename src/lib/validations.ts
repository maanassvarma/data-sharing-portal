import { z } from 'zod'

// File upload validation (yours)
export const fileUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  contentType: z.string().min(1, 'Content type is required'),
})
export type FileUploadInput = z.infer<typeof fileUploadSchema>

// Thing creation validation (yours)
export const createThingSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
})
export type CreateThingInput = z.infer<typeof createThingSchema>

// Accept either key and allow relative or absolute strings
const quicksightEither = z.union([
  z.object({ url: z.string().min(1),        expiresAt: z.string().optional() }),
  z.object({ embedUrl: z.string().min(1),   expiresAt: z.string().optional() }),
])

// ✅ Re-export the name that other files import
export const quicksightResponseSchema = quicksightEither.transform((d) => {
  const raw = 'url' in d ? d.url : d.embedUrl
  const abs = new URL(raw, window.location.origin).href
  return {
    url: abs,
    // keep expiresAt (optional) so callers depending on it don't break
    expiresAt: 'expiresAt' in d ? d.expiresAt : undefined,
  }
})

export type QuickSightResponse = z.infer<typeof quicksightResponseSchema>

// Optional convenience function (used by UI code)
export function parseQuickSightResponse(raw: unknown): QuickSightResponse {
  return quicksightResponseSchema.parse(raw)
}

// Presign response (yours — fine as-is)
export const presignResponseSchema = z.object({
  uploadUrl: z.string().url(),
  fileKey: z.string(),
  expiresAt: z.string(),
})
export type PresignResponse = z.infer<typeof presignResponseSchema>
