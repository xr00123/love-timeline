from __future__ import annotations

from app.core.crypto import Crypto, EncryptionKeyError
from app.core.settings import settings


def encrypt_text(plaintext: str, *, aad: bytes = b"") -> tuple[str, bool]:
    if not settings.encryption_key_b64:
        return plaintext, False
    crypto = Crypto(settings.encryption_key_b64)
    return crypto.encrypt_text_b64(plaintext, aad=aad), True


def decrypt_text(payload: str, *, is_encrypted: bool, aad: bytes = b"") -> str:
    if not is_encrypted:
        return payload
    crypto = Crypto(settings.encryption_key_b64)
    return crypto.decrypt_text_b64(payload, aad=aad)


def encryption_ready() -> bool:
    if not settings.encryption_key_b64:
        return False
    try:
        Crypto(settings.encryption_key_b64).encrypt_text_b64("ok")
        return True
    except EncryptionKeyError:
        return False

