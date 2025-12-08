---
layout: single
title:  "[Blog] Jekyll에서 Next.js로 블로그 이전기"
excerpt: "Jekyll에서 Next.js로 블로그를 마이그레이션하며 겪은 과정과 기술적인 구현 내용을 정리했습니다."
toc: true
toc_sticky: true
categories:
  - Blog
tags: [Next.js, React, TailwindCSS, Migration]
date: 2025-12-08
classes: wide
---

기존에 Jekyll을 사용하여 블로그를 운영하고 있었으나, 커스터마이징의 한계와 빌드 속도 등 여러 불편함을 느껴 Next.js로 이전을 결심하게 되었습니다. 이번 포스팅에서는 Jekyll 블로그를 Next.js (+ TypeScript, Tailwind CSS)로 마이그레이션한 과정을 기술적으로 정리해봅니다.

# 0. 나만을 위한 웹사이트

우선 이번에 블로그를 리뉴얼하면서 신경쓴 포인트는 **RESUME, Project를 보여주기 쉽도록 확장함과 동시에 기술블로그 통합(내 관심사를 정리하고 보여주기 쉽도록)** 에 중심을 두었습니다.

처음 홈페이지로 접속하게 되면 다음과 같이  기술블로그와 제가 지금껏 진행한 프로젝트, 제 소개 및 RESUME을 볼 수 있습니다.

![homepage_main](/assets/images/2025-12-08-migrating-jekyll-to-nextjs/image-1.png)

결국 기술블로그를 통해 공부 내용을 정리하면서도 이를 외부 유저가 받아들이기 쉽게 만드는 것이 중요하다고 생각했습니다.

그럼 새롭게 구성한 내용에 대해 정리해보도록 하겠습니다.

# 1. 왜 Next.js 인가?

Jekyll도 훌륭한 정적 사이트 생성기(SSG)이지만, 다음과 같은 이유로 Next.js를 선택했습니다.

*   **React 생태계**: React의 방대한 라이브러리를 활용하여 UI를 더욱 풍부하게 구성할 수 있습니다.
*   **완벽한 커스터마이징**: 디자인부터 기능까지 모든 코드를 직접 제어할 수 있어 원하는 기능을 자유롭게 구현할 수 있습니다.
*   **성능**: Next.js의 이미지 최적화, 코드 스플리팅 등 강력한 성능 최적화 기능을 활용할 수 있습니다.

# 2. 프로젝트 구조 및 파일 시스템 라우팅

Jekyll의 `_posts` 폴더 구조를 최대한 유지하면서 Next.js의 App Router를 활용했습니다.

## 2.1 디렉토리 구조
기존 `_posts` 대신 `content/posts` 디렉토리를 만들어 마크다운 파일들을 관리합니다.

```
content/posts/
├── DL_ML/
│   ├── DL/
│   ├── ML/
│   └── NLP/
├── Projects/
└── ...
```

## 2.2 Dynamic Routing (`[...slug]`)
Next.js의 동적 라우팅을 활용하여, 중첩된 카테고리 구조(예: `domain.com/DL_ML/NLP/post-title`)를 URL로 매핑했습니다.

**`app/[...slug]/page.tsx`**:
```tsx
import { getPostData } from '@/lib/posts';

export default async function Post({ params }: Props) {
    const { slug } = await params; // ['DL_ML', 'NLP', 'post-title']
    const postData = await getPostData(slug);

    return (
        <article className="prose dark:prose-invert max-w-none">
            <h1>{postData.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
    );
}
```


# 3. 배포 자동화 (GitHub Actions)

Jekyll과 마찬가지로 `GitHub Pages`에 배포하지만, Next.js 빌드 과정을 수행하도록 워크플로우를 수정했습니다.

**`.github/workflows/nextjs.yml`**:
```yaml
# ...
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
            path: ./out
```

이제 `git push`만 하면 자동으로 빌드되고 배포됩니다.

# 4. 포스팅 자동화 및 글쓰기 경험 개선

블로그를 운영하면서 가장 번거로운 점은 **이미지 관리**와 **Frontmatter 작성**이었습니다. 이를 해결하기 위해 두 가지 자동화 기능을 추가했습니다.

## 4.1 이미지 붙여넣기 자동화
VS Code 설정을 통해 마크다운 작성 시 이미지를 붙여넣으면 (`Cmd+V`), 자동으로 `public/assets/images/[게시글제목]/` 경로에 저장되도록 구성했습니다.

**`.vscode/settings.json`**:
```json
{
    "markdown.copyFiles.destination": {
        "content/posts/**/*": "public/assets/images/${documentBaseName}/",
        "_drafts/**/*": "public/assets/images/${documentBaseName}/"
    }
}
```

이제 글을 쓰다가 스크린샷을 찍고 바로 붙여넣기만 하면, 파일 관리와 이미지 경로 입력이 자동으로 처리됩니다.

단, 배포를 하기 위해서는 앞에 public만 지워주면 됩니다!

## 4.2 포스팅 발행 스크립트 (`npm run publish`)
매번 Jekyll 형식의 Frontmatter를 수동으로 작성하는 번거로움을 없애기 위해, 간단한 텍스트 파일만 작성하면 자동으로 변환하고 배포해주는 파이썬 스크립트를 작성했습니다.

**입력 파일 예시 (`draft.txt`)**:
```text
# 제목 : 나의 첫 자동 포스팅
# 날짜: 2025-12-08
# 카테고리: Projects
--------
여기서부터는 자유롭게 내용을 작성하시면 됩니다.
```

**실행**:
```bash
npm run publish draft.txt
```

이 명령어 한 줄이면:
1. 제목, 날짜, 카테고리를 파싱하여 디렉토리 구조에 맞게 마크다운 파일 생성
2. `git add`, `commit`, `push` 자동 수행
3. GitHub Actions를 통해 블로그 배포 완료

## 4.3 이미지 포함 포스팅

이미지를 포함해서 글을 작성할 때, 딱 한 가지 규칙만 지켜주면 됩니다! 작성할 때 파일을 _drafts 폴더 안에 만들고 확장자를 .md로 설정해주는 것 입니다. (예: _drafts/my-new-post.md)

이렇게 하면:

_drafts 폴더 안의 파일에 이미지를 붙여넣으면 (Cmd+V),
VS Code가 이미지를 알아서 public/assets/images/...로 저장하고 링크를 생성해줍니다.
나중에 npm run publish _drafts/my-new-post.md를 실행하면, 이미지가 잘 연결된 상태로 포스팅됩니다.

| 요약: _drafts/제목.md 파일 생성
| 내용 작성 및 사진 붙여넣기 (경로는 신경 X)
| 터미널: npm run publish _drafts/제목.md

이제 글쓰기에만 집중할 수 있는 환경이 완성되었습니다! 🚀

---

이번 이전과 리뉴얼을 통해 더 빠르고 자유로운 블로그 환경을 구축하게 되었습니다. 앞으로 더 양질의 포스팅으로 채워나가겠습니다!
