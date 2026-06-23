---
title:  "[ML Study] 선형 회귀와 최적화: 정규방정식부터 경사하강법(GD)까지"
excerpt: "머신러닝의 기초인 선형 회귀(Linear Regression) 모델의 정의와 최적의 가중치를 찾기 위한 두 가지 학습 방법인 정규방정식 및 경사하강법(Gradient Descent)의 수학적 원리 정리"
categories:
  - AI, DL, ML
tags:
  - AI, DL, ML
  - Linear Regression
  - Optimization
  - Gradient Descent
toc: true
toc_sticky: true
use_math: true
date: 2025-11-25
last_modified_at: 2025-11-25
---
<!--
⚠️ Math Rendering Rules ⚠️
1. Do NOT wrap math expressions in backticks (` `).
   - INCORRECT: `$x + y$`
   - CORRECT: $x + y$
2. Do NOT wrap math delimiters (`$`) in bold (`**`) or italics (`*`).
   - INCORRECT: **$x$**
   - CORRECT: $x$ or $\mathbf{x}$
3. Format exponents using math mode (e.g., for 2 to the power of n).
   - INCORRECT: 2^n
   - CORRECT: $2^n$
4. Use $ for inline math and $$ for block math.
-->

## Introduction

머신러닝의 궁극적인 목표는 주어진 데이터로부터 패턴을 학습하여, 한 번도 보지 못한 새로운 데이터에 대해 유효한 예측을 수행하는 **일반화(Generalization)를** 달성하는 것입니다. 이를 위해 우리는 해결하고자 하는 문제에 따라 적절한 모델(가설 공간 $\mathcal{H}$)과 예측의 잘못된 정도를 측정할 손실 함수(Loss function, $\ell$)를 정의하고, 이 손실을 최소화하는 파라미터를 찾는 **최적화(Optimization)** 과정을 거칩니다.

![Machine Learning Process](/assets/images/2025-11-25-linear-regression-and-optimization/page_3.png)

이번 포스트에서는 머신러닝 최적화 이론의 첫걸음이자 가장 대표적인 회귀 모델인 **선형 회귀(Linear Regression)와**, 이 모델을 학습시키기 위한 두 가지 핵심 방법론인 **정규방정식(Normal Equation)** 및 **경사하강법(Gradient Descent)에** 대해 자세히 알아보겠습니다.

---

## 1. 머신러닝의 기초 다지기

선형 회귀를 배우기 전에, 머신러닝 시스템을 구성하는 몇 가지 기본 개념과 용어를 짚고 넘어가겠습니다.

### 분류(Classification) vs 회귀(Regression)
머신러닝이 해결하는 지도 학습(Supervised Learning) 문제는 크게 예측하고자 하는 타깃 변수의 형태에 따라 두 가지로 분류됩니다.
* **분류 (Classification):** 이메일이 스팸인지 아닌지(이진 분류), 혹은 손글씨 숫자가 0부터 9 중 어떤 숫자인지(다중 분류)와 같이 **이산적인 범주(Category)를** 예측하는 작업입니다.
* **회귀 (Regression):** 온도에 따른 화학 용액의 반응 속도 예측, 혹은 주택의 여러 특성을 바탕으로 한 가격 예측과 같이 **연속적인 수치(Continuous Quantity)를** 예측하는 작업입니다.

![Classification vs Regression](/assets/images/2025-11-25-linear-regression-and-optimization/page_4.png)

### "모델을 학습한다"는 것의 진짜 의미
머신러닝에서 모델을 학습(Training)시킨다는 것은 데이터로부터 예측에 유리한 규칙(Rule)을 스스로 찾아내도록 유도하는 과정입니다. 이 시스템은 크게 세 가지 요소의 조화로 이루어집니다.
1. **모델 (Model, 예측식):** 입력값 $x$와 출력값 $y$의 관계를 표현하는 수학적 가설입니다. 예를 들어 선형 회귀 모델의 파라미터를 $\theta$라고 할 때, 가설 식은 $h_{\theta}(x)$로 정의됩니다.
2. **평가 지표 (오차 측정):** 모델이 예측을 얼마나 잘했는지 수치화한 함수입니다.
3. **최적화 (Optimization):** 평가 지표를 기준으로 오차가 가장 작아지도록 모델의 파라미터 $\theta$를 조정해 나가는 알고리즘적 방법론입니다.

