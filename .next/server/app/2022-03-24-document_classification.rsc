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
0:{"P":null,"b":"xTAnN8PQ3b6-LdzNENhZ7","p":"","c":["","2022-03-24-document_classification"],"i":false,"f":[[["",{"children":[["slug","2022-03-24-document_classification","d"],{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/51e5ba5c7de07f80.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"min-h-screen flex flex-col font-sans","children":["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]]}],{"children":[["slug","2022-03-24-document_classification","d"],["$","$1","c",{"children":[null,["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L4",[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/5eacd01f773eed7f.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","$L5",null,{"children":["$L6",["$","$L7",null,{"promise":"$@8"}]]}]]}],{},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,[["$","$L9",null,{"children":"$La"}],null],["$","$Lb",null,{"children":["$","div",null,{"hidden":true,"children":["$","$c",null,{"fallback":null,"children":"$Ld"}]}]}]]}],false]],"m":"$undefined","G":["$e",[]],"s":false,"S":true}
f:I[3089,["182","static/chunks/app/%5Bslug%5D/page-ad31c54747687caf.js"],"default"]
10:I[4010,["182","static/chunks/app/%5Bslug%5D/page-ad31c54747687caf.js"],"default"]
11:Tb60,
# 문서 분류 모델 정리

자연어처리의 예제 중 하나인 문서 분류 모델을 구현하기 전에, 우선 문서 분류 모델에 대해 알아보자.

**문서 분류**(document classification)란 문서가 주어졌을 때 해당 문서의 범주를 분류하는 과제이다.

본 과제의 예시를 살펴보면

  - 뉴스를 입력하고 정치, 경제, 연예 등 범주를 맞추기
  
  - 영화 리뷰가 긍정/부정 등 어떤 **극성** (polarity)을 가지는지 분류하기

이번 실습에서 사용할 데이터는 네이버 영화 리뷰 말뭉치(NSMC)이다. 
이번 실습에서 만들 문서 분류 모델은 영화 리뷰 문장을 입력으로 하고 해당 문장이 속한 극성의 확률을 출력한다.
문서 분류 모델의 출력은 확률값이므로 적당한 후처리 과정을 거쳐 **긍정, 부정처럼 사람이 보기에 좋은 형태로 가공한다.**
이를 **감성 분석** (sentiment analysis)라고 한다.

## 모델 구조

본 chapter에서 사용하는 문서 분류 모델은 입력 문장을 토큰화한 뒤 문장 시작과 끝을 알리는 스페셜 토큰 **CLS**와 **SEP**를 각각 원래 토큰 시퀀스 앞뒤에 붙인다.

이를 BERT 모델에 입력하고 문장 수준의 벡터(`pooler_output`)를 뽑는다. 
여기에 작은 추가 모듈을 덧붙여 모델 전체의 출력이 **[해당 문장이 긍정일 확률, 해당 문장이 부정일 확률]** 형태가 되도록 한다.

### 그림 1. 문서 분류

