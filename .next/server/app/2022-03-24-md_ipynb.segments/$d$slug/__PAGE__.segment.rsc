1:"$Sreact.fragment"
2:I[24170,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
3:I[55132,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
8:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/865c404e1d9a0c65.js"],"OutletBoundary"]
9:"$Sreact.suspense"
:HL["/_next/static/chunks/b9ef641e76e3a351.css","style"]
4:T6f9,
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

이제 이 파일들을 모두 add/commit/push하면 Github 블로그에 포스팅이 추가되는 것을 확인할 수 있다.0:{"buildId":"8lJiHtAmlyU3nNFMbG8_k","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[마크다운] Jupyter notebook을 Markdown으로 변환하는 방법"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"2022-03-24","children":"March 24, 2022"}],"$undefined"]}]]}],[["$","p","p-0",{"children":["자연어처리(NLP) 공부를 하면서 정리해놓은 ",["$","code","code-0",{"children":".ipynb"}],"파일이 꽤나 많아졌다. 이러한 내용들을 블로그에 업로드하려면 결국 ",["$","code","code-1",{"children":".md"}],"로 바꿔줘야 한다."]}],"\n",["$","p","p-1",{"children":"그렇다면 어떠한 방법을 사용해야할까?"}],"\n",["$","h2","h2-0",{"className":"text-2xl font-bold mt-8 mb-4","children":["$","code","code-0",{"children":"nbconvert"}]}],"\n",["$","p","p-2",{"children":[["$","code","code-0",{"children":"nbconvert"}],"는 jupyter notebook을 markdown 파일 혹은 html파일로 변환해주는 프로그램이다."]}],"\n",["$","p","p-3",{"children":"아래의 명령어를 통해 설치할 수 있다."}],"\n",["$","pre","pre-0",{"children":["$","code","code-0",{"className":"hljs language-bash","children":[["$","span","span-0",{"className":"hljs-comment","children":"# pip을 통해 nbconvert 설치"}],"\npip install nbconvert\n"]}]}],"\n",["$","pre","pre-1",{"children":["$","code","code-0",{"className":"hljs language-bash","children":[["$","span","span-0",{"className":"hljs-comment","children":"# conda를 통해 nbconvert 설치"}],"\nconda install nbconvert\n"]}]}],"\n",["$","p","p-4",{"children":"예를 들어 살펴보자."}],"\n",["$","p","p-5",{"children":[["$","code","code-0",{"children":"Hello.ipynb"}],"라는 jupyter notebook 파일을 markdown 파일로 변환하고 싶다면?\n이를 위해 먼저 ",["$","code","code-1",{"children":"Hello.ipynb"}]," 파일이 있는 경로로 이동한다. 그 뒤, 아래의 명령어를 실행한다."]}],"\n",["$","pre","pre-2",{"children":["$","code","code-0",{"className":"hljs language-bash","children":"jupyter nbconvert --to markdown Hello.ipynb\n"}]}],"\n",["$","p","p-6",{"children":"위의 명령어는 해당 경로에 다음의 두 가지 결과물을 생성한다."}],"\n",["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":[["$","code","code-0",{"children":"Hello.md"}]," : markdown 파일"]}],"\n",["$","li","li-1",{"children":[["$","code","code-0",{"children":"Hello_files"}]," : markdown 파일에 포함되어 있는 모든 이미지들을 모아놓은 폴더"]}],"\n"]}],"\n",["$","p","p-7",{"children":"이를 활용하여 Github 블로그에 포스팅 하기 위해서는 다음과 같은 작업을 거쳐야 한다."}],"\n",["$","ol","ol-0",{"children":["\n",["$","li","li-0",{"children":[["$","code","code-0",{"children":"Hello.md"}]," 파일 내 상단에 YAML 부분을 추가한다."]}],"\n",["$","li","li-1",{"children":[["$","code","code-0",{"children":"Hello.md"}]," 파일 내 이미지들의 경로를 블로그의 이미지 경로 형태로 수정한다."]}],"\n",["$","li","li-2",{"children":[["$","code","code-0",{"children":"Hello.md"}]," 파일의 파일명을 날짜(date)와 제목(title)을 포함하는 ",["$","code","code-1",{"children":"YYYY-MM-DD-TITLE.md"}]," 형태로 바꿔준다."]}],"\n",["$","li","li-3",{"children":["이 ",["$","code","code-0",{"children":"YYYY-MM-DD-TITLE.md"}]," 파일을 블로그의 ",["$","code","code-1",{"children":"_posts"}]," 폴더로 이동시킨다."]}],"\n",["$","li","li-4",{"children":[["$","code","code-0",{"children":"Hello_files"}]," 폴더를 블로그의 ",["$","code","code-1",{"children":"images"}]," 폴더로 이동시킨다."]}],"\n"]}],"\n",["$","p","p-8",{"children":"이제 이 파일들을 모두 add/commit/push하면 Github 블로그에 포스팅이 추가되는 것을 확인할 수 있다."}]],["$","$L2",null,{}]]}],["$","$L3",null,{"content":"$4"}]]}],["$L5","$L6"],"$L7"]}],"loading":null,"isPartial":false}
5:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/b9ef641e76e3a351.css","precedence":"next"}]
6:["$","script","script-0",{"src":"/_next/static/chunks/6b8d09032578b975.js","async":true}]
7:["$","$L8",null,{"children":["$","$9",null,{"name":"Next.MetadataOutlet","children":"$@a"}]}]
a:null
