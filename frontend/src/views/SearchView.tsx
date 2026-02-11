import { useState } from 'react'

import { searchMemories } from '../api/client'
import type { SearchHitRead } from '../api/types'

type Props = {
  onOpen: (id: string) => void
}

export function SearchView(props: Props) {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<SearchHitRead[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  async function run() {
    if (!query.trim()) return
    setLoading(true)
    setHasSearched(true)
    setError(null)
    setItems([])
    try {
      const data = await searchMemories(query, 8)
      setItems(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2>自然语言检索</h2>
      <div className="search-row">
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && void run()} placeholder="例如：我们第一次去海边的那天" />
        <button className="btn primary" disabled={loading || query.trim().length === 0} onClick={() => void run()}>
          搜索
        </button>
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <div>正在翻阅记忆...</div>
        </div>
      ) : null}
      {error ? <div className="error">{error}</div> : null}
      {!loading && hasSearched && items.length === 0 && !error ? <div className="empty-result">没有找到相关的记忆碎片</div> : null}
      <div className="cards">
        {items.map((h) => (
          <button key={h.memory_id} className="card" onClick={() => props.onOpen(h.memory_id)}>
            <div className="card-title">{h.distance == null ? '匹配' : `距离 ${h.distance.toFixed(4)}`}</div>
            <div className="card-body">{h.content_preview || '—'}</div>
            <div className="tags">
              {h.tags.map((t) => (
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

