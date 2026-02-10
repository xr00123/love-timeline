from datetime import datetime, timezone
from typing import List, Optional
from uuid import uuid4

from sqlmodel import Field, Relationship, SQLModel


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class MemoryTagLink(SQLModel, table=True):
    memory_id: str = Field(foreign_key="memory.id", primary_key=True)
    tag_id: int = Field(foreign_key="tag.id", primary_key=True)


class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)

    memories: List["Memory"] = Relationship(back_populates="tags", link_model=MemoryTagLink)


class Memory(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)

    created_at: datetime = Field(default_factory=utcnow, index=True)
    occurred_at: Optional[datetime] = Field(default=None, index=True)

    source_type: str = Field(default="text", index=True)
    source_name: Optional[str] = Field(default=None, index=True)

    content: str
    content_is_encrypted: bool = Field(default=False)

    analysis_json: str = Field(default="")

    tags: List[Tag] = Relationship(back_populates="memories", link_model=MemoryTagLink)
    attachments: List["Attachment"] = Relationship(back_populates="memory")
    entities: List["Entity"] = Relationship(back_populates="memory")


class Attachment(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    memory_id: str = Field(foreign_key="memory.id", index=True)

    created_at: datetime = Field(default_factory=utcnow, index=True)
    file_path: str
    mime_type: Optional[str] = Field(default=None, index=True)

    memory: Memory = Relationship(back_populates="attachments")


class Entity(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    memory_id: str = Field(foreign_key="memory.id", index=True)

    created_at: datetime = Field(default_factory=utcnow, index=True)
    kind: str = Field(index=True)
    value: str = Field(index=True)

    memory: Memory = Relationship(back_populates="entities")
