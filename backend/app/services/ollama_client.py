from __future__ import annotations

from typing import Any

import httpx

from app.core.settings import settings


class OllamaError(RuntimeError):
    pass


def _client() -> httpx.Client:
    return httpx.Client(base_url=str(settings.local_ollama_url), timeout=60.0)


def embed_texts(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []
    with _client() as client:
        resp = client.post(
            "/api/embed",
            json={
                "model": settings.ollama_embed_model,
                "input": texts,
            },
        )
    if resp.status_code >= 400:
        raise OllamaError(f"Ollama embed failed: {resp.status_code} {resp.text}")
    data: Any = resp.json()
    embeddings = data.get("embeddings")
    if not isinstance(embeddings, list):
        raise OllamaError("Ollama embed response missing embeddings")
    return embeddings


def generate_json(prompt: str, *, schema: dict[str, Any]) -> dict[str, Any]:
    with _client() as client:
        resp = client.post(
            "/api/generate",
            json={
                "model": settings.ollama_chat_model,
                "prompt": prompt,
                "stream": False,
                "format": schema,
            },
        )
    if resp.status_code >= 400:
        raise OllamaError(f"Ollama generate failed: {resp.status_code} {resp.text}")
    data: Any = resp.json()
    raw = data.get("response", "")
    if isinstance(raw, str):
        try:
            import json

            return json.loads(raw)
        except Exception:
            return {"raw": raw}
    return {"raw": raw}

