from __future__ import annotations

from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(min_length=1)
    limit: int = Field(default=5, ge=1, le=20)


class SearchHitRead(BaseModel):
    memory_id: str
    distance: float | None
    content_preview: str
    tags: list[str]

