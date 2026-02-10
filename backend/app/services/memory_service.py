from __future__ import annotations

from datetime import datetime

from sqlmodel import Session, select

from app.db.models import Memory, Tag
from app.services.encryption import decrypt_text, encrypt_text


def _normalize_tags(tags: list[str]) -> list[str]:
    cleaned = []
    for t in tags:
        name = t.strip()
        if not name:
            continue
        if name not in cleaned:
            cleaned.append(name)
    return cleaned


def _get_or_create_tags(session: Session, names: list[str]) -> list[Tag]:
    names = _normalize_tags(names)
    if not names:
        return []
    existing = session.exec(select(Tag).where(Tag.name.in_(names))).all()
    existing_by_name = {t.name: t for t in existing}
    tags: list[Tag] = []
    for name in names:
        tag = existing_by_name.get(name)
        if tag is None:
            tag = Tag(name=name)
            session.add(tag)
            session.flush()
        tags.append(tag)
    return tags


def create_memory(
    session: Session,
    *,
    content: str,
    occurred_at: datetime | None = None,
    tags: list[str] | None = None,
    source_type: str = "text",
    source_name: str | None = None,
) -> Memory:
    payload, is_encrypted = encrypt_text(content)
    memory = Memory(
        occurred_at=occurred_at,
        source_type=source_type,
        source_name=source_name,
        content=payload,
        content_is_encrypted=is_encrypted,
    )
    memory.tags = _get_or_create_tags(session, tags or [])
    session.add(memory)
    session.commit()
    session.refresh(memory)
    return memory


def get_memory(session: Session, memory_id: str) -> Memory | None:
    return session.get(Memory, memory_id)


def list_memories(session: Session, *, limit: int = 50) -> list[Memory]:
    return session.exec(select(Memory).order_by(Memory.created_at.desc()).limit(limit)).all()


def memory_content(memory: Memory) -> str:
    return decrypt_text(memory.content, is_encrypted=memory.content_is_encrypted)


def memory_preview(memory: Memory, *, max_len: int = 160) -> str:
    text = memory_content(memory).strip().replace("\r\n", "\n").replace("\n", " ")
    if len(text) <= max_len:
        return text
    return text[: max_len - 1] + "…"

