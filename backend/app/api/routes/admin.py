from __future__ import annotations

import json

from fastapi import APIRouter, BackgroundTasks, HTTPException
from sqlmodel import Session, select

from app.db.models import Memory
from app.db.session import engine
from app.services.memory_service import memory_content
from app.services.optional_nlp import ner, sentiment
from app.services.vector_store import index_many, reset_collection

router = APIRouter()


def _reindex_task(reset: bool) -> None:
    if reset:
        reset_collection()
    batch: list[tuple[str, str]] = []
    with Session(engine) as session:
        memories = session.exec(select(Memory)).all()
        for m in memories:
            batch.append((m.id, memory_content(m)))
            if len(batch) >= 16:
                index_many(batch)
                batch.clear()
    if batch:
        index_many(batch)


@router.post("/reindex")
def reindex(background_tasks: BackgroundTasks, reset: bool = True):
    background_tasks.add_task(_reindex_task, reset)
    return {"status": "scheduled"}


@router.post("/analyze/{memory_id}")
def analyze(memory_id: str):
    with Session(engine) as session:
        memory = session.get(Memory, memory_id)
        if memory is None:
            raise HTTPException(status_code=404, detail="Memory not found")
        text = memory_content(memory)
        extra = {
            "transformers_sentiment": sentiment(text),
            "spacy_ner": ner(text),
        }
        current = {}
        if memory.analysis_json:
            try:
                current = json.loads(memory.analysis_json)
            except Exception:
                current = {"raw": memory.analysis_json}
        merged = {**current, **{k: v for k, v in extra.items() if v is not None}}
        memory.analysis_json = json.dumps(merged, ensure_ascii=False)
        session.add(memory)
        session.commit()
    return {"status": "ok", "updated": True}

