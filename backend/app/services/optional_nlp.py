from __future__ import annotations

from typing import Any


def sentiment(text: str) -> dict[str, Any] | None:
    try:
        from transformers import pipeline  # type: ignore
    except Exception:
        return None
    try:
        fn = pipeline("sentiment-analysis")
        out = fn(text)
        return {"model": "transformers:sentiment-analysis", "result": out}
    except Exception:
        return None


def ner(text: str) -> dict[str, Any] | None:
    try:
        import spacy  # type: ignore
    except Exception:
        return None
    try:
        nlp = spacy.load("zh_core_web_sm")
        doc = nlp(text)
        ents = [{"text": e.text, "label": e.label_} for e in doc.ents]
        return {"model": "spacy:zh_core_web_sm", "entities": ents}
    except Exception:
        return None

