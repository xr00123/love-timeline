from app.services.preprocess import extract_text_from_plain


def test_extract_text_from_plain(tmp_path):
    p = tmp_path / "a.txt"
    p.write_text("hello\nworld", encoding="utf-8")
    assert extract_text_from_plain(p) == "hello\nworld"

