---
layout: single
title:  "[Proteomics] Percolator"
excerpt: "Proteomics 수업 내용 정리 - Percolator"
toc: true
toc_sticky: true

categories:
  - proteomics
tags: [proteomics]
use_math: true

last_modified_at: 2023-05-04T23:04:00
classes: wide
---
# Percolator

percolation이라는 툴은 실제로 지금은 커뮤니티에서 peptide validation을 할때 가장 많이 쓰이는 방법 중에 하나이다. **Semi-supervised** learning을 쓰고 있고, 그러다 보니 데이터를 바꿔가며 iterative하게 학습을 여러번 반복하는 방법이다. 

학습할 때 사용하는 feature의 집합은 DB search type, 즉 어떠한 tool를 사용하느냐에 따라서 다르게 정해져 있다. **즉, DB search에 사용한 툴에 가장 최적화된 feature set을 이미 제공하고 있는 것**이다.

데이터가 주어지면, 어떤 특정한 데이터 집합에 대해서 우리가 validation하고 싶은 건데, 그 데이터 집합에 대해서 model을 매번 새로 학습시킨다. peptide profit이 모델 파라미터 추정이 주어진 dataset에 대해서 매번 새로 한 것과 비슷하게, 여기서도 dataset이 주어지면 거기에 맞는 적절한 모델을 학습하는 일을 매번 반복적으로 한다는 말이다. 그리고 방법은 결국 `iterative한 SVM(Support Vector Machine)을 이용`하는 것이다. 