### 오차의 세 가지 계층: Error, Loss, Cost
현업이나 논문에서 오차를 가리키는 용어들은 혼용되기 쉽지만, 엄밀히는 그 범위와 역할이 다릅니다.

![Error Loss Cost Definitions](/assets/images/2025-11-25-linear-regression-and-optimization/page_5.png)

| 개념 | 범위 | 의미 및 역할 |
| :--- | :--- | :--- |
| **Error (오차)** | 개별 데이터 | 실제값과 예측값 사이의 단순하고 원초적인 차이 ($y - \hat{y}$) |
| **Loss (손실)** | 개별 데이터 | 오차의 크기나 방향성을 반영하여 수학적으로 정의한 개별 데이터당 패널티 함수 (예: $L(y, \hat{y}) = (y - \hat{y})^2$) |
| **Cost (비용)** | 전체 데이터 | 전체 학습 데이터셋에 대해 계산한 Loss의 평균값으로, 모델의 전반적인 성능을 평가하고 최적화의 타깃이 되는 최종 함수 (예: Mean Squared Error) |

---

## 2. 선형 회귀(Linear Regression) 모델

선형 회귀는 입력 특성(Feature) $x$와 타깃 $y$ 사이에 선형적인 관계가 있다고 가정하고, 데이터에 가장 잘 맞는 '선(Line/Hyperplane)'을 긋는 모델입니다.

$n$개의 특성을 가진 입력 벡터를 $\mathbf{x} = [x_1, x_2, \dots, x_n]^T$라 하고 편향(Bias)을 조절하기 위해 $x_0 = 1$을 추가하면, 선형 회귀의 예측 식은 가중치 벡터 $\boldsymbol{\theta} = [\theta_0, \theta_1, \dots, \theta_n]^T$를 이용하여 다음과 같이 표현할 수 있습니다.

$$h_{\boldsymbol{\theta}}(\mathbf{x}) = \theta_0 x_0 + \theta_1 x_1 + \dots + \theta_n x_n = \boldsymbol{\theta}^T \mathbf{x}$$

이때 모델의 성능을 평가하기 위해 사용하는 대표적인 비용 함수(Cost Function)는 **평균 제곱 오차(MSE, Mean Squared Error)입니다**. $m$개의 학습 샘플에 대하여 MSE는 다음과 같이 정의됩니다.

$$J(\boldsymbol{\theta}) = \frac{1}{m} \sum_{i=1}^{m} \left( \boldsymbol{\theta}^T \mathbf{x}^{(i)} - y^{(i)} \right)^2$$

선형 회귀의 학습 목표는 바로 이 비용 함수 $J(\boldsymbol{\theta})$를 최소화하는 최적의 가중치 벡터 $\boldsymbol{\theta}$를 찾는 것입니다.

![Linear Regression Concept](/assets/images/2025-11-25-linear-regression-and-optimization/page_7.png)

---

## 3. 정규방정식 (Normal Equation)

최적의 $\boldsymbol{\theta}$를 구하는 첫 번째 방법은 비용 함수 $J(\boldsymbol{\theta})$를 최소화하기 위해 수식을 수학적으로 직접 풀어내는 방법인 **정규방정식(Normal Equation)입니다**.

행렬 연산을 위해 전체 학습 데이터의 특성을 행렬 $\mathbf{X}$ (크기 $m \times (n+1)$)로 나타내고, 타깃을 벡터 $\mathbf{y}$로 표현하면 비용 함수 $J(\boldsymbol{\theta})$를 최소화하는 해석적 솔루션(Analytical Solution)은 다음과 같은 닫힌 형태의 수식(Closed-form solution)으로 유도됩니다.

$$\boldsymbol{\theta} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}$$

![Normal Equation Method](/assets/images/2025-11-25-linear-regression-and-optimization/page_10.png)

