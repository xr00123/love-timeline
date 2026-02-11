import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useHomeImage } from '@/hooks/use-home-image'

import { getHealth, API_BASE_URL } from '../api/client'
import type { Health } from '../api/types'

export function SettingsView() {
  const [data, setData] = useState<Health | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { image, saveImage, clearImage } = useHomeImage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Pass the file directly to saveImage (which now calls the API)
    saveImage(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

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

  const baseUrl = API_BASE_URL

  return (
    <div className="panel">
      <h2>设置</h2>
      <div className="row">
        <div className="label">API 地址</div>
        <div>{baseUrl}</div>
      </div>

      <div className="row" style={{ marginTop: '20px', alignItems: 'flex-start' }}>
        <div className="label">首页图片</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>建议上传 1:1 比例的图片，将展示在首页</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button onClick={handleUploadClick} variant="outline" size="sm">
              上传图片
            </Button>
            {image && (
              <Button onClick={clearImage} variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                清除
              </Button>
            )}
          </div>
          {image && (
            <div style={{ width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', marginTop: '10px', border: '1px solid #eee' }}>
              <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
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

