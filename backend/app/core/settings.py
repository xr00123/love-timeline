from __future__ import annotations

from pathlib import Path

from pydantic import AnyUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="backend/.env", env_file_encoding="utf-8")

    app_env: str = "dev"
    data_dir: Path = Path("./backend/data")
    db_url: str = "sqlite:///./backend/data/app.db"
    chroma_dir: Path = Path("./backend/data/chroma")
    ollama_base_url: AnyUrl = "http://localhost:11434"
    ollama_embed_model: str = "nomic-embed-text"
    ollama_chat_model: str = "llama3"
    encryption_key_b64: str = ""


settings = Settings()
