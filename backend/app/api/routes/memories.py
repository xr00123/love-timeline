from __future__ import annotations

from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException, File, Form, UploadFile
from dateutil import parser

from app.db.models import Attachment
from app.db.session import SessionDep
from app.schemas.memory import MemoryCreate, MemoryDetail, MemoryRead
from app.services.memory_service import create_memory, get_memory, list_memories, memory_content, memory_preview
from app.services.analyzer import analyze_text, dumps
from app.services.vector_store import index_memory
from app.services.preprocess import preprocess_upload

router = APIRouter()


def _parse_tags(raw: str | None) -> list[str]:
    if not raw:
        return []
    parts = [p.strip() for p in raw.replace("，", ",").split(",")]
    return [p for p in parts if p]


@router.post("/unified", response_model=MemoryDetail)
async def create_unified_memory(
    session: SessionDep,
    files: List[UploadFile] = File(default=[]),
    content: str | None = Form(None),
    occurred_at: datetime | None = Form(None),
    tags: str | None = Form(None),
):
    attachments_to_save = []
    combined_content = (content or "").strip()
    
    source_type = "text"
    source_name = None
    
    # 1. Process files
    for file in files:
        result = await preprocess_upload(file)
        if result.raw_text:
            combined_content += f"\n\n[File: {file.filename}]\n{result.raw_text}"
        else:
             combined_content += f"\n\n[File: {file.filename}] (No text content)"
        
        if result.saved_path:
            attachments_to_save.append({
                "path": result.saved_path,
                "mime": file.content_type
            })
            
        # Use the first file's type/name as primary if not set
        if source_type == "text" and result.source_type != "text":
            source_type = result.source_type
            source_name = result.source_name

    if not combined_content.strip() and not attachments_to_save:
         raise HTTPException(status_code=400, detail="Content or files required")

    # 2. Analyze if needed
    analysis_data = None
    final_occurred_at = occurred_at
    final_tags = _parse_tags(tags)

    if not final_occurred_at or not final_tags:
        # Try to analyze
        try:
            analysis_data = analyze_text(combined_content)
            if analysis_data:
                if not final_occurred_at and analysis_data.get("happened_at"):
                    try:
                        final_occurred_at = parser.parse(analysis_data["happened_at"])
                    except Exception:
                        pass
                
                if not final_tags and analysis_data.get("tags"):
                    final_tags = analysis_data["tags"]
        except Exception:
            pass

    # Fallbacks
    if not final_occurred_at:
        final_occurred_at = datetime.now()
    if not final_tags:
        final_tags = ["其他"]

    # 3. Create Memory
    memory = create_memory(
        session,
        content=combined_content,
        occurred_at=final_occurred_at,
        tags=final_tags,
        source_type=source_type,
        source_name=source_name,
    )
    
    # 4. Save analysis
    if analysis_data:
         memory.analysis_json = dumps(analysis_data)
         session.add(memory)
    
    # 5. Save attachments
    for att in attachments_to_save:
        attachment = Attachment(
            memory_id=memory.id,
            file_path=att["path"],
            mime_type=att["mime"],
        )
        session.add(attachment)
    
    session.commit()
    session.refresh(memory)
    
    # 6. Index
    try:
        index_memory(memory.id, combined_content)
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