![문서 분류](https://user-images.githubusercontent.com/84653623/156362925-f4488adb-857f-4b49-92e4-a6db61554b9f.png)

## 태스크 모듈

`pooler_output` 벡터 뒤에 붙는 추가 모듈의 구조는 아래의 그림과 동일하다. 우선 `pooler_output`벡터 **(그림에서 x)** 에 드롭아웃을 적용한다.
드롭아웃을 적용한다는 의미는 그림에서 입력 벡터 x의 768개 요솟값 가운데 일부를 랜덤으로 0으로 바꿔 이후 계산에 포함하지 않도록 하는 것이다.

### 그림 2. 문서 분류 태스크 모듈

![문서 분류 태스크 모듈](https://user-images.githubusercontent.com/84653623/156363232-3c63964a-6ad9-4dd8-b4cb-2424a31a8ae7.png)

그 다음 가중치 행렬을 곱해 `pooler_output`을 분류해야 할 범주 수만큼의 차원을 갖는 벡터로 변환한다 **(그림에서 net)**.
만일 `pooler_output`벡터가 768차원이고 분류 대상 범주 수가 2개(**긍정, 부정**)라면 가중치 행렬의 크기는 768 * 2이 된다.
여기에 소프트맥스 함수를 취하면 모델의 최종 출력 **(그림에서 y)** 이 된다. 

이렇게 만든 모델의 최종 출력과 정답 레이블을 비교해 모델 출력이 정답 레이블과 최대한 같아지도록 태스크 모듈과 BERT 레이어를 포함한 모델 전체를 업데이트 한다.
이를 **파인튜닝**(fine-tuning)이라고 한다.
4:["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[NLP] 문서 분류 모델"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"$D2022-03-25T00:00:00.000Z","children":"March 25, 2022"}],"$undefined"]}]]}],[["$","h1","h1-0",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"문서 분류 모델 정리"}],"\n",["$","p","p-0",{"children":"자연어처리의 예제 중 하나인 문서 분류 모델을 구현하기 전에, 우선 문서 분류 모델에 대해 알아보자."}],"\n",["$","p","p-1",{"children":[["$","strong","strong-0",{"children":"문서 분류"}],"(document classification)란 문서가 주어졌을 때 해당 문서의 범주를 분류하는 과제이다."]}],"\n",["$","p","p-2",{"children":"본 과제의 예시를 살펴보면"}],"\n",["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":["\n",["$","p","p-0",{"children":"뉴스를 입력하고 정치, 경제, 연예 등 범주를 맞추기"}],"\n"]}],"\n",["$","li","li-1",{"children":["\n",["$","p","p-0",{"children":["영화 리뷰가 긍정/부정 등 어떤 ",["$","strong","strong-0",{"children":"극성"}]," (polarity)을 가지는지 분류하기"]}],"\n"]}],"\n"]}],"\n",["$","p","p-3",{"children":["이번 실습에서 사용할 데이터는 네이버 영화 리뷰 말뭉치(NSMC)이다.\n이번 실습에서 만들 문서 분류 모델은 영화 리뷰 문장을 입력으로 하고 해당 문장이 속한 극성의 확률을 출력한다.\n문서 분류 모델의 출력은 확률값이므로 적당한 후처리 과정을 거쳐 ",["$","strong","strong-0",{"children":"긍정, 부정처럼 사람이 보기에 좋은 형태로 가공한다."}],"\n이를 ",["$","strong","strong-1",{"children":"감성 분석"}]," (sentiment analysis)라고 한다."]}],"\n",["$","h2","h2-0",{"id":"","className":"text-2xl font-bold mt-8 mb-4","children":"모델 구조"}],"\n",["$","p","p-4",{"children":["본 chapter에서 사용하는 문서 분류 모델은 입력 문장을 토큰화한 뒤 문장 시작과 끝을 알리는 스페셜 토큰 ",["$","strong","strong-0",{"children":"CLS"}],"와 ",["$","strong","strong-1",{"children":"SEP"}],"를 각각 원래 토큰 시퀀스 앞뒤에 붙인다."]}],"\n",["$","p","p-5",{"children":["이를 BERT 모델에 입력하고 문장 수준의 벡터(",["$","code","code-0",{"children":"pooler_output"}],")를 뽑는다.\n여기에 작은 추가 모듈을 덧붙여 모델 전체의 출력이 ",["$","strong","strong-0",{"children":"[해당 문장이 긍정일 확률, 해당 문장이 부정일 확률]"}]," 형태가 되도록 한다."]}],"\n",["$","h3","h3-0",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"그림 1. 문서 분류"}],"\n",["$","p","p-6",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/156362925-f4488adb-857f-4b49-92e4-a6db61554b9f.png","alt":"문서 분류"}]}],"\n",["$","h2","h2-1",{"id":"","className":"text-2xl font-bold mt-8 mb-4","children":"태스크 모듈"}],"\n",["$","p","p-7",{"children":[["$","code","code-0",{"children":"pooler_output"}]," 벡터 뒤에 붙는 추가 모듈의 구조는 아래의 그림과 동일하다. 우선 ",["$","code","code-1",{"children":"pooler_output"}],"벡터 ",["$","strong","strong-0",{"children":"(그림에서 x)"}]," 에 드롭아웃을 적용한다.\n드롭아웃을 적용한다는 의미는 그림에서 입력 벡터 x의 768개 요솟값 가운데 일부를 랜덤으로 0으로 바꿔 이후 계산에 포함하지 않도록 하는 것이다."]}],"\n",["$","h3","h3-1",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"그림 2. 문서 분류 태스크 모듈"}],"\n",["$","p","p-8",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/156363232-3c63964a-6ad9-4dd8-b4cb-2424a31a8ae7.png","alt":"문서 분류 태스크 모듈"}]}],"\n",["$","p","p-9",{"children":["그 다음 가중치 행렬을 곱해 ",["$","code","code-0",{"children":"pooler_output"}],"을 분류해야 할 범주 수만큼의 차원을 갖는 벡터로 변환한다 ",["$","strong","strong-0",{"children":"(그림에서 net)"}],".\n만일 ",["$","code","code-1",{"children":"pooler_output"}],"벡터가 768차원이고 분류 대상 범주 수가 2개(",["$","strong","strong-1",{"children":"긍정, 부정"}],")라면 가중치 행렬의 크기는 768 * 2이 된다.\n여기에 소프트맥스 함수를 취하면 모델의 최종 출력 ",["$","strong","strong-2",{"children":"(그림에서 y)"}]," 이 된다."]}],"\n",["$","p","p-10",{"children":["이렇게 만든 모델의 최종 출력과 정답 레이블을 비교해 모델 출력이 정답 레이블과 최대한 같아지도록 태스크 모듈과 BERT 레이어를 포함한 모델 전체를 업데이트 한다.\n이를 ",["$","strong","strong-0",{"children":"파인튜닝"}],"(fine-tuning)이라고 한다."]}]],["$","$Lf",null,{}]]}],["$","$L10",null,{"content":"$11"}]]}]
a:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
6:null
8:{"metadata":[["$","title","0",{"children":"Sehoon's Workspace"}],["$","meta","1",{"name":"description","content":"Welcome to my page!"}]],"error":null,"digest":"$undefined"}
d:"$8:metadata"
