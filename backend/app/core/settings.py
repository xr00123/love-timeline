from __future__ import annotations

from pathlib import Path

from pydantic import AnyUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


# Use absolute path based on this file's location: backend/app/core/settings.py -> backend/data
DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="backend/.env", env_file_encoding="utf-8")

    app_env: str = "dev"
    data_dir: Path = DATA_DIR
    db_url: str = f"sqlite:///{DATA_DIR}/app.db"
    chroma_dir: Path = DATA_DIR / "chroma"
    local_ollama_url: AnyUrl = "http://127.0.0.1:11434"
    ollama_embed_model: str = "nomic-embed-text"
    ollama_chat_model: str = "llama3"
    encryption_key_b64: str = ""


settings = Settings()
