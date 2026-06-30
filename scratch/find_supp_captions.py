filepath = "/Users/sehoonpark/.gemini/antigravity-ide/brain/f766845b-ad76-44d0-9453-9fbea9d2e904/scratch/alphalink2_fulltext.txt"

with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r"Supplementary Figure \d+", text, re.IGNORECASE)]
print(f"Found {len(matches)} occurrences:")
for idx in matches[:20]:
    start = idx
    end = min(len(text), idx + 300)
    print(text[start:end])
    print("-" * 50)
