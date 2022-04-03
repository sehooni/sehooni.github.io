---
published: true
title:  "[DL, ML] ANN, DNN, CNN, RNN 개념과 차이"
excerpt: "ANN, DNN, CNN, RNN 개념과 차이"
toc: true
toc_sticky: true

categories:
  - DL, ML
tags: [DL, ML]

date: 2022-04-03
last_modified_at: 2022-04-03T15:00:00-16:30:00
classes: wide
---

딥러닝을 공부하다보면 인공지능, 머신러닝 그리고 딥러닝이라는 단어가 많이 등장한다. 또한 인공신경망을 설명하는 과정에서도 ANN, DNN, CNN, RNN등 다양하게 등장한다. 세부적으로 들어가기에 앞서 각 단어의 의미를 살펴보도록하자.

# 인공지능, 머신러닝, 딥러닝

- **인공지능**(Artificial Intelligence): 인간의 지능을 갖고 있는 기능을 갖춘 컴퓨터 시스템. 인간의 지능을 기계 등에 인공적으로 구현한 것

- **머신러닝**(Machine Learning): 기계학습이라고도 불리우며, 인공지능의 한 분야이다. 컴퓨터가 학습할 수 있도록 하는 알고리즘과 기술을 개발하는 분야

- **딥러닝**(Deep Learning): 여러 비선형 변환기법의 조합을 통해 높은 수준의 추상화(다량의 복잡한 자료들에서 핵심적인 내용만 추려내는 작업)을 시도하는 기계학습 알고리즘의 집합

