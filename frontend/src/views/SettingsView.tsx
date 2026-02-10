import { useState } from 'react'

import { getHealth } from '../api/client'
import type { Health } from '../api/types'

export function SettingsView() {
  const [data, setData] = useState<Health | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function check() {
    setLoading(true)
    setError(null)
    try {
      const res = await getHealth()
      setData(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000'

  return (
    <div className="panel">
      <h2>设置</h2>
      <div className="row">
        <div className="label">API 地址</div>
        <div>{baseUrl}</div>
      </div>
      <div className="actions">
        <button className="btn" onClick={() => void check()} disabled={loading}>
          连接测试
        </button>
      </div>
      {loading ? <div className="muted">请求中…</div> : null}
      {error ? <div className="error">{error}</div> : null}
      {data ? <pre className="content">{JSON.stringify(data, null, 2)}</pre> : null}
    </div>
  )
}

