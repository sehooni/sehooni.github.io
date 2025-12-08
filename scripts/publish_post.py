import sys
import os
import re
import subprocess
from datetime import datetime

def slugify(text):
    # Retrieve title from header or just clean up the text
    # Remove special characters, replace spaces with hyphens, lowercase
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '_', text) # use underscore as per user's existing style often seen
    return text.strip('_')

def parse_and_publish(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        sys.exit(1)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find headers
    # Format:
    # # 제목 : Title
    # # 날짜: YYYY-MM-DD
    # # 카테고리: Category
    # --------
    # Content
    
    title_match = re.search(r'^#\s*제목\s*:\s*(.+)$', content, re.MULTILINE)
    date_match = re.search(r'^#\s*날짜\s*:\s*(.+)$', content, re.MULTILINE)
    category_match = re.search(r'^#\s*카테고리\s*:\s*(.+)$', content, re.MULTILINE)
    
    if not (title_match and date_match and category_match):
        print("Error: Invalid format. Please ensure Title, Date, and Category are present.")
        sys.exit(1)

    title = title_match.group(1).strip()
    date_str = date_match.group(1).strip()
    category = category_match.group(1).strip()
    
    # Extract body content (everything after the separator)
    # Separator can be stricter, at least 3 dashes
    body_parts = re.split(r'^-{3,}', content, maxsplit=1, flags=re.MULTILINE)
    if len(body_parts) < 2:
        print("Error: Separator '--------' not found.")
        sys.exit(1)
        
    body = body_parts[1].strip()

    # Generate Slug and Filename
    # Try to make slug from title
    slug = slugify(title)
    filename = f"{date_str}-{slug}.md"
    
    # Category handling:
    # If category matches existing folder in content/posts, use it.
    # We assume 'category' string matches the directory structure, e.g. "DL_ML/NLP" or just "Projects"
    base_posts_dir = "content/posts"
    target_dir = os.path.join(base_posts_dir, category)
    
    if not os.path.exists(target_dir):
        # Allow creating new categories? Yes.
        os.makedirs(target_dir, exist_ok=True)
        
    target_path = os.path.join(target_dir, filename)

    # Create Frontmatter
    # layout: single is standard
    # categories: list of path segments
    categories_list = category.split('/')
    
    frontmatter = f"""---
layout: single
title:  "{title}"
date: {date_str}
categories:
{chr(10).join(f'  - {c}' for c in categories_list)}
---

{body}
"""

    # Write file
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(frontmatter)
        
    print(f"Successfully created post at: {target_path}")

    # Git Operations
    try:
        subprocess.run(["git", "add", target_path], check=True)
        subprocess.run(["git", "commit", "-m", f"feat: add new post '{title}'"], check=True)
        subprocess.run(["git", "push"], check=True)
        print("Successfully deployed to GitHub!")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/publish_post.py <input_file>")
        sys.exit(1)
        
    parse_and_publish(sys.argv[1])
