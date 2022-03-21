---
layout: single
title:  "[ML] Linear Regression 정리"
excerpt: "Linear Regression"

categories:
  - ML
tags: [ML]

last_modified_at: 2022-03-21T18:10:00-19:19:00
classes: wide
---

학교 수업으로 타학과 전공인 '인공지능과 딥러닝'을 수강하게 되었다.
오일석 교수님의 <Machine Learning 기계학습> 을 기반으로 진행되는 강의이다.

Perceptron을 설명하면서 Linear regression을 직접 코딩을 통해 실습하는 시간을 가졌는데, 아래의 내용은 그 실습 내용을 정리한 것이다.


# Linear regression
Author: Seungjae Lee(이승재)

모두를 위한 딥러닝을 참고하였습니다.

## Theoretical Overview
$$ H(x) = Wx + b $$
$$ cost(W, b) = \\frac{1}{m} \\sum^m_{i=1} \\left( H(x^{(i)}) - y^{(i)} \\right)^2 $$

- $H(x)$: 주어진 $x$ 값에 대해 예측을 어떻게 할 것인가\n,
- $cost(W, b)$: $H(x)$ 가 $y$ 를 얼마나 잘 예측했는가

## Import
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    import torch.optim as optim

## For reproducibility
    torch.manual_seed(1)

## Data
다음 예제를 위해 예시 데이터를 사용하여보자.
(We will use fake data for this example.) 
    x_train = torch.FloatTensor([[1], [2], [3]])
    y_train = torch.FloatTensor([[1], [2], [3]])
    print(x_train)
    print(x_train.shape)
    print(y_train)
    print(y_train.shape)
기본적으로 Pytorch는 NCHW 형태이다.

## Weight Initialization
    W = torch.zeros(1, requires_grad=True)
    print(W)
    b = torch.zeros(1, requires_grad=True)
    print(b)

## Hypothesis
$$ H(x) = Wx + b $$
    hypothesis = x_train * W + b
    print(hypothesis)

## Cost
$$ cost(W, b) = \frac{1}{m} \sum^m_{i=1} \left( H(x^{(i)}) - y^{(i)} \right)^2 $$

    print(hypothesis)
    print(y_train)
    print(hypothesis - y_train)
    print((hypothesis - y_train) ** 2)
    cost = torch.mean((hypothesis - y_train) ** 2)
    print(cost)

## Gradient Descent
    optimizer = optim.SGD([W, b], lr = 0.01)
    optimizer.zero_grad()
    cost.backward()
    optimizer.step()
    print(W)
    print(b)

가설이 잘 작동하는지 확인하여 보자.
(Let's check if the hypothesis is now better.)

    hypothesis = x_train * W + b
    print(hypothesis)
    cost = torch.mean((hypothesis - y_train) ** 2)
    print(cost)

## Training with Full Code
In reality, we will be training on the dataset for multiple epochs. This can be done simply with loops.

    # 데이터
    x_train = torch.FloatTensor([[1], [2], [3]])
    y_train = torch.FloatTensor([[1], [2], [3]])

    # 모델 초기화
    W = torch.zeros(1, requires_grad=True)
    b = torch.zeros(1, requires_grad=True)

    # optimizer 설정
    optimizer = optim.SGD([W, b], lr = 0.01)

    nb_epochs = 1000
    for epoch in range(nb_epochs + 1):
            
        # H(x) 계산
        hypothesis = x_train * W + b
            
        # cost 계산
        cost = torch.mean((hypothesis - y_train) ** 2)
            
        # cost로 H(x) 개선
        optimizer.zero_grad()
        cost.backward()
        optimizer.step()
            
        # 100번마다 로그 출력
        if epoch % 100 == 0:
            print('Epoch {:4d}/{} W: {:.3f}, b: {:.3f} Cost: {:.6f}'.format(
                    epoch, nb_epochs, W.item(), b.item(), cost.item()
            ))

## High-level implementaion with `nn.Module`
Remember that we had this fake data.

    x_train = torch.FloatTensor([[1], [2], [3]])
    y_train = torch.FloatTensor([[1], [2], [3]])

### 이제 linear regression 모델을 만들면 되는데, 기본적으로 Pytorch의 모든 모델은 제공되는 `nn.Module`을 inherit 해서 만들게 된다.

    class LinearRegressionModel(nn.Module):
        def __init__(self):
            super().__init__()
            self.linear = nn.Linear(1, 1)
            
        def forward(self, x):
            return self.linear(x)

### 모델의 `__init__`에서는 사용할 레이어들을 정의하게 된다. 여기서 우리는 linear regression 모델을 만들기 때문에, `nn.Linear`를 이용할 것이다. 그리고 `forward`에서는 이 모델이 어떻게 입력값에서 출력값을 계산하는지 알려준다.

    model = LinearRegressionModel()

## Hypothesis
이제 모델을 생성해서 예측값 *H(x)* 를 구해보자
    hypothesis = model(x_train)
    print(hypothesis)

## Cost
이제 mean squared error (MSE)로 cost를 구해보자. MSE 역시 PyTorch에서 기본적으로 제공한다.

    print(hypothesis)
    print(y_train)
    cost = F.mse_loss(hypothesis, y_train)
    print(cost)

## Gradient Descent
마지막 주어진 cost를 이용해 *H(x)* 의 *W* , *b* 를 바꾸어서 cost를 줄여봅시다. 이때 PyTorch의 `torch.optim`에 있는 `optimizer`들 중 하나를 사용할 수 있다.

    optimizer = optim.SGD(model.parameters(), lr=0.01)
    optimizer.zero_grad()
    cost.backward()
    optimizer.step()

## Training with Full Code
이제 Linear Regression 코드를 이해했으니, 실제로 코드를 돌려 피팅하여보자.

    # 데이터
    x_train = torch.FloatTensor([[1], [2], [3]])
    y_train = torch.FloatTensor([[1], [2], [3]])

    # 모델 초기화
    model = LinearRegressionModel()

    # optimizer 설정
    optimizer = optim.SGD(model.parameters(), lr=0.01)

    nb_epochs = 1000
    for epoch in range(nb_epochs + 1):
        
        # H(x) 계산
        prediction = model(x_train)
            
        # cost 계산
        cost = F.mse_loss(prediction, y_train)
            
        # cost로 H(x) 개선
        optimizer.zero_grad()
        cost.backward()
        optimizer.step()
            
        # 100번 마다 로그 출력
        if epoch % 100 == 0:
            params = list(model.parameters())
            W = params[0].item()
            b = params[1].item()
            print('Epoch {:4d}/{} W: {:.3f}, b: {:.3f} Cost: {:.6f}'.format(
                epoch, nb_epochs, W, b, cost.item()
            ))
        
점점 *H(x)* 의 *W* 와 *b* 를 조정해서 cost가 줄어드는 것을 볼 수 있다.
