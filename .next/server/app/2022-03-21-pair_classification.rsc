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
0:{"P":null,"b":"xTAnN8PQ3b6-LdzNENhZ7","p":"","c":["","2022-03-21-pair_classification"],"i":false,"f":[[["",{"children":[["slug","2022-03-21-pair_classification","d"],{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/51e5ba5c7de07f80.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"min-h-screen flex flex-col font-sans","children":["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]]}],{"children":[["slug","2022-03-21-pair_classification","d"],["$","$1","c",{"children":[null,["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L4",[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/5eacd01f773eed7f.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","$L5",null,{"children":["$L6",["$","$L7",null,{"promise":"$@8"}]]}]]}],{},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,[["$","$L9",null,{"children":"$La"}],null],["$","$Lb",null,{"children":["$","div",null,{"hidden":true,"children":["$","$c",null,{"fallback":null,"children":"$Ld"}]}]}]]}],false]],"m":"$undefined","G":["$e",[]],"s":false,"S":true}
4:["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[NLP] 문장 쌍 분류 모델"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"$D2022-03-25T00:00:00.000Z","children":"March 25, 2022"}],"$undefined"]}]]}],[["$","h1","h1-0",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"문장 쌍 분류 모델 정리"}],"\n",["$","p","p-0",{"children":"자연어처리의 예제 중 하나인 문장 쌍 분류 모델을 구현하기 전에, 우선 문장 쌍 분류 모델에 대해 알아보자."}],"\n",["$","p","p-1",{"children":["본 chapter에서는 ",["$","strong","strong-0",{"children":"문장 쌍 분류"}],"(sentence pair classification)의 대표 예로 ",["$","strong","strong-1",{"children":"자연어 추론"}],"(natural language inference, NLI) 과제를 실습한다."]}],"\n",["$","p","p-2",{"children":["$","strong","strong-0",{"children":"\"문장 쌍 분류란 문장 2개가 주어졌을 때 해당 문장 사이의 관계가 어떤 범주일지 분류하는 과제다.\""}]}],"\n",["$","p","p-3",{"children":["자연어 추론은 2개의 문장(또는 문서)이 참(entailment), 거짓(contradiction), 중립 또는 판단 불가(neutral)인지 가려내는 것이다.\n여기에서 ",["$","strong","strong-0",{"children":"entailment"}],"는 '함의', ",["$","strong","strong-1",{"children":"contradiction"}],"은 '모순'으로 번역되기도 한다."]}],"\n",["$","p","p-4",{"children":"아래의 예시를 살펴보면"}],"\n",["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":["\n",["$","p","p-0",{"children":"나 출근했어 + 난 백수야   → 거짓"}],"\n"]}],"\n",["$","li","li-1",{"children":["\n",["$","p","p-0",{"children":"나 출근했어 + 난 개발자야  → 중립"}],"\n"]}],"\n"]}],"\n",["$","p","p-5",{"children":"이번 실습에서 사용할 데이터는 업스테이지에서 공개한 NLI데이터셋* 이다.\n이 데이터셋은 전제(premise)에 대한 가설(hypothesis)이 참인지, 거짓인지, 중립인지 정보가 레이블(gold_label)로 주어져 있다."}],"\n",["$","h4","h4-0",{"children":"*klue-benchmark.com/tasks/68/overview/description"}],"\n",["$","p","p-6",{"children":"이번 chapter에서 만들 NLI 과제 수행 모델은 전제와 가설 2개 문장을 입력으로 하고, 두 문장의 관계가 어떤 범주일지 확률을 출력한다.\n그리고 출격을 적당한 후처리 과정을 거쳐 참(entailment), 거짓(contradiction), 중립(neutral) 등 사람이 보기에 좋은 형태로 가공해 준다."}],"\n",["$","h2","h2-0",{"id":"","className":"text-2xl font-bold mt-8 mb-4","children":"모델 구조"}],"\n",["$","p","p-7",{"children":["본 chapter에서 사용하는 문장 쌍 분류 모델은 전제와 가설 두 문장을 각각 토큰화한 뒤 ",["$","strong","strong-0",{"children":"[CLS] + 전제 + [SEP] + 가설 + [SEP]"}]," 형태로 이어 붙인다.\n여기에서 ",["$","strong","strong-1",{"children":"CLS"}],"는 문장 시작을 알리는 스페셜 토큰, ",["$","strong","strong-2",{"children":"SEP"}],"는 전제와 가설을 서로 구분해 주는 스페셜 토큰이다."]}],"\n",["$","p","p-8",{"children":["이를 BERT 모델에 입력하고 문장 수준의 벡터(",["$","code","code-0",{"children":"pooler_output"}],")를 뽑는다. 이 벡터엔 전제와 가설의 의미가 응축되어 있다.\n여기에 작은 추가 모듈을 덧붙여 모델 전체의 출력이 ",["$","strong","strong-0",{"children":"[전제에 대해 가설이 참일 확률, 전제에 대해 가설이 거질일 확률, 전제에 대해 가설이 중립일 확률]"}]," 형태가 되도록 한다."]}],"\n",["$","h3","h3-0",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"그림 1. 문장 쌍 분류"}],"\n",["$","p","p-9",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/156359430-e0d35d51-d1b5-49d4-b0f6-37a5fadf7f6e.png","alt":"문장쌍 분류"}]}],"\n",["$","h2","h2-1",{"id":"","className":"text-2xl font-bold mt-8 mb-4","children":"태스크 모듈"}],"\n",["$","p","p-10",{"children":[["$","code","code-0",{"children":"pooler_output"}]," 벡터 뒤에 붙는 추가 모듈의 구조는 아래의 그림과 동일하다. 우선 ",["$","code","code-1",{"children":"pooler_output"}],"벡터 ",["$","strong","strong-0",{"children":"(그림에서 x)"}]," 에 드롭아웃을 적용한다.\n그 다음 가중치 행렬을 곱해 ",["$","code","code-2",{"children":"pooler_output"}],"을 분류해야 할 범주 수만큼의 차원을 갖는 벡터로 변환한다 ",["$","strong","strong-1",{"children":"(그림에서 net)"}],".\n만일 ",["$","code","code-3",{"children":"pooler_output"}],"벡터가 768차원이고 분류 대상 범주 수가 3개(참, 거짓, 중립)라면 가중치 행렬의 크기는 768 * 3이 된다."]}],"\n",["$","h3","h3-1",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"그림 2. 문장 쌍 분류 태스크 모듈"}],"\n",["$","p","p-11",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/156359238-49dfef62-31d8-4e1a-bd1e-feb38caa74fd.png","alt":"문장 쌍 분류 태스크 모듈"}]}],"\n",["$","p","p-12",{"children":["여기에 소프트맥스 함수를 취하면 모델의 최종 출력 ","$Lf"," 이 된다.\n이렇게 만든 모델의 최종 출력과 정답 레이블을 비교해 모델 출력이 정답 레이블과 최대한 같아지도록 BERT 레이어를 포함한 모델 전체를 업데이트 한다."]}],"\n","$L10"],"$L11"]}],"$L12"]}]
13:I[3089,["182","static/chunks/app/%5Bslug%5D/page-ad31c54747687caf.js"],"default"]
14:I[4010,["182","static/chunks/app/%5Bslug%5D/page-ad31c54747687caf.js"],"default"]
f:["$","strong","strong-0",{"children":"(그림에서 y)"}]
10:["$","p","p-13",{"children":["문장 쌍 분류 태스크 모듈은 ",["$","a","a-0",{"href":"https://github.com/sehooni/nlp_example/blob/main/example/document_classification/document_classification.md","children":"문서 분류 태스크 모듈"}],"과 거의 유사한 모습이다.\n문서 분류 과제를 3개 범주(긍정, 부정, 중립)를 분류하는 태스크로 상정한다면 두 모듈 구조는 똑같다.\n다만 차이는 태스크 모듈의 입력(",["$","code","code-0",{"children":"pooler_output"}],")이 된다.\n즉, ",["$","strong","strong-0",{"children":["$","code","code-0",{"children":"pooler_output"}]}]," 에 문장 1개의 의미가 응축되어 있다면 ",["$","strong","strong-1",{"children":"문서 분류"}],", 2개의 의미가 내포해 있다면 ",["$","strong","strong-2",{"children":"문장 쌍 분류"}]," 과제가 된다."]}]
11:["$","$L13",null,{}]
15:Tff1,
# 문장 쌍 분류 모델 정리

