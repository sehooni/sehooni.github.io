#!/bin/bash

# 1. Prompt for Post Title
echo "📝 Enter Post Title:"
read title

if [ -z "$title" ]; then
  echo "Error: Title is required."
  exit 1
fi

# 2. Prompt for Category
echo "📂 Enter Category (default: ETC):"
read category
category=${category:-ETC}

# 3. Format Date and Filename
# Get current date
date_str=$(date +%Y-%m-%d)
# Slugify title (replace spaces with hyphens, lowercase)
slug_title=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')
filename="${date_str}-${slug_title}.md"
year=$(date +%Y)

# Define path (nested by category folder if desired, keeping simple flat structure or category folder)
# User's existing structure has folders like _posts/DL, _posts/ML.
target_dir="_posts/$category"
mkdir -p "$target_dir"
filepath="$target_dir/$filename"

# 4. Create File with Front Matter
cat <<EOF > "$filepath"
---
title:  "$title"
excerpt: ""
categories:
  - $category
tags:
  - $category
toc: true
toc_sticky: true
date: $date_str
last_modified_at: $date_str
---

## Introduction

Write your introduction here.

## Content

![Image Description](/assets/images/placeholder.png)

EOF

echo "✅ Successfully created post: $filepath"
