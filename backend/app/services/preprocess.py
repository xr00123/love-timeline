from __future__ import annotations

import hashlib
from dataclasses import dataclass
from pathlib import Path

from fastapi import UploadFile

from app.core.settings import settings


@dataclass(frozen=True)
class PreprocessResult:
    raw_text: str
    source_type: str
    source_name: str | None
    saved_path: str | None
    sha256: str


def _safe_filename(name: str) -> str:
    name = name.strip().replace("\\", "_").replace("/", "_")
    if not name:
        return "file"
    return name


async def save_upload(file: UploadFile) -> tuple[Path, str]:
    uploads_dir = settings.data_dir / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)

    filename = _safe_filename(file.filename or "file")
    target = uploads_dir / filename
    digest = hashlib.sha256()

    content = await file.read()
    digest.update(content)
    sha256 = digest.hexdigest()

    stem = target.stem
    suffix = target.suffix
    target = uploads_dir / f"{stem}_{sha256[:12]}{suffix}"
    target.write_bytes(content)

    return target, sha256


def extract_text_from_pdf(path: Path) -> str:
    from PyPDF2 import PdfReader

    reader = PdfReader(str(path))
    parts: list[str] = []
    for page in reader.pages:
        text = page.extract_text() or ""
        if text.strip():
            parts.append(text)
    return "\n".join(parts).strip()


def extract_text_from_image(path: Path) -> str:
    try:
        import pytesseract
        from PIL import Image
    except Exception:
        return ""

    try:
        img = Image.open(path)
    except Exception:
        return ""
    try:
        return (pytesseract.image_to_string(img) or "").strip()
    except Exception:
        return ""


def extract_text_from_plain(path: Path) -> str:
    raw = path.read_bytes()
    for enc in ("utf-8", "utf-16", "gb18030"):
        try:
            return raw.decode(enc).replace("\r\n", "\n").strip()
        except Exception:
            continue
    return raw.decode("utf-8", errors="ignore").replace("\r\n", "\n").strip()


def _guess_source_type(content_type: str | None, filename: str | None) -> str:
    if content_type:
        if content_type.startswith("image/"):
            return "image"
        if content_type in {"application/pdf"}:
            return "pdf"
        if content_type.startswith("text/"):
            return "text"
    if filename:
        lower = filename.lower()
        if lower.endswith((".png", ".jpg", ".jpeg", ".webp", ".bmp")):
            return "image"
        if lower.endswith(".pdf"):
            return "pdf"
        if lower.endswith((".txt", ".md")):
            return "text"
    return "file"


async def preprocess_upload(file: UploadFile) -> PreprocessResult:
    saved_path, sha256 = await save_upload(file)
    source_type = _guess_source_type(file.content_type, file.filename)

    if source_type == "pdf":
        raw_text = extract_text_from_pdf(saved_path)
    elif source_type == "image":
        raw_text = extract_text_from_image(saved_path)
    elif source_type == "text":
        raw_text = extract_text_from_plain(saved_path)
    else:
        raw_text = ""

    return PreprocessResult(
        raw_text=raw_text,
        source_type=source_type,
        source_name=file.filename,
        saved_path=str(saved_path),
        sha256=sha256,
    )