### 정규방정식의 장점
* **경사하강법과 달리 하이퍼파라미터 튜닝 불필요**: 학습률(Learning Rate)을 설정할 필요가 없으며, 최적해를 찾기 위해 반복적인 학습(Iteration) 과정을 거치지 않고 단 한 번의 행렬 연산으로 최적해를 도출합니다.
* **소규모 데이터셋에서 매우 효율적**: 데이터의 개수 $m$이 작거나 특성의 개수 $n$이 적을 때(대략 수천 개 이하) 매우 빠르게 최적해를 찾아냅니다.

### 정규방정식의 단점 및 한계
* **컴퓨팅 연산 비용의 급격한 증가**: 식 내부의 역행렬 연산 $(\mathbf{X}^T \mathbf{X})^{-1}$은 특성 개수 $n$에 대해 대략 $O(n^3)$의 계산 복잡도를 가집니다. 즉, 특성이 2배 늘어나면 계산 시간은 약 8배 증가합니다. 특성이 수만 개를 넘어가면 연산 속도가 극도로 느려집니다.
* **메모리 제한**: 대규모 데이터를 행렬로 전부 메모리에 올려 처리해야 하므로 Out-of-Memory(OOM) 문제가 발생하기 쉽습니다.

---

## 4. 경사하강법 (Gradient Descent)

정규방정식의 한계 때문에 특성이나 데이터의 크기가 매우 클 때는 수학적 수식을 직접 푸는 대신, 오차가 작아지는 방향으로 파라미터를 조금씩 조정하며 최적해에 수렴해 나가는 반복적 방법론인 **경사하강법(Gradient Descent, GD)을** 사용합니다.

### 경사하강법의 비유적 개념
안개가 자욱하게 낀 깊은 산속에서 등산객이 하산하는 상황을 상상해 보십시오. 주변 지형을 볼 수 없기 때문에 등산객이 취할 수 있는 최선의 방법은 **"지금 발을 딛고 서 있는 위치에서 경사가 가장 가파른 내리막길 방향으로 한 발짝 내려가는 것"**입니다. 이 과정을 반복하다 보면 결국 산 밑 골짜기(최저 오차 지점)에 도달하게 됩니다.

![Gradient Descent Concept](/assets/images/2025-11-25-linear-regression-and-optimization/page_13.png)

머신러닝에서도 마찬가지로 가중치 $\boldsymbol{\theta}$의 현재 위치에서 비용 함수 $J(\boldsymbol{\theta})$의 기울기(Gradient, 경사)를 구한 뒤, 기울기의 반대 방향으로 가중치를 조금씩 업데이트합니다.

$$\boldsymbol{\theta}^{(next)} = \boldsymbol{\theta} - \eta \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$$

여기서 $\eta$(에타)는 가중치를 한 번에 얼마나 크게 업데이트할지 결정하는 **학습률(Learning Rate)입니다**.

* 학습률 $\eta$가 **너무 작은 경우**: 골짜기 밑바닥으로 내려가는 보폭이 너무 좁아 학습 속도가 매우 느려지고 컴퓨터 자원이 낭비됩니다.
* 학습률 $\eta$가 **너무 큰 경우**: 보폭이 너무 커서 골짜기 밑바닥을 지나쳐 건너편 언덕으로 튀어 올라가며, 결국 오차가 줄어들지 않고 점점 커지며 발산하게 됩니다.

### 손실 공간의 다채로운 지형 (Loss Landscape)
가중치가 많고 비선형적인 모델(예: 신경망)로 확장될 경우, 손실 함수가 그리는 공간은 매우 험난한 지형을 이룹니다.

![Loss Landscape](/assets/images/2025-11-25-linear-regression-and-optimization/page_15.png)

* **전역 최솟값 (Global Minimum):** 손실 공간 전체에서 오차가 가장 작은 최적의 지점입니다.
* **지역 최솟값 (Local Minimum):** 주변 지형보다 오차가 작아 골짜기 형태를 띠지만 전체 관점에서는 최적이 아닌 지점입니다. 경사하강법을 수행하다가 이곳에 갇히면 학습이 조기에 멈출 수 있습니다.
* **고원 (Plateau):** 경사가 거의 없는 평평한 지형입니다. 기울기가 0에 수렴하므로 가중치 업데이트가 거의 일어나지 않는 정체 현상이 발생합니다.
* **안장점 (Saddle Point):** 한쪽 방향으로는 오르막길이지만 다른 방향으로는 내리막길이 공존하는 지점입니다. 다차원 공간에서 빈번하게 관찰되며, 학습 정체의 주요 원인이 됩니다.

