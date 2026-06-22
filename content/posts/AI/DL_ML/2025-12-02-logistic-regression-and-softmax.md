---
title:  "[ML Study] 분류 모델의 핵심: 로지스틱 회귀와 소프트맥스 회귀"
excerpt: "회귀에서 분류 모델로의 확장 과정, 학습 모니터링을 위한 Learning Curve, 과적합을 방지하는 규제(Regularization) 기법, 그리고 로지스틱 회귀와 소프트맥스 회귀의 수학적 원리 정리"
categories:
  - AI, DL, ML
tags:
  - AI, DL, ML
  - Logistic Regression
  - Softmax Regression
  - Regularization
toc: true
toc_sticky: true
use_math: true
date: 2025-12-02
last_modified_at: 2025-12-02
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

지난 포스트에서는 가장 기본적인 회귀 알고리즘인 선형 회귀와 가중치를 최적화하는 경사하강법(Gradient Descent)의 종류를 살펴보았습니다. 그러나 모델을 열심히 학습시킨 후, 우리는 다음과 같은 의문들에 직면하게 됩니다.
1. "이 모델이 지금 제대로 학습되고 있는가?"
2. "학습 데이터에는 기가 막히게 맞는데, 왜 실제 테스트에서는 예측을 망칠까?" (과적합 문제)
3. "선형 회귀의 예측 선을 어떻게 하면 '0 또는 1' 같은 분류(Classification) 문제에 적용할 수 있을까?"

이번 포스트에서는 모델의 학습 상태를 모니터링하는 **학습 곡선(Learning Curve)**과 과적합을 해결하는 **규제(Regularization)** 기법을 살펴보고, 회귀에서 분류 모델로 확장하는 핵심 알고리즘인 **로지스틱 회귀(Logistic Regression)** 및 **소프트맥스 회귀(Softmax Regression)**의 수학적 원리를 완벽하게 정리해 보겠습니다.

---

## 1. 모델 진단: 학습 곡선 (Learning Curve)

모델이 학습을 '잘' 하고 있는지 판단하기 위해서는 **과소적합(Underfitting)**, **적정합(Good Fit)**, **과적합(Overfitting)** 중 어디에 위치해 있는지 알아야 합니다. 이를 진단하는 가장 대표적인 도구가 바로 **학습 곡선(Learning Curve)**입니다.

### 세 가지 적합 상태 비유
* **과소적합 (Underfitting)**: 시험의 난이도는 고난도 '미적분'인데, 학생은 기초 '사칙연산' 공식만 외우고 시험을 치는 상태입니다. 모델의 표현력이 너무 단순하여 데이터의 본질적인 패턴조차 포착하지 못합니다.
* **적정합 (Good Fit)**: 실력에 딱 맞는 난이도의 교재로 알맞게 공부하여 실전 시험에서도 좋은 점수를 기대할 수 있는 모범적인 상태입니다.
* **과적합 (Overfitting)**: 교재의 기출문제와 정답 번호, 심지어 모퉁이의 낙서까지 달달 외워버린 상태입니다. 기출문제는 100점을 맞지만, 실제 시험(새로운 데이터)을 보면 완전히 망하게 됩니다.

![Underfitting Good Fit Overfitting](/assets/images/2025-12-02-logistic-regression-and-softmax/page_9.png)

### 학습 곡선(Learning Curve)으로 진단하기
학습 곡선은 에포크(Epoch, 학습 반복 횟수)의 진행에 따라 **훈련 손실(Train Loss)**과 **검증 손실(Validation Loss)**이 어떻게 변화하는지 그린 그래프입니다.

```
Loss
 │
 │      Underfitting                    Good Fit                      Overfitting
 │     (Train/Val 둘 다 높음)          (둘 다 안정적으로 감소)        (Val Loss만 상승)
 └────────────────────────────        ───────────────────────────    ───────────────────────────
              Epoch                                Epoch                          Epoch
```

