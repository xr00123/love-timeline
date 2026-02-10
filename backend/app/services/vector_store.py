from __future__ import annotations

from dataclasses import dataclass

import chromadb

from app.core.settings import settings
from app.services.ollama_client import embed_texts


@dataclass(frozen=True)
class SearchHit:
    memory_id: str
    distance: float | None


_client: chromadb.PersistentClient | None = None
_collection = None


def _get_collection():
    global _client, _collection
    if _client is None:
        _client = chromadb.PersistentClient(path=str(settings.chroma_dir))
    if _collection is None:
        _collection = _client.get_or_create_collection(name="memories")
    return _collection


def reset_collection() -> None:
    global _client, _collection
    if _client is None:
        _client = chromadb.PersistentClient(path=str(settings.chroma_dir))
    try:
        _client.delete_collection(name="memories")
    except Exception:
        pass
    _collection = _client.get_or_create_collection(name="memories")


def index_memory(memory_id: str, content: str) -> None:
    content = (content or "").strip()
    if not content:
        return
    emb = embed_texts([content])[0]
    col = _get_collection()
    col.upsert(ids=[memory_id], embeddings=[emb], documents=[content])


def index_many(items: list[tuple[str, str]]) -> None:
    cleaned: list[tuple[str, str]] = []
    for mid, content in items:
        text = (content or "").strip()
        if text:
            cleaned.append((mid, text))
    if not cleaned:
        return
    ids = [mid for mid, _ in cleaned]
    texts = [text for _, text in cleaned]
    embeddings = embed_texts(texts)
    col = _get_collection()
    col.upsert(ids=ids, embeddings=embeddings, documents=texts)


def search_memories(query: str, *, limit: int = 5) -> list[SearchHit]:
    query = (query or "").strip()
    if not query:
        return []
    emb = embed_texts([query])[0]
    col = _get_collection()
    results = col.query(query_embeddings=[emb], n_results=limit, include=["distances"])
    ids = (results.get("ids") or [[]])[0]
    distances = (results.get("distances") or [[]])[0]
    hits: list[SearchHit] = []
    for i, memory_id in enumerate(ids):
        dist = None
        if i < len(distances):
            dist = distances[i]
        hits.append(SearchHit(memory_id=memory_id, distance=dist))
    return hits
