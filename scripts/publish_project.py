import sys
import os
import re
import json
import subprocess

def parse_and_publish_project(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        sys.exit(1)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex patterns
    # # 제목 : Title
    # # 설명 : Description
    # # 진행기간 : Date (YYYY.MM or string)
    # # 링크 : Label: URL, Label: URL
    
    title_match = re.search(r'^#\s*제목\s*:\s*(.+)$', content, re.MULTILINE)
    desc_match = re.search(r'^#\s*설명\s*:\s*(.+)$', content, re.MULTILINE)
    date_match = re.search(r'^#\s*진행기간\s*:\s*(.+)$', content, re.MULTILINE)
    links_match = re.search(r'^#\s*링크\s*:\s*(.+)$', content, re.MULTILINE)
    
    if not (title_match and desc_match and date_match):
        print("Error: Invalid format. Please ensure Title, Description, and Date are present.")
        sys.exit(1)

    title = title_match.group(1).strip()
    description = desc_match.group(1).strip()
    date_str = date_match.group(1).strip()
    
    # Parse Links
    # Expected format: "GitHub: https://..., Demo: https://..."
    links = []
    if links_match:
        links_str = links_match.group(1).strip()
        # Split by comma first
        link_parts = links_str.split(',')
        for part in link_parts:
            # Split by first colon
            if ':' in part:
                label_end = part.find(':')
                label = part[:label_end].strip()
                url = part[label_end+1:].strip()
                
                icon = 'external'
                if 'github' in label.lower():
                    icon = 'github'
                
                links.append({
                    "label": label,
                    "url": url,
                    "icon": icon
                })
    
    # Extract body content
    body_parts = re.split(r'^-{3,}', content, maxsplit=1, flags=re.MULTILINE)
    if len(body_parts) < 2:
        print("Error: Separator '--------' not found.")
        sys.exit(1)
        
    content_markdown = body_parts[1].strip()

    # Load existing projects
    projects_file = 'content/projects.json'
    projects = []
    if os.path.exists(projects_file):
        with open(projects_file, 'r', encoding='utf-8') as f:
            try:
                projects = json.load(f)
            except json.JSONDecodeError:
                projects = []

    # Check if project already exists (by title), update if so, else append
    existing_index = -1
    for i, p in enumerate(projects):
        if p['title'] == title:
            existing_index = i
            break
            
    new_project = {
        "title": title,
        "date": date_str,
        "description": description,
        "links": links,
        "contentMarkdown": content_markdown
    }
    
    if existing_index >= 0:
        print(f"Updating existing project: {title}")
        projects[existing_index] = new_project
    else:
        print(f"Adding new project: {title}")
        projects.insert(0, new_project) # Prepend or Append? logic in lib handles sort. Let's just append or prepend.

    # Write back to JSON
    with open(projects_file, 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=4, ensure_ascii=False)
        
    print(f"Successfully updated projects.json")

    # Git Operations
    try:
        subprocess.run(["git", "add", projects_file], check=True)
        # Commit message depends on update or add, but generic is fine
        subprocess.run(["git", "commit", "-m", f"feat: update project '{title}'"], check=True)
        subprocess.run(["git", "push"], check=True)
        print("Successfully deployed to GitHub!")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/publish_project.py <input_file>")
        sys.exit(1)
        
    parse_and_publish_project(sys.argv[1])
