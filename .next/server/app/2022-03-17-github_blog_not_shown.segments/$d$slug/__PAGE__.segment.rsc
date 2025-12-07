1:"$Sreact.fragment"
2:I[24170,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
3:I[55132,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
8:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/865c404e1d9a0c65.js"],"OutletBoundary"]
9:"$Sreact.suspense"
:HL["/_next/static/chunks/b9ef641e76e3a351.css","style"]
4:Ta3b,
# 문제 상황 

오늘 새벽, 내 블로그에 글을 게시하고서 자야지 했는데 분명 로컬 서버에는 등록이 되었는데 블로그에는 안뜨는 오류가 발생했다.

`_posts` 에 `.md` 파일을 추가했으나 실제 내 블로그에 글이 안올라오는 것이다. 내 로컬 서버 (localhost:4000)에는 올라왔으나, push를 진행한 이후 실제 페이지에는 글이 보이지 않았다.

파일 이름과 카테고리 등을 계속 확인하고 또 확인했다.

이전에 블로그 셋팅하면서 이상한 걸 만진건 아닐까 하면서 이것저것 찾아봤는데.. 글은 올라오지 않았다.

이제 막 시작했는데, 다시 해야한다는 점이 너무 아쉬웠어서 이대로 포기할 수 없다는 생각으로 영어로 열심히 검색하여 이것저것 시도를 해보았다.

<br>

# 해결 방법

우선 md의 기본 원칙을 살펴본다!

다음의 내용들은 기본적으로 지켜야 하는 것이다.

1. `YEAR-MONTH-DAY-title.md` 파일 제목 형식을 확인.
2. 포스팅 날짜 맞게 입력했는지 확인.
3. `_post` 폴더에 맞게 위치해 있는지 확인.
4. 카테고리 맞게 입력 했는지, 해당 카테고리 존재하는지 확인.

<br>

위 사항들은 다 지켰는데... 왜 안되는 것일까..

스택오버플로우랑 구글링을 통해서 시도해 본 사항들은 아래와 같다.

1. `_config.yml`에 `future: true` 추가.
2. 페이지 옵션(타이틀, 카테고리 적는 곳)에 `published: true` 추가.
3. `index.html`에 공백이라도 추가해서 변경사항을 만들고 push.
4. `jekyll build --verbose`로 skip된 것이 있는지 확인.

<br>

본인은 1, 2번 사항을 추가하여 해결할 수 있었다. 해당 변경사항은 다음과 같다. → [dbf7205](https://github.com/sehooni/sehooni.github.io/commit/29cf4e1c62a51ef759becb842188f90970c5dc38)

혹시 위 항목들을 해봐도 해결이 되지 않는다면 아래 '참고자료'에 링크한 스택오버플로우 글들을 살펴보는 것을 추천한다:)
또한 다음 깃허브 블로그에서 최종적으로 찾아서 해결하였으니 같이 업로드를 해놓는다.

<br>

# 참고자료

- [devyuseon.github.io](https://devyuseon.github.io/github%20blog/githubblog-post-not-shown/)
- [jekyll-post-not-generated](https://stackoverflow.com/questions/30625044/jekyll-post-not-generated)
- [github-pages-are-not-updating](https://stackoverflow.com/questions/20422279/github-pages-are-not-updating)
- [jekyll-not-generating-posts](https://stackoverflow.com/questions/16990138/jekyll-not-generating-posts)0:{"buildId":"8lJiHtAmlyU3nNFMbG8_k","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[Blog] github 블로그 포스팅 게시 안되는 오류 해결"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"$D2022-03-17T00:00:00.000Z","children":"March 17, 2022"}],"$undefined"]}]]}],[["$","h1","h1-0",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"문제 상황"}],"\n",["$","p","p-0",{"children":"오늘 새벽, 내 블로그에 글을 게시하고서 자야지 했는데 분명 로컬 서버에는 등록이 되었는데 블로그에는 안뜨는 오류가 발생했다."}],"\n",["$","p","p-1",{"children":[["$","code","code-0",{"children":"_posts"}]," 에 ",["$","code","code-1",{"children":".md"}]," 파일을 추가했으나 실제 내 블로그에 글이 안올라오는 것이다. 내 로컬 서버 (localhost:4000)에는 올라왔으나, push를 진행한 이후 실제 페이지에는 글이 보이지 않았다."]}],"\n",["$","p","p-2",{"children":"파일 이름과 카테고리 등을 계속 확인하고 또 확인했다."}],"\n",["$","p","p-3",{"children":"이전에 블로그 셋팅하면서 이상한 걸 만진건 아닐까 하면서 이것저것 찾아봤는데.. 글은 올라오지 않았다."}],"\n",["$","p","p-4",{"children":"이제 막 시작했는데, 다시 해야한다는 점이 너무 아쉬웠어서 이대로 포기할 수 없다는 생각으로 영어로 열심히 검색하여 이것저것 시도를 해보았다."}],"\n",["$","br","br-0",{}],"\n",["$","h1","h1-1",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"해결 방법"}],"\n",["$","p","p-5",{"children":"우선 md의 기본 원칙을 살펴본다!"}],"\n",["$","p","p-6",{"children":"다음의 내용들은 기본적으로 지켜야 하는 것이다."}],"\n",["$","ol","ol-0",{"children":["\n",["$","li","li-0",{"children":[["$","code","code-0",{"children":"YEAR-MONTH-DAY-title.md"}]," 파일 제목 형식을 확인."]}],"\n",["$","li","li-1",{"children":"포스팅 날짜 맞게 입력했는지 확인."}],"\n",["$","li","li-2",{"children":[["$","code","code-0",{"children":"_post"}]," 폴더에 맞게 위치해 있는지 확인."]}],"\n",["$","li","li-3",{"children":"카테고리 맞게 입력 했는지, 해당 카테고리 존재하는지 확인."}],"\n"]}],"\n",["$","br","br-1",{}],"\n",["$","p","p-7",{"children":"위 사항들은 다 지켰는데... 왜 안되는 것일까.."}],"\n",["$","p","p-8",{"children":"스택오버플로우랑 구글링을 통해서 시도해 본 사항들은 아래와 같다."}],"\n",["$","ol","ol-1",{"children":["\n",["$","li","li-0",{"children":[["$","code","code-0",{"children":"_config.yml"}],"에 ",["$","code","code-1",{"children":"future: true"}]," 추가."]}],"\n",["$","li","li-1",{"children":["페이지 옵션(타이틀, 카테고리 적는 곳)에 ",["$","code","code-0",{"children":"published: true"}]," 추가."]}],"\n",["$","li","li-2",{"children":[["$","code","code-0",{"children":"index.html"}],"에 공백이라도 추가해서 변경사항을 만들고 push."]}],"\n",["$","li","li-3",{"children":[["$","code","code-0",{"children":"jekyll build --verbose"}],"로 skip된 것이 있는지 확인."]}],"\n"]}],"\n",["$","br","br-2",{}],"\n",["$","p","p-9",{"children":["본인은 1, 2번 사항을 추가하여 해결할 수 있었다. 해당 변경사항은 다음과 같다. → ",["$","a","a-0",{"href":"https://github.com/sehooni/sehooni.github.io/commit/29cf4e1c62a51ef759becb842188f90970c5dc38","children":"dbf7205"}]]}],"\n",["$","p","p-10",{"children":"혹시 위 항목들을 해봐도 해결이 되지 않는다면 아래 '참고자료'에 링크한 스택오버플로우 글들을 살펴보는 것을 추천한다:)\n또한 다음 깃허브 블로그에서 최종적으로 찾아서 해결하였으니 같이 업로드를 해놓는다."}],"\n",["$","br","br-3",{}],"\n",["$","h1","h1-2",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"참고자료"}],"\n",["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":["$","a","a-0",{"href":"https://devyuseon.github.io/github%20blog/githubblog-post-not-shown/","children":"devyuseon.github.io"}]}],"\n",["$","li","li-1",{"children":["$","a","a-0",{"href":"https://stackoverflow.com/questions/30625044/jekyll-post-not-generated","children":"jekyll-post-not-generated"}]}],"\n",["$","li","li-2",{"children":["$","a","a-0",{"href":"https://stackoverflow.com/questions/20422279/github-pages-are-not-updating","children":"github-pages-are-not-updating"}]}],"\n",["$","li","li-3",{"children":["$","a","a-0",{"href":"https://stackoverflow.com/questions/16990138/jekyll-not-generating-posts","children":"jekyll-not-generating-posts"}]}],"\n"]}]],["$","$L2",null,{}]]}],["$","$L3",null,{"content":"$4"}]]}],["$L5","$L6"],"$L7"]}],"loading":null,"isPartial":false}
5:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/b9ef641e76e3a351.css","precedence":"next"}]
6:["$","script","script-0",{"src":"/_next/static/chunks/6b8d09032578b975.js","async":true}]
7:["$","$L8",null,{"children":["$","$9",null,{"name":"Next.MetadataOutlet","children":"$@a"}]}]
a:null