* **Underfitting**: Train Loss와 Validation Loss 모두가 학습이 끝나도 매우 높은 수준에 머물러 있습니다.
* **Good Fit**: 두 손실 곡선이 나란히 부드럽게 우하향하며 적절한 최저점에 안착합니다.
* **Overfitting**: Train Loss는 계속 떨어져 거의 0에 가까워지는데, Validation Loss는 어느 순간부터 감소를 멈추고 오히려 다시 상승하기 시작합니다. 즉, 학습 데이터를 과하게 외우기 시작한 지점입니다.

![Learning Curve Diagram](/assets/images/2025-12-02-logistic-regression-and-softmax/page_10.png)

---

## 2. 과적합의 원인과 처방: 규제 (Regularization)

과적합의 주요 원인은 **모델이 너무 복잡해서 학습 데이터의 아주 작은 노이즈(Noise)까지 외워버리기 때문**입니다. 수학적으로는 모델의 가중치($\theta$ 또는 $w$) 값들이 필요 이상으로 비대해질 때 발생합니다.

### 왜 가중치($\theta$)가 크면 과적합일까? (망치 비유)
* **작은 망치 (작은 가중치)**: 못을 부드럽게 박아 넣으며 데이터의 전반적인 거시적 패턴만 반영합니다.
* **큰 망치 (큰 가중치)**: 너무 세게 내려쳐서 못뿐만 아니라 주변 벽면까지 파손합니다. 즉, 학습 데이터의 아주 미세한 잡음 하나까지 모델 곡선에 우그러뜨려 반영하느라 요동치는 거친 예측 선이 만들어집니다.

![Hammer Analogy for Weights](/assets/images/2025-12-02-logistic-regression-and-softmax/page_13.png)

따라서 최적화 과정에서 가중치 값이 너무 커지지 않도록 패널티를 주는 기술을 **규제(Regularization)**라고 부릅니다.

---

### L2 규제: 릿지 회귀 (Ridge Regression)
기존 MSE 비용 함수에 **가중치 제곱의 합**을 패널티 항으로 더해주는 기법입니다.

$$J(\boldsymbol{\theta}) = \text{MSE}(\boldsymbol{\theta}) + \alpha \frac{1}{2} \sum_{i=1}^{n} \theta_i^2$$

(여기서 $\alpha$는 규제의 강도를 조절하는 하이퍼파라미터입니다.)

* **원리**: 가중치 $\theta$가 조금만 커져도 제곱의 형태로 패널티가 커지므로, 모델은 전체적으로 가중치를 최대한 작고 균등하게 유지하려고 합니다. 
* **특징**: 곡선이 완만해지고 부드러워집니다. 패널티 함수가 미분 가능하므로 경사하강법으로 쉽게 최적화할 수 있습니다. 가중치가 0에 가깝게 줄어들 뿐, 정확히 0이 되지는 않습니다.

![Ridge L2 Regularization](/assets/images/2025-12-02-logistic-regression-and-softmax/page_15.png)

---

### L1 규제: 라쏘 회귀 (Lasso Regression)
기존 MSE 비용 함수에 **가중치 절댓값의 합**을 패널티 항으로 더해주는 기법입니다.

$$J(\boldsymbol{\theta}) = \text{MSE}(\boldsymbol{\theta}) + \alpha \sum_{i=1}^{n} |\theta_i|$$

* **원리**: 가중치가 0에서 멀어지면 절댓값 크기대로 즉시 선형적인 패널티를 받습니다. L1 패널티의 기하학적 특성상 최적화를 거치면 **중요하지 않은 특성의 가중치가 정확히 0으로 수축**됩니다.
* **특징**: 가중치 행렬이 희소(Sparse)해집니다. 즉, 자동으로 불필요한 입력 변수를 걸러내는 **변수 선택(Feature Selection)** 기능을 제공하여 모델을 단순화하고 가독성을 높입니다.

