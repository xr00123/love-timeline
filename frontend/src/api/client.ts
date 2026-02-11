import type { Health, MemoryDetail, MemoryRead, SearchHitRead } from './types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000'

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`${resp.status} ${text}`)
  }
  return (await resp.json()) as T
}

export async function getHealth(): Promise<Health> {
  return requestJson<Health>('/health')
}

export async function listMemories(limit = 50): Promise<MemoryRead[]> {
  return requestJson<MemoryRead[]>(`/memories?limit=${encodeURIComponent(String(limit))}`)
}

export async function getMemory(id: string): Promise<MemoryDetail> {
  return requestJson<MemoryDetail>(`/memories/${encodeURIComponent(id)}`)
}

export async function createMemory(input: { content: string; tags: string[]; occurred_at?: string | null }): Promise<MemoryDetail> {
  return requestJson<MemoryDetail>('/memories', {
    method: 'POST',
    body: JSON.stringify({
      content: input.content,
      tags: input.tags,
      occurred_at: input.occurred_at ?? null,
    }),
  })
}

export async function uploadMemoryFile(input: {
  file: File
  tags: string[]
  occurred_at?: string | null
}): Promise<MemoryDetail> {
  const form = new FormData()
  form.append('file', input.file)
  if (input.occurred_at) form.append('occurred_at', input.occurred_at)
  if (input.tags.length > 0) form.append('tags', input.tags.join(','))

  const resp = await fetch(`${API_BASE_URL}/uploads`, {
    method: 'POST',
    body: form,
  })
  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`${resp.status} ${text}`)
  }
  return (await resp.json()) as MemoryDetail
}

export async function createUnifiedMemory(input: {
  files?: File[]
  content?: string
  tags?: string[]
  occurred_at?: string | null
}): Promise<MemoryDetail> {
  const form = new FormData()
  if (input.files) {
    for (const f of input.files) {
      form.append('files', f)
    }
  }
  if (input.content) form.append('content', input.content)
  if (input.occurred_at) form.append('occurred_at', input.occurred_at)
  if (input.tags && input.tags.length > 0) form.append('tags', input.tags.join(','))

  const resp = await fetch(`${API_BASE_URL}/memories/unified`, {
    method: 'POST',
    body: form,
  })
  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`${resp.status} ${text}`)
  }
  return (await resp.json()) as MemoryDetail
}

export async function searchMemories(query: string, limit = 5): Promise<SearchHitRead[]> {
  return requestJson<SearchHitRead[]>('/search', {
    method: 'POST',
    body: JSON.stringify({ query, limit }),
  })
}

