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
0:{"P":null,"b":"xTAnN8PQ3b6-LdzNENhZ7","p":"","c":["","2022-03-24-md_ipynb"],"i":false,"f":[[["",{"children":[["slug","2022-03-24-md_ipynb","d"],{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/51e5ba5c7de07f80.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"min-h-screen flex flex-col font-sans","children":["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]]}],{"children":[["slug","2022-03-24-md_ipynb","d"],["$","$1","c",{"children":[null,["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L4",[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/5eacd01f773eed7f.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","$L5",null,{"children":["$L6",["$","$L7",null,{"promise":"$@8"}]]}]]}],{},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,[["$","$L9",null,{"children":"$La"}],null],["$","$Lb",null,{"children":["$","div",null,{"hidden":true,"children":["$","$c",null,{"fallback":null,"children":"$Ld"}]}]}]]}],false]],"m":"$undefined","G":["$e",[]],"s":false,"S":true}
f:I[3089,["182","static/chunks/app/%5Bslug%5D/page-ad31c54747687caf.js"],"default"]
10:I[4010,["182","static/chunks/app/%5Bslug%5D/page-ad31c54747687caf.js"],"default"]
11:T6f9,
자연어처리(NLP) 공부를 하면서 정리해놓은 `.ipynb`파일이 꽤나 많아졌다. 이러한 내용들을 블로그에 업로드하려면 결국 `.md`로 바꿔줘야 한다.

그렇다면 어떠한 방법을 사용해야할까?

## `nbconvert`

`nbconvert`는 jupyter notebook을 markdown 파일 혹은 html파일로 변환해주는 프로그램이다.

아래의 명령어를 통해 설치할 수 있다.

```bash
# pip을 통해 nbconvert 설치
pip install nbconvert
```

```bash
# conda를 통해 nbconvert 설치
conda install nbconvert
```

예를 들어 살펴보자.

`Hello.ipynb`라는 jupyter notebook 파일을 markdown 파일로 변환하고 싶다면?
이를 위해 먼저 `Hello.ipynb` 파일이 있는 경로로 이동한다. 그 뒤, 아래의 명령어를 실행한다.

```bash
jupyter nbconvert --to markdown Hello.ipynb
```

위의 명령어는 해당 경로에 다음의 두 가지 결과물을 생성한다.

- `Hello.md` : markdown 파일
- `Hello_files` : markdown 파일에 포함되어 있는 모든 이미지들을 모아놓은 폴더

이를 활용하여 Github 블로그에 포스팅 하기 위해서는 다음과 같은 작업을 거쳐야 한다.

1. `Hello.md` 파일 내 상단에 YAML 부분을 추가한다.
2. `Hello.md` 파일 내 이미지들의 경로를 블로그의 이미지 경로 형태로 수정한다.
3. `Hello.md` 파일의 파일명을 날짜(date)와 제목(title)을 포함하는 `YYYY-MM-DD-TITLE.md` 형태로 바꿔준다.
4. 이 `YYYY-MM-DD-TITLE.md` 파일을 블로그의 `_posts` 폴더로 이동시킨다.
5. `Hello_files` 폴더를 블로그의 `images` 폴더로 이동시킨다.

