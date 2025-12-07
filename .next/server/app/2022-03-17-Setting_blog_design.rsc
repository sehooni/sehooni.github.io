1:"$Sreact.fragment"
2:I[9766,[],""]
3:I[8924,[],""]
5:I[4431,[],"OutletBoundary"]
7:I[5278,[],"AsyncMetadataOutlet"]
9:I[4431,[],"ViewportBoundary"]
b:I[4431,[],"MetadataBoundary"]
c:"$Sreact.suspense"
e:I[7150,[],""]
:HL["/_next/static/css/51e5ba5c7de07f80.css","style"]
:HL["/_next/static/css/5eacd01f773eed7f.css","style"]
0:{"P":null,"b":"xTAnN8PQ3b6-LdzNENhZ7","p":"","c":["","2022-03-17-Setting_blog_design"],"i":false,"f":[[["",{"children":[["slug","2022-03-17-Setting_blog_design","d"],{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/51e5ba5c7de07f80.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"min-h-screen flex flex-col font-sans","children":["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]]}],{"children":[["slug","2022-03-17-Setting_blog_design","d"],["$","$1","c",{"children":[null,["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L4",[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/5eacd01f773eed7f.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","$L5",null,{"children":["$L6",["$","$L7",null,{"promise":"$@8"}]]}]]}],{},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,[["$","$L9",null,{"children":"$La"}],null],["$","$Lb",null,{"children":["$","div",null,{"hidden":true,"children":["$","$c",null,{"fallback":null,"children":"$Ld"}]}]}]]}],false]],"m":"$undefined","G":["$e",[]],"s":false,"S":true}
4:["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[Blog] 블로그 setting 하기(back_to_top)"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"2022-03-17","children":"March 17, 2022"}],"$undefined"]}]]}],[["$","p","p-0",{"children":"블로그를 setting하는데 거의 3일을 투자한 것 같네요."}],"\n",["$","p","p-1",{"children":"이 블로그가 메인이 아닌, 공부내용을 업로드하면서 git과 css를 동시에 짬내서 공부하는 느낌인지라..!!"}],"\n",["$","p","p-2",{"children":"또 개강도 했고, 대학원 준비도 하고... 이래저래 정신이 없었지만"}],"\n",["$","p","p-3",{"children":"거두절미하고 포스팅을 이어나가 보도록 하겠습니다."}],"\n",["$","p","p-4",{"children":"다른 분들의 repo도 참고하고, 또 기본의 repo를 보면서 이것저것 setting을 진행하였습니다! :)"}],"\n",["$","h1","h1-0",{"id":"1","className":"text-3xl font-bold mt-8 mb-4","children":"1. minimal-mistakes-theme에서 back to top 버튼 만들기"}],"\n",["$","h2","h2-0",{"id":"1-1","className":"text-2xl font-bold mt-8 mb-4","children":["1.1. ",["$","code","code-0",{"children":"_sass/minimal-mistakes/_sidebar.scss"}],"에서 아래 내용 삽입"]}],"\n",["$","p","p-5",{"children":"삽입할 내용은 다음과 같아요! 다음 내용의 수정을 통해서 위치 조정 또한 가능하답니다."}],"\n",["$","pre","pre-0",{"children":["$","code","code-0",{"className":"hljs language-scss","children":[["$","span","span-0",{"className":"hljs-selector-class","children":".sidebar__top"}]," {\n  ",["$","span","span-1",{"className":"hljs-attribute","children":"position"}],": fixed;\n  ",["$","span","span-2",{"className":"hljs-attribute","children":"bottom"}],": ",["$","span","span-3",{"className":"hljs-number","children":"1.5em"}],";\n  ",["$","span","span-4",{"className":"hljs-attribute","children":"right"}],": ",["$","span","span-5",{"className":"hljs-number","children":"2em"}],";\n  ",["$","span","span-6",{"className":"hljs-attribute","children":"z-index"}],": ",["$","span","span-7",{"className":"hljs-number","children":"10"}],";\n}\n"]}]}],"\n",["$","p","p-6",{"children":[["$","strong","strong-0",{"children":"삽입 후"}],"의 모습은 다음과 같아요."]}],"\n",["$","p","p-7",{"children":[["$","code","code-0",{"children":"_sidebar.scss"}],"를 보면 다음과 같이 ========= 부분 ",["$","strong","strong-0",{"children":"아래"}],"에 추가해주면 된다는 점."]}],"\n",["$","pre","pre-1",{"children":["$","code","code-0",{"className":"hljs language-scss","children":[["$","span","span-0",{"className":"hljs-comment","children":"/* ==========================================================================\n   SIDEBAR\n   ========================================================================== */"}],"\n\n",["$","span","span-1",{"className":"hljs-comment","children":"/*\n   Default\n   ========================================================================== */"}],"\n\n",["$","span","span-2",{"className":"hljs-selector-class","children":".sidebar__top"}]," {\n  ",["$","span","span-3",{"className":"hljs-attribute","children":"position"}],": fixed;\n  ",["$","span","span-4",{"className":"hljs-attribute","children":"bottom"}],": ",["$","span","span-5",{"className":"hljs-number","children":"1.5em"}],";\n  ",["$","span","span-6",{"className":"hljs-attribute","children":"right"}],": ",["$","span","span-7",{"className":"hljs-number","children":"2em"}],";\n  ",["$","span","span-8",{"className":"hljs-attribute","children":"z-index"}],": ",["$","span","span-9",{"className":"hljs-number","children":"10"}],";\n}\n\n",["$","span","span-10",{"className":"hljs-selector-class","children":".sidebar"}]," {\n  ",["$","span","span-11",{"className":"hljs-keyword","children":"@include"}]," clearfix();\n  ",["$","span","span-12",{"className":"hljs-comment","children":"// @include breakpoint(max-width $large) {"}],"\n  ",["$","span","span-13",{"className":"hljs-comment","children":"//   /* fix z-index order of follow links */"}],"\n  ",["$","span","span-14",{"className":"hljs-comment","children":"//   position: relative;"}],"\n  ",["$","span","span-15",{"className":"hljs-comment","children":"//   z-index: 10;"}],"\n  ",["$","span","span-16",{"className":"hljs-comment","children":"//   -webkit-transform: translate3d(0, 0, 0);"}],"\n  ","$Lf","\n  ","$L10","\n  --생략--\n"]}]}],"\n","$L11","\n","$L12","\n","$L13","\n","$L14","\n","$L15","\n","$L16","\n","$L17","\n","$L18","\n","$L19","\n","$L1a","\n","$L1b","\n","$L1c","\n","$L1d","\n","$L1e","\n","$L1f"],"$L20"]}],"$L21"]}]
22:I[3089,["182","static/chunks/app/%5Bslug%5D/page-ad31c54747687caf.js"],"default"]
23:I[4010,["182","static/chunks/app/%5Bslug%5D/page-ad31c54747687caf.js"],"default"]
f:["$","span","span-17",{"className":"hljs-comment","children":"//   transform: translate3d(0, 0, 0);"}]
10:["$","span","span-18",{"className":"hljs-comment","children":"// }"}]
11:["$","h2","h2-1",{"id":"1-2","className":"text-2xl font-bold mt-8 mb-4","children":["1.2. ",["$","code","code-0",{"children":"_layouts/default.html"}],"에 내용 삽입"]}]
12:["$","p","p-8",{"children":"삽입할 내용 부분"}]
13:["$","pre","pre-2",{"children":["$","code","code-0",{"className":"hljs language-html","children":[["$","span","span-0",{"className":"hljs-tag","children":["<",["$","span","span-0",{"className":"hljs-name","children":"aside"}]," ",["$","span","span-1",{"className":"hljs-attr","children":"class"}],"=",["$","span","span-2",{"className":"hljs-string","children":"\"sidebar__top\""}],">"]}],"\n",["$","span","span-1",{"className":"hljs-tag","children":["<",["$","span","span-0",{"className":"hljs-name","children":"a"}]," ",["$","span","span-1",{"className":"hljs-attr","children":"href"}],"=",["$","span","span-2",{"className":"hljs-string","children":"\"#site-nav\""}],">"]}]," ",["$","span","span-2",{"className":"hljs-tag","children":["<",["$","span","span-0",{"className":"hljs-name","children":"i"}]," ",["$","span","span-1",{"className":"hljs-attr","children":"class"}],"=",["$","span","span-2",{"className":"hljs-string","children":"\"fas fa-angle-double-up fa-2x\""}],">"]}],["$","span","span-3",{"className":"hljs-tag","children":["</",["$","span","span-0",{"className":"hljs-name","children":"i"}],">"]}],["$","span","span-4",{"className":"hljs-tag","children":["</",["$","span","span-0",{"className":"hljs-name","children":"a"}],">"]}],"\n",["$","span","span-5",{"className":"hljs-tag","children":["</",["$","span","span-0",{"className":"hljs-name","children":"aside"}],">"]}],"\n"]}]}]
14:["$","p","p-9",{"children":[["$","strong","strong-0",{"children":"삽입 후"}],"의 모습입니다."]}]
15:["$","p","p-10",{"children":[["$","code","code-0",{"children":"<div id=\"footer\" class=\"page__footer\">"}]," 의 바로 ",["$","strong","strong-0",{"children":"위"}],"에 추가하면 되구요!"]}]
16:["$","pre","pre-3",{"children":["$","code","code-0",{"className":"hljs language-html","children":["--생략--\n{% raw %}\n    {% endif %}\n    ",["$","span","span-0",{"className":"hljs-tag","children":["<",["$","span","span-0",{"className":"hljs-name","children":"aside"}]," ",["$","span","span-1",{"className":"hljs-attr","children":"class"}],"=",["$","span","span-2",{"className":"hljs-string","children":"\"sidebar__top\""}],">"]}],"\n    ",["$","span","span-1",{"className":"hljs-tag","children":["<",["$","span","span-0",{"className":"hljs-name","children":"a"}]," ",["$","span","span-1",{"className":"hljs-attr","children":"href"}],"=",["$","span","span-2",{"className":"hljs-string","children":"\"#site-nav\""}],">"]}]," ",["$","span","span-2",{"className":"hljs-tag","children":["<",["$","span","span-0",{"className":"hljs-name","children":"i"}]," ",["$","span","span-1",{"className":"hljs-attr","children":"class"}],"=",["$","span","span-2",{"className":"hljs-string","children":"\"fas fa-angle-double-up fa-2x\""}],">"]}],["$","span","span-3",{"className":"hljs-tag","children":["</",["$","span","span-0",{"className":"hljs-name","children":"i"}],">"]}],["$","span","span-4",{"className":"hljs-tag","children":["</",["$","span","span-0",{"className":"hljs-name","children":"a"}],">"]}],"\n    ",["$","span","span-5",{"className":"hljs-tag","children":["</",["$","span","span-0",{"className":"hljs-name","children":"aside"}],">"]}],"\n    ",["$","span","span-6",{"className":"hljs-tag","children":["<",["$","span","span-0",{"className":"hljs-name","children":"div"}]," ",["$","span","span-1",{"className":"hljs-attr","children":"id"}],"=",["$","span","span-2",{"className":"hljs-string","children":"\"footer\""}]," ",["$","span","span-3",{"className":"hljs-attr","children":"class"}],"=",["$","span","span-4",{"className":"hljs-string","children":"\"page__footer\""}],">"]}],"\n{% endraw %}\n--생략--\n"]}]}]
17:["$","br","br-0",{}]
18:["$","h2","h2-2",{"id":"1","className":"text-2xl font-bold mt-8 mb-4","children":"1.3. 확인"}]
19:["$","p","p-11",{"children":"아래 이미지처럼 생긴 top 버튼이 생긴 것을 확인 할 수 있습니다. 다른 친구들보다는 매우 간단한 작업이었던..."}]
1a:["$","p","p-12",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/158626167-9f246219-69cd-429c-b6e3-ccd1920e2a93.png","alt":"back_to_top"}]}]
1b:["$","br","br-1",{}]
1c:["$","p","p-13",{"children":"내용이 길어져서 섹션을 나눠서 다음 포스팅에서 또 다른 설정하기를 설명드리도록 하겠습니다!"}]
1d:["$","p","p-14",{"children":"모두들 즐코하는 하루 보내세요 :P"}]
1e:["$","h3","h3-0",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"참고"}]
1f:["$","p","p-15",{"children":["[1] ",["$","a","a-0",{"href":"https://github.com/mmistakes/minimal-mistakes/issues/1731","children":"https://github.com/mmistakes/minimal-mistakes/issues/1731"}]]}]
20:["$","$L22",null,{}]
24:Tb09,
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


[1] [https://github.com/mmistakes/minimal-mistakes/issues/1731](https://github.com/mmistakes/minimal-mistakes/issues/1731)21:["$","$L23",null,{"content":"$24"}]
a:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
6:null
8:{"metadata":[["$","title","0",{"children":"Sehoon's Workspace"}],["$","meta","1",{"name":"description","content":"Welcome to my page!"}]],"error":null,"digest":"$undefined"}
d:"$8:metadata"
