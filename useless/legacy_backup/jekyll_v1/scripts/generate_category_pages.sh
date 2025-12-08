#!/bin/bash

# Directory containing posts
POSTS_DIR="_posts"
PAGES_DIR="_pages"

# Create pages directory if it doesn't exist
mkdir -p "$PAGES_DIR"

# Iterate over directories in _posts to find categories
for dir in "$POSTS_DIR"/*/; do
    if [ -d "$dir" ]; then
        category_name=$(basename "$dir")
        
        # Skip if category is simply "YYYY-MM-DD-..." files (not a folder category)
        # But user structure seems to be _posts/DL/, _posts/ML/ etc.
        
        slug=$(echo "$category_name" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')
        filename="$PAGES_DIR/category-$slug.md"
        
        echo "Creating category page for: $category_name ($filename)"
        
        cat <<EOF > "$filename"
---
title: "$category_name"
layout: archive
permalink: /categories/$slug/
author_profile: true
sidebar:
  nav: "docs"
---

{% assign category = "$category_name" %}
{% assign posts = site.categories[category] %}

<div class="entries-list">
  {% for post in posts %}
    {% include archive-single.html type="list" %}
  {% endfor %}
</div>
EOF
    fi
done

echo "Category pages generation complete."
