import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { LIST_DATASETS, REQUEST_ACCESS } from '@/graphql/operations'

export default function DatasetsTab() {
  const { data, loading, error, refetch } =
    useQuery<{ datasets: Array<{id:string;name:string;owner:string;visibility:string;created_at:string}> }>(LIST_DATASETS)

  const [requestAccess] = useMutation(REQUEST_ACCESS)
  const [copied, setCopied] = useState<string | null>(null)

  async function getLink(key: string) {
    const r = await fetch('/s3/presign-get', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ key })
    })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const { downloadUrl } = await r.json()
    await navigator.clipboard.writeText(downloadUrl)
    setCopied(key); setTimeout(()=>setCopied(null), 1500)
  }

  if (loading) return <div className="p-4">Loading datasets…</div>
  if (error)   return <div className="p-4 text-red-700">Error: {error.message}</div>

  return (
    <div className="space-y-3">
      {data?.datasets?.map(ds => (
        <div key={ds.id} className="flex items-center justify-between p-3 border rounded">
          <div className="min-w-0">
            <div className="font-medium truncate">{ds.name}</div>
            <div className="text-xs text-muted-foreground">Owner: {ds.owner} • {ds.visibility} • {new Date(ds.created_at).toLocaleString()}</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 border rounded" onClick={() => getLink(`uploads/${ds.name}`)}>
              {copied === `uploads/${ds.name}` ? 'Copied' : 'Get Link'}
            </button>
            <button className="px-2 py-1 border rounded" onClick={async () => { await requestAccess({ variables:{ datasetId: ds.id } }); refetch() }}>
              Request Access
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
