import { useEffect, useState } from 'react'

import type { MemoryDetail } from '../api/types'
import { getMemory } from '../api/client'

type Props = {
  memoryId: string | null
  onClose: () => void
}

export function MemoryDetailDrawer(props: Props) {
  const [data, setData] = useState<MemoryDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!props.memoryId) return
    setLoading(true)
    setError(null)
    setData(null)
    void getMemory(props.memoryId)
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }, [props.memoryId])

  if (!props.memoryId) return null

  return (
    <div className="drawer-backdrop" role="dialog" aria-modal="true">
      <div className="drawer">
        <div className="drawer-header">
          <div className="drawer-title">记忆详情</div>
          <button className="btn" onClick={props.onClose}>
            关闭
          </button>
        </div>
        {loading ? <div className="muted">加载中…</div> : null}
        {error ? <div className="error">{error}</div> : null}
        {data ? (
          <div className="drawer-body">
            <div className="row">
              <div className="label">创建时间</div>
              <div>{new Date(data.created_at).toLocaleString()}</div>
            </div>
            <div className="row">
              <div className="label">发生时间</div>
              <div>{data.occurred_at ? new Date(data.occurred_at).toLocaleString() : '—'}</div>
            </div>
            <div className="row">
              <div className="label">来源</div>
              <div>{data.source_name ?? data.source_type}</div>
            </div>
            <div className="row">
              <div className="label">标签</div>
              <div className="tags">{data.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            </div>
            <div className="row">
              <div className="label">内容</div>
              <pre className="content">{data.content}</pre>
            </div>
            {data.analysis_json ? (
              <div className="row">
                <div className="label">分析</div>
                <pre className="content">{data.analysis_json}</pre>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

