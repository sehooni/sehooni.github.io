filepath = "/Users/sehoonpark/.gemini/antigravity-ide/brain/f766845b-ad76-44d0-9453-9fbea9d2e904/scratch/alphalink2_fulltext.txt"

with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r"Supplementary", text, re.IGNORECASE)]
print(f"Found {len(matches)} occurrences:")
seen = set()
for idx in matches:
    start = max(0, idx - 100)
    end = min(len(text), idx + 200)
    snippet = text[start:end].replace("\n", " ")
    if snippet[:50] not in seen:
        print(snippet)
        seen.add(snippet[:50])
        print("-" * 50)
