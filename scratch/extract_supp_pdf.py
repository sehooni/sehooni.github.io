# /// script
# dependencies = [
#   "pypdf",
# ]
# ///
import pypdf

reader = pypdf.PdfReader("/Users/sehoonpark/.gemini/antigravity-ide/brain/f766845b-ad76-44d0-9453-9fbea9d2e904/scratch/alphalink2_supp.pdf")
print(f"Total pages: {len(reader.pages)}")

# Print text from all pages
full_text = ""
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    full_text += f"\n--- Page {i+1} ---\n" + text

# Save the extracted text to a text file
with open("/Users/sehoonpark/.gemini/antigravity-ide/brain/f766845b-ad76-44d0-9453-9fbea9d2e904/scratch/alphalink2_supp_text.txt", "w", encoding="utf-8") as f:
    f.write(full_text)

# Find and print headings or lines starting with "Supplementary Figure"
import re
lines = full_text.split("\n")
for line in lines:
    if re.search(r"Supplementary Figure \d+", line, re.IGNORECASE) or re.search(r"Supplementary Fig\.", line, re.IGNORECASE):
        print(line)