![Lasso L1 Regularization](/assets/images/2025-12-02-logistic-regression-and-softmax/page_16.png)

---

### 엘라스틱넷 (Elastic Net)
릿지(L2)와 라쏘(L1) 규제를 결합하여 두 장점을 모두 취한 기법입니다.

$$J(\boldsymbol{\theta}) = \text{MSE}(\boldsymbol{\theta}) + r \alpha \sum_{i=1}^{n} |\theta_i| + \frac{1 - r}{2} \alpha \sum_{i=1}^{n} \theta_i^2$$

(여기서 $r$은 L1과 L2 패널티 사이의 비율을 결정하는 하이퍼파라미터입니다.)

* **특징**: 라쏘의 변수 선택 능력과 릿지의 안정적인 수렴 능력을 동시에 제공합니다. 다중공선성(특성 간 강한 상관관계)이 있는 대규모 실제 산업 데이터에서 가장 안정적이고 실용적인 규제 방식으로 선호됩니다.

![Elastic Net Regularization](/assets/images/2025-12-02-logistic-regression-and-softmax/page_18.png)

---

### 조기 종료 (Early Stopping)
수학적 공식을 더하는 대신, 학습을 모니터링하다가 **검증 손실(Validation Loss)이 최소화된 최적의 지점에서 학습을 강제로 멈추는 직관적인 기법**입니다. 과적합이 발생하기 직전에 모델 훈련을 중단시키므로 추가 계산 자원 낭비도 막을 수 있어 딥러닝에서 필수적으로 사용됩니다.

![Early Stopping Mechanism](/assets/images/2025-12-02-logistic-regression-and-softmax/page_19.png)

---

## 3. 이진 분류의 해답: 로지스틱 회귀 (Logistic Regression)

선형 회귀는 연속적인 값만 예측하므로 출력값이 $-\infty$에서 $+\infty$까지 뻗어 나갑니다. 하지만 "스팸 여부(0 또는 1)"를 판별하려면 출력이 항상 **0과 1 사이의 확률 값**으로 제한되어야 합니다.

**로지스틱 회귀**는 선형 회귀 식의 결과물 $z = \boldsymbol{\theta}^T \mathbf{x}$를 확률을 출력하는 **시그모이드(Sigmoid) 함수**에 통과시켜 분류 문제를 해결하는 모델입니다.

![Sigmoid Logic](/assets/images/2025-12-02-logistic-regression-and-softmax/page_21.png)

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$

$$\hat{p} = h_{\boldsymbol{\theta}}(\mathbf{x}) = \sigma(\boldsymbol{\theta}^T \mathbf{x})$$

이 예측 확률 $\hat{p}$가 $0.5$ 이상이면 $1$(Positive)로 분류하고, $0.5$ 미만이면 $0$(Negative)으로 분류합니다.

![Logistic Regression Mathematical Structure](/assets/images/2025-12-02-logistic-regression-and-softmax/page_22.png)

### 왜 MSE 대신 크로스 엔트로피(Cross-Entropy) 손실을 쓸까?
시그모이드 함수를 선형 회귀처럼 MSE 비용 함수에 그대로 대입해 사용하면, 양 끝단에서 기울기가 급격히 완만해지는 특성 때문에 **기울기 소실(Gradient Vanishing)**이 일어나 학습 속도가 너무 느려집니다. 또한, MSE는 잘못된 강한 예측(예: 정답은 1인데 0.01로 예측)에 대해 충분한 패널티를 주지 못합니다.

이 문제를 해결하기 위해 로지스틱 회귀에서는 예측이 틀릴수록 패널티가 로그 스케일로 무한히 발산하는 **크로스 엔트로피 손실 함수(Cross-Entropy Loss, 로그 손실)**를 사용합니다.

$$\text{Loss}(y, \hat{p}) = -y \log(\hat{p}) - (1 - y) \log(1 - \hat{p})$$