---

## 5. 경사하강법의 세 가지 변형 기법

경사하강법을 실제로 구현할 때, "한 번 업데이트하기 위해 데이터를 몇 개나 사용할 것인가"를 기준으로 크게 세 가지로 분류합니다.

![Gradient Descent Variants](/assets/images/2025-11-25-linear-regression-and-optimization/page_16.png)

### 1) 배치 경사하강법 (Batch Gradient Descent, BGD)
가중치를 한 번 업데이트할 때마다 **전체 학습 데이터셋의 평균 기울기**를 계산합니다.
* **특징**: 전체 데이터를 한 번에 고려하므로 기울기 방향이 매우 안정적이고 오차가 매끄럽게 감소합니다.
* **단점**: 한 걸음 내딛기 위해 매번 모든 데이터를 계산해야 하므로 데이터가 수백만 개에 달할 경우 속도가 극도로 느려집니다.

### 2) 확률적 경사하강법 (Stochastic Gradient Descent, SGD)
가중치를 업데이트할 때마다 **단 하나의 샘플 데이터를 무작위로 추출**하여 그것의 기울기만 계산합니다.
* **특징**: 매 단계 연산량이 매우 적어 속도가 아주 빠르고 대규모 데이터셋도 가뿐히 처리합니다. 불안정하게 요동치며 움직이기 때문에, 오히려 지역 최솟값(Local Minimum)에 갇히지 않고 탈출하여 더 좋은 최적해로 나아가는 이점을 제공하기도 합니다.
* **단점**: 최적의 지점에 도달해서도 멈추지 않고 주변을 계속 진동합니다. 이를 해결하기 위해 학습이 진행됨에 따라 학습률을 점진적으로 감소시키는 **학습 스케줄(Learning Schedule)** 기법을 병행하여 수렴하도록 돕습니다.

### 3) 미니배치 경사하강법 (Mini-Batch Gradient Descent)
배치(전체)와 확률적(1개)의 장점을 결합한 현대 머신러닝/딥러닝의 표준 방식입니다. 데이터를 일정한 크기의 묶음(보통 16, 32, 64, 128, 256, 512개 등)인 **미니배치(Mini-batch)** 단위로 나누어 평균 기울기를 계산하고 가중치를 업데이트합니다.
* **특징**: 전체를 보는 BGD보다는 빠르고, 1개만 보는 SGD보다는 경로가 한결 부드럽고 안정적입니다. 또한, 행렬 연산 하드웨어인 GPU의 병렬 연산 최적화 구조와 결합하여 계산 효율성을 극대화할 수 있습니다.

![Batch vs SGD vs Mini-Batch Visualized](/assets/images/2025-11-25-linear-regression-and-optimization/page_20.png)

---

## Summary

선형 회귀 모델과 최적화의 핵심 개념을 최종 요약하면 다음과 같습니다.

* **모델(Model)은** 입력과 타깃 사이의 관계를 수학적으로 **"무엇을 표현할지"** 정의합니다.
* **최적화(Optimization)는** 정의된 모델의 가중치를 데이터에 맞춰 **"어떻게 학습할지"** 결정합니다.
* 가중치 도출 방법에는 한 번에 직접 수학적으로 최적해를 찾는 **정규방정식**과, 기울기를 타고 순차적으로 하강하는 **경사하강법(GD)이** 있습니다.
* 데이터가 거대할 때는 경사하강법이 필수적이며, 데이터를 활용하는 단위에 따라 **Batch GD, SGD, Mini-Batch GD**로 나뉘며 현대 딥러닝에서는 **Mini-Batch GD**가 표준으로 사용됩니다.

![Summary of Linear Regression and Optimization](/assets/images/2025-11-25-linear-regression-and-optimization/page_22.png)

다음 포스트에서는 모델이 올바르게 훈련되고 있는지 모니터링하는 방법인 Learning Curve와 과적합을 방지하는 규제(Regularization) 기법, 그리고 이를 분류 모델로 확장하는 로지스틱 회귀에 대해 이어서 다루어 보겠습니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
