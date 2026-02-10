import { useEffect, useState } from 'react'

import { listMemories } from '../api/client'
import type { MemoryRead } from '../api/types'

type Props = {
  onOpen: (id: string) => void
}

export function TimelineView(props: Props) {
  const [items, setItems] = useState<MemoryRead[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function refresh() {
    setLoading(true)
    setError(null)
    void listMemories(50)
      .then(setItems)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>时间线</h2>
        <button className="btn" onClick={refresh} disabled={loading}>
          刷新
        </button>
      </div>
      {loading ? <div className="muted">加载中…</div> : null}
      {error ? <div className="error">{error}</div> : null}
      <div className="cards">
        {items.map((m) => (
          <button key={m.id} className="card" onClick={() => props.onOpen(m.id)}>
            <div className="card-title">{new Date(m.created_at).toLocaleString()}</div>
            <div className="card-sub">{m.source_name ?? m.source_type}</div>
            <div className="card-body">{m.content_preview || '—'}</div>
            <div className="tags">
              {m.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

