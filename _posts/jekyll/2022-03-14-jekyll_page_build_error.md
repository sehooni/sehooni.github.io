---
title:  "[jekyll 에러] pages build and deployment"
excerpt: ""

categories:
  - Blog
tags: [Blog, jekyll]

last_modified_at: 2022-03-14T12:00:00-03:00
classes: wide
---

블로그 첫 게시물을 작성하고, 처음 fork를 통해 만들었던 사이트를 다시 나만의 repo로 만든다고 다시 도전했다.

기존 파일들을 .zip으로 다운을 받은 뒤, 일일히 업로드 및 commtit을 하였는데 서버에 업로그가 되지 않은 오류 발견....😅

참고한 여러 github들을 뒤지며 찾아본 결과.... `Action`에서 `pages build and deployment` 에러들... 

오류가 잔뜩 발생한 것 이였다!!!!!!!!!!!!!!!

이 모든 문제의 범인은 `_config.yml`에 있었다. 

![error1](https://user-images.githubusercontent.com/84653623/158160359-dd3d61fc-7551-42e3-a2f3-bae63f9ca6f4.png)

다시 `_config.yml` 형식을 초기화하고서, 이전까지 작성한 형식으로 수정하였다.

자세히 확인하면 다음과 같다.

![error2](https://user-images.githubusercontent.com/84653623/158160666-8f38e45b-ccc2-4640-b413-a77888b419cd.png)

![detail](https://user-images.githubusercontent.com/84653623/158162938-c700fa99-f79c-4608-8dc1-79680ee4035e.png)

