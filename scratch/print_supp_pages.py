filepath = "/Users/sehoonpark/.gemini/antigravity-ide/brain/f766845b-ad76-44d0-9453-9fbea9d2e904/scratch/alphalink2_supp_text.txt"

with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

import re

# Split by "--- Page X ---" to get page content
pages = re.split(r"--- Page \d+ ---", text)
print(f"Extracted {len(pages)} pages.")

for i in range(1, min(10, len(pages))):
    print(f"=== Page {i} ===")
    content = pages[i].strip()
    # Print the first 500 characters of each page
    print(content[:600])
    print("-" * 50)
