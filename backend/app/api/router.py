from __future__ import annotations

from fastapi import APIRouter

from app.api.routes.health import router as health_router
from app.api.routes.admin import router as admin_router
from app.api.routes.memories import router as memories_router
from app.api.routes.search import router as search_router
from app.api.routes.uploads import router as uploads_router

api_router = APIRouter()

api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])
api_router.include_router(memories_router, prefix="/memories", tags=["memories"])
api_router.include_router(search_router, prefix="/search", tags=["search"])
api_router.include_router(uploads_router, prefix="/uploads", tags=["uploads"])
