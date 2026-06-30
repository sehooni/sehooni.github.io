import re

filepath = "/Users/sehoonpark/00_workspace/projects/sehooni.github.io/content/posts/PaperReview/2023-08-30-AlphaLink-protein-structure-prediction.md"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

images = re.findall(r"!\[.*?\]\((.*?)\)", content)
print("Image paths in markdown:")
for img in images:
    print(img)
