filepath = "/Users/sehoonpark/.gemini/antigravity-ide/brain/f766845b-ad76-44d0-9453-9fbea9d2e904/scratch/alphalink2_fulltext.txt"

with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r"in-cell|single\s+crosslink", text, re.IGNORECASE)]
for idx in matches:
    start = max(0, idx - 150)
    end = min(len(text), idx + 250)
    print(text[start:end].replace("\n", " "))
    print("-" * 50)
