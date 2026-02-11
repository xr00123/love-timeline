from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.settings import settings
from app.db.init_db import init_db


def create_app() -> FastAPI:
    app = FastAPI(title="Love Time API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    settings.data_dir.mkdir(parents=True, exist_ok=True)
    settings.chroma_dir.mkdir(parents=True, exist_ok=True)
    (settings.data_dir / "static").mkdir(parents=True, exist_ok=True)
    init_db()

    # Mount static files correctly
    static_dir = settings.data_dir / "static"
    if not static_dir.exists():
        static_dir.mkdir(parents=True, exist_ok=True)
        
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
    app.include_router(api_router)
    return app


app = create_app()
