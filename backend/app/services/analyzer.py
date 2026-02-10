from __future__ import annotations

import json
from typing import Any

from app.services.ollama_client import generate_json


def analyze_text(text: str) -> dict[str, Any]:
    text = (text or "").strip()
    if not text:
        return {}
    schema: dict[str, Any] = {
        "type": "object",
        "properties": {
            "sentiment": {"type": "string"},
            "people": {"type": "array", "items": {"type": "string"}},
            "places": {"type": "array", "items": {"type": "string"}},
            "events": {"type": "array", "items": {"type": "string"}},
            "tags": {"type": "array", "items": {"type": "string"}},
            "summary": {"type": "string"},
        },
        "required": ["sentiment", "people", "places", "events", "tags", "summary"],
    }
    prompt = (
        "请从下面的记忆文本中提取结构化信息，并仅输出符合 JSON Schema 的 JSON。\n"
        "要求：sentiment 用 1 个词描述情感倾向；people/places/events/tags 为字符串数组；summary 为一句话摘要。\n\n"
        f"记忆文本：\n{text}"
    )
    return generate_json(prompt, schema=schema)


def dumps(data: dict[str, Any]) -> str:
    return json.dumps(data, ensure_ascii=False)

