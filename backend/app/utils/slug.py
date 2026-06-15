from __future__ import annotations
import re
import unicodedata

def _to_ascii(text: str) -> str:
    return (
        unicodedata.normalize("NFKD", text)
        .encode("ascii", "ignore")
        .decode("ascii")
    )

def slugify(text: str, max_length: int = 200) -> str:
    text = _to_ascii(text.strip().lower())
    text = re.sub(r"[^\w\s-]", "", text)      
    text = re.sub(r"[\s_]+", "-", text)       
    text = re.sub(r"-{2,}", "-", text)          
    text = text.strip("-")                      
    return text[:max_length]

async def unique_slug(
    base: str,
    exists_fn,          
    max_length: int = 200,
) -> str:
    candidate = slugify(base, max_length)
    if not candidate:
        candidate = "untitled"

    if not await exists_fn(candidate):
        return candidate

    for n in range(2, 10_000):
        suffix = f"-{n}"
        trimmed = candidate[: max_length - len(suffix)]
        new_slug = f"{trimmed}{suffix}"
        if not await exists_fn(new_slug):
            return new_slug

    raise RuntimeError(f"Không thể tạo slug duy nhất cho: {base!r}")