# Automation Scripts Guide

이 디렉토리는 블로그 포스팅과 프로젝트 업데이트를 자동화하기 위한 스크립트들을 포함하고 있습니다.
복잡한 Frontmatter나 JSON 데이터를 직접 수정할 필요 없이, 간단한 텍스트 파일과 명령어 한 줄로 배포까지 가능합니다.

## 1. 블로그 포스팅 (`npm run publish`)

새로운 블로그 글을 작성하고 배포할 때 사용합니다.

### 사용 방법
1. **초안 작성**: `_drafts` 폴더(권장) 또는 임의의 위치에 텍스트 파일(`.md`, `.txt`)을 생성합니다.
2. **이미지 첨부**: VS Code에서 `_drafts` 폴더 내의 파일에 이미지를 붙여넣으면 자동으로 설정된 경로(`public/assets/images/...`)로 저장됩니다.
3. **명령어 실행**:
   ```bash
   npm run publish _drafts/my-post.md
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
1. **초안 작성**: 임의의 텍스트 파일(`.txt`)을 생성합니다.
2. **명령어 실행**:
   ```bash
   npm run publish-project new-project.txt
   ```

### 입력 파일 형식
```text
# 제목 : 프로젝트 이름
# 설명 : 프로젝트에 대한 한 줄 요약
# 진행기간 : 2024.12 (또는 2024.01 - 2024.12)
# 링크 : GitHub: https://github.com/..., Demo: https://...
--------
(여기서부터 마크다운 상세 설명 작성)
- 주요 기능
- 사용 기술
```

## 3. 공통 사항
* 스크립트 실행 성공 시 자동으로 `git add`, `git commit`, `git push`가 수행되어 GitHub Pages에 배포됩니다.
* `projects.json`이나 마크다운 파일이 자동으로 생성/수정되므로 별도의 파일 관리가 필요 없습니다.
