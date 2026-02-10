from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class MemoryCreate(BaseModel):
    content: str = Field(min_length=1)
    occurred_at: Optional[datetime] = None
    tags: list[str] = Field(default_factory=list)


class MemoryRead(BaseModel):
    id: str
    created_at: datetime
    occurred_at: Optional[datetime]
    source_type: str
    source_name: Optional[str]
    content_preview: str
    tags: list[str]


class MemoryDetail(BaseModel):
    id: str
    created_at: datetime
    occurred_at: Optional[datetime]
    source_type: str
    source_name: Optional[str]
    content: str
    tags: list[str]
    analysis_json: str

