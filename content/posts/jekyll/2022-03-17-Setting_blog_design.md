---
published: true
title:  "[Blog] 블로그 setting 하기(back_to_top)"
excerpt: "Blog setting"
toc: true
toc_sticky: true

categories:
  - Blog
tags: [Blog, jekyll]

last_modified_at: 2022-03-17T00:00:00-00:30:00
classes: wide
---

블로그를 setting하는데 거의 3일을 투자한 것 같네요.

이 블로그가 메인이 아닌, 공부내용을 업로드하면서 git과 css를 동시에 짬내서 공부하는 느낌인지라..!!

또 개강도 했고, 대학원 준비도 하고... 이래저래 정신이 없었지만

거두절미하고 포스팅을 이어나가 보도록 하겠습니다.

다른 분들의 repo도 참고하고, 또 기본의 repo를 보면서 이것저것 setting을 진행하였습니다! :)

# 1. minimal-mistakes-theme에서 back to top 버튼 만들기

## 1.1. `_sass/minimal-mistakes/_sidebar.scss`에서 아래 내용 삽입

삽입할 내용은 다음과 같아요! 다음 내용의 수정을 통해서 위치 조정 또한 가능하답니다.

```scss
.sidebar__top {
  position: fixed;
  bottom: 1.5em;
  right: 2em;
  z-index: 10;
}
```

**삽입 후**의 모습은 다음과 같아요.

`_sidebar.scss`를 보면 다음과 같이 ========= 부분 **아래**에 추가해주면 된다는 점.

```scss
/* ==========================================================================
   SIDEBAR
   ========================================================================== */

/*
   Default
   ========================================================================== */

.sidebar__top {
  position: fixed;
  bottom: 1.5em;
  right: 2em;
  z-index: 10;
}

.sidebar {
  @include clearfix();
  // @include breakpoint(max-width $large) {
  //   /* fix z-index order of follow links */
  //   position: relative;
  //   z-index: 10;
  //   -webkit-transform: translate3d(0, 0, 0);
  //   transform: translate3d(0, 0, 0);
  // }
  --생략--
```

## 1.2. `_layouts/default.html`에 내용 삽입

삽입할 내용 부분

```html
<aside class="sidebar__top">
<a href="#site-nav"> <i class="fas fa-angle-double-up fa-2x"></i></a>
</aside>
```

**삽입 후**의 모습입니다. 

```<div id="footer" class="page__footer">``` 의 바로 **위**에 추가하면 되구요! 


```html
--생략--
{% raw %}
    {% endif %}
    <aside class="sidebar__top">
    <a href="#site-nav"> <i class="fas fa-angle-double-up fa-2x"></i></a>
    </aside>
    <div id="footer" class="page__footer">
{% endraw %}
--생략--
```
<br>

## 1.3. 확인

아래 이미지처럼 생긴 top 버튼이 생긴 것을 확인 할 수 있습니다. 다른 친구들보다는 매우 간단한 작업이었던... 

![back_to_top](https://user-images.githubusercontent.com/84653623/158626167-9f246219-69cd-429c-b6e3-ccd1920e2a93.png)

<br>


내용이 길어져서 섹션을 나눠서 다음 포스팅에서 또 다른 설정하기를 설명드리도록 하겠습니다!

모두들 즐코하는 하루 보내세요 :P


### 참고


[1] [https://github.com/mmistakes/minimal-mistakes/issues/1731](https://github.com/mmistakes/minimal-mistakes/issues/1731)