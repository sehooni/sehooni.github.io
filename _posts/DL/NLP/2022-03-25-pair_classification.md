---
published: true
title:  "[NLP] 문장 쌍 분류 모델"
excerpt: "문장 쌍 분류 모델이란?"

categories:
  - NLP
tags: [NLP, DL]

date: 2022-03-25
last_modified_at: 2022-03-25T17:40:00-18:00:00
classes: wide
---

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
즉, **`pooler_output`** 에 문장 1개의 의미가 응축되어 있다면 **문서 분류**, 2개의 의미가 내포해 있다면 **문장 쌍 분류** 과제가 된다.