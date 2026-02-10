import { useMemo, useState } from 'react'

import { createMemory, uploadMemoryFile } from '../api/client'
import type { MemoryDetail } from '../api/types'

function parseTags(raw: string): string[] {
  return raw
    .replace(/，/g, ',')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export function RecordView() {
  const [content, setContent] = useState('')
  const [tagsRaw, setTagsRaw] = useState('')
  const [occurredAt, setOccurredAt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<MemoryDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const tags = useMemo(() => parseTags(tagsRaw), [tagsRaw])

  async function submitText() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await createMemory({
        content,
        tags,
        occurred_at: occurredAt ? new Date(occurredAt).toISOString() : null,
      })
      setResult(data)
      setContent('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  async function submitFile() {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await uploadMemoryFile({
        file,
        tags,
        occurred_at: occurredAt ? new Date(occurredAt).toISOString() : null,
      })
      setResult(data)
      setFile(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2>记忆录入</h2>
      <div className="grid">
        <div className="field">
          <div className="label">标签（逗号分隔）</div>
          <input value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="约会, 旅行, 纪念日" />
        </div>
        <div className="field">
          <div className="label">发生时间（可选）</div>
          <input type="datetime-local" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <div className="label">文本内容</div>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="写下这一刻…" />
      </div>
      <div className="actions">
        <button className="btn primary" disabled={loading || content.trim().length === 0} onClick={() => void submitText()}>
          保存文本
        </button>
      </div>

      <hr />

      <div className="field">
        <div className="label">上传文件（图片 / PDF / 文本）</div>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <div className="actions">
        <button className="btn primary" disabled={loading || !file} onClick={() => void submitFile()}>
          上传并生成记忆
        </button>
      </div>

      {loading ? <div className="muted">处理中…</div> : null}
      {error ? <div className="error">{error}</div> : null}
      {result ? (
        <div className="result">
          <div className="muted">已创建：{result.id}</div>
          <pre className="content">{result.content}</pre>
        </div>
      ) : null}
    </div>
  )
}

