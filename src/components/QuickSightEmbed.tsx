import { useEffect, useRef, useState } from 'react'
import { parseQuickSightResponse } from '@/lib/validations'

type QSLike = { embedDashboard?: (opts: any) => { on: (e: string, cb: (p?: any) => void) => void } } | null

function looksLikeQuickSight(url: string) {
  return /^https?:\/\/.*quicksight\..*\.amazonaws\.com\/.*embed/i.test(url)
}

async function loadSdk(): Promise<QSLike> {
  try {
    const m: any = await import('amazon-quicksight-embedding-sdk')
    // handle both shapes: namespace or default
    return m?.embedDashboard ? m : m?.default ?? null
  } catch {
    return null
  }
}

export default function QuickSightEmbed() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [url, setUrl] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string>()

  async function load() {
    setLoading(true); setErr(undefined); setUrl(undefined)
    try {
      const res = await fetch('/quicksight/embed-url', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { url } = parseQuickSightResponse(await res.json())
      setUrl(url)

      if (looksLikeQuickSight(url)) {
        const sdk = await loadSdk()
        if (!sdk?.embedDashboard) {
          // SDK not available → fallback to iframe
          return
        }
        const dash = sdk.embedDashboard({
          url,
          container: containerRef.current!,
          height: '800px',
          width: '100%',
          scrolling: 'no',
          loadingHeight: '48px',
        })
        dash.on('error', (e: any) => setErr(e?.error?.message ?? 'Embed error'))
        // Optional: parameters on load (no-op for mock)
        dash.on('load', async () => {
          try { /* await dash.setParameters({ Project: ['BrainHealth'] }) */ } catch {}
        })
      }
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load dashboard URL')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const useIframe = !!url && !looksLikeQuickSight(url) // mock/local path
  const useSdk = !!url && !useIframe

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
        <button className="px-3 py-1.5 border rounded" onClick={() => load()} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {err && <div role="alert" className="p-3 border border-red-300 text-red-700 rounded">Error: {err}</div>}
      {!err && loading && <div className="p-3">Loading dashboard…</div>}

      {/* Only show SDK container for real QuickSight URLs */}
      {useSdk && <div ref={containerRef} className="w-full border rounded min-h-[400px]" />}

      {/* Fallback iframe for mock/local URLs */}
      {useIframe && (
        <iframe
          key={url}                 // forces reload on Refresh
          title="QuickSight (mock)"
          src={url}
          className="w-full h-[70vh] border rounded"
          allow="fullscreen"
        />
      )}
    </div>
  )
}