![Untitled](https://github.com/sehooni/sehooni.github.io/assets/84653623/bf1d16cb-1738-4cda-8752-3194702667bc)

## Semi-supervised

Semi-supervised의 정의는 이렇게 폭 넓게 이야기할 수 있다. classification문제를 예를 들어 살펴보면, `모든 data에 한해 label이 주어지면 Supervised, 아무것도 label이 주어지지 않으면 Unsupervised`라고 한다. 이때 `Semi-supervised는 data의 label이 일부만 주어지는, label이 없는 data도 주어지는 경우`를 말하며, 이런 경우에 할 수 있는 방법이 여러가지 존재한다.

![Untitled 1](https://github.com/sehooni/sehooni.github.io/assets/84653623/d5bc4f26-6c33-4cd3-bb5c-9a0dd031cb9d)

Percolator가 사용한 방법은 iterative하게 하는 일종의 self-training이라는 방법을 사용했다. 기본적으로 semi-supervised이므로, label이 일부가 있어야 한다. 그렇기 때문에 **우선 target-decoy search를 진행**한다. targeting을 search하면 모든 spectrum에 결국은 peptide가 다 assign이 된다. 근데 그 중 우리가 label을 확신할 수 있는 것은 decoy match 뿐이다. 따라서 그것들이 다 false라고 우리가 label을 정해도 된다. decoy spectrum(decoy peptide에 match된 spectrum)은 다 label을 0으로 주어도 괜찮다. 

우리가 어떤 걸 1이라고 하고 어떤 걸 0이라고 할 거냐 때문에 이 문제를 풀고 있는 것이고, 우리가 맨 처음으로 해볼 수 있는 것은 target에 match된 것 중에 DB search score에 굉장히 높은 애들 그런 건 확실하다 그런 애들은 절대로 틀릴 수 없다고 생각하면 그런 애들만 일부 label을 1로 주는 것이다. 상당히 score가 높아서 이런 점수 이상을 받았다는 것은 절대로 틀린 match일 수는 없다라고 하는 어떤 기준이 있으면 그 정도를 label을 주고, 나머지는 모르겠다 이니까 unlabeled된 상태로 그냥 두는 것이다.

![Untitled 2](https://github.com/sehooni/sehooni.github.io/assets/84653623/2fdfde35-3c17-41d1-8eb5-4ac6b8d35bd0)

위의 그림에서 볼 수 있듯이, `decoy spectrum은 그냥 들어가고, decoy spectrum에 대한 match와 그 다음에 PSM target match 일부가 classifier를 만드는데 사용된다.` 사실 저 화살표가 살짝 애매한데 이 **데이터들이 사실은 SVM Trainer로 들어가고, 학습하는 model의 그 feature가 주어지면, 이를 이용해 Classifier를 하나 만든다.** 그래서 위에 초기라고 따로 작성을 해둔 것이다.

초기에 target과 decoy search 결과에서 decoy PSM은 다 label을 0으로 주고, target PSM 중에 굉장히 score가 높은 애들만 label을 1로 준 다음 label이 있는 애들만 가지고 SVM training을 하는 것이다. 그 결과 Classifier가 하나 나올 것이고, 그 Classifier를 가지고 전체 PSM을 다시 Classify를 해보는 것이다. 그러면 unlabeled target 중에 어떤 애는 1, 어떤 애는 0 이렇게 갈 것이다. 

- 그런데 이제 달라진 점은 뭐냐 하면 처음에 우리가 target-decoy search 결과를 놓고 FDR을 추정할 때 사용했던 것은 score 1개 였지만, 여기서는 SVM 입력으로 주어지는게 score 외에도 굉장히 다양한 feature들이 주어진다. 다시 말해 Search tool에 의하면 score가 굉장히 좋아 보이지만 다른 측면으로 보니 얘는 그렇게 믿을 만하지 않다 이러면 reject할 수도 있는 것이고, search score는 좀 낮은 것 같은데 다른 거를 살펴보니 얘는 믿을 만하다 그러면 다시 받아들 수도 있는 것이다. **search score 하나만 가지고 판단하는 게 조금 불안전하다고 생각해서 이 training SVM trainer가 input으로 받아들이는 feature가 훨씬 다양하게 사용될 수 있다는 것이다.**

 

그래서 초기에 SVM Trainer가 만든 Classifier를 가지고 전체 PSM을 다시 한 번 labeling을 진행한다. 그렇게 label을 했으면 그 label된 애들을 가지고 다시 또 FDR을 할 수 있으며, 이때 사용하는 값은 classifier의 출력이다. 원래의 target-decoy search 결과를 쓰면 이게 의미가 없기 때문이다.  

지금 SVM이 만들어낸 Classifier를 가지고 (Classifier의 출력은 0 또는 1이어야 하는데, SVM이니까 -1에서 1사이의 값이 나온다.) 적절히 사용해서 FDR을 한다. FDR을 하고나면 또 새로운 확실한 label이 생기게 되며, FDR을 통과한 애들은 label이 1이라고 볼 수 있고, 통과하지 않은 애들은 label이 없다고 본다. 계속 같은 상황이 반복되는 것이다.

- **맨 처음에는 target-decoy에서 확실히 점수가 높은 애들만 labeling을 해주고, decoy는 label을 0으로 주고 learning**을 했다. 이후 **두 번째 iteration부터**는 저 SVM training의 결과로 얻은 점수를 기준으로 **FDR을 해서 통과한 애들은 label이 1**이고, 통과하지 않은 애들은 unlabel로 본다. **decoy는 늘 0**으로 생각하고 **이러한 과정을 반복**하는 것이다.

**목표**는 같은 FDR에서라면 우리가 FDR을 1%로 하겠다, 5%로 하겠다 이렇게 정했으면, 같은 FDR에서 **True Positive**에 해당하는 애들은 최대한 많이 뽑아내는 것이다. 또한 이렇게 iteration을 반복하면 그렇게 될 것으로 기대하는 것이다.

# Features

**학습을 할 때 제일 중요한 것**은 결국 `feature를 어떻게 정하느냐` 그 다음에 `data를 어떻게 확보하느냐`이다. 

![Untitled 3](https://github.com/sehooni/sehooni.github.io/assets/84653623/5d5b5716-fb52-445d-8374-5ca6b1875742)

Percolator는 그래서 search tool에 dependent하게 optimal feature set을 정의하고 있다. 그래서 이제 위의 그림에서 확인할 수 있듯이 Mascot, Sequest, MS-GF+ 등 각 search tool에 맞는 feature를 이렇게 따로 따로 정의하고 있다.

## Features: Percolator

Percolator가 사용하는 feature의 set들은 아래의 사진에서 확인할 수 있다. 잠깐 살펴보면, 이 feature들은 이것과 비슷한 값들을 적절히 다뤄야한다.

 예를 들어서 본인이 Sequest로 search를 했다 그러면 우리가 알고 있는 Cross-correlation score(Xcorr)와 Delta CN (= Delta Xcorr(=1등과 2등에 해당하는 peptide의 Xcorr 차이)), SP score(Sequest가 내부적으로 초기에 사용하는, candidate peptide를 필터링하는 score), 그 값에 log를 취한 것도 쓰고, mass, enzyme rule, ion fraction, #PSMs 등 다양한 feature들을 사용한다.

![Untitled 4](https://github.com/sehooni/sehooni.github.io/assets/84653623/98f6e5fa-ffa3-4a77-bfb8-91398ba4736d)

이것들 중 전체가 제공되는 것이 아닌, 일부가 제공되는데 percolator라는 tool이 하는 일은 search engine에서 나온 여러가지 score들과 search tool과는 별로 상관이 없는 값들도 동시에 고려해서 validation하는 학습을 하겠다는 것이다. 

![Untitled 5](https://github.com/sehooni/sehooni.github.io/assets/84653623/9f20d3fd-fc56-4833-b81f-f12d07a36bae)

다시 말해 **percolator가 하는 일**은 결국 `이런 다양한 feature들의 어떤 combined score를 학습을 통해서 구하는 것`이다. **SVM학습을 시킨다는 것**은 이런 feature들은 어떤 weight를 적절히 주면 label에 따라서 잘 분류할 수 있느냐 이걸 찾는 문제이기 때문에 결국은 이런 feature를 어떻게 combine해서 decision boundary를 정할 거냐 하는 문제에 해당하는 것이다. 그렇기 때문에 combined score를 학습하는 셈이다. 이런 feature들을 어떻게 잘 조합하면 정말 맞는 것과 틀리는 것을 내가 잘 구별할 수 있을까 하는 거를 찾아가는 과정이라고 생각할 수 있는 것이다.

다음으로 볼 내용은 percolator 자체하고는 별로 상관이 없지만 feature engineering을 할 때 고려해야 하는 사항들에 대해 정리해 놓은 것이다.

## Features: pre-processing

feature를 사용할 때 어떤 feature를 고를 거냐(선택할 거냐)하는 이야기를 하기 전에, feature들에 대한 어떤 pre-processing이 필요한 경우가 많이 있다. 아래의 그림에서 볼 수 있듯이 **Scaling, Clipping, Log scaling, Z-score** 이런 **Normalization 하는 방법들**도 가능하고, 값이 없을 때 어떻게 할 것이냐 하는 **Imputation**도 고려할 것 중에 하나이다.

![Untitled 6](https://github.com/sehooni/sehooni.github.io/assets/84653623/3cde8561-a209-4a86-bba1-13b43bb2e8dc)

다음과 같이 설명하는 예시들은 다 pre-processing의 방법들이며, 이러한 pre-processing은 사용될 수 있다지 꼭 해야한다는 것은 아니다. (Not a have to, but it can do) 

feature의 의미가 무엇인지, 상황이 어떠한지를 잘 보고 거기에 맞게 이런 일들을 하는 것이다.

### Scaling & Log tranform

scaling은 예를 들어 설명하도록 하겠다.

어떤 feature는 값의 범위가 1 ~ 10,000이고, 또 다른 feature는 값의 범위가 0.5 ~ 0.7이다라고 하면 두개의 feature를 그냥 원래의 입력으로 주어진 raw data값을 그냥 쓰는게 학습을 할 때 어려움을 줄 수 있다. 

왜냐하면 **feature가 scale이 전혀 다르기 때문에 그 weight를 잘 맞추는 일이 더 어려워지는 경우가 있다는 것**이다. 

그래서 **전체를 normalize해서 0~1 사이의 값이 되게 이렇게 scale해주는 경우가 많다.** (요즘은 tool이 자동으로 이런 scaling을 해주는 경우도 많이 존재)

![Untitled 7](https://github.com/sehooni/sehooni.github.io/assets/84653623/43a13167-b589-437b-847c-a73b4a9744c9)

그 다음 이렇게 **scaling하는 것만으로는 충분히 그 효과를 얻기 어려울 수가 있어**서, 왜냐하면 값의 변화가 굉장히 큰 feature가 값의 변화가 작은 feature를 그냥 linear하게 scaling하는 것이 서로 이렇게 안 맞을 때가 많이 있다.

그래서 **굉장히 값의 변화가, 범위가 굉장히 큰 그런 종류의 feature들**은 **log를 취한 다음에 그걸로 scaling을 하는 log transformation이 필요할 때가 많이 있다는 것**이다. 그렇기에 상황에 따라서는, log scaling도 생각해 볼 수 있는 것이다.

### Feature clipping

또 하나 고려해볼 수 있는 case는 outliers가 있는 경우이다. 대체로 모든 feature 값들이 다음과 같이 존재하고 여기에 아주 1, 2개씩 굉장히 큰 값을 가진 애들이 이렇게 나오는 분포가 있을 때, 이거 전체를 놓고 scaling하는 게 바람직하냐고 질문을 던질 수 있으며, 그렇지 않다 이 말이다. 

**outlier에 해당하는 애들은 그냥 버리고(noise라고 판단하고), 나머지만 가지고 우리가 data를 쓰겠다는 것**이다.

![Untitled 8](https://github.com/sehooni/sehooni.github.io/assets/84653623/2fb82d5f-2a01-49eb-907f-2e580478f741)

무엇이 outlier냐 무엇이 noise냐 하는 것도 data에 따라 다 다르기 때문에 일반적으로 이야기하는 것은 어려운 일이다. 그렇기 때문에 data를 다루면서 그 의미를 잘 이해해야 하는 것이다. outlier를 제거하는 방법도 굉장히 다양한 방법이 있을 수 있는데, 그때 그때 다 다르기 때문에 여기서는 자세히 다루기는 어렵고, 그런 점들이 있다 정도로만 이해하자.

### Z-score

Normal 분포를 가정했을 때, 다양한 score를 표시할 수 있으며 이는 아래의 표를 통해 확인 할 수 있다.

![Untitled 9](https://github.com/sehooni/sehooni.github.io/assets/84653623/707cca4a-5d07-4a63-b4a0-e312f5ada0d7)

Normal 분포를 가정했을 때, **평균(mean)에 해당하는 위치를 Z-score 0**으로 보고, $1\sigma, 2\sigma, 3\sigma$를 각각 **1, 2, 3으로 표시**하여 **각각의 분포에서 어디쯤 위치하고 있느냐 하는 것이 Z-score가 나타내는 값**이다. (일종의 normalization 하는 방법)

### Imputation

imputation은 값이 없는, 그러니까 data에 따라서는 특정한 feature는 값을 정할 수 없는 경우가 있을 수 있다는 것이다. 그럴 경우에 어떻게 할 것이냐 하는 issue.

이제 한 가지 방법은 하나의 feature라도 값이 없는 data는 그냥 버리는 방법이 있다. 모든, 값이 다 있는 애만 학습에 사용하고 그렇지 않는 애는 그냥 다 버릴 수 있으면 그나마 행복한 상황이다. data가 충분히 많아서, 버리고도 학습을 할 수가 있으면 다행인데, **imputation을 고민하는 이유**는 **data가 충분하지 않기 때문**이다. 그럴 때 이제 어떻게 할 거냐의 문제이고, 값이 없을 때 어떤 값으로 대체할 거냐 하는게 imputation의 issue이다.

![Untitled 10](https://github.com/sehooni/sehooni.github.io/assets/84653623/24817118-a9a8-4770-9fdc-9f42235e84df)

가장 간단하게는 **Mean, median mode** 이런 식으로 **전체 분포에서 평균 중간값 혹은 최빈값(가장 많이 나오는 값), 이런 것을 사용하는 것**이 제일 그래도 그럴 듯 하니까 이렇게 하고 넘어가는 방법도 있다. 

그 다음에 **우리가 어떤 값이 다른 값하고 어떤 correlation이 있는가 하는 것을 우리가 알 수 있다면**, (절대로 그렇지는 않지만, 예를 들어서 우리가 다루는 문제에서 peptide의 길이가 질량하고 correlation이 있다면, 혹은 질량이 charge하고 일정 정도 correlation이 있다면,) 그럼 이제 **그 중 어떤 값이 없다고 할 때 그 값을 그 correlation을 보고 적당한 값을 채워넣는 이런 일을 할 수도 있다.** 그래서 `missing value와 다른 변수 사이에 correlation이 있다고 하면 그렇게 regression을 해서 missing value에 적절한 값을 넣을 수 있다.`

 

그 다음에 **KNN(K-nearset neighbor)를 이용한 imputation도 가능**하다. 여기서 이제 nearest neighbor를 무엇으로 정의할 것이냐가 물론 issue가 되겠지만, 나하고 제일 비슷한 data를 찾아서 걔가 가진 그 값을 나도 그냥 가져오는 방법이 될 것이다. 그래서 나랑 비슷한 애들 k개를 뽑아서 그 중 가장 흔히 관찰된 값을 하나에 쓴다던가?! (**discrete한 경우**) mean이나 mode를 사용 한다던가?! (**continuous한 경우**)

이런 것은 이제 feature가 주어졌을 때, 그 feature들을 어떻게 처리할 거냐 하는 문제이다. 그 전에 이제 feature를 무엇을 사용할거냐 하는 issue가 있다. 

## Features: feature engineering

Feature engineering의 문제는 크게 2가지로 생각해 볼 수 있다.

- feature extraction
- feature selection

기본적으로 feature engineering을 하는 거는 그 feature들을 다시 재조합해서, 다시 잘 transform해서 새로운 feature로 바꾸는 과정을 말한다. 

![Untitled 11](https://github.com/sehooni/sehooni.github.io/assets/84653623/ac17b628-aaba-49a2-a5d7-5e8650f1bcce)

### Features: feature selection

앞서 이야기한 것처럼 combined score를 만든다던지, 이런게 이제 **feature selection**에 해당한다. **주어지는 feature set에서 어느 것을 쓰고 어느 것을 안 쓸 것인지를 고르는 문제**는 feature selection의 일종이라고 생각할 수 있을 것 같다. 

feature selection 자체로도 하나의 연구 분야이며, 알고리즘들이 또 다 구현되어 있다. 그런 것을 잘 활용하는 것도 좋은 방법이다.  **가장 단순한 방법은 하나씩 하나씩 넣어보거나 하나씩 하나씩 빼보는 stepwise feature selection**이다. 

![Untitled 12](https://github.com/sehooni/sehooni.github.io/assets/84653623/a2b5b664-79ce-4264-9afd-d7feadce6ddf)

사실은 n개의 feature가 있다고 할 때, n개의 feature를 조합해서 그중에 어떤 걸 쓸까를 정하는 문제는 모든 subset을 다 try 해봐야 한다. 그럼 $2^n$개를 다 시도해봐야 하는데 사람이다보니 그럴 수는 없다. 그래서 $2^n$개의 문제지만 이렇게 하나씩 하나씩 넣어보거나 빼보는 거는 n에 비례한 문제로 바꿔치기 하는 것이다. **그냥 단순화시켜서 $2^n$과는 비교할 수 없이 작은 시도이지만 이런 정도로 내가 끝 하겠다 하는 하나의 단순화된 방법**이 있을 수 있다. 이것이 **filter** 방법에 해당한다.

![Untitled 13](https://github.com/sehooni/sehooni.github.io/assets/84653623/d8d132ea-eae7-47c6-a400-08da64f09300)

`학습하고 독립적으로 하는 게 지금 이야기한 filter 방법`이고, 미리 다 feature를 골라놓은 다음에 선택된 feature만 가지고 학습을  하는 것이다. 

 feature selection 자체를 학습이랑 연결시키는 방법들도 있다. 위의 그림에서 마름모꼴로 MODEL이라고 한게 학습하는 부분을 의미하는데 학습하면서 feature selection이 같이 되게 하는 방법들도 다양하게 존재한다.

 그 다음에, iterative하게 학습하면서 그 학습 set에서 의미있는 feature들을 잘 골라내는 방법이 있는데, 위 그림에서 볼 수 있듯이 **wrapper**나 **embedding**하는 방법들은 **data에 매우 dependent해지는 경향이 있다**. 그 이유는 `feature 자체를 학습과 연계했기 때문`이다. 약간의 위험성이 있기는 하지만 우리가 잘 판단해야 한다. 학습 데이터가 많고 무슨 짓을 해도 over-fitting이 안 될 상황이다라고 생각하면 이렇게 해볼 만 하고, 그렇지 않고 학습의 data가 굉장히 minimal한데 이런 학습하고 feature selection을 연결시켜 놓으면 그 data에는 잘 동작하지만 다른 data에서는 굉장히 이상한 결과를 내는 그런 것들을 만들 가능성이 많이 있다는 것이다.

우리가 feature selection을 할 때도 그렇고 사실은 model을 selection 할 때도 반드시 고려해야 할 것인데, Bias와 Variance 사이에 trade-off가 있다는 것이다. 

![Untitled 14](https://github.com/sehooni/sehooni.github.io/assets/84653623/36e47494-8b42-485c-a9db-b39e0b5ebc03)

bias는 학습 모델이나 feature set 자체가 어떤 원천적인 한계가 있어서 거기서 오는 어떠한 error가 있을 수 있다는 것이다. 

 예를 들어 이야기해보자. 위의 그림에서 회색으로 표시된 point들이 data point를 의미하고, 10개가 표시되어 있다. 이 친구들을 학습해서 이를 나타내는 함수를 구하고 싶은 것이며, 이떄 표시된 점선은 실제 함수 관계가 둘 사이, x와 y 사이에 3차식쯤으로, 이런 polynomial에 해당한다. 그런데 왜 이 점선과 어긋난 위치의 data가 관찰되었냐 하면 측정하는 기기에 오류가 있어서 일정 정도 벗어나게 관찰되고 있는 것이다.(일부는 많이 벗어나고 또 일부는 살짝 벗어나고 이렇다.) 이렇게 관찰된 data point가 있고 실제로는 이 점선에 해당하는 함수 관계가 있지만 우리는  **data point만 보고 어떤 함수관계가 있는지 찾아야하는 문제**를 풀고 있는 것이다. 

이런 경우에 빨간색처럼 직선으로 modeling할 것이냐 혹은 파란색처럼 3차식으로 modeling할 것이냐, 초록색은 9차식으로 modeling할 것이냐에 따라서 **우리가 받아들이는 종류의 error가 다를 수 있다**. 왼쪽은 `bias가 굉장히 큰 경우`로, **model 자체가 한계가 있어서 아무리 data point를 더 많이 가져다 주어도 error가 줄어들기 어려운 상황인 것**이다. 반대로 `variance`는 초록색과 같이 data point가 10개밖에 안되는데 9차식을 가지고 modeling을 하였으니 100% 맞출 수 있지만, 여기에 만약 data point가 추가되기 시작하면 전혀 다른 결과가 나오게 된다. **data에 따라서 data가 조금만 바꿔어도 결과적으로 나오는 model의 결과가 많이 달라지는 error가 있다 하는 것**을 variance라고 한다.

이 **bias와 variances는 서로 trade-off가 있는데,** bias가 커지면 variance가 작고, variance가 커지면 bias가 작아지는, 이 2개를 **결국 합한 것이 결국 전체 error가 되기 때문**이다. 이게 `이 둘 다 적절히 control 되는 수준이 어디냐를 찾는 게 좋은 학습을 하는 방법`이다.   

![Untitled 15](https://github.com/sehooni/sehooni.github.io/assets/84653623/fcbc56da-9542-4cfd-b2e4-a9b5dc15546d)

위의 사진의 가운데 있는 것처럼 bias도 적절히 control하고, variance도 적당히 control해서 가장 적절한 위치가 어디냐를 찾는 문제가 결국은 학습을 어떻게 하면 잘하게 할거냐인데, **왜 이러한 이야기를 feature selection을 이야기하다 말고 하냐면,** **feature가 우리가 필요한 것보다 너무 작으면 bias가 큰 상황이 되고, 반대로 지나치게 많으면 variance가 큰 상황이 된다.** 

x는 동일한데 degree가 크니까 model이 다른것이고, 그렇지 않고 model은 똑같이 linear model이라고 해도 feature가 x1부터 x10까지 주어 졌느냐, x1부터 x3까지 주어졌느냐에 따라서도 bias와 variance가 왔다갔다 한다는 것이다. 그래서 이 둘 사이에 trade-off가 있고, 이 trade-off는 model과 feature 둘 다 적용되는 이야기이다. 그래서 feature를 적절히 잘 고르는 것이, 이 bias와 variance를 적절히 control 하는 게 굉장히 중요하다는 것이다. 다시 말하면, 쓸 데 없는 feature를 굉장히 많이 갖고오면 학습이 잘 되는 것처럼 보이지만 이런 상황을 만들고 있을 가능성이 많이 존재하기 때문에 feature를 어떻게 잘 고르냐 하는게, 또 전체 error는 결국 이 둘의 합에 해당하기 때문에 적절히 control해서 이 중간 지점을 찾는게 굉장히 중요한 것이다.

그래서 이제 앞서 이야기 한 것처럼 stepwise로 하나씩 넣던지, 하나씩 빼든지 하면서 feature를 골라야 하는데 언제 그러면 feature를 고르는 것을 멈출 것이냐 하는 것이 또다른 고민일 것이다. 언제까지 넣어야 좋은 건지, 어디까지 빼면 이제 더 이상 빼지 않는 게 좋다고 판단하는 건지 그런 어떤 기준이 되는 matric들이 있다. 이때 아래에 있는 matric들이 많이 사용된다. 

![Untitled 16](https://github.com/sehooni/sehooni.github.io/assets/84653623/a67bdb3b-36bc-4743-8a32-e3e9f1f9af80)

여기서 p는 feature의 갯수이며, 위 그림에서는 model parameter라고 p를 이야기했는데, 여기서는 feature의 갯수를 이야기 하며, 그 다음에는 주어진 애는 똑같이 주어져 있으니까 학습 data는 고정이 된 것이다. 이때 feature의 갯수를 무엇으로 할 때가 전체적으로 가장 바람직한가 하는 것들을 이런 식으로 여러가지 방식으로 제안하고 있는 것이고, 우리가 참고해 볼 만한 matric이다 라는 정도만 이야기하면 될 것 같다.

우리가 사용하는 tool안에 이런 것들도 다 구현되어 있으며, feature selection하는 알고리즘을 돌릴 때 이런 parameter를 사용하면 된다. 

### Features: feature extraction

feature에 관해서 마지막으로 할 이야기는 feature extraction이다. 결국은 **주어진 data를 설명하는 새로운 dimension을 찾는 셈**이다. 이 `dimension을 찾을 때 PCA는 이렇게 variance가 가장 큰 방향으로 dimension을 찾는다`. 왜냐하면 그래야 **그 dimension에서 가장 많은 data를 설명할 수 있기 때문**에 그래서 PCA가 하고 싶은 일은 자기 하나 가지고(첫번째 component라고 하면) 그걸로 어떻게 가장 많은 data를 잘 설명할 거냐, 얘하고 얘하고 왜 다른지, 이게 data point가 다 다른 것을 설명해야 되기 때문에 variance가 가장 큰 방향으로 이걸 찾는 일을 하는 것이다. 

![Untitled 17](https://github.com/sehooni/sehooni.github.io/assets/84653623/6d8ae294-f52d-4566-ba26-63c327b50354)

이렇게 하는 거는 이제 data를 표현하는 입장이고, 그렇지 않고 만약 classification을 한다 그러면 아래 그림과 같이 data를 이 쪽 dimension으로 표현할 것이냐 다른 쪽 dimension으로 표현할거냐 라고 할 때 당연히 LD 1 dimension으로 표현해야 classify하고자 하는 두 그룹이 명백히 나뉠 것이다.

![Untitled 18](https://github.com/sehooni/sehooni.github.io/assets/84653623/fecb88c7-1455-4ec6-8dd5-8863487f2159)

그래서 이 **LDA도 PCA의 일종이지만 얘는 variance가 작아지는 방향으로 축을 찾는다**. 그러니까 각각의 data에 해당하는 이 그룹의 variance가 가장 작아지는 방향으로 찾기 때문에 classification 문제를 우리가 다루고자 할 때는 이런 LDA 같은 것을 쓰는게 필요하다고 말하는 것이다. 아래 그림만 보아도 명백히 왜 그런 일을 하는지 알 수 있을 것이다. 

![Untitled 19](https://github.com/sehooni/sehooni.github.io/assets/84653623/8c1165fc-f45f-4191-ac2c-273261761590)

기술적으로는 LDA나 PCA나 다를 게 없지만 어떤 새로운 dimension의 feature의 조합을 찾는 셈인건데 그 **feature의 조합을 어떤 목적으로 찾느냐**, 표현하기 위해서 찾느냐 아니면 classification을 하기 위해서 찾는 거냐에 따라서 **찾는 것의 방향이 약간 다를 뿐이고, 하고 있는 일은 그게 그거**다.

여기까지가 입력으로 사용할 feature들이 어떤 게 있을 수 있고 그런 것들을 가지고 무슨 일을 해야 할 건가 하는 이야기를 해 보았다. 다음으로는 percolator에서 이 학습을 어떻게 했는지, 학습 모델에 대해서도 알아보자.

# Model

## Model: training data

아래의 사진을 보면 positive를 쓴다고 했는데 실제로 percolator가 무엇을 confident하다고 보냐면, target-decoy에서 1% FDR을 해서 그 threshold를 넘는 애들을 다 그냥 confident한 PSM으로 보는 것이다. 그래서 1% FDR을 통과한 target hit들을 전부 positives로 보고 negatives는 decoy 중에 (이제 classification을 해보면 그 class의 size를 어느 정도 맞추는 게, 비교적 uniform하게 분포하는게 학습시키는데 굉장히 중요, 실제 data space는 그렇지 않다고 하더라도! → 그래야 generalization이 충분히 됨) decoy hit을 늘 이만큼 있다고 가정한다.

다시 말해, target hit 중에 일부만 positive로 사용하여 set을 만들고, 그것과 비슷한 정도의 decoy hit을 random하게 고른다. 이를 통해 양쪽의 밸랜스를, 학습 data의 크기를 어느 정도 맞춘 다음에 학습을 하는 것이다. 

![Untitled 20](https://github.com/sehooni/sehooni.github.io/assets/84653623/fc857049-1624-4bfd-9143-9cb20e645fb9)

 아래 그림에서 살펴볼 수 있듯이, 학습 data를 이용해서, **SVM을 학습해서 얻은 학습 model이 나오면 그 classifier를 이용해서 다시 re-score(re-rank는 re-score를 통해 rank를 바꿀 수 있으므로 여기서는 re-score가 더 적합할 듯)를 한다.** 이후 다시 한번 FDR을 하면 label이 바뀔 수 있는 것이다. 그래서 positive set을 다시 정하고 그때 또 negative를 그 숫자만큼 random하게 다시 decoy에서 뽑고.. **이 과정을 반복**하는 것이다.

![Untitled 21](https://github.com/sehooni/sehooni.github.io/assets/84653623/e54637ea-c818-4b77-9307-df92db9e8c78)

percolator는 언제까지 이 iteration을 하느냐하면, **실제로는 최대 10번까지만 iteration을 반복**하게 된다. 그러니까 SVM학습의 측면에서 볼 때, 10번 이상은 절대로 안하는 것이다. 실험적으로 해보니, data size가 충분히 크면(예를 들어 1만개) iteration을 1~2번 정도 하고 나면 seturation되서 더 이상 바뀌지 않는 다는 것이다. 실험적으로 해보니까 10번 정도 하면 target-decoy가 의미 있는 상황에서는 충분히 가능하다라고 생각을 해서 이제 max 10번 이렇게 한 것이다. 이 학습을 10번 한다는게 시간적으로는 굉장히 계산 자원을 쓰는 측면에서는 학습을 10번 반복하는 게 그렇게 행복한 일은 아니다. 

그래서 **percolator는 비교적 빠른 학습을 위해서 linear SVM을 사용**한다. 학습을 빨리 하기 위해서 다른 학습 model을 쓰면 이걸 iteration 반복하는게 굉장히 부담스러울 수 있는것이다. 

## Model: SVM(1)

이 SVM이 어떤 학습 모델이냐 개념 정도만 설명하고 넘어가도록 하자. 아래의 그림에서 볼 수 있듯이, 여기에 있는 이 점들로 표현된 것들이 이제 학습 data이고, 진한 애들이 positive, 흐린 애들이 negative다 그러면 SVM은 이걸 2차원 평면으로 설명하지만, 이 학습 data를 나타내는 feature의 vector가 있는 거고, 그 feature vector는 2차원이 아닐 수도 있다. 당연히 걔네들은 어떤 차원일지 모르기 때문에 임의의 차원의 vector인데, 설명하기 위해서 그림에서는 2차원처럼 표시되어 있다. 이때 $w, x$는 어떤 vector를 나타낸다.

![Untitled 22](https://github.com/sehooni/sehooni.github.io/assets/84653623/3df9d080-0ce6-458c-bb9a-83a6c11c375b)

그래서 이제 만약에 2차원 평면 상에 이렇게 data들을 나타낼 수 있다면 그 data들을 구분 짓는 2개의 cluster가 있는 것이다. **positive set과 negative set, 이 둘을 잘 구분하는 어떤 decision boundary를 찾고 싶은 건데, SVM은 두 set사이의 영역을 구분 짓는, data point 사이를 구분 짓는 공간을 구하고 싶은 것**이다. 그 공간의 가운데를 지나는 것이 maximal margin을 갖는 decision boundary이고, 이 영역을 중심으로 positive와 negative가 구분이 된다. 위 그림에서 회색 부분이 그 margin의 영역이고, 가장 잘 나누는 것이 Decision boundary, 그리고 SVM이 원하는 것은 최대로 떨어질 수 있는 line이 만들어지는게 어디냐를 찾는 것이다.

여기서는 이제 이렇게 2차원으로 설명했기 때문에 직선 두 개로 설명했지만, 이게 이제 차원이 늘어나면, 3차원이면 평면이, 4차원이면 3차원 곡선이 될 것이다. 이렇게 차원이 늘어나면 그렇게 계속 달라진다고 생각해 볼 수 있다.

## Model: training a linear SVM

이걸 구하는 과정도 조금 살펴보면 흥미롭기는 하다. 이렇게 margin을 가장 넓히는 그런 decision boundary를 찾기 위해서는 positive set에 대해서 $x$가 **positive set일 때**, $wx+b > 1$이여야 한다. 왜냐하면 positive set의 supporting vector를 지나는 직선이 $wx+b=1$인 직선이었기 때문에 이것보다 커야하는 것이다. 마찬가지로 **label이 negative인 $x$에 대해서는** $wx+b < -1$이여야 한다. 

![Untitled 23](https://github.com/sehooni/sehooni.github.io/assets/84653623/807dda3a-d7de-4d53-a96f-c179a1088a17)

이제 이 조건을 만족하도록 구해보면 결국 이 $\lambda$라고 하는 게 두 직선 사이의 margin이다. $x^+$라고 하는데 positive의 직선이고, $x^-$라고 하는게 negative의 직선을 의미한다. 두 직선은 결국 $w$벡터의 뱡향으로 평행 이동 시킨 것이지 때문에 $\lambda$만큼, 이 크기가 남는 것이다. 따라서 위 그림의 식들과 같이 쓸 수 있고, 이를 정리하면  $\lambda$는 weight vector의 norm이라고 부르는 값을 부모로 갖는 이런 값이 되는 것이다. **우리가 원하는 것은 $\lambda$가 제일 커지는 $w$를 구하는 것**이다. SVM에서는 둘을 제일 많이 갈라놓는 $w$가 뭐냐를 찾는 문제라는 것이다. 

![Untitled 24](https://github.com/sehooni/sehooni.github.io/assets/84653623/b2f2d431-a5a1-4484-b986-6f580c22ab55)

이것을 바꿔서 **저 norm을 minimize하는 문제로 구하는 것**이다. 이때 norm이 아닌 norm의 제곱을 구하는 이유는 나중에 저 norm을 계산하는데 그 안에 square-root가 있기 때문이고, norm을 minimize하나 norm의 제곱을 minimize하나 minimize하는 조건은 똑같기 때문에 그렇게 하겠다는 것이다.

minimize할 때의 조건을 생각해보면 결국 주어진 data를 잘 설명하면서, 다 만족시키면서 minimize해야 할 것이다. 그래서 **$x_i$가 positive set의 data일 때는 $y$가 1, negative data일 때는 $y$가 -1**이며, **SVM은 1, -1 이렇게 labeling**을 하게 된다. 결국 이를 통해 $\mathit{y(wx+b) \ge 1}$의 식에 다 적합한 모델이 된다.

정리하자면 아래와 같다.

- 주어진 training data를 다 만족시키면서 이것을 minimize하는 그런 $w$를 찾는게, SVM에서 문제를 해결하고자 하는 decision boundary에 해당하는 직선이 뭐냐를 찾는 문제이고, 직선은 결국 coefficient들을 찾는 건데 그게 이 $w$라고 하는 weight-vector로 표현될 수 있다.

그런데 이제 이렇게 조건이 붙었을 때 어떤 optimization을 할 때는 Lagrange multiplier method를 쓸수가 있다. 이 조건에 해당하는 부분까지를 합하는 equation을 만들고 그 전체를 그냥 minimize하면 그러면 원래 우리가 이 조건일 때 norm을 minimize하는 것과 같은 결과를 얻을 수 있다는 것이다. 

Lagrange multiplier method에 의해 각각을 그냥 편미분해서 그게 0이 되는, 3개의 parameter 각각에 대해서 편미분을 한 다음에 이 전체 함수가 0이 되는 값이 뭐냐를 찾으면 된다. 그래서 위의 그림을 살펴보면 $w$와 $b$, 여기에는 안나타났지만 $\alpha$에 대해서도 편미분을 한 다음에 그거를 만족시키는 값을 찾는 문제로 바꿔서 생각할 수 있다는 것이다. 이 SVM을 제대로 이해하는 것은 굉장히 복잡하다. 개념을 이해하는 정도로만 간략하게 설명을 하면 그런 것으로 충분할 것 같다고 생각된다.

## Model: testing a linear SVM

그렇게 해서 $w$와 $b$와 이런 것이 어떤 값을 가질 때 margin이 maximize되냐 하는 거를 우리가 찾으면 그 다음에는 inference는 굉장히 간단하다. $wb$에 의해서 2개의 직선이 정해지고, 그 2개의 직선 가운데를 지나가는 애를 우리가 decision boundary라고 했으니까, 그 decision boundary를 중심으로 그러를 넘으면 positive, 아니면 negative (`training data는 1과 -1로 label을 붙였지만 inference할 때는 중심이 0, 즉 decision boundary를 중심으로 우리가 하기 때문에 0을 중심으로 구별!`)로 해서 판단한다. 

![Untitled 25](https://github.com/sehooni/sehooni.github.io/assets/84653623/e8367c87-a247-44a9-bc1b-cd2c4f00a85d)

## Model: SVM(2)

중요한 것은 2가지이다. **첫 번째는 이렇게 margin을 maximize하는 그런 decision boundary를 찾자**하는 것. **또 하나는 아래 그림에서 이야기 하듯, kernel trick이라고 하는 것**이다. 이 2가지가 SVM 학습의 가장 큰 contribution이다.

![Untitled 26](https://github.com/sehooni/sehooni.github.io/assets/84653623/e32b85d8-4a7b-4520-a5d6-843e3f4fc27b)

 아래의 그림을 살펴보자. 학습 data가 이렇게 margin을 두고 완전히 나눌 수 있게 주어지면 그나마 다행인데 어떤 decision boundary를 가져와도 얘네를 완벽하게 나눌 수 있는 경우가 없을 때! 그러니까 separable하지 않은 data가 주어질 수 있는 거다. 왜냐하면 학습 data에는 noise도 섞여 있고, 그 이상한 것들이 많이 나올 수 있기 때문에 저렇게 separation이 잘 되지 않는 학습 data가 왔을 때 어떻게 할 거냐 이런 경우인 것이다. 2차원 평면에서 보자면 빨간색과 파란색 이 두 그룹을 구별해야 하는데 지금 이런 식으로 data가 배치가 되어 있어서 어디에다 직선을 그어도 두 class를 완전하게 나눌 수 있는 직선은 없는 것이다. 즉, **직선이라는 한계를 가지고 있는 이상은, 모델이 linear SVM이라는 하는 그 조건 하에서는 빨간 class가 파란 class를 나눌 수 있는 직선은 이 세상에 존재하지 않는다는 것**이다. 

![Untitled 27](https://github.com/sehooni/sehooni.github.io/assets/84653623/6f107192-4c9e-4a49-b5ab-24d467385b2e)

 그렇기 때문에 **”Slack” variable**이라는 것을 추가해서 margin을 조금 soft하게 가는 것이다.(**soft margin**) 원래는 위의 그림처럼 positive set과 negative set에 대한 boundary에서 중간에 나오는 애들($x_3, x_4, x_5$)은 포기를 해야하는데, 그렇지 않고 약간의 여유를 두어서 허용할 수 있게 그런 개선을 좀 했다는 것이다. `즉, soft margin을 주어서 그 안에서는 왔다갔다 하더라도 허용할 수 있도록 개선한 것이다.`  그보다 더 중요한 것은 **”Kernel” trick**이라고 하는 것이다.

## Model: kernel trick

위에서 본 것처럼 input space 안에서는 절대로 decision boundary를 찾을 수 없는 문제라고 하더라도 얘네를 다른 차원으로 data를 옮기면, 즉 feature space를 바꾸면(transformation), 거기서는 decision boundary가 생길 수 있다는 것이 kernel trick의 핵심이다. 그렇게 바꾸고 나서 classify를 해보자 하는게 기본적인 생각인 것이다.

![Untitled 28](https://github.com/sehooni/sehooni.github.io/assets/84653623/098271e4-b552-4a4b-88a0-79f611827b6d)

이렇게 바꾸는 거를 kernel function을 이용해서 표현할 수 있다면, optimal solution을 찾기 위한 계산을 하다 보면 아래와 같은 식들과 만날 수 있다. **2개의 data $x_i$와 $x_j$, 그 2개의 data point 사이에 이런 곱을 구해야하는 일이 생기는데 각각을 다른 feature space로 보낸 것**이다. **$x_i$와 $x_j$를 transform해서 $\Phi(x_i)$와 $\Phi(x_j)$로 바꾼다.** 그 다음에 **그들 사이의 곱을 구하는 문제로 바꾸면 classification이 잘 되기도 하더라**라는 이야기이다.

![Untitled 29](https://github.com/sehooni/sehooni.github.io/assets/84653623/75f5f489-162b-4b7f-bc3d-5633dcc324b9)

어떤 transformation을 할 수 있는가 하면, 위의 그림에서 볼 수 있듯이, *linear,* *polynomial*, *sigmoid*, *gaussian* 이런 것들이 가능하다. 이제 흥미로운 것은 그렇게 transformation을 하라고 하면 transformation 하는 시간이 필요하고 거기 가서 곱해야 하는데 많은 경우 이 transformation이 차원이 늘어나게 된다. 그러면 늘어난 차원에서 곱해야 되니까 계산량이 훨씬 늘어나는 문제가 있다. 

 이 SVM 논문에서 흥미로운 것은 이렇게 **transformation한 다음에 곱을 구하는 것이 하나의 kernel function으로 그냥 표현할 수 있다는 것**이고, 각 transformation에 있어 kernel function이 위 그림의 파란 부분처럼 표현이 가능하다. 그래서 `처음에 늘리는 transformation을 각각 한 다음에 늘어난 차원에서 곱을 구하는 게 아니라 훨씬 계산량을 적게하고도 같은 일을 할 수 있다는 것`이다. 이렇게 보여줌으로서 이제 학습을 할 때 그저 선택을 하면 되며, 그런 선택에 있어 kernel fuction을 이용하면 계산은 빨라지되, 계산량은 늘어나지 않는다. ( 계산량이 늘어나기는 늘어난다. 왜냐하면 feature space를 확장 차원에 늘려놨기 때문에 계산량이 줄어들 수는 없다. 단, 미치듯이 늘어나지는 않는다는 것이다.)

kernel function을 다른 것을 써서 SVM을 시도해보는 것도 가능한데, non-linear한 것들을 쓰기 시작하면 실제 속도는 굉장히 느려진다. 우리가 보고 있는 것 처럼 SVM 학습 자체를 여러 번 해야하는 이런 상황에서는 계산량이 워낙 많기 때문에 kernel function을 다른 걸 쓰는 게 그렇게 바람직한 상황은 아닌 것이다. 

## Percolator iteration

이 percolator가 하는 일에 대해 전체적인 것을 살펴보았다. 다음으로 data를 어떤 식으로 iteration이 반복되면서 바꾸는지, 그 다음에 학습에 사용한 SVM이라는 model이 어떤 것인지 이렇게 했더니 결과적으로 어떻게 되었는지 살펴보자.

![Untitled 30](https://github.com/sehooni/sehooni.github.io/assets/84653623/decbdbf7-44a9-4e33-8e9d-5afc76bbd19d)

위 그림에서 확인할 수 있는 Crux는 이제 SEQUEST를 굉장히 빠르게 실행할 수 있게 알고리즘을 약간 개선한 software이다. Crux를 돌려서 Crux가 주는 p-value를 가지고 target-decoy를 해봤더니 같은 FDR 1%에서 그래프 내 주황색과 같이 ID가 나왔다. 같은 결과를 Crux를 똑같이 돌리고 그거에 대해서 percolator를 실행하고 났더니 그래프 내 파란색과 같이 ID가 늘어났더라 하는게 이 사람들의 주장이다. 그래서 전체 psm을 target psm 137만개 짜리를 가지고 일을 해보니 이렇게 FDR별로 ID되는 갯수가 바뀌는데 우리가 많이 사용하는 근처(점선)에서는 이렇게 차이가 많이 났다는 것이다.

**Search는 동일한 것을 했는데 뒤에 percolator를 돌리느냐 안 돌리느냐에 따라서 ID의 갯수가 저렇게 차이가 많이 났다.** 4천 8백만개가 5천 5백만개가 됐으면 10%보다도 더 많이 늘어난 것이다.

 

이제 왜 늘어났는가를 생각해보면, **우선 percolator에서 feature가 더 많이 쓰였다.** 그렇다면 target-decoy할 때 input feature를 많이 쓰면 되는거 아니냐고, target-decoy할 때 기준 하나만 쓰지 말고 여러 개 잘 조합해서 쓰면 되는 거 아니냐고 반문할 수 있는데, 그것과는 방법이 좀 다르다. 

**학습이 들어간 것**이다. 각 feature의 중요도 weight를 학습한 것 같은데 결국은 중요도 data의 특성을 학습한 것이다. overfitting을 하고 있는 거 아니냐는 의심이 들 수 있는데 validation과 test까지 다 잘 해봐도 비교적 쓸 만 하고, overfitting 하는 경우는 드물다는 것이다. 결국은 특정한 data에 잘맞는 feature의 조합을 했기 때문이다라고 생각하고 있다.

이제 또 한가지는 **여러 feature를 물론 조합하는 거하고 상관이 있는데** 그냥 원래 target-decoy할 때는 대게는 이제 database search 알고리즘이 주는 score 한 개를 사용했다. (DBSearch 알고리즘은 match를 시킬 때 그 spectrum 하나만 본다. 그 set 전체를 보지 않는 것이다. 때문에 set 전체가 가지는 어떤 statistical한 정보들은 하나도 활용을 안하게된다.) 그런데 **이제 percolator를 사용하면 set 전체의 특성도 반영하게 되는 것**이다.

- Scan 하나를 독립적으로 보지 않고 전체 set에 대한 것을 활용할 수 있다는 점과 특정한 data의 feature로 쓰이는 것들의 중요도를 다 이렇게 적절히 조절해서 거기에 acceptive하게 할 수 있다는 점에서 이렇게 ID가 늘어난 게 아닌가 생각해볼 수 있다.

![Untitled 31](https://github.com/sehooni/sehooni.github.io/assets/84653623/e90e6ce2-9412-4cbe-b623-248784b1e2ec)

그런데 이제 percolator의 단점은 tool마다 feature set이 다르다는 것이다. 해서 공통된 어떤 feature를 사용할 수 없나 해서 이런 연구를 한 것이 위의 사진이다.

# Model: Other classification model

percolator에 대한 설명은 여기까지이며, 몇가지 classification에 많이 쓰이는 학습 model을 아주 간단한 친구들을 한 두 가지만 살펴보자. 

## Model: logistic regression

 **classification을 할 때 많이 쓰이는 것 중에 하나가 이 logistic regression**이다. 예를 들어서 아래 그림처럼 몇 시간 공부했느냐에 따라서 시험에 통과할 확률이 있다고 하자. data point들을 살펴보면 어떤 사람은 3시간 공부하고 합격했고, 어떤 사람은 3시간 공부하고 떨어졌고, 1시간 공부한 사람은 떨어졌음을 보여준다. 그래서 결과는 결국 붙었냐 떨어졌냐와 같이 binary로 관찰이 된다는 것이다. 

 그런데 예를 들어서 이거를 linear regression을 하겠다라고 생각하면, 이 주어진 data point에 대해서 error가 가장 작게 직선을 긋는 방법은 점선 같은 것이다. (2시간 공부하면 붙을 확률이 0.1이고, 3시간 공부하면 붙을 확률이 0.6이고, 5시간 공부하면 붙을 확률이 1이다와 같이 값을 주는 직선이 될 것이다.) 

![Untitled 32](https://github.com/sehooni/sehooni.github.io/assets/84653623/5b5dee12-5872-404d-b66c-4c203bedf207)

 하지만 얘는 딱봐도 붉은 점선으로 나타내기 보다는 초록색 점선과 같이 나타내야 될 것처럼 보인다. input feature는 공부한 시간 하나밖에 없지만 이런 식으로 decision boundary를 정해야 한다. 또 여기서도 문제가 있다. 결국은 **decision boundary를 잘 정하려면 미분이 되어야 하는데**, 이 step function(초록 점선)의 형태로는 미분이 안된다. 따라서 미분 가능한 함수로 바꿔 준 것이 파란색 선, 즉 **logistic function, 줄여서는 sigmoid function**이라고 부른다. 

그 함수는 아래와 같이 생겼다.

![Untitled 33](https://github.com/sehooni/sehooni.github.io/assets/84653623/5d3150a1-9b16-4033-aefd-5b3674e708e5)

여기서 **$x_0$는 센터를 0에 맞추기 위해서 평균만큼 이렇게 shift하는 것**이며, 저 기본꼴이 logistic function이고 여기서 $L$과 $k$, $x_0$가 각각 1, 1, 0일 때를 sigmoid function이라고 부른다. 오른쪽 그래프와 같다. classification 문제에서 저 그래프가 도출이 되었으니, 주어진 데이터를 가장 잘 설명하는 이 parameter를 구하는 문제로 보는 것이다. 따라서 **$L, k, x_0$를 구하면 문제로 해결을 하면 되고, 구하는 방법은 stocastic gradient descent 방법, 즉 편미분을 해서 그 방향으로 계속 weight를, parameter들을 업데이트하는 방식**으로 하면 된다.

**logistic function이 좋은 이유**는 미분한 함수가 딱 크로스 폼으로 구해지기 때문에 어렵지 않게 그 값을 구할 수 있음에 있다. 즉, gradient를 쉽게 구할 수 있어 편리하고, 이 때문에 logistic regression을 classification문제에서 굉장히 많이 사용한다.

## Model: decision tree

classification에서 많이 쓰이는 또 다른 게 **decision tree**이다. tree의 형태로 **decision tree의 node는 어떤 feature에 해당하는 것**이 node가 된다. **그 feature의 값이 뭐냐가 각각의 edge**로 나타내어진다. 그 feature 값에 따라서 주어진 data를 아래와 같이 나누게 된다. 이 feature가 뭔지 모르지만, 이 feature 값이 A인 애들이 A subtree에 들어가고, B에 해당하면 그다음 B subtree에, `그래서 tree의 root에서 시작해서 아래로 내려가면 내려갈수록 점점 그 해당 feature의 값에 해당하는 그 subset으로 줄여나가는 것`이다.

![Untitled 34](https://github.com/sehooni/sehooni.github.io/assets/84653623/5a91436c-2ad6-493e-8a4e-13518ca0df83)

data는 그냥 이 feature들의 값으로 표현된 형태로 나타나며, 쉽게 말하면 엑셀 시트의 형태로 data가 있는 것이며 그 data로부터 위와 같은 tree를 학습하는게 목표인 것이다. data가 100개 혹은 1천 개, 1만 개 주어져있다하더라도 data를 읽어서 각각의 feature들의 값을 통해 어떻게 tree를 만들거냐를 생각해보자. 이 tree를 만들고 나면 그 다음에는 어떠한 data가 오더라도 그냥 tree를 root에서부터 따라 내려가면 classify가 된다. 학습 data에는 실제로는 존재하지 않았더라도, 그런 feature combination이 존재하지 않았더라도, 이런 decision tree가 하나 만들어지면 어떤 data든 결정할 수 있는 것이다.

![Untitled 35](https://github.com/sehooni/sehooni.github.io/assets/84653623/255639de-6da6-4a45-b57a-e547f9c545fe)

결국은 **root에 어떤 attribute(=feature)을 고를거냐로부터 시작된다**. decision tree를 만들 때는 root부터 만들고 진행한다. 이때 모든 가능한 tree를 다 시도해 보는 것은 불가능하다. 그래서 어떻게 approximation을 하는거냐면, 그냥 각각의 위치에서 가장 바람직한 feature를 하나를 고르는 것이다. 각각의 위치란, 그 subtree에 해당하는 root를 고르는 것이다. **각 feature의 값에 따라서 classify를 해보고, 정보를 포함하고 있는가를 통해 더 나은 것을 root에 있는 feature로 선택**한다. 이후 classify가 잘 되지 않은 subtree에 대해서만 어떤 feature를 쓰면 더 잘 나눌 수 있을까 하는거를 똑같은 방식으로 시도한다. 위 그림에서 직관적으로는 patron이 type보다 더 좋은 feature인 것을 알겠는데, 객관적으로는 어떻게 판단할까라는 의문이 들 수 있다. 그에 대한 해답은 다음 그림과 같이 **Entropy**라는 기준으로 답변을 할 수 있겠다. 

![Untitled 36](https://github.com/sehooni/sehooni.github.io/assets/84653623/5811c132-bc53-4a7b-a4e1-063ca3dbae0e)

entropy라고 하는 것은 Information Content를 의미한다. 여기서 $v_1, \dots, v_n$은 feature의 값을 의미하며, 각각의 값에 해당하는 dataset이 있으면 그 data가 전체에서 확률이 얼마나 되는가를 나타내는 것은 $p$이다. 확률은 결국 분수의 형태(fraction)로 볼 수 있다.

예를 들어, feature의 값에 따라서 $v_1, v_2, v_3$가 있으면 각각의 값에 따라서 이들의 fraction을 가지고 $-P \log(P)$를 구한 다음에 SUM한 것을 **Entropy**라고 부른다. 

앞서 봤던 그림을 예로 다시한번 Entropy와 관련하여 살펴보자.

![Untitled 37](https://github.com/sehooni/sehooni.github.io/assets/84653623/907ee13f-1d62-407c-b40e-0457a85001f4)

여기서 분홍색 동그라미의 경우, 6개 중에 2개가 positive, 4개가 negative로 나타났다. 이때의 entropy는 계산해보면 아래와 같이 구해진다.

![Untitled 38](https://github.com/sehooni/sehooni.github.io/assets/84653623/2f9d263f-2b4e-4cf0-9eb1-0a4601087b01)

마찬가지로 some부분의 entropy를 계산해보면, 아래와 같이 구해지는데 $\log(0/4)$는 정의할 수 없지만 앞에 곱해진 $0/4$로 0이 된다.

![Untitled 39](https://github.com/sehooni/sehooni.github.io/assets/84653623/ca823ee1-f775-4d0b-90d8-429826b73065)

이를 통해 모두 다 같은 label을 가지고 있을때 entropy가 가장 낮음을 확인 할 수 있다.

그래서 entropy 함수를 그려보면 다음과 같이 그려진다.

![Untitled 40](https://github.com/sehooni/sehooni.github.io/assets/84653623/ce8ee1fa-5f21-4689-9ee8-e5d89cb89b24)

그러니까 한 label, 즉 positive가 1 혹은 0 (전체가 1로 본 경우), 음.. 확률로 보는게 좋을 것 같다. 확률 $p$가 1 혹은 0일 때, entropy는 0이 되고, 반대로 $1/2$일때 가장 높은 값인 1의 값을 갖는다. 여기서 하고 싶은 이야기는 각각의 partion이 가지는 이 entropy가 있는데, 이 entropy를 전체 partion에 대해서 SUM해보면 (weighted sum) 그 entropy가 그 feature의 information이라고 생각하는 것이다. 어떤 정보의 양이라고 생각하는데, entropy가 낮으면 낮을수록 정보의 양이 많고, 반반이면 entropy가 가장 클 때이고, 그때는 아무것도 모르는 상태, 즉 positive인지 negative인지 알 수 없는 상태인 것이다.

![Untitled 41](https://github.com/sehooni/sehooni.github.io/assets/84653623/068dd541-6b20-4db7-af35-7cc07af4f895)

앞서 설명한 것처럼 feature를 정하면 각각의 subtree에 해당하는 partion들이 생기고 각 subtree에 대해서 똑같은 일을 반복하는 것이다. 이 subtree에 해당해서 다시 root를 누구로 정할거냐 하면, 정보의 양이 가장 많은 feature를 고르겠다는 것이다. 그런 식으로 계속 따라가면서 가르고가르면 언젠가는 다 나눌 것이다. 이것이 결국 decision learning의 개념인 것이다. 문제는 너무 잘 가르다보니 overfitting이 되는 일들이 굉장히 많다는 점이다.

## Model: random forest

그런 부분을 극복하기 위해서 너무 많이 가르지 않게 일정한 size가 되면 더 이상 나누지 않는 이런 일도 하고 가끔은 이게 갈랐던 걸 다시 뭉치는 이런 후처리도 하고 여러가지 기술들이 많이 있지만, 여전히 decision tree는 비교적 overfitting을 많이 하는 것으로 알려져 있다.

그래서 그것을 극복하기위해 사람들이 뭘 쓰냐면 이 random forest라는 것을 쓴다. 문자 그대로 forest이다. tree가 여러 개, 즉 decision tree를 여러 개 만드는 것이다. decision tree 만드는 게 시간이 되게 빠르기도 하고, 생각해 보면 feature가 n개 있으면 그중에 하나 고르고, 그다음에 나머지 중에 또 하나 고르고, 그냥 순서대로 가는 것이고, 사실 저 information entropy를 계산하는 것은 또 간단하기도 하다. frequency count를 해서 그걸로 계산만 하면 되므로 굉장히 간단하기 때문에 decision tree 만드는데 필요한 계산량이 많지 않다. 그래서 이제 이 forest를 만들어도 시간이 별로 안 걸리는 것이다.

![Untitled 42](https://github.com/sehooni/sehooni.github.io/assets/84653623/2d84ec5b-13fd-485e-8060-c8b4649da7ec)

앞에 random이 붙는 이유는 같은 data로 decision tree를 만들면 맨날 똑같은 tree만 나올테니, data를 random하게 골라서 진행하는 것이다. 많은 tree가 만들어 지면, 어떻게 하나를 고르냐 하면, majority voting, 즉 많은 애들이 주는 값으로 그냥 쓴다. 이렇게 하는 것이 random forest의 아주 간단한 형태이다. 

이렇게 하면 실제로 overfitting issue가 굉장히 해소가 되고, 또 이게 ensamble 방법의 일종이라고 당연히 볼 수 있다. 

- decision을 빠르게 학습이 가능하다는 점과 overfitting되는 것을 극복하는 하나의 방법으로써 random forest가 굉장히 많이 쓰인다. 이 때문에 classification의 방법 중 하나.

# Percolator summary

통계적으로 statistical한 validation 방법(ex. target decoy)은 아니며, 또 어떤 model이 있어서 그 model의 parameter를 추정해서 어떤 FDR(False Discovery Rate)을 추정하는 방법도 아니다. 참 묘한 방법인데, 두 개를 mix했다고 보면 될 것 같다. 뭔가 model이 있다고는 생각을 하는 것이다. 그러니까 SVM classifier가 model인 것이다. 결국은 어떤 model이 있고 그 model이 data를 잘 설명하는 weight parameter들이 뭐냐 하는 것을 찾는 문제 이기는 한데, 그런데 이 model parameter를 잘 조정하기 위해서 쓰이는 data는 또 target-decoy에서 온 것이다. 한번 iteration이 끝나고 여전히 target-decoy 비슷한 걸 해서 FDR을 추정해서 그것으로 label을 쓰니까, 결국은 target decoy 하는 셈인 것이다.

그래서 이 2가지 방법을 적절히 mix해서 사용하고 있다는 생각이 든다. 이것도 어떻게 생각하면 일종의 EM 알고리즘 비슷한 것이라고 생각 할 수 있다. 결국은 우리가 원하는게 이들의 label을 구하는 것인데, label을 구하려면 뭔가 feature를 잘 활용해서 다룰지를 알면 구할 수 있다. 이걸 이용해서 맞추고 이런 과정의 반복이다보니, 일종의 EM 알고리즘이다 라고 생각할 수 있는 것이다. 

이 과정에서 model의 함수는 linear SVM인데 이밖에도 decision tree, random forest 등에 대해서 추가적으로 알아보았다. percolator에 들어가는 feature들도 잘 정리하면 좋을 듯하다.

---
> 본 내용은 한양대학교 컴퓨터소프트웨어학과 및 인공지능학과 백은옥 교수님의 강의자료을 바탕으로하여 작성되었습니다!

> PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. :)