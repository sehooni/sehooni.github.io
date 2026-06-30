filepath = "/Users/sehoonpark/.gemini/antigravity-ide/brain/f766845b-ad76-44d0-9453-9fbea9d2e904/scratch/alphalink2_fulltext.txt"

with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

# Let's print the text between indices 28000 and 32500
print(text[28000:32500])
