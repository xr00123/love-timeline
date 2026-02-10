export type MemoryRead = {
  id: string
  created_at: string
  occurred_at: string | null
  source_type: string
  source_name: string | null
  content_preview: string
  tags: string[]
}

export type MemoryDetail = {
  id: string
  created_at: string
  occurred_at: string | null
  source_type: string
  source_name: string | null
  content: string
  tags: string[]
  analysis_json: string
}

export type SearchHitRead = {
  memory_id: string
  distance: number | null
  content_preview: string
  tags: string[]
}

export type Health = {
  status: string
  app_env: string
}

