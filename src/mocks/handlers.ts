// src/mocks/handlers.ts
import { http, HttpResponse, graphql } from 'msw'
import { z } from 'zod'

// ---- Runtime validation for /s3/presign body ----
const PresignBody = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
})

const PresignGetBody = z.object({ key: z.string().min(1) })

export const handlers = [
  // QuickSight embed URL (your UI accepts url or embedUrl; pick one and stay consistent)
  http.get('/quicksight/embed-url', () => {
    return HttpResponse.json({
      // If your parser expects `url`, keep url; if it expects `embedUrl`, rename accordingly.
      url: '/mock-dashboard.html',
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    })
  }),

  // S3 presign (typed + safe)
  http.post('/s3/presign', async ({ request }) => {
    try {
      const raw = await request.json().catch(() => null) // unknown → maybe null
      const parsed = PresignBody.safeParse(raw)
      if (!parsed.success) {
        return HttpResponse.json(
          { error: 'fileName and contentType are required' },
          { status: 400 }
        )
      }

      const { fileName, contentType } = parsed.data
      // contentType is validated even if we don't use it here; keep for realism
      const fileKey = `uploads/${encodeURIComponent(fileName)}`
      return HttpResponse.json({
        uploadUrl: 'https://httpbin.org/put',
        fileKey,
        expiresAt: new Date(Date.now() + 3600_000).toISOString(),
      })
    } catch {
      return HttpResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
  }),

  // ── S3 presign (GET) – place it right below the PUT presign
  http.post('/s3/presign-get', async ({ request }) => {
    const raw = await request.json().catch(() => null)
    const parsed = PresignGetBody.safeParse(raw)
    if (!parsed.success) return HttpResponse.json({ error: 'key required' }, { status: 400 })
    const { key } = parsed.data
    // mock a downloadable link
    return HttpResponse.json({ downloadUrl: `https://httpbin.org/anything/${encodeURIComponent(key)}` })
  }),

  // GraphQL: Things
  graphql.query('ListThings', () => {
    return HttpResponse.json({
      data: {
        things: Array.from({ length: 25 }).map((_, i) => ({
          id: String(i + 1),
          name: `Thing ${i + 1}`,
          status: i % 2 ? 'ACTIVE' : 'PENDING',
          created_at: new Date(Date.now() - i * 86_400_000).toISOString(),
          __typename: 'Thing',
        })),
      },
    })
  }),

  graphql.mutation('CreateThing', ({ variables }) => {
    const name =
      typeof variables?.name === 'string' && variables.name.trim()
        ? variables.name
        : 'New'
    return HttpResponse.json({
      data: {
        createThing: {
          id: (globalThis.crypto?.randomUUID?.() ?? String(Math.random())).toString(),
          name,
          status: 'ACTIVE',
          created_at: new Date().toISOString(),
          __typename: 'Thing',
        },
      },
    })
  }),

  // GraphQL: Datasets
  graphql.query('ListDatasets', () =>
    HttpResponse.json({
      data: {
        datasets: Array.from({ length: 5 }).map((_, i) => ({
          id: String(i + 1),
          name: `Dataset ${i + 1}`,
          owner: 'BrainHealth',
          visibility: (['private', 'shared', 'public'] as const)[i % 3],
          created_at: new Date(Date.now() - i * 86_400_000).toISOString(),
          __typename: 'Dataset',
        })),
      },
    })
  ),

  graphql.mutation('CreateDataset', ({ variables }) =>
    HttpResponse.json({
      data: {
        createDataset: {
          id: (globalThis.crypto?.randomUUID?.() ?? String(Math.random())).toString(),
          name:
            typeof variables?.name === 'string' && variables.name.trim()
              ? variables.name
              : 'New Dataset',
          owner: 'you',
          visibility: 'private',
          created_at: new Date().toISOString(),
          __typename: 'Dataset',
        },
      },
    })
  ),

  // ── GraphQL: RequestAccess – put it with the dataset ops
  graphql.mutation('RequestAccess', ({ variables }) =>
    HttpResponse.json({ data: { requestAccess: {
      id: String(variables?.datasetId ?? '0'),
      status: 'PENDING',
      requested_at: new Date().toISOString(),
      __typename: 'AccessRequest'
    }}})
  ),
]
