from __future__ import annotations

from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, create_engine

from app.core.settings import settings


def _sqlite_connect_args(db_url: str) -> dict:
    if db_url.startswith("sqlite:"):
        return {"check_same_thread": False}
    return {}


engine = create_engine(settings.db_url, connect_args=_sqlite_connect_args(settings.db_url))


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
