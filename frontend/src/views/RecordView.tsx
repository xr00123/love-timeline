import { useState, useRef } from 'react'
import { createUnifiedMemory } from '../api/client'
import type { MemoryDetail } from '../api/types'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Camera, Video, FileText, Upload, X, Calendar, Plus, Loader2, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RecordView() {
  const [activeTab, setActiveTab] = useState('photo')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [occurredAt, setOccurredAt] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [result, setResult] = useState<MemoryDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setFiles([])
    setError(null)
  }

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

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      processFiles(Array.from(e.target.files))
    }
    e.target.value = ''
  }

  function processFiles(incomingFiles: File[]) {
    const validFiles: File[] = []
    let hasInvalid = false

    incomingFiles.forEach((file) => {
      let isValid = false
      if (activeTab === 'photo' && file.type.startsWith('image/')) isValid = true
      else if (activeTab === 'video' && file.type.startsWith('video/')) isValid = true
      else if (activeTab === 'document') isValid = true

      if (isValid) {
        validFiles.push(file)
      } else {
        hasInvalid = true
      }
    })

    if (hasInvalid) {
      setError(
        activeTab === 'photo'
          ? '仅支持上传图片格式文件'
          : activeTab === 'video'
            ? '仅支持上传视频格式文件'
            : '不支持的文件格式'
      )
    } else {
      setError(null)
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  function removeFile(index: number) {
    setFiles(files.filter((_, i) => i !== index))
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
      setContent('')
      setTags([])
      setOccurredAt('')
      setFiles([])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const renderPreview = (file: File, index: number) => {
    const isImage = file.type.startsWith('image/')
    return (
      <div key={index} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
        {isImage ? (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-full h-full object-cover"
            onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
          />
        ) : (
          <div className="flex flex-col items-center p-2 text-center">
            {file.type.startsWith('video/') ? <Video className="w-8 h-8 text-gray-400" /> : <FileText className="w-8 h-8 text-gray-400" />}
            <span className="text-[10px] text-gray-500 mt-1 line-clamp-2 w-full break-all leading-tight">{file.name}</span>
          </div>
        )}
        <button
          onClick={() => removeFile(index)}
          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: '70%',  // 核心：宽度70%
      minWidth: '320px', // 小屏最小宽度，避免过窄
      margin: '0 auto', // 水平居中
      width: '100%'     // 自适应父容器
    }} className="p-6 space-y-8 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-white/60 shadow-sm">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif font-bold text-gray-800">记录美好时光</h2>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="flex w-full mb-6 bg-gray-100/80 p-1">
          <TabsTrigger
            value="photo"
            className="flex-1 justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Camera className="w-4 h-4" /> 照片
          </TabsTrigger>
          <TabsTrigger
            value="video"
            className="flex-1 justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Video className="w-4 h-4" /> 视频
          </TabsTrigger>
          <TabsTrigger
            value="document"
            className="flex-1 justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <FileText className="w-4 h-4" /> 故事/文档
          </TabsTrigger>
        </TabsList>

        <div
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-10 transition-all text-center cursor-pointer group w-full",
            error ? "border-red-300 bg-red-50/50" : "border-gray-300 hover:border-[#9C6C53] hover:bg-[#9C6C53]/5"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept={activeTab === 'photo' ? 'image/*' : activeTab === 'video' ? 'video/*' : '*'}
            onChange={handleFileSelect}
          />

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {activeTab === 'photo' && <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-[#9C6C53]" />}
              {activeTab === 'video' && <Video className="w-8 h-8 text-gray-400 group-hover:text-[#9C6C53]" />}
              {activeTab === 'document' && <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#9C6C53]" />}
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-gray-700">
                点击或拖拽{activeTab === 'photo' ? '照片' : activeTab === 'video' ? '视频' : '文件'}到这里
              </p>
              <p className="text-sm text-gray-400">支持批量上传</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-500 text-center animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4 animate-in fade-in zoom-in-95 duration-200">
            {files.map((file, i) => renderPreview(file, i))}
          </div>
        )}
      </Tabs>

      <div className="space-y-6 w-full">
        <div className="space-y-2 w-full">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> 发生时间
            <span className="text-xs text-gray-400 font-normal">(✨ 已自动识别)</span>
          </label>
          <input
            type="datetime-local"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            className="w-full bg-gray-50 border-gray-200 focus:border-[#9C6C53] focus:ring-[#9C6C53]/20"
          />
        </div>

        <div className="space-y-2 w-full">
          <label className="text-sm font-medium text-gray-600">文本内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="这一天我们在哪里？做了什么？..."
            className="w-full bg-gray-50 border-gray-200 focus:border-[#9C6C53] focus:ring-[#9C6C53]/20 resize-none"
          />
        </div>

        <div className="space-y-2 w-full">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Loader2 className="w-4 h-4" /> 标签
            <span className="text-xs text-gray-400 font-normal">(自动分析/手动)</span>
          </label>
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 min-h-[50px] w-full">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-sm text-gray-700 shadow-sm"
              >
                #{t}
                <button
                  onClick={() => removeTag(t)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <div className="flex items-center gap-2 flex-1 min-w-[120px]">
              <Plus className="w-4 h-4 text-gray-400" />
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="添加标签..."
                className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 w-full">
        <Button
          className="w-full h-12 text-lg bg-[#9C6C53] hover:bg-[#825541] text-white shadow-lg shadow-[#9C6C53]/20 transition-all hover:-translate-y-0.5"
          disabled={loading}
          onClick={() => void submit()}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 保存中...
            </>
          ) : (
            '❤️ 保存记忆'
          )}
        </Button>
      </div>

      {result && (
        <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-100 animate-in slide-in-from-bottom-4 w-full">
          <div className="flex items-center gap-2 text-green-700 font-medium mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-200 text-green-800 text-xs">✓</span>
            记忆已保存
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex gap-2">
              <span className="font-medium">时间：</span>
              {result.occurred_at ? new Date(result.occurred_at).toLocaleString() : '未知'}
            </div>
            <div className="flex gap-2">
              <span className="font-medium">标签：</span>
              {result.tags.join(', ')}
            </div>
            <div className="p-3 bg-white/60 rounded-lg border border-green-100/50 mt-2 w-full">
              {result.content}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}