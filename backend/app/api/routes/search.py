from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.db.session import SessionDep
from app.schemas.search import SearchHitRead, SearchRequest
from app.services.memory_service import get_memory, memory_preview
from app.services.vector_store import search_memories

router = APIRouter()


@router.post("", response_model=list[SearchHitRead])
def search(payload: SearchRequest, session: SessionDep):
    try:
        hits = search_memories(payload.query, limit=payload.limit)
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    items: list[SearchHitRead] = []
    for hit in hits:
        memory = get_memory(session, hit.memory_id)
        if memory is None:
            continue
        items.append(
            SearchHitRead(
                memory_id=hit.memory_id,
                distance=hit.distance,
                content_preview=memory_preview(memory),
                tags=[t.name for t in memory.tags],
            )
        )
    return items