#### 그림.1 인공지능, 머신러닝, 딥러닝의 구조
![introduction of DL structure](https://user-images.githubusercontent.com/84653623/161415534-43ce2091-ac1c-4a05-96c8-be980a9e79d0.png)


그림 1과 같이 가장 포괄적인 인공지능 분야 안에 머신러닝이 속하고, 머신러닝 분야 속에 딥러닝 분야가 속해있다고 생각하면 된다.


# ANN, DNN, CNN, RNN
## ANN(Artificial Neural Network)

머신러닝의 한 분야인 딥러닝은 **인공신경망**(Artificial Neural Network)를 기초로 하고 있다. 인공신경망이라고 불리는 ANN은 `사람의 신경망 원리와 구조를 모방하여 만든 기계학습 알고리즘`이다. 인간의 뇌에에서 뉴런들이 어떤 신호, 자극 등을 받고, 그 자극이 어떠한 임계값(threshold)을 넘어서면 결과 신호를 전달하는 과정에서 착안한 것이다. 여기서 들어온 자극, 신호는 인공신경망에서 Input Data이며 임계겂은 가중치(weight), 자극에 의해 어떤 행동을 하는 것은 Output Data에 비교하면 된다.

#### 그림.2 ANN
![ANN structure](https://user-images.githubusercontent.com/84653623/161415878-76a6c9f1-9e06-411f-8f89-663727a4b79a.png)

인공신경망은 시냅스의 결합으로 네트워크를 형성한 인공뉴런(Node)이 학습을 통해 시냅스의 결합 세기를 변화 시켜 문제 해결 능력을 가지는 모델 전반을 의미한다. (출처: 위키백과)

다시 말해, 그림 2와 같이 다수의 입력 데이터를 받는 입력층(Input layer), 데이터의 출력을 담당하는 출력층(Output layer), 입력과 출력층 사이에 존재하는 레이어들(은닉층, hidden layer)이 존재한다. 여기서 히든 레이어들의 갯수와 노드의 개수를 구성하는 것을 모델을 구성한다고 말한다. 이 모델을 잘 구성하여 원하는 Output 값을 잘 예측하는 것이 우리가 해야할 일이다. 은닉층에서는 활성화함수(Activation Fuction)를 사용하여 최적의 가중치(weight)와 바이어스(Bias)를 찾아내는 역할을 한다.

### ANN의 문제점

- 학습과정에서 파라미터의 최적값을 찾기 어렵다.
출력 값을 결정하는 활성화 함수의 사용은 기울기 값에 의해 weight가 결정되었다. 이런 gradient값이 뒤로 갈수록 점점 작아져 0에 수렴하는 오류를 발생시키기도 하며, 부분적인 에러를 최저 에러로 인식하여 더이상 학습을 하지 않는 경우도 있다.

- 과적합(Overfitting)에 따른 문제

- 학습시간이 너무 느리다.
은닉층이 많으면 학습하는 데에 정확도가 올라가지만 그만큼 연산량이 기하 급수적으로 늘어나게 된다.

하지만 이러한 문제들은 점점 해결되고 있다. 느린 학습시간은 그래픽카드의 발전으로 많은 연산량도 감당할 수 있을 정도로 하드웨어의 성능이 좋아졌으며, 과적합문제는 사전 훈련을 통해 방지할 수 있게 되었다.


## DNN(Deep Neural Network)

#### 그림.3 NN vs DNN
![NNvsDNN](https://user-images.githubusercontent.com/84653623/161416432-a7afea8a-ca6b-443d-bfa9-302796ba8fdd.png)

ANN 기법의 여러 문제가 해결됨에 따라 모델 내의 은닉층을 많이 늘려서 학습의 결과를 향상시키는 방법이 등장했다. 이를 DNN(Deep Neural Network)라고 한다. 

`DNN은 은닉층을 2개 이상 지닌 학습 방법`을 뜻한다. 컴퓨터가 스스로 분류레이블을 만들어 내고 공간을 왜곡하고 데이터를 구분짓는 과정을 반복하여 최적의 구분선을 도출해낸다. 많은 데이터와 반복학습, 사전학습, 그리고 오류역적파 기법을 통해 현재 널리 사용되고 있다. 그리고, DNN을 응용한 알고리즘이 바로 CNN, RNN인 것이며, 이 외에도 LSTM, GRU 등이 있다.

## CNN(Convolution Neural Network, 합성곱신경망)

기존의 방식은 데이터에서 정보를 추출해 학습이 이루어졌지만, CNN은 데이터의 특징을 추출하여 특징들의 패턴을 파악하는 구조이다. 이러한 CNN 알고리즘은 **Convolution** 과정과 **Pooling** 과정을 통해 진행된다. `Convolution Layer와 Pooling Layer를 복합적으로 구성하여 알고리즘을 만드는 것`이다.

#### 그림.4 CNN
![CNN](https://user-images.githubusercontent.com/84653623/161416538-d3a66a4e-63cb-4af0-acc9-67405df183c5.png)

### Convoluton

`데이터의 특징을 추출하는 과정`으로 데이터에 각 성분의 인접 성분들을 조사해 득징을 파악하고 파악한 특징을 한장으로 도출시키는 과정이다. 여기서 도출된 정보를 Convolution Layer라고 한다. 이 과정은 하나의 압축 과정이며, 파라미터의 갯수를 효과적으로 줄여주는 역할을 한다.

#### 그림.5 CNN-Convolution
![convolution](https://user-images.githubusercontent.com/84653623/161416997-c4239118-e778-4486-97a1-40388f13108a.png)

### Pooling

Convolution 과정을 거친 레이어의 사이즈를 줄여주는 과정이다. 단순히 데이터의 사이즈를 줄여주고, 노이즈를 상쇄시키고 미세한 부분에서 일관적인 특징을 제공한다. 

#### 그림.6 Pooling
![pooling](https://user-images.githubusercontent.com/84653623/161417048-20e5429f-1907-43bc-9e10-af6b5d0b0712.jpg)

CNN은 보통 정보추출, 문장분류, 얼굴인식 등의 분야에서 널리 사용되고 있다.


## RNN(Recurrent Neural Network, 순환신경망)

RNN 알고리즘은 `반복적이고 순차적인 데이터(Sequential Data)학습에 특화된 인공신경망의 한 종류로써 내부의 순환구조가 들어있다는 특징`을 가지고 있다. 순환구조를 이용하여 과거의 학습을 Weight를 통해 현재 학습에 반영하는 것이다. 즉, `기존의 지속적이고 반복적이며 순차적인 데이터학습의 한계를 해결하는 알고리즘`이다. 현재의 학습과 과거의 학습의 연결을 가능하게 하고, 시간에 종속된다는 특징을 갖고 있다. 음성 웨이브폼을 파악하거나, 텍스트의 앞 뒤 성분을 파악할 때 주로 사용된다.

#### 그림.7 RNN
![RNN](https://user-images.githubusercontent.com/84653623/161417100-e04b1a46-3998-423f-bdd7-5e7fdef08399.png)


이와같이 인공지능, 머신러닝, 딥러닝의 차이를 알아보고, ANN, DNN, CNN, RNN의 구조 및 차이점을 알아보았다. 공부하면 할수록 내가 아직 부족하다는 것을 느끼지만, 그럼에도 한 걸음 더 내딛었다는 사실을 생각하며 끊임없이 노력해야지 :)