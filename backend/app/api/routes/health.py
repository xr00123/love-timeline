from __future__ import annotations

import httpx
from fastapi import APIRouter

from app.core.settings import settings
from sqlalchemy import text
from sqlmodel import Session

from app.db.session import engine
from app.services.encryption import encryption_ready

router = APIRouter()


@router.get("")
def health():
    db_ok = True
    try:
        with Session(engine) as session:
            session.exec(text("select 1"))
    except Exception:
        db_ok = False

    ollama_ok = True
    ollama_version = None
    try:
        with httpx.Client(base_url=str(settings.ollama_base_url), timeout=3.0) as client:
            resp = client.get("/api/version")
        if resp.status_code >= 400:
            ollama_ok = False
        else:
            data = resp.json()
            ollama_version = data.get("version")
    except Exception:
        ollama_ok = False

    chroma_ok = True
    try:
        import chromadb

        client = chromadb.PersistentClient(path=str(settings.chroma_dir))
        col = client.get_or_create_collection(name="memories")
        col.count()
    except Exception:
        chroma_ok = False

    return {
        "status": "ok",
        "app_env": settings.app_env,
        "db_ok": db_ok,
        "ollama_ok": ollama_ok,
        "ollama_version": ollama_version,
        "chroma_ok": chroma_ok,
        "encryption_ready": encryption_ready(),
    }
