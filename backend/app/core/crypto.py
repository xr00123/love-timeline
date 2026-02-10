from __future__ import annotations

import base64
import os
from dataclasses import dataclass

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


class EncryptionKeyError(ValueError):
    pass


def generate_key_b64() -> str:
    return base64.b64encode(os.urandom(32)).decode("ascii")


def _decode_key(key_b64: str) -> bytes:
    if not key_b64:
        raise EncryptionKeyError("ENCRYPTION_KEY_B64 is empty")
    try:
        key = base64.b64decode(key_b64)
    except Exception as e:
        raise EncryptionKeyError("Invalid ENCRYPTION_KEY_B64") from e
    if len(key) != 32:
        raise EncryptionKeyError("ENCRYPTION_KEY_B64 must decode to 32 bytes")
    return key


@dataclass(frozen=True)
class Crypto:
    key_b64: str

    def encrypt_text_b64(self, plaintext: str, *, aad: bytes = b"") -> str:
        key = _decode_key(self.key_b64)
        aesgcm = AESGCM(key)
        nonce = os.urandom(12)
        ciphertext = aesgcm.encrypt(nonce, plaintext.encode("utf-8"), aad or None)
        payload = nonce + ciphertext
        return base64.b64encode(payload).decode("ascii")

    def decrypt_text_b64(self, payload_b64: str, *, aad: bytes = b"") -> str:
        key = _decode_key(self.key_b64)
        raw = base64.b64decode(payload_b64)
        nonce, ciphertext = raw[:12], raw[12:]
        aesgcm = AESGCM(key)
        plaintext = aesgcm.decrypt(nonce, ciphertext, aad or None)
        return plaintext.decode("utf-8")

