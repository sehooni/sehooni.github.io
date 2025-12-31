---
layout: single
title:  "[CV] ImageNet Classification with Deep Convolutional Neural Networks(CNN)"
excerpt: "CNN_Paper 리뷰"
toc: true
toc_sticky: true

categories:
  - PaperReview
tags: [PaperReview, CV, CNN]
use_math: true

last_modified_at: 2022-04-28T16:30:00-20:04:00
classes: wide
---

# CNN이란?
CNN이란, **Convolutional Neural Network**의 준말로 합성곱 신경망이라 불린다.
입력 이미지로부터 특징을 추출하여 입력이미지가 어떤 이미지인지 클래스를 분류하게 되는 것이다.
대게 이미지 및 비디오 인식, 추천 시스템, 이미지 분류, 의료 이미지 분석 및 자연어처리에 이용된다.

## ANN과 CNN
ANN은 **Artificial Neural Network**의 준말로 사람의 신경망 원리와 구조를 모방하여 만든 기계학습 알고리즘이다. 이와 관련한 내용은 [[DL] ANN, DNN, CNN, RNN 개념과 차이](https://sehooni.github.io/dl/ANN,DNN,CNN,RNN/) 에 명시해두었다.

본론으로 돌아와 ANN과 비교하여 CNN을 알아보자면, 일반 신경망, ANN은 이미지 전체를 하나의 데이터로 입력하기 때문에 
이미지의 특성을 찾지 못하고 이미지의 위치가 변형되거나 왜곡된 경우에는 올바른 성능을 기대할 수 없게 된다. 즉, `데이터의 형상이 무시되는 것이다.`

이에 반해 합성곱 신경망, CNN은 이미지를 하나의 데이터가 아닌 여러개로 분할하여 처리한다. 이에 따라 이미지가 왜곡되더라도 이미지의 부분적 특성을 추출할 수 있어 올바른 성능을 낼 수 있다.

### 그림 1. ANN과 CNN
![ANN과 CNN](https://user-images.githubusercontent.com/84653623/165703614-c50e182f-25fa-4c5e-a45c-001cbe4d11c6.png)

이와 관련한 내용은 위의 그림을 통해서 쉽게 확인 가능하다.

### 그림 2. CNN의 진행순서
![CNN의 진행순서](https://user-images.githubusercontent.com/84653623/165703938-4905c417-1e76-4617-b4dd-cbdc3fd33f66.png)

위의 그림은 CNN의 진행순서를 간략하게 도식화한 것이다. 데이터가 입력되면 `Convolution`, `ReLu function`, `Pooling`과정을 거쳐 특징을 분석하게 된다.
이후 `flatten`, `fully connected`, `Softmax function`을 통해 classification을 진행하게 된다.


# CNN의 구조
기존 신경망의 구조는 인접하는 계층의 모든 뉴런이 결합된 완전연결로 `affine 계층으로 구성`된다. 
그러나 CNN의 경우, 신경망 구조에서 합성곱 계층과 풀링층이 추가되었다. 또한 풀링층은 때에 따라 생략이 가능하다. 

## CNN의 구조

### 그림 3. CNN의 구조 1
![CNN의 구조](https://user-images.githubusercontent.com/84653623/165707470-339d138e-a0df-43d1-832b-38ee36f1f8ab.png)

### 그림 4. CNN의 구조 2
![CNN의 구조2](https://user-images.githubusercontent.com/84653623/165729172-47445bfc-969e-4f30-a876-f273960f5f5e.png)

위의 <그림 3>과 <그림 4>를 통해 CNN의 구조를 확인할 수 있다.

# Convolution
본 내용을 설명하기에 앞서 bias는 편향을 의미한다. 합성곱 연산, **Convolution**의 bias는 데이터에 bias가 더해지는 과정이다.
덧셈연산이라고 생각하면 이해하기 쉽다. 완전 연결 신경망에는 가중치(Weight) 매개변수와 bias가 존재하게 된다.
`CNN에서는 이와 유사하게 필터와 bias가 학습을 시킬 매개변수이다. `
`다시 말해, 이미지 처리에서 말하는 필터 연산에 해당하는 것이다.`

## stride
stride는 지정된 간격으로 필터를 순회하는 간격을 의미한다. 아래의 <그림 6>에서는 stride가 1로 설정된 것이며,
stride가 2로 설정되면 필터는 2칸씩 이동하면서 합성곱을 계산한다.

### 그림 5. 합성곱 연산 과정 1
![합성곱 연산과정 1](https://user-images.githubusercontent.com/84653623/165711865-7153cc40-3954-45d9-9db4-31715447b868.png)

위의 그림과 같이 bias는 항상 하나의 값($1 \times 1$)으로 존재하며 필터를 적용한 후 모든 원소에 더해지게 된다.
즉 CNN을 통해 학습이 거듭되며 필터의 원소값과 bias가 매번 갱신되는 것이다.

### 그림 6. 합성곱 연산 과정 2
![합성곱 연산과정 2](https://user-images.githubusercontent.com/84653623/165712067-9aa6e8fb-6d79-492a-9664-e866786d09cd.jpg)

2차원의 입력 데이터가 들어오면, 필터의 윈도우가 일정 간격으로 이동해가며 연산이 적용된다.
이때 이 이동과정을 `Stride`라고 한다. 
이 과정을 모든 장소에서 진행하고, 위의 사진 오른쪽과 같은 합성곱 연산의 출력이 완성된다.


# Padding
**Padding**은 기존 데이터 주변에 값들을 채워넣어 크기를 키우는 것이다.
Convolution 과정은 특징을 추출하는 것을 목표로 한다. 

그러나, Padding이 없이 진행되면 Convolution 연산 후에는 *'의도치 않게'* 이미지의 크기가 작아지게 된다.
이는 Edge 성분이 점차 사라지게 되고, 이에 따라 Edge 근처의 특징을 누락할 수 있다.
따라서 Padding을 통해 Convolution 연산을 하게 되더라도, 그 결과 이미지가 입력 이미지와 그 크기를 동일하게 유지하면서 특징을 추출할 수 있다.

## Padding의 종류
데이터 주변에 어떠한 값을 채우느냐에 따라 padding의 종류가 나뉜다.
- Zero Padding : 최외각을 모두 pixel 0으로 설정
- Same Padding : 최외각을 모두 이미지 외곽의 pixel 값으로 사용

### 그림 7. Zero Padding 원리
![padding](https://user-images.githubusercontent.com/84653623/165729269-37476345-7114-4ddb-a790-735ece84d5f7.jpg)

<그림 7>은 zero padding의 원리를 설명한 그림이다.

# Pooling
CNN의 구조를 살펴보면 `Conv → Pooling → Conv → Pooling~~`의 순서로 진행된다.

Convolution 연산 후, FC Layer(Fully-Connected Layer)로 바로 연결될 경우, 입력 이미지를 그대로 가져와 연산을 진행하게 된다.
이 때문에 FC Layer에서의 연산량이 기하급수적으로 증가하게 된다. `이러한 연산량을 줄이기 위해 Pooling이라는 과정을 추가하여, 연산 후 크기를 '적당히' 줄이고 특정 feature를 강조한다.`
그렇다면 특정 feature를 강조한다는 것은 무슨 의미일까?

특정 feature를 강조한다는 것은 `Convolution 이미지의 특징을 추출하고, 그 결과 속에서 특정 특징을 강조한다`는 의미이다. 

Convolution이 행렬(matrix)의 연산이라면, Pooling은 각 Pixel에서 하나의 값을 뽑아내는 것이다.

## Pooling의 종류
pooling은 두 가지 종류로 구성된다. 
- Max Pooling : 윈도우 창 내에서 각 원소들 중 가장 큰 값을 추출
- Average Pooling : 윈도우 창 내에서 각 원소들의 평균 값을 추출

### 그림 8. Pooling의 원리
![pooling](https://user-images.githubusercontent.com/84653623/165735542-9f473be7-2f0a-4c3f-9de8-211121dce50f.png)

<그림 8>을 통해 Pooling의 원리를 살펴볼 수 있다.

# 요약하자면...

CNN(Convolution Neural Network)은 이미지의 공간정보를 유지하면서 인접 이미지와의 특징을 효과적으로 인식하고 강조하는 방식으로 이미지의 특징을 추출하는 부분과 이미지를 분류하는 부분으로 구성된다.
특징 추출 영역은 필터를 사용하여 공유 파라미터 수를 최소화하면서 이미지의 특징을 찾는 Convolution Layer와 특징을 강화하고 모으는 Pooling Layer로 구성된다.

CNN은 필터의 크기를 비롯하여 Stride, Padding과 Pooling의 크기로 출력 데이터 크기를 조절하고, 필터의 개수로 출력 데이터의 채널을 결정한다.

CNN은 같은 레이어 크기의 FCNN과 비교해 볼 때 학습 파라미터의 양이 현저히 적다. 은닉층이 깊어질 수록 그 차이는 더 커지게 된다. 
`즉, CNN은 더 작은 학습 파라미터로 더 높은 인식률을 제공`하는 것이다. 

본 논문에는 특징 추출과 분류로 구성이 되어있으나, 이번 포스팅에서는 특징 추출 부분에 포커스를 맞추어 진행하였다.

---
PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. 긴 글 읽어주셔서 감사합니다. 


# Reference
- 논문: [ImageNet Classification with Deep Convolutional Neural Networks](https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html)
- '기계학습(Machine Learning)/오일석 저자' 강의 자료
