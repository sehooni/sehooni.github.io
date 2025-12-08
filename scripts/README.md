# Automation Scripts Guide

이 디렉토리는 블로그 포스팅과 프로젝트 업데이트를 자동화하기 위한 스크립트들을 포함하고 있습니다.
복잡한 Frontmatter나 JSON 데이터를 직접 수정할 필요 없이, 간단한 텍스트 파일과 명령어 한 줄로 배포까지 가능합니다.

## 1. 블로그 포스팅 (`npm run publish`)

새로운 블로그 글을 작성하고 배포할 때 사용합니다.

### 사용 방법
1. **초안 작성**: `_drafts/post` 폴더(권장)에 텍스트 파일(`.md`, `.txt`)을 생성합니다. (예: `_drafts/post/my-post.md`)
2. **이미지 첨부**: VS Code에서 `_drafts` 폴더 내의 파일에 이미지를 붙여넣으면 자동으로 설정된 경로(`public/assets/images/...`)로 저장됩니다.
3. **명령어 실행**:
   ```bash
   npm run publish _drafts/post/my-post.md
   ```

### 입력 파일 형식
```text
# 제목 : 글 제목
# 날짜: YYYY-MM-DD
# 카테고리: 카테고리/서브카테고리 (예: Projects/SideProject)
--------
(여기서부터 마크다운 내용 작성)
```

---

## 2. 프로젝트 업데이트 (`npm run publish-project`)

Projects 페이지에 새로운 프로젝트를 추가하거나 기존 프로젝트를 업데이트할 때 사용합니다.

### 사용 방법
1. **초안 작성**: `_drafts/project` 폴더(권장)에 텍스트 파일(`.txt`)을 생성합니다. (예: `_drafts/project/new-project.txt`)
2. **명령어 실행**:
   ```bash
   npm run publish-project _drafts/project/new-project.txt
   ```

### 입력 파일 형식
```text
# 제목 : 프로젝트 이름
# 설명 : 프로젝트에 대한 한 줄 요약
# 진행기간 : 2024.12 (또는 2024.01 - 2024.12)
# 태그 : AI, Game, Hackathon
# 링크 : GitHub: https://github.com/..., Demo: https://...
--------
(여기서부터 마크다운 상세 설명 작성)
- 주요 기능
- 사용 기술
```

## 3. 공통 사항
* **파일 생성 원리**:
  - `npm run publish`: 초안을 읽어 **`content/posts`** 폴더에 실제 마크다운 파일을 생성합니다. (`_drafts` 파일은 유지됨)
  - `npm run publish-project`: 초안을 읽어 **`content/projects.json`** 데이터를 갱신합니다.
* **Git 자동 배포**: 스크립트 실행 시 자동으로 변경 사항(`content/` 내의 파일들)이 커밋되고 배포됩니다.
* **_drafts 폴더**: 이 폴더는 Git에 저장되지 않으므로(gitignore), 자유롭게 메모장처럼 사용하시면 됩니다.