전체 $m$개 데이터에 대한 비용 함수(Binary Cross Entropy)는 다음과 같습니다.

$$J(\boldsymbol{\theta}) = -\frac{1}{m} \sum_{i=1}^{m} \left[ y^{(i)} \log(\hat{p}^{(i)}) + (1 - y^{(i)}) \log(1 - \hat{p}^{(i)}) \right]$$

이 크로스 엔트로피 손실 함수를 사용하면 시그모이드와 결합 시 미분이 매우 깔끔하게 정리되어 오차가 클수록 초기에 경사하강 속도가 빨라지는 장점이 있습니다.

![MSE vs Cross Entropy Gradient Analysis](/assets/images/2025-12-02-logistic-regression-and-softmax/page_24.png)

![Loss Penalty Comparison](/assets/images/2025-12-02-logistic-regression-and-softmax/page_25.png)

---

## 4. 다중 분류로의 확장: 소프트맥스 회귀 (Softmax Regression)

로지스틱 회귀는 0과 1 중 하나를 고르는 이진 분류기입니다. 만약 강아지, 고양이, 라마 등 **3개 이상의 클래스를 분류해야 한다면 어떻게 해야 할까요?** 이를 다중 분류(Multi-class Classification)로 일반화한 것이 바로 **소프트맥스 회귀(Softmax Regression / 다항 로지스틱 회귀)**입니다.

### 소프트맥스(Softmax) 함수의 원리
소프트맥스 회귀는 입력 샘플 $\mathbf{x}$에 대해 각 클래스 $k$마다 고유의 선형 예측 점수(Logit) $s_k(\mathbf{x}) = (\boldsymbol{\theta}^{(k)})^T \mathbf{x}$를 계산한 뒤, 이 점수들을 **소프트맥스 함수**에 통과시켜 클래스별 확률 분포로 변환합니다.

$$\hat{p}_k = \text{Softmax}(\mathbf{s}(\mathbf{x}))_k = \frac{e^{s_k(\mathbf{x})}}{\sum_{j=1}^{K} e^{s_j(\mathbf{x})}}$$

* **특징**: 모든 클래스에 대한 출력 확률은 항상 $0$에서 $1$ 사이의 값을 가집니다. 또한, 모든 클래스 확률의 총합은 정확히 **$1$**이 됩니다. 모델은 이 중 가장 높은 확률을 가진 클래스를 최종 예측값으로 채택합니다.

![Softmax Regression Concept](/assets/images/2025-12-02-logistic-regression-and-softmax/page_28.png)

---

## Summary

학습 진단부터 다중 클래스 분류 모델까지의 흐름을 정리해 보겠습니다.

* 모델 학습의 건강 상태는 **학습 곡선(Learning Curve)**의 Train/Val Loss 추이를 관찰해 평가합니다.
* 가중치 폭주로 인한 과적합(Overfitting) 진단이 나오면, 패널티를 가해 학습 선을 유연하게 만드는 **L2(Ridge)**, **L1(Lasso)**, **Elastic Net**, **Early Stopping** 등의 규제를 처방합니다.
* 훈련이 원활해지면, 선형 수식 출력을 **시그모이드 함수**에 통과시키고 **크로스 엔트로피 손실**로 최적화하여 **이진 분류(Logistic Regression)**를 완수합니다.
* 클래스가 3개 이상인 다중 분류가 필요할 때는 선형 출력을 **소프트맥스 함수**에 통과시켜 클래스별 확률 분포를 계산하는 **다중 분류(Softmax Regression)** 모델로 확장하여 해결합니다.

![Summary of Regularization and Classification](/assets/images/2025-12-02-logistic-regression-and-softmax/page_29.png)

이로써 선형 회귀부터 최적화, 과적합 해결, 그리고 로지스틱/소프트맥스 분류 모델까지의 핵심적인 머신러닝 스터디 여정이 완성되었습니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
