filepath = "/Users/sehoonpark/.gemini/antigravity-ide/brain/f766845b-ad76-44d0-9453-9fbea9d2e904/scratch/alphalink2_fulltext.txt"

with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

import re

# Find occurrences of "AlphaLink" followed by words or comparing it to the first version
matches = [m.start() for m in re.finditer(r"monomer|first version|original AlphaLink", text, re.IGNORECASE)]
for idx in matches[:15]:
    start = max(0, idx - 200)
    end = min(len(text), idx + 600)
    print(f"Match at {idx}:")
    print(text[start:end].replace("\n", " "))
    print("-" * 50)
