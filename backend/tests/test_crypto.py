from app.core.crypto import Crypto, generate_key_b64


def test_crypto_roundtrip():
    key = generate_key_b64()
    crypto = Crypto(key)
    payload = crypto.encrypt_text_b64("hello")
    assert crypto.decrypt_text_b64(payload) == "hello"

