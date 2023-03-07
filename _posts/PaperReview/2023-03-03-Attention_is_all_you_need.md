---
layout: single
title:  "[PaperReview] Attention is all you need"
excerpt: "Transformer 논문 리뷰"
toc: true
toc_sticky: true

categories:
  - PaperReview
tags: [PaperReview, NLP, transformer, Attention]
use_math: true

last_modified_at: 2023-03-07T13:38:08-17:19:00
classes: wide
---

2022년 자연어처리 스터디, 집현전 3기에서 진행하였던 ['Attention is all you need' 논문 리뷰](https://docs.google.com/presentation/d/16ehwCfxzDYtmXI2-8qz4djyKLb2e6mHE/edit?usp=sharing&ouid=103416735755875236001&rtpof=true&sd=true)를 기반으로 재구성한 포스팅임을 미리 알려드립니다.
아래 링크에서 영상으로도 확인할 수 있습니다. 

링크 : [Attention is all you nedd 논문 리뷰 발표 영상](https://youtu.be/aFlWGqVzPbo)

이번 포스팅에서는 NLP, 즉 자연어 처리의 연구에 있어 가장 기본이 되는, 근본이 되는 논문인 'Attention is all you need'를 소개하고자 합니다.

---
# Background
    
본 논문에 대한 자세한 설명에 앞서 먼저 배경지식을 살펴보고 넘어가도록 하겠습니다.

## Transformer의 기여

**Transformer**는 2017년 Google이 제안한 **seq2seq 모델**입니다. 기존의 Sequence Transduction,변환 모델은 Encoder(인코더)와 Decoder(디코더)를 포함하는 구조를 바탕으로 Recurrent(순환 신경망)과 Convolution Layer를 사용하게 됩니다. Transformer는 **Attention 메커니즘**의 활용을 통해 인코더와 디코더를 연결하게 됩니다. 이러한 새로운 구조를 바탕으로 하는 Transformer는 Machine Translation(기계번역)에서 매우 좋은 성능을 보였으며, 학습 시 우수한 병렬화(Parallelizable)에 우수할 뿐만 아니라 훨씬 더 적은 시간을 소요하게 됩니다. 추가적으로 Constituency Parsing(구문 분석)분야에서도 우수한 성능을 보였으며, Generalization(일반화) 또한 잘 된다고 합니다.

## BERT & GPT

Transformer는 최근 핫한 BERT와 GPT의 구조에도 큰 기여를 하였습니다.

아래 fig 1에서 확인할 수 있듯이, transformer는 크게 인코더와 디코더로 구성되어 있습니다.

이와 관련한 자세한 구조 설명은 밑에서 다시 다루도록 하겠습니다.

![Untitled](https://user-images.githubusercontent.com/84653623/223362088-79a56eba-d54b-4e38-8fa8-c49fd1a06ad7.png)


**Bert**는 transformer에서 디코더를 제외하고 **인코더를**, **GPT**는 반대로 인코더를 제외하고 **디코더를** 사용합니다. **전자**는 **문자의 의미를 추출**하는데, **후자**는 **문장 생성**에 강점을 두고 있습니다.

본론으로 돌아와 정리하자면, 결국 두 모델이 탄생할 수 있었던 큰 기여를 한 것은 transformer라는 점입니다. 두 모델에 대한 내용은 추후 다룰 논문 리뷰에서 이야기하도록 하겠습니다.

![Untitled 1](https://user-images.githubusercontent.com/84653623/223362058-82d66bd5-9245-41a5-9f4b-1250584596e4.png)

## Seq2seq: RNN과 seq2seq 구조와 문제점

seq2seq의 구조를 살펴보면 다음과 같습니다.

![Untitled 2](https://user-images.githubusercontent.com/84653623/223362061-375a5c89-9bc4-4f97-9b4d-600facc01c3c.png)

RNN의 모델 중 하나인 seq2seq는 **순차적으로 연산을 진행**하게 됩니다. 또한 context vector를 추출하는 과정에서 정보를 압축하게 됩니다.

그러나 그로 인해 **병렬화가 불가능 하며, 연산 속도가 저하되는 문제점**이 발생합니다. Long-term dependency problem, 즉 **정보가 줄어듦에 따라 제대로된 예측을 할 수 없게 되는 것** 입니다. 정보 압축으로 인해 **손실이 발생**하게 된다는 문제점 또한 존재합니다.

![Untitled 3](https://user-images.githubusercontent.com/84653623/223362064-3cbfdb8f-8b2d-4acd-aafa-d678d99f9d3c.png)

## Seq2seq with Attention model

이러한 문제점을 개선하기 위해 소스 문장의 모든 레이어(각 토큰이 연결된)의 출력 전부를 입력으로 받는, seq2seq에 attention이 결합된 모델이 등장합니다. Attention이란, 결론적으로 단의의 전체적인 정보를 저장하는 것이라고 이해하시면 될 것 같습니다.

![Untitled 4](https://user-images.githubusercontent.com/84653623/223362066-52eb6e78-b2fa-4064-a410-3b802992d6ad.png)

구조를 그대로 두고 weight sum vector(h1 + h2 …)를 디코더의 RNN셀과  FC셀의 input으로 넣게 됩니다. 여기서 구해진 확률값, attention weight를 이용해 각 추력이 어떤 정보를 만히 참고해쓴지 확인할 수 있게 됩니다.

## Transformer

이후 등장한 Transformer는 CNN, RNN을 전혀 필요로 하지 않고 **attention만을 이용**합니다. 이의 경우 RNN처럼 문장 안의 각 단어 순서 정보를 주기 어려워 지는데, 이를 **Positional Encoding**을 이용하여 순서정보를 주게 됩니다.

인코더와 디코더로 구성되는 것은 동일하나 attention과정을 여러 레이어에서 반복, 즉 인코더가 N개 중첩되는 것입니다.

RNN, LSTM은 입력 단어 갯수만큼 인코더 레이어를 거쳐 hidden state를 만들지만, transformer는 단어가 하나로 연결되어 **병렬적으로 한번의 인코더를 거쳐 병렬적으로 출력값을 생성**하게 됩니다. 이를 통해 **계산 복잡도를 줄이게** 되었습니다.

![Untitled 5](https://user-images.githubusercontent.com/84653623/223362069-19f3e157-0dce-425e-8f6a-f99e7eefcc8e.png)

# Model Architecture

그럼 이제 transformer 모델의 구조에 대해 자세히 이야기해보도록 하겠습니다.

## Inputs

### Outline

Transformer는 앞서 이야기했듯이 인코더와 디코더로 구성되어 있습니다. 먼저 인코더의 input embedding을 살펴보면 fig 8과 같은 과정으로 진행이 됩니다. input 데이터는 수백만개의 문장 데이터입니다. 이 문장 데이터를 컴퓨터가 이해하기 위해서는 **문자인 단어를 숫자로 변경해야합니다**. 임베딩을 통해 우리는 문자인 단어들을 각각 잘 나타낼 수 있는 숫자로 변경합니다. 그리고 숫자로 변환된 데이터를 입력 데이터에 주게 됩니다.

![Untitled 6](https://user-images.githubusercontent.com/84653623/223362073-4c06feba-b3cc-4beb-bcca-54dc045e4f47.png)

### Byte Pair Encoding(BPE)

Transformer 모델은 자연어 문장을 분절한 토큰 시퀀스를 입력으로 받습니다. 따라서 문장에 **토큰화**를 수행해주어야 합니다. 토큰화 방법은 단어 단위, 문자 단위, 서브 단위 등 크게 3가지가 존재합니다. BPE는 1994년 제안된 데이터 압축 알고리즘이며, 자연어 처리의 서브워드 분리 알고리즘으로 응용되었습니다. 즉, 기존에 있던 단어를 분리하는 것으로,**글자 단위**에서 점차적으로 **단어 집합**을 만들어 내는 방향으로 접근합니다. 이를 통해 OOV(Out of Vocabulary)문제를 완화하였습니다.

### Positional Encoding

다음으로 positional encoding입니다. fig 9에서 보이는 바와 같이 중간에 삽입되어 있습니다. Positional encoding은 **주기 함수를 이용**하여 각 단어의 상대적인 위치 정보를 입력하게 됩니다. 앞에서 이야기하였듯이, Transformer는 RNN의 단점을 해결하고자 제시되었습니다. 따라서 positional encoding 계층을 사용하므로써 단어들이 순차적으로 들어오지 않고 뭉태기로 들어와도 단어들의 순서를 이해하면서 병렬적으로 연산이 가능합니다. 다시 말해, 단어 데이터들의 상대적인 위치 데이터를 제공하므로써 병렬 연산이 가능해지는 것 입니다.

![Untitled 7](https://user-images.githubusercontent.com/84653623/223362076-723ff165-8340-41fb-aa10-8936a39f843c.png)

fig 10을 통해 positional encoding의 식을 살펴볼 수 있습니다. 본 논문에서는 sinusoidal version을 사용했는데, 그 이유는 각 포지션의 **상대적인 정보**를 나타내야하며, **선형변환 형태로 나와 학습이 편리**하기 때문이라 이해하였습니다.

![Untitled 8](https://user-images.githubusercontent.com/84653623/223362077-4c7588e4-f568-4f73-9764-e86732489228.png)

## Multi-head Attention

### outline

논문에서는 self-attention(scaled dot-product attention) layer를 다중으로 구현한 multi-head attention을 제시하였습니다. Scaled dot-product attention의 구조는 fig 12에서 확인할 수 있습니다. 

![Untitled 9](https://user-images.githubusercontent.com/84653623/223362081-9b9d488e-4881-4f98-894c-bb21765f573c.png)

### Dot-product Attention & Scaling

Scaled-dot을 수식으로 표현하면 fig 14와 같습니다. 이때, 논문에선 attention을 concat이 아닌 dot으로 구현하였습니다. 그 이유를 살펴보자면, dim의 증가가 없음에 따라 **space가 efficient**하며, **matrix multiplication만으로 구현이 가능**하여 빠르기 때문입니다.

![Untitled 10](https://user-images.githubusercontent.com/84653623/223362083-52c453e9-f396-40b2-8f90-12e980fb3212.png)

그렇다면 기존의 dot-product attention에서 scaling을 진행한 이유는 무엇일까요?

그 이유는 fig 15에서 살펴볼 수 있듯이, **QK의 내적 값이 매우 커질 수 있기 때문**입니다. 왜 커지는가에 의문을 품을 수 있습니다. 그에 대해 보충 설명을 하자면, Q, K가 각각 gaussian(가우시안) 분포를 따른다고 가정했을 때 분산이 d_k가 됨을 확인할 수 있습니다.

![Untitled 11](https://user-images.githubusercontent.com/84653623/223362085-c2e091b1-5aea-45ff-95d4-7aad558b02e5.png)

QK의 내적 값이 매우 커지면 softmax의 scale variant한 특성을 만나 gradient vanishing이 발생하게 됩니다. 실제로 dim = 4인 경우, softmax의 jacobian(자코비안)은 fig 16과 같은데, 이 경우 scale이 크면 S = (1, 0, 0, 0)과 같은 형태가 되어 gradient vanishing이 발생합니다.

![Untitled 12](https://user-images.githubusercontent.com/84653623/223362012-dcd91405-23f6-4178-bdd3-d523384e1e63.png)

### Scaled Dot-product Attention

그렇다면 논문에서 이야기하는 Q, K, V가 의미하는 것은 무엇일까요? 

- Q = **Query vector** : 우리가 찾고 있는 벡터, **영향을 받는 벡터**
- K = **Key vector** : 어떤 종류의 정보가 있는지를 나타내는 벡터, **영향을 주는 벡터**
- V = **Value vector** : **주는 영향의 가중치 벡터**

Fig 17에 나와있듯이 scaled dot-product attention의 과정을 정리해보면, 먼저 입력을 Q, K, V로 처리하게 됩니다. 이후 matrix로 여러 입력을 처리하고, Q와 K 사이의 내적을 통해 Q, K 사이 유사도를 측정하게 됩니다. 이후 fig 18과 같이 softmax 함수에 대입하여 최종 attention 값 matrix를 얻게 됩니다. 다시 말해 **softmax(QK)V = Attention value matrix**와 같이 정리할 수 있겠습니다.

![Untitled 13](https://user-images.githubusercontent.com/84653623/223362015-7054ac4e-d732-4d9b-acd2-c682b9e0bec8.png)

![Untitled 14](https://user-images.githubusercontent.com/84653623/223362017-f598f039-a873-4dc5-a986-7abbac280bcc.png)

### Process

위에서 설명하였듯이 Q, K, V를 계산하여 concat(=concatenate)를 진행하게 됩니다.  concatenate은 사슬로 잇다라는 의미로 attention한 값들을 말 그대로 이어줍니다. 

![Untitled 15](https://user-images.githubusercontent.com/84653623/223362021-4b3efb40-1263-4322-878b-3ca7503191cb.png)
Multi-head attention으로 얻을 수 있는 이점을 살펴보면, 입력의 서로 다른 부분을 참조함에 따라 다양한 표현을 얻을 수 있습니다. 또한 이를 통해 ensemble 효과를 얻을 수 있다는 큰 이점을 갖고 있습니다. 여기서 앙상블 효과란, 하나의 모델만을 학습시켜 사용하는 것이 아닌 여러 모델을 학습시켜 결합하는 방식으로 문제를 처리하는 , 여러 측면에서 데이터를 바라보는 효과를 의미합니다.

![Untitled 16](https://user-images.githubusercontent.com/84653623/223362022-10fd110b-2bf7-4aa3-973e-8ac256b1e8af.png)

### 3-Type Attention

transformer에는 encoder self-attention, masked decoder self-attention, encoder-decoder attention의 총 3가지 Attention layer가 존재합니다. Encoder self-attention은 각 단어의 순열 전부를 참고하며, masked decoder self-attention은 치팅을 방지하지 위해 앞쪽 단어들만을 참고하게 됩니다. Encoder-decoder attention에서 query는 디코더, key와 value는 인코더에 있으며 positional encoding에서 주기함수를 활용해 각 단어의 상대적인 위치 정보를 입력하게 됩니다. 

![Untitled 17](https://user-images.githubusercontent.com/84653623/223362025-132d5b23-ab74-4caa-adbd-1d6437a026d7.png)

각 어텐션의 타입의 Q, K, V는 다음과 같이 표시할 수 있습니다.

- 인코더의 self-attention
    - Query = Key = Value
- 디코더의 masked self-attention
    - Query = Key = Value
- 디코더의 encoder-decoder attention
    - Query: 디코더 벡터 / Key = Value: 인코더 벡터

인코더의 self-attention과 디코더의 masked self-attention에서는 Q와 K, V가 모두 동일합니다. 그러나 디코더의 encoder-decoder attention은 Q로 decoder vector를, K&V로 encoder vector를 갖습니다.

![Untitled 18](https://user-images.githubusercontent.com/84653623/223362030-af353e35-b893-4f44-b24a-4c809fe5ea92.png)

또한 multi-head attention에서 decoder는 auto-regressive한 모델이기 때문에 masking을 필요로 합니다. Masking을 통해 Auto-regressive한 성질을 유지할 수 있습니다. Fig 24에서 볼 수 있듯이 y1은 x1만 참고하며, y2는 x1, x2를, 즉 이후 단계의 값은 참고하지 못하는 것입니다.

![Untitled 19](https://user-images.githubusercontent.com/84653623/223362031-a764a7cd-9174-4f17-a4e4-06f01aea9408.png)

![Untitled 20](https://user-images.githubusercontent.com/84653623/223362036-ab73ed78-476d-4363-a540-decfccaca366.png)

이러한 masked Decoder self-attention에 대해 조금더 살펴보도록 하겠습니다.

### decoder 내부의 attention

앞서 설명드린바와 같이 Transformer의 디코더에서는 인코더와 다르게 Masked Multi-head attention이 수행됩니다. 인코더는 input에 있는 내용을 이해하는 task라면, 디코더는 input에 있는 내용을 기반으로 output 내용을 예측하는 task이기 때문입니다. 그렇기 때문에 masking을 통해 output의 내용을 미리 컷닝하지 못하도록 막는 것입니다.

Multi-head attention과는 기본적으로 동일하지만, self attention 계산 수행시 현재 시점보다 앞에 위치한 시퀀스들만을 이용해 self attention을 수행하고, 뒤에 위치한 시퀀스는 참조하지 않다는 차이점을 갖고 있습니다. 기존 seq2seq와 같은 RNN(순환 신경망) 모델은 시퀀스가 순차적으로 입력되기 때문에 앞쪽부터 순차적으로 업데이트 되어온 hidden state를 다음 시퀀스 예측을 위해 사용하였습니다. 하지만 transformer 모델은 입력 시퀀스가 한번에 input으로 들어가기 때문에, 현재 시점보다 뒤에 오는 시퀀스의 정보마저도 알 수 있게 됩니다. 이를 방지하기 위해 masking을 한 뒤 self attention을 수행하는 것입니다. 

![Untitled 21](https://user-images.githubusercontent.com/84653623/223362037-ae270b41-c025-4078-86bc-20b00204f537.png)

지금부터 그 과정을 조금 더 살펴보도록 하겠습니다.

![Untitled 22](https://user-images.githubusercontent.com/84653623/223362039-39f3b5cf-afaf-4a3f-8f3b-ef97c54bb137.png)

fig 26의 a와 같이 ‘I am a boy’라는 벡터를 가정합니다. b는 이 벡터의  score를 나타냅니다. 여기서 흰 색 부분, 즉 현재 시점보다 뒤에 오는 값에 마스크를 씌워줍니다. 이를 표시한 것이 c입니다. masking을 수학적으로 구현할 때에는 포지션에 해당하는 score 값을 -inf(마이너스 무한대) 값으로 표기함으로 적용할 수 있습니다. 마스크 처리를 먼저 한 후 softmax를 취하면, d와 같은 Masked score vector가 생성됩니다.

![Untitled 23](https://user-images.githubusercontent.com/84653623/223362040-27e4cc73-9989-4216-8f89-cf675790f408.png)

이렇게 maksing된 값은 최종적으로 self attention을 거쳐 masked multi head attention을 완성하게 됩니다. 이렇게 디코더에서 완성된 값은 앞서 인코더에서 완성된 값과 병합을 해야합니다. 인코더에서 디코더로 값이 전달되는 과정에서 또한 어텐션 기법이 적용됩니다.

## Layer normalization

다음으로 Layer normalization입니다. layer normalization을 사용한 이유를 알아보기 위해  Batch normalization과 비교하여 함께 살펴보도록 하겠습니다.

![Untitled 24](https://user-images.githubusercontent.com/84653623/223362041-5f64e351-fdf3-41db-bf10-802a327b7e1e.png)

Batch normalization과 Layer normalization에 대해 본 논문에서는 다음과 같이 표현하고 있습니다.

> **Batch Normalization** : Estimate the normalization statistics from the summed inputs to the neurons **over a mini-batch of training case.**
> 

> **Layer Normalization** : Estimate the normalization statistics from the summed inputs to the neurons **within a hidden layer.**
> 

즉, Batch Normalization은 미니 배치 단위로 정규화를 하는 반면, Layer Normalization은 hidden layer의 input을 기준으로 평균과 분산을 계산하게 됩니다. 

이처럼 정규화의 단위가 다르기 때문에 Batch Normalization은 다음과 같은 단점이 존재합니다.

1. mini-batch 크기에 의존적이다.
2. Recurrent 기반 모델에 적용이 어렵다

반면에 Layer Normalization의 경우 이와 대비되는 다음과 같은 장점들이 존재합니다.

1. 데이터마다 각각 다른 normalization term(μ, σ)를 갖는다
2. mini-batch 크기에 영향을 받지 않는다. (즉, size = 1 이어도 작동한다.)
3. 서로 다른 길이를 갖는 sequence가 batch 단위의 입력으로 들어오는 경우에도 적용할 수 있다. (1번 특징 때문)

따라서 본 논문에서는 layer normalization을 사용하게 되었습니다.

## FFN

FFN의 역할에 대해서 알아보기 전에 Residual connection을 사용하는 이유를 간단히 이야기하고 넘어가도록 하겠습니다.

Transformer의 경우, 연산량이 많고 층이 깊어 일반화가 필요합니다. 따라서 차원이 같은 서브층의 입력과 출력을 더해 연산량을 줄여 모델의 학습을 돕게 됩니다.

![Untitled 25](https://user-images.githubusercontent.com/84653623/223362044-3eb73ced-7651-4838-b0a1-5817bbd6172c.png)

FFN은 Fully-connected feed forward network를 의미합니다. FFN의 수식과 그 수식을 도식화하면 fig 30과 같습니다. multi-head attention의 경우 선형 변환만 들어가있기 때문에 활성화 함수(activation function)를 추가하고 활성화 함수 이전과 이후에 fully-connected layer를 삽입함으로써 비선형성을 추가하는 역할을 합니다.

![Untitled 26](https://user-images.githubusercontent.com/84653623/223362048-f029180c-a02e-4b03-9dd6-2e7ef85beac5.png)


---
# Training

## Data & Batching

Traininig에 사용된 데이터와 배치는 다음과 같습니다.

- Standard WMT 2014 English-German dataset
    - 4.5 million sentence pairs
    - encoded using BPE, 37,000 tokens
- Larger WMT 2014 English-French dataset
    - 36 million sentences
    - split tokens into 32,000 word-piece vocabulary
- Batched together by approximate sequence length
    - Each training batch contained a set of sentence pairs
    - containing approximately 25,000 source tokens and 25,000 target tokens

## Optimizer & Scheduler

Training에는 Adam optimizer를 사용하였습니다. 또한 fig 31에서 볼 수 있듯이 시점에 따라 learning rate를 다르게 하였습니다. 

![Untitled 27](https://user-images.githubusercontent.com/84653623/223362049-ab43a551-6bff-48ae-ad4e-57640ed9f83b.png)

warmup-step인 첫번째 training step에서는 lr을 선형적으로 증가시켰으며, 그 후로는 step number의 inverse square root에 비례하게 감소시켰습니다.

## Regulation

또한 Residual dropout과 Label smoothing 기법을 regulation으로 사용하였습니다. 라벨 스무딩이란 라벨에 노이즈를 추가함으로써 의도적으로 hard target을 soft target으로 바꾸는 기법을 말합니다.

본 논문에서는 두 기법을 통해 accuracy와 BLEU score를 향상시켰다고 언급하고 있습니다. 

![Untitled 28](https://user-images.githubusercontent.com/84653623/223362051-164c0c97-add4-4cbf-b52d-4a23d8b734b7.png)



---
# Experiments

## BLEU & PPL

본 논문에서는 BLEU와 PPL을 이용하여 성능을 평가하고 있습니다. BLEU는 기계 번역 결과와 사람이 직접 번역한 결과가 얼마나 유사한지 비교하여 번역에 대한 성능을 측정하는 방법입니다. 측정 기준은 n-gram을 기반합니다. (n-gram의 정의는 모든 단어를 고려하는 것이 아닌, 일부 단어 몇 개를 보는데, 이때 몇 개가 곧 n-gram의 n입니다.) 

n-gram에 비해 좀 더 생소한 PPL에 대해 이야기해보도록 하겠습니다. 두 개의 모델 A, B가 있을 때 이 모델의 성능은 어떻게 확인할 수 있을지 생각해봅시다. 두 개의 모델을 오타 교정, 기계 번역 등의 평가에 투입해 볼 수 있겠습니다. 그러나 이러한 평가보다는 조금 부정확할 수는 있어도 테스트 데이터에 대해서 빠르게 식으로 계산되는 더 간단한 평가 방법이 존재합니다. 바로 모델 내에서 자신의 성능을 수치화하여 결과를 내놓는 perplexity, PPL입니다. PPL이 ‘낮을 수록’ 언어 모델의 성능이 좋다는 것을 의미합니다. fig 33에서 볼 수 있는 수식은 꽤나 어렵게 느껴질 수 있습니다. 그러나 예를 통해 간단히 설명해보겠습니다.

![Untitled 29](https://user-images.githubusercontent.com/84653623/223362052-3bcd4396-5bad-482c-9aa8-2bee89719419.png)

PPL이 10이 나왔다고 가정해봅시다. 그렇다면 해당 언어 모델은 테스트 데이터에 대해서 다음 단어를 예측하는 모든 시점(time step)마다 평균 10개의 단어, 즉 선택지를 가지고 어떤 것이 정답인지 고민하고 있다고 볼 수 있습니다. 즉, 보다 적은 선택지를 가지고 고민하는 것이 모델의 성능이 높다는 것을 의미하겠습니다.

단, PPL은 이처럼 테스트 데이터에 의존하므로 두 개 이상의 언어 모델을 비교할 때는 정량적으로 양이 많고, 또한 도메인에 알맞는 테스트 데이터를 사용해야 할 것입니다.

## Translation

fig 34를 보면  2가지 transformer 모델이 존재합니다.

![Untitled 30](https://user-images.githubusercontent.com/84653623/223362054-f1749afe-caf6-4ad0-a8d4-1be667bb81e9.png)

- Transformer (base model) : 체크포인트 5개에 평균을 낸 단일 모델
- Transformer (big) : 체크포인트 20개의 평균을 냈고 beam size가 4이고 length penalty가 0.6인 beam search도 사용

big model의 경우, BLEU 스코어에서 EN-DE(영어-독일어), EN-FR(영어-프랑스어) 번역 task에서 가장 좋은 점수인 SOTA를 기록했습니다. 또한 training cost의 경우, base model이 기타 다른 모델(ConcS2S)과 비교했을 때 cost가 낮음을 확인할 수 있습니다. big model도 마찬가지로 cost가 높다고는 볼 수 없습니다.

## Parsing

parsing의 경우에서도 fig 35와 같이 2가지로 나누어 확인할 수 있습니다. 

- Transformer (WSJ only) : WSJ dataset(40K)만 활용
- Transformer (semi-supervised) : Berkly Parser Corpora(17M)을 학습

![Untitled 31](https://user-images.githubusercontent.com/84653623/223362057-c4c20eab-0cc0-4573-b2ad-1ef913ff7e6d.png)

Transformer (WSJ only)는 번역전용 모델이었음에도 불구하고 parser 전문으로 만들었던 RNN Grammer(Dyer et al.(2016))을 제외하고 좋은 퍼포먼스를 보여주었습니다. 또한 Transformer(semi-supervised)의 경우 다른 task와 비교해서 해당 task가 훨씬 더 좋은 성능을 보였음을 제시하였습니다.

해당 실험을 통해 트랜스포머가 다른 task에서도 유용함을 보여주었습니다.


---
# 요약하자면

Transformer는 기존의 RNN, seq2seq 모델의 한계였던 병렬화 불가능과 연산 속도 저하의 문제를 해결하는 attention 기법을 도입하였습니다. 병렬적 연산을 통해 계산 복잡도를 줄였습니다. 구조에서 주의깊게 볼 점은 역시나 attention의 적용과 self-attention, masked self attention일 것 입니다.

 transformer를 기점으로 NLP는 큰 발전을 이루었습니다. BERT와 GPT 또한 transformer의 인코더와 디코더 만을 이용해서 만들었으며, 최근 붐이 일고 있는 ChatGPT 또한 GPT를 기반으로 하다보니 transformer에서 파생되었다고 할 수 있겠습니다.


---
- **참고 문헌**

    [Attention is all you need](https://arxiv.org/abs/1706.03762)

    [Attention is all you need paper 뽀개기](https://pozalabs.github.io/transformer/)
    
    [1. Attention Is All You Need](https://welcome-to-dewy-world.tistory.com/108)
    
    [Python, Machine & Deep Learning](https://greeksharifa.github.io/nlp(natural%20language%20processing)%20/%20rnns/2019/08/17/Attention-Is-All-You-Need/)
    
    [Have A Nice AI](https://kmhana.tistory.com/28)
    
    [Attention Is All You Need(transformer) paper 정리](https://omicro03.medium.com/attention-is-all-you-need-transformer-paper-%EC%A0%95%EB%A6%AC-83066192d9ab)
    
    [[NLP] Attention Is All You Need 번역 및 정리 (Transformer)](https://silhyeonha-git.tistory.com/16)
---
PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. 긴 글 읽어주셔서 감사합니다. 