자연어처리의 예제 중 하나인 문장 쌍 분류 모델을 구현하기 전에, 우선 문장 쌍 분류 모델에 대해 알아보자.

본 chapter에서는 **문장 쌍 분류**(sentence pair classification)의 대표 예로 **자연어 추론**(natural language inference, NLI) 과제를 실습한다.

**"문장 쌍 분류란 문장 2개가 주어졌을 때 해당 문장 사이의 관계가 어떤 범주일지 분류하는 과제다."**

자연어 추론은 2개의 문장(또는 문서)이 참(entailment), 거짓(contradiction), 중립 또는 판단 불가(neutral)인지 가려내는 것이다.
여기에서 **entailment**는 '함의', **contradiction**은 '모순'으로 번역되기도 한다. 

아래의 예시를 살펴보면

  - 나 출근했어 + 난 백수야   → 거짓
  
  - 나 출근했어 + 난 개발자야  → 중립

이번 실습에서 사용할 데이터는 업스테이지에서 공개한 NLI데이터셋* 이다.
이 데이터셋은 전제(premise)에 대한 가설(hypothesis)이 참인지, 거짓인지, 중립인지 정보가 레이블(gold_label)로 주어져 있다.

#### *klue-benchmark.com/tasks/68/overview/description
    
이번 chapter에서 만들 NLI 과제 수행 모델은 전제와 가설 2개 문장을 입력으로 하고, 두 문장의 관계가 어떤 범주일지 확률을 출력한다.
그리고 출격을 적당한 후처리 과정을 거쳐 참(entailment), 거짓(contradiction), 중립(neutral) 등 사람이 보기에 좋은 형태로 가공해 준다.

