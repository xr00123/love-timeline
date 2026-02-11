from __future__ import annotations

from datetime import datetime

import shutil
from pathlib import Path

from fastapi import APIRouter, File, Form, UploadFile
from pydantic import BaseModel

from app.core.settings import settings
from app.db.models import Attachment
from app.db.session import SessionDep
from app.schemas.memory import MemoryDetail
from app.services.analyzer import analyze_text, dumps
from app.services.memory_service import create_memory, memory_content
from app.services.preprocess import preprocess_upload
from app.services.vector_store import index_memory

router = APIRouter()


class ImageResponse(BaseModel):
    url: str | None


@router.get("/home-image", response_model=ImageResponse)
def get_home_image():
    static_dir = settings.data_dir / "static"
    image_path = static_dir / "home_image.png"
    if image_path.exists():
        return ImageResponse(url="/static/home_image.png")
    return ImageResponse(url=None)


@router.post("/home-image", response_model=ImageResponse)
async def upload_home_image(file: UploadFile = File(...)):
    static_dir = settings.data_dir / "static"
    static_dir.mkdir(parents=True, exist_ok=True)
    file_path = static_dir / "home_image.png"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return ImageResponse(url="/static/home_image.png")


@router.delete("/home-image", response_model=ImageResponse)
def delete_home_image():
    static_dir = settings.data_dir / "static"
    image_path = static_dir / "home_image.png"
    if image_path.exists():
        image_path.unlink()
    return ImageResponse(url=None)


def _parse_tags(raw: str | None) -> list[str]:
    if not raw:
        return []
    parts = [p.strip() for p in raw.replace("，", ",").split(",")]
    return [p for p in parts if p]


@router.post("", response_model=MemoryDetail)
async def upload_file(
    session: SessionDep,
    file: UploadFile = File(...),
    occurred_at: datetime | None = Form(None),
    tags: str | None = Form(None),
):
    result = await preprocess_upload(file)
    content = result.raw_text.strip() or f"[附件] {result.source_name or 'file'}"

    memory = create_memory(
        session,
        content=content,
        occurred_at=occurred_at,
        tags=_parse_tags(tags),
        source_type=result.source_type,
        source_name=result.source_name,
    )
    try:
        index_memory(memory.id, content)
    except Exception:
        pass
    try:
        analysis = analyze_text(content)
        if analysis:
            memory.analysis_json = dumps(analysis)
            session.add(memory)
            session.commit()
            session.refresh(memory)
    except Exception:
        pass

    if result.saved_path:
        attachment = Attachment(
            memory_id=memory.id,
            file_path=result.saved_path,
            mime_type=file.content_type,
        )
        session.add(attachment)
        session.commit()
        session.refresh(memory)

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
