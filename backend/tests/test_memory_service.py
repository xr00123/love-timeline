from sqlmodel import Session, SQLModel, create_engine

from app.core.crypto import generate_key_b64
from app.core.settings import settings
from app.db.models import Memory
from app.services.memory_service import create_memory, get_memory, list_memories, memory_content


def test_create_and_list_memory_with_encryption():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)

    old_key = settings.encryption_key_b64
    settings.encryption_key_b64 = generate_key_b64()
    try:
        with Session(engine) as session:
            created = create_memory(session, content="今天很开心", tags=["约会", "海边"])
            assert created.id
            fetched = get_memory(session, created.id)
            assert fetched is not None
            assert fetched.content_is_encrypted is True
            assert memory_content(fetched) == "今天很开心"

            items = list_memories(session, limit=10)
            assert len(items) == 1
            assert isinstance(items[0], Memory)
    finally:
        settings.encryption_key_b64 = old_key