이제 이 파일들을 모두 add/commit/push하면 Github 블로그에 포스팅이 추가되는 것을 확인할 수 있다.4:["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[마크다운] Jupyter notebook을 Markdown으로 변환하는 방법"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"2022-03-24","children":"March 24, 2022"}],"$undefined"]}]]}],[["$","p","p-0",{"children":["자연어처리(NLP) 공부를 하면서 정리해놓은 ",["$","code","code-0",{"children":".ipynb"}],"파일이 꽤나 많아졌다. 이러한 내용들을 블로그에 업로드하려면 결국 ",["$","code","code-1",{"children":".md"}],"로 바꿔줘야 한다."]}],"\n",["$","p","p-1",{"children":"그렇다면 어떠한 방법을 사용해야할까?"}],"\n",["$","h2","h2-0",{"id":"$undefined","className":"text-2xl font-bold mt-8 mb-4","children":["$","code","code-0",{"children":"nbconvert"}]}],"\n",["$","p","p-2",{"children":[["$","code","code-0",{"children":"nbconvert"}],"는 jupyter notebook을 markdown 파일 혹은 html파일로 변환해주는 프로그램이다."]}],"\n",["$","p","p-3",{"children":"아래의 명령어를 통해 설치할 수 있다."}],"\n",["$","pre","pre-0",{"children":["$","code","code-0",{"className":"hljs language-bash","children":[["$","span","span-0",{"className":"hljs-comment","children":"# pip을 통해 nbconvert 설치"}],"\npip install nbconvert\n"]}]}],"\n",["$","pre","pre-1",{"children":["$","code","code-0",{"className":"hljs language-bash","children":[["$","span","span-0",{"className":"hljs-comment","children":"# conda를 통해 nbconvert 설치"}],"\nconda install nbconvert\n"]}]}],"\n",["$","p","p-4",{"children":"예를 들어 살펴보자."}],"\n",["$","p","p-5",{"children":[["$","code","code-0",{"children":"Hello.ipynb"}],"라는 jupyter notebook 파일을 markdown 파일로 변환하고 싶다면?\n이를 위해 먼저 ",["$","code","code-1",{"children":"Hello.ipynb"}]," 파일이 있는 경로로 이동한다. 그 뒤, 아래의 명령어를 실행한다."]}],"\n",["$","pre","pre-2",{"children":["$","code","code-0",{"className":"hljs language-bash","children":"jupyter nbconvert --to markdown Hello.ipynb\n"}]}],"\n",["$","p","p-6",{"children":"위의 명령어는 해당 경로에 다음의 두 가지 결과물을 생성한다."}],"\n",["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":[["$","code","code-0",{"children":"Hello.md"}]," : markdown 파일"]}],"\n",["$","li","li-1",{"children":[["$","code","code-0",{"children":"Hello_files"}]," : markdown 파일에 포함되어 있는 모든 이미지들을 모아놓은 폴더"]}],"\n"]}],"\n",["$","p","p-7",{"children":"이를 활용하여 Github 블로그에 포스팅 하기 위해서는 다음과 같은 작업을 거쳐야 한다."}],"\n",["$","ol","ol-0",{"children":["\n",["$","li","li-0",{"children":[["$","code","code-0",{"children":"Hello.md"}]," 파일 내 상단에 YAML 부분을 추가한다."]}],"\n",["$","li","li-1",{"children":[["$","code","code-0",{"children":"Hello.md"}]," 파일 내 이미지들의 경로를 블로그의 이미지 경로 형태로 수정한다."]}],"\n",["$","li","li-2",{"children":[["$","code","code-0",{"children":"Hello.md"}]," 파일의 파일명을 날짜(date)와 제목(title)을 포함하는 ",["$","code","code-1",{"children":"YYYY-MM-DD-TITLE.md"}]," 형태로 바꿔준다."]}],"\n",["$","li","li-3",{"children":["이 ",["$","code","code-0",{"children":"YYYY-MM-DD-TITLE.md"}]," 파일을 블로그의 ",["$","code","code-1",{"children":"_posts"}]," 폴더로 이동시킨다."]}],"\n",["$","li","li-4",{"children":[["$","code","code-0",{"children":"Hello_files"}]," 폴더를 블로그의 ",["$","code","code-1",{"children":"images"}]," 폴더로 이동시킨다."]}],"\n"]}],"\n",["$","p","p-8",{"children":"이제 이 파일들을 모두 add/commit/push하면 Github 블로그에 포스팅이 추가되는 것을 확인할 수 있다."}]],["$","$Lf",null,{}]]}],["$","$L10",null,{"content":"$11"}]]}]
a:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
6:null
8:{"metadata":[["$","title","0",{"children":"Sehoon's Workspace"}],["$","meta","1",{"name":"description","content":"Welcome to my page!"}]],"error":null,"digest":"$undefined"}
d:"$8:metadata"
