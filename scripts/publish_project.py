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

    # Parse Metadata Headers
    # Format:
    # # 제목 : Title
    # # 진행기간 : Date (YYYY.MM - YYYY.MM)
    # # 태그 : Tag1, Tag2
    # # 이미지 : /path/to/image
    # # 비디오 : /path/to/video
    # # 링크 : Label: URL, Label: URL
    # # 설명 : Description text
    
    title_match = re.search(r'^#\s*제목\s*:\s*(.+)$', content, re.MULTILINE)
    period_match = re.search(r'^#\s*진행기간\s*:\s*(.+)$', content, re.MULTILINE)
    tags_match = re.search(r'^#\s*태그\s*:\s*(.+)$', content, re.MULTILINE)
    image_match = re.search(r'^#\s*이미지\s*:\s*(.+)$', content, re.MULTILINE)
    video_match = re.search(r'^#\s*비디오\s*:\s*(.+)$', content, re.MULTILINE)
    links_match = re.search(r'^#\s*링크\s*:\s*(.+)$', content, re.MULTILINE)
    desc_match = re.search(r'^#\s*설명\s*:\s*(.+)$', content, re.MULTILINE)
    
    if not (title_match and period_match and desc_match):
        print("Error: Invalid format. Title, Period, and Description are required.")
        sys.exit(1)

    title = title_match.group(1).strip()
    period = period_match.group(1).strip()
    description = desc_match.group(1).strip()
    
    image = image_match.group(1).strip() if image_match else ""
    video = video_match.group(1).strip() if video_match else ""

    # Parse Tags
    tags = []
    if tags_match:
        tags_str = tags_match.group(1).strip()
        tags = [t.strip() for t in tags_str.split(',') if t.strip()]
    
    # Parse Links
    links = []
    if links_match:
        links_str = links_match.group(1).strip()
        link_parts = links_str.split(',')
        for part in link_parts:
            if ':' in part:
                label_end = part.find(':')
                label = part[:label_end].strip()
                url = part[label_end+1:].strip()
                
                icon = 'external'
                if 'github' in label.lower():
                    icon = 'github'
                elif 'blog' in label.lower():
                    icon = 'blog'
                
                links.append({
                    "label": label,
                    "url": url,
                    "icon": icon
                })
    
    # Parse Details (EN/KO)
    # Format:
    # --------
    # [EN]
    # ...
    # [KO]
    # ...
    
    body_parts = re.split(r'^-{3,}', content, maxsplit=1, flags=re.MULTILINE)
    if len(body_parts) < 2:
        print("Error: Separator '--------' not found.")
        sys.exit(1)
        
    raw_body = body_parts[1].strip()
    
    details = {"en": "", "ko": ""}
    
    # Split by [EN] and [KO] tags
    # We use a simple regex to find the content between tags
    # Assuming user puts [EN] first then [KO], or vice versa.
    
    # Strategy: Split by `\[(EN|KO)\]`
    parts = re.split(r'\[(EN|KO)\]', raw_body)
    # parts[0] is usually empty or pre-text
    # parts[1] is 'EN' or 'KO'
    # parts[2] is content for parts[1]
    # parts[3] is 'EN' or 'KO'
    # parts[4] is content for parts[3]
    
    current_lang = None
    for part in parts:
        part = part.strip()
        if part in ['EN', 'KO']:
            current_lang = part.lower()
        elif current_lang:
            details[current_lang] = part
            
    # Load existing projects from JSON source
    projects_file = 'content/projects_data.json'
    projects = []
    if os.path.exists(projects_file):
        with open(projects_file, 'r', encoding='utf-8') as f:
            try:
                projects = json.load(f)
            except json.JSONDecodeError:
                projects = []

    # Check if project already exists (by title), update if so, else prepend
    existing_index = -1
    for i, p in enumerate(projects):
        if p['title'] == title:
            existing_index = i
            break
            
    new_project = {
        "title": title,
        "tags": tags,
        "period": period,
        "description": description,
        "image": image,
        "video": video,
        "github": next((link['url'] for link in links if link['icon'] == 'github'), ""),
        "links": links,
        "details": details
    }
    
    # Remove empty fields
    if not video: del new_project["video"]
    if not image: del new_project["image"]
    if not new_project["github"]: del new_project["github"]

    if existing_index >= 0:
        print(f"Updating existing project: {title}")
        projects[existing_index] = new_project
    else:
        print(f"Adding new project: {title}")
        projects.insert(0, new_project) 

    # Write back to JSON
    with open(projects_file, 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=4, ensure_ascii=False)
        
    print(f"Successfully updated {projects_file}")

    # Git Operations (Optional, can be commented out if user wants manual control)
    try:
        subprocess.run(["git", "add", projects_file], check=True)
        print("Staged changes for commit.")
    except subprocess.CalledProcessError as e:
        print(f"Git add failed: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/publish_project.py <input_file>")
        print("Make sure your input file follows the template format.")
        sys.exit(1)
        
    parse_and_publish_project(sys.argv[1])
