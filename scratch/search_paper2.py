filepath = "/Users/sehoonpark/.gemini/antigravity-ide/brain/f766845b-ad76-44d0-9453-9fbea9d2e904/scratch/alphalink2_fulltext.txt"

with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

import re

keywords = ["Fine-tuning of alphafold-multimer", "Evaluation set up", "Fine-tuning", "Evaluation"]
for kw in keywords:
    print(f"=== Keyword: {kw} ===")
    matches = [m.start() for m in re.finditer(re.escape(kw), text, re.IGNORECASE)]
    for idx in matches:
        start = max(0, idx - 300)
        end = min(len(text), idx + 1000)
        print(f"Match at {idx}:\n...{text[start:end]}...\n")
        print("-" * 50)
