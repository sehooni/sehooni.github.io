#!/bin/bash

TEMPLATE_FILE="_drafts/new_project.md"

cat <<EOF > "$TEMPLATE_FILE"
# 제목 : New Project Title
# 진행기간 : 2024.01 - 2024.12
# 태그 : AI, React, TypeScript
# 이미지 : /assets/images/placeholder.png
# 비디오 : 
# 링크 : GitHub: https://github.com/username/repo, Blog: https://sehooni.github.io/..., Demo: https://...
# 설명 : A short description for the project card.

--------
[EN]
Detailed description in English.
- Feature 1
- Feature 2

[KO]
Detailed description in Korean.
- 기능 1
- 기능 2
EOF

echo "Created project template at $TEMPLATE_FILE"
echo "Edit this file and then run: python3 scripts/publish_project.py $TEMPLATE_FILE"
