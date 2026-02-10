from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.db.session import SessionDep
from app.schemas.memory import MemoryCreate, MemoryDetail, MemoryRead
from app.services.memory_service import create_memory, get_memory, list_memories, memory_content, memory_preview
from app.services.analyzer import analyze_text, dumps
from app.services.vector_store import index_memory

router = APIRouter()


@router.post("", response_model=MemoryDetail)
def create_text_memory(payload: MemoryCreate, session: SessionDep):
    memory = create_memory(
        session,
        content=payload.content,
        occurred_at=payload.occurred_at,
        tags=payload.tags,
        source_type="text",
        source_name=None,
    )
    try:
        index_memory(memory.id, payload.content)
    except Exception:
        pass
    try:
        analysis = analyze_text(payload.content)
        if analysis:
            memory.analysis_json = dumps(analysis)
            session.add(memory)
            session.commit()
            session.refresh(memory)
    except Exception:
        pass
    return MemoryDetail(
        id=memory.id,
        created_at=memory.created_at,
        occurred_at=memory.occurred_at,
        source_type=memory.source_type,
        source_name=memory.source_name,
        content=memory_content(memory),
        tags=[t.name for t in memory.tags],
        analysis_json=memory.analysis_json,
    )


@router.get("", response_model=list[MemoryRead])
def list_memory(session: SessionDep, limit: int = 50):
    memories = list_memories(session, limit=limit)
    return [
        MemoryRead(
            id=m.id,
            created_at=m.created_at,
            occurred_at=m.occurred_at,
            source_type=m.source_type,
            source_name=m.source_name,
            content_preview=memory_preview(m),
            tags=[t.name for t in m.tags],
        )
        for m in memories
    ]


@router.get("/{memory_id}", response_model=MemoryDetail)
def memory_detail(memory_id: str, session: SessionDep):
    memory = get_memory(session, memory_id)
    if memory is None:
        raise HTTPException(status_code=404, detail="Memory not found")
    return MemoryDetail(
        id=memory.id,
        created_at=memory.created_at,
        occurred_at=memory.occurred_at,
        source_type=memory.source_type,
        source_name=memory.source_name,
        content=memory_content(memory),
        tags=[t.name for t in memory.tags],
        analysis_json=memory.analysis_json,
    )
