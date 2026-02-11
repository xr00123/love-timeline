import { useState } from 'react'
import { createUnifiedMemory } from '../api/client'
import type { MemoryDetail } from '../api/types'

export function RecordView() {
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [occurredAt, setOccurredAt] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [result, setResult] = useState<MemoryDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function addTag() {
    const t = newTag.trim()
    if (t && !tags.includes(t)) {
      setTags([...tags, t])
      setNewTag('')
    }
  }

  function removeTag(t: string) {
    setTags(tags.filter((tag) => tag !== t))
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  async function submit() {
    if (!content.trim() && files.length === 0) {
      setError('请输入内容或上传文件')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await createUnifiedMemory({
        content,
        files,
        tags,
        occurred_at: occurredAt ? new Date(occurredAt).toISOString() : null,
      })
      setResult(data)
      // Reset form
      setContent('')
      setTags([])
      setOccurredAt('')
      setFiles([])
      if (document.querySelector('input[type="file"]')) {
        ;(document.querySelector('input[type="file"]') as HTMLInputElement).value = ''
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2>记录美好时光</h2>

      <div className="field">
        <div className="label">标签 (可选，留空自动分析)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          {tags.map((t) => (
            <span
              key={t}
              className="tag-chip"
              style={{
                background: '#eee',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {t}
              <button
                onClick={() => removeTag(t)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
            placeholder="输入标签按回车添加"
            style={{ flex: 1 }}
          />
          <button className="btn" onClick={addTag}>
            添加
          </button>
        </div>
      </div>

      <div className="field">
        <div className="label">发生时间 (可选，留空自动分析)</div>
        <input type="datetime-local" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} />
      </div>

      <div className="field">
        <div className="label">文本内容</div>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="写下这一刻…" />
      </div>

      <div className="field">
        <div className="label">上传文件 (图片 / PDF / 文本)</div>
        <input type="file" multiple onChange={handleFiles} />
        {files.length > 0 && (
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            {files.map((f, i) => (
              <li key={i}>
                {f.name} ({Math.round(f.size / 1024)} KB)
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="actions">
        <button className="btn primary" disabled={loading} onClick={() => void submit()}>
          {loading ? '保存中...' : '保存记忆'}
        </button>
      </div>

      {error ? (
        <div className="error" style={{ marginTop: '16px', color: 'red' }}>
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="result" style={{ marginTop: '20px', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
          <div className="muted">已创建：{result.id}</div>
          <div>
            <strong>时间：</strong>
            {result.occurred_at ? new Date(result.occurred_at).toLocaleString() : '未知'}
          </div>
          <div>
            <strong>标签：</strong>
            {result.tags.join(', ')}
          </div>
          <pre className="content" style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
            {result.content}
          </pre>
        </div>
      ) : null}
    </div>
  )
}