## 모델 구조

본 chapter에서 사용하는 문장 쌍 분류 모델은 전제와 가설 두 문장을 각각 토큰화한 뒤 **[CLS] + 전제 + [SEP] + 가설 + [SEP]** 형태로 이어 붙인다.
여기에서 **CLS**는 문장 시작을 알리는 스페셜 토큰, **SEP**는 전제와 가설을 서로 구분해 주는 스페셜 토큰이다.

이를 BERT 모델에 입력하고 문장 수준의 벡터(`pooler_output`)를 뽑는다. 이 벡터엔 전제와 가설의 의미가 응축되어 있다. 
여기에 작은 추가 모듈을 덧붙여 모델 전체의 출력이 **[전제에 대해 가설이 참일 확률, 전제에 대해 가설이 거질일 확률, 전제에 대해 가설이 중립일 확률]** 형태가 되도록 한다.

### 그림 1. 문장 쌍 분류

![문장쌍 분류](https://user-images.githubusercontent.com/84653623/156359430-e0d35d51-d1b5-49d4-b0f6-37a5fadf7f6e.png)

## 태스크 모듈

`pooler_output` 벡터 뒤에 붙는 추가 모듈의 구조는 아래의 그림과 동일하다. 우선 `pooler_output`벡터 **(그림에서 x)** 에 드롭아웃을 적용한다.
그 다음 가중치 행렬을 곱해 `pooler_output`을 분류해야 할 범주 수만큼의 차원을 갖는 벡터로 변환한다 **(그림에서 net)**.
만일 `pooler_output`벡터가 768차원이고 분류 대상 범주 수가 3개(참, 거짓, 중립)라면 가중치 행렬의 크기는 768 * 3이 된다.

### 그림 2. 문장 쌍 분류 태스크 모듈

![문장 쌍 분류 태스크 모듈](https://user-images.githubusercontent.com/84653623/156359238-49dfef62-31d8-4e1a-bd1e-feb38caa74fd.png)

여기에 소프트맥스 함수를 취하면 모델의 최종 출력 **(그림에서 y)** 이 된다. 
이렇게 만든 모델의 최종 출력과 정답 레이블을 비교해 모델 출력이 정답 레이블과 최대한 같아지도록 BERT 레이어를 포함한 모델 전체를 업데이트 한다.

문장 쌍 분류 태스크 모듈은 [문서 분류 태스크 모듈](https://github.com/sehooni/nlp_example/blob/main/example/document_classification/document_classification.md)과 거의 유사한 모습이다.
문서 분류 과제를 3개 범주(긍정, 부정, 중립)를 분류하는 태스크로 상정한다면 두 모듈 구조는 똑같다.
다만 차이는 태스크 모듈의 입력(`pooler_output`)이 된다. 
즉, **`pooler_output`** 에 문장 1개의 의미가 응축되어 있다면 **문서 분류**, 2개의 의미가 내포해 있다면 **문장 쌍 분류** 과제가 된다.12:["$","$L14",null,{"content":"$15"}]
a:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
6:null
8:{"metadata":[["$","title","0",{"children":"Sehoon's Workspace"}],["$","meta","1",{"name":"description","content":"Welcome to my page!"}]],"error":null,"digest":"$undefined"}
d:"$8:metadata"
