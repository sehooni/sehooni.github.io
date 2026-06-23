---
title:  "[ML Study] 머신러닝 첫걸음: Classification 모델 완전정복 (1)"
excerpt: "인공지능, 머신러닝, 딥러닝의 기본 개념을 정리하고, MNIST 데이터셋과 SGD 분류기를 활용한 이진 분류 모델 학습 및 정밀도, 재현율, F1-Score, ROC-AUC 등 성능 지표의 상세 분석"
categories:
  - AI, DL, ML
tags:
  - AI, DL, ML
toc: true
toc_sticky: true
use_math: true
date: 2025-09-30
last_modified_at: 2025-09-30
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

컴퓨터가 주어진 사진을 보고 고양이와 강아지를 구별해내는 것을 상상해 보세요. 우리에게는 너무나 직관적인 일이지만, 기계에게는 복잡한 학습 과정이 필요합니다. 이렇게 데이터를 특정 카테고리로 나누는 작업을 '분류(Classification)'라고 부르며, 이는 현대 인공지능의 가장 기본적이면서도 핵심적인 능력 중 하나입니다.

이 글은 한국기초과학지원연구원(KBSI)의 AI/ML 스터디 자료를 바탕으로, 인공지능과 머신러닝의 기본 개념부터 시작하여, 실제로 분류 모델을 어떻게 훈련하고 그 성능을 정교하게 평가하는지 단계별로 안내합니다. 머신러닝을 처음 접하는 입문자부터 개념을 다시 정리하고 싶은 실무자까지, 모두에게 유용한 가이드가 될 것입니다.

본문에서는 다음과 같은 주제들을 순서대로 다룰 예정입니다.

1. AI, 머신러닝, 딥러닝의 관계
2. 첫 번째 과제: MNIST 손 글씨 숫자 분류
3. 이진 분류기 훈련 방법
4. 모델 성능 측정의 모든 것


## 1. AI, 머신러닝(Machine Learning) & 딥러닝(Deep Learning)의 세계

인공지능 시대를 살아가면서 AI, 머신러닝, 딥러닝이라는 용어를 자주 접하게 됩니다. 이들은 단순한 유행어가 아니라, 명확한 범위와 관계를 가진 기술 분야입니다. 성공적인 머신러닝 모델을 구축하기 위해서는 이들의 관계를 정확히 이해하는 것이 첫걸음입니다.

### 개념의 계층 구조

AI, 머신러닝, 딥러닝은 포함 관계를 가집니다. 가장 넓은 개념은 **인공지능(AI)이며**, **머신러닝(ML)은** 그 핵심적인 하위 분야입니다. 그리고 **딥러닝(DL)은** 머신러닝의 여러 기법 중 하나로, 더욱 전문화된 영역입니다.

* 인공지능 (Artificial Intelligence, AI): 인간의 지능을 모방하여, 사람이 수행하는 일을 컴퓨터가 할 수 있도록 구현하는 가장 포괄적인 기술입니다.
* 머신러닝 (Machine Learning, ML): AI를 구현하는 대표적인 방법론입니다. 기계가 데이터로부터 스스로 학습하여 특정 작업을 수행하는 기술을 의미합니다. 대표적인 알고리즘으로는 인공 신경망, 서포트 벡터 머신(SVM), 결정 트리 등이 있습니다.
* 딥러닝 (Deep Learning, DL): 머신러닝의 한 분야로, 인공 신경망을 깊게(여러 층으로) 쌓아올려 복잡한 패턴을 학습하는 기술입니다. CNN, RNN, RBM 등이 여기에 속합니다.


### 머신러닝(ML)과 딥러닝(DL)의 결정적 차이

가장 큰 차이점은 '특성 추출(Feature Extraction)' 과정에 있습니다.

* 머신러닝(ML): 사람이 직접 데이터의 중요한 특징(예: 자동차의 바퀴, 핸들)을 추출하여 모델에 입력해야 합니다. 이 과정에서 사람의 전문 지식과 개입이 중요합니다.
* 딥러닝(DL): 모델이 데이터로부터 직접 주요 특징을 학습하고 분류까지 자동으로 수행합니다. 사람의 개입을 최소화하고 데이터 자체의 패턴을 깊이 있게 파악합니다.


두 기술의 차이점을 표로 정리하면 다음과 같습니다.
![ML_versus_DL](/assets/images/2025-09-30-ML_Classification/image.png)


### Total process of Machine Learning

머신러닝 프로젝트는 크게 두 단계로 나뉩니다.

1. 학습 단계 (Training Phase): 정답이 있는 데이터(Label)를 사용하여 모델을 훈련시킵니다. 데이터에서 특징을 추출하고, 머신러닝 알고리즘을 적용하여 분류 또는 예측 모델을 생성합니다. 이 모델은 반복적인 학습을 통해 점차 정교해집니다.
2. 예측 단계 (Prediction Phase): 학습이 완료된 모델에 새로운 데이터를 입력합니다. 모델은 학습된 패턴을 기반으로 이 새로운 데이터에 대한 결과를 예측합니다.


### 머신러닝의 3가지 유형

머신러닝은 학습 방식에 따라 크게 세 가지로 분류됩니다.

* 지도 학습 (Supervised Learning): 정답(레이블)이 있는 데이터를 사용하여 모델을 학습시킵니다. 스팸 메일 분류처럼, 각 데이터가 어떤 범주에 속하는지 명확히 알려주고 패턴을 배우게 하는 방식입니다.
* 비지도 학습 (Unsupervised Learning): 정답이 없는 데이터를 사용합니다. 데이터 내에 숨겨진 구조나 패턴, 그룹을 스스로 찾아내도록 합니다. 예를 들어, 사용자들을 비슷한 성향의 그룹으로 묶는 군집화(Clustering)가 있습니다.
* 강화 학습 (Reinforcement Learning): 에이전트(Agent)가 특정 환경 내에서 행동하고, 그 결과로 얻는 보상(Reward)과 벌점(Penalty)을 통해 최적의 행동 정책을 학습하는 방식입니다.

이제 이러한 기본 지식을 바탕으로, 실제 데이터를 다루며 개념을 구체화해 보겠습니다.


## 2. 첫 번째 과제: MNIST 손 글씨 숫자 분류

머신러닝 분야에는 모델의 성능을 시험하고 비교하기 위한 표준 데이터셋들이 존재합니다. 그중 MNIST 데이터셋은 이미지 분류를 처음 시작하는 모든 이들이 거쳐 가는 'Hello, World!'와 같은 상징적인 존재입니다.

### MNIST 데이터셋이란?

MNIST는 0부터 9까지의 손으로 쓴 숫자 이미지 70,000개로 구성된 대규모 데이터베이스입니다. 이 데이터셋의 구조는 다음과 같습니다.

*   **총 데이터 수**: 70,000개의 이미지
*   **이미지 크기**: 각 이미지는 $28 \times 28$ 픽셀의 흑백 이미지입니다.
*   **특성 (Features):** 각 이미지는 $28 \times 28 = 784$개의 픽셀로 이루어져 있으며, 각 픽셀의 밝기(강도, $0$~$255$) 값이 하나의 특성이 됩니다.

따라서 데이터는 $(70000, 784)$ 형태의 2차원 배열로 표현되며, 이는 70,000개의 샘플 각각이 784개의 특성을 가지고 있음을 의미합니다. 각 샘플에 해당하는 실제 숫자 값(레이블)은 $(70000,)$ 형태의 배열에 저장됩니다.

Scikit-Learn 라이브러리를 이용하여 MNIST 데이터를 불러오는 기본 코드는 다음과 같습니다.

```python
from sklearn.datasets import fetch_openml
import numpy as np

# MNIST 데이터셋 다운로드
mnist = fetch_openml('mnist_784', version=1, as_frame=False)
X, y = mnist["data"], mnist["target"]

# 데이터의 형태 확인
print(X.shape, y.shape)
# 출력: (70000, 784), (70000,)
```

---

## 3. 이진 분류기 (Binary Classifier) 훈련하기

**이진 분류기(Binary Classifier)는** 데이터를 '예' 또는 '아니오'의 두 가지 범주 중 하나로만 분류하는 모델입니다.

### 개념을 현실로: '5-탐지기' 만들기

0부터 9까지 모든 숫자를 한 번에 구별하는 다중 분류(Multiclass Classification)에 앞서, 문제를 단순화하여 "이 이미지는 숫자 5인가, 아닌가?"를 판별하는 '5-탐지기' 모델을 만들어 보겠습니다.

*   **'5' (Positive):** 이미지가 숫자 5일 경우 (True)
*   **'5 아님' (Negative):** 이미지가 5가 아닌 다른 모든 숫자일 경우 (False)

먼저 데이터를 모델 학습을 위한 훈련 세트(앞의 60,000개)와 최종 평가를 위한 테스트 세트(뒤의 10,000개)로 분할합니다. 그 후 Scikit-Learn의 `SGDClassifier`(확률적 경사 하강법 분류기)를 사용하여 이진 분류 모델을 학습시킵니다.

```python
from sklearn.linear_model import SGDClassifier

# 훈련/테스트 세트 분할
X_train, X_test, y_train, y_test = X[:60000], X[60000:], y[:60000], y[60000:]

# 레이블을 문자열에서 정수형으로 변환
y_train = y_train.astype(np.int8)
y_test = y_test.astype(np.int8)

# '5-detector'를 위한 이진 타깃 레이블 생성
y_train_5 = (y_train == 5)
y_test_5 = (y_test == 5)

# SGD 분류 모델 선언 및 훈련
sgd_clf = SGDClassifier(random_state=42)
sgd_clf.fit(X_train, y_train_5)

# 첫 번째 데이터가 5인지 예측 테스트
print(sgd_clf.predict([X_train[0]])) # 결과: True 또는 False
```

---

## 4. 모델 성능 측정의 모든 것 (Performance Measures)

학습이 끝난 모델을 평가하는 단계는 매우 중요합니다. 단순히 분류기의 정확도 하나만 신뢰하는 것은 불균형한 데이터셋에서 위험할 수 있기 때문입니다.

### 1) 교차 검증 (Cross-Validation)

훈련 데이터를 하나의 세트로만 검증하면 과적합(Overfitting) 여부를 판별하기 힘듭니다. **k-겹 교차 검증 (k-fold cross-validation)을** 통해 모델의 일반화 성능을 안정적으로 평가할 수 있습니다.

```python
from sklearn.model_selection import cross_val_score

# 3-Fold 교차 검증을 통한 정확도(Accuracy) 측정
accuracy_scores = cross_val_score(sgd_clf, X_train, y_train_5, cv=3, scoring="accuracy")
print("Fold별 정확도:", accuracy_scores)
```

### 2) 오차 행렬 (Confusion Matrix)

오차 행렬은 분류 모델의 예측 결과를 상세하게 기록한 표입니다. 모델이 예측한 값과 실제 값이 어떻게 매칭되는지를 보여주며, 실수의 유형을 구체적으로 보여줍니다.

*   **True Positive (TP):** 실제 '5'를 '5'라고 올바르게 예측한 경우.
*   **True Negative (TN):** 실제 '5 아님'을 '5 아님'이라고 올바르게 예측한 경우.
*   **False Positive (FP):** 실제 '5 아님'을 '5'라고 잘못 예측한 경우 (양성 오류).
*   **False Negative (FN):** 실제 '5'를 '5 아님'이라고 잘못 예측한 경우 (음성 오류).

```python
from sklearn.model_selection import cross_val_predict
from sklearn.metrics import confusion_matrix

# 교차 검증 예측값 도출
y_train_pred = cross_val_predict(sgd_clf, X_train, y_train_5, cv=3)

# 오차 행렬(Confusion Matrix) 계산
cm = confusion_matrix(y_train_5, y_train_pred)
print("오차 행렬:\n", cm)
```

### 3) 핵심 성능 지표 계산

오차 행렬의 값을 기반으로 분류기의 종합 성능을 평가할 수 있는 핵심 지표들을 도출합니다.

*   **정확도 (Accuracy):** 전체 데이터 중 올바르게 분류한 비율입니다.
    $$\text{Accuracy} = \frac{\text{TP} + \text{TN}}{\text{TP} + \text{TN} + \text{FP} + \text{FN}}$$
*   **정밀도 (Precision):** 모델이 Positive('5')라고 예측한 것 중에서 실제 Positive인 비율입니다.
    $$\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}}$$
*   **재현율 (Recall / Sensitivity):** 실제 Positive('5')인 전체 샘플 중 모델이 Positive라고 검출해 낸 비율입니다.
    $$\text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}}$$
*   **F1-Score**: 정밀도와 재현율의 조화 평균으로, 두 지표가 균형을 이룰 때 높은 값을 가집니다.
    $$\text{F1-Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$

```python
from sklearn.metrics import precision_score, recall_score, f1_score

print("정밀도 (Precision):", precision_score(y_train_5, y_train_pred))
print("재현율 (Recall):", recall_score(y_train_5, y_train_pred))
print("F1-Score:", f1_score(y_train_5, y_train_pred))
```

### 4) 정밀도와 재현율의 트레이드오프 (Trade-off)

분류기의 결정 임계값(Decision Threshold)을 조정하면 정밀도와 재현율의 밸런스를 제어할 수 있습니다. 

*   임계값을 낮추면 더 너그럽게 Positive로 판정하므로 **재현율은 올라가고 정밀도는 떨어집니다**.
*   임계값을 높이면 까다롭게 Positive로 판정하므로 **정밀도는 올라가고 재현율은 떨어집니다**.

---

## 5. ROC 곡선과 AUC

**ROC(Receiver Operating Characteristic) 곡선**과 **AUC(Area Under the Curve)** 면적은 결정 임계값의 변화에 따른 이진 분류기의 분류 능력을 한눈에 보여주는 평가 도구입니다.

*   **Y축 (True Positive Rate, TPR):** 실제 Positive 중 올바르게 양성 예측한 비율인 재현율입니다.
    $$\text{TPR} = \frac{\text{TP}}{\text{TP} + \text{FN}}$$
*   **X축 (False Positive Rate, FPR):** 실제 Negative 중 Positive로 잘못 예측한 비율입니다.
    $$\text{FPR} = \frac{\text{FP}}{\text{FP} + \text{TN}}$$

```python
from sklearn.metrics import roc_curve, roc_auc_score
import matplotlib.pyplot as plt

# 예측 점수(Decision Function Score) 확인
y_scores = cross_val_predict(sgd_clf, X_train, y_train_5, cv=3, method="decision_function")

# ROC 곡선 값 계산
fpr, tpr, thresholds = roc_curve(y_train_5, y_scores)

# ROC 곡선 시각화
def plot_roc_curve(fpr, tpr, label=None):
    plt.plot(fpr, tpr, linewidth=2, label=label)
    plt.plot([0, 1], [0, 1], 'k--') # 대각 점선 (무작위 예측)
    plt.axis([0, 1, 0, 1])
    plt.xlabel('False Positive Rate (FPR)')
    plt.ylabel('True Positive Rate (TPR / Recall)')
    plt.grid(True)

plot_roc_curve(fpr, tpr)
plt.show()

# AUC 점수 계산
auc_score = roc_auc_score(y_train_5, y_scores)
print("ROC-AUC 점수:", auc_score)
```

AUC(면적) 값이 $1.0$에 가까울수록 완벽한 모델이고, $0.5$에 가까울수록 동전 던지기 수준의 무작위 모델임을 의미합니다.

---

## 맺음말: 분류를 넘어 다음 단계로

지금까지 우리는 인공지능, 머신러닝, 딥러닝의 기본 개념을 정리하고, MNIST 데이터셋을 사용하여 Scikit-Learn의 SGD 분류기를 통해 이진 분류 모델을 직접 구축해 보았습니다. 더 나아가 오차 행렬, 정밀도, 재현율, F1-Score, 그리고 ROC-AUC까지 체계적인 성능 검증 원리를 학습했습니다.

성공적인 모델 구축의 핵심은 단순히 모델을 학습시키는 것을 넘어, 당면한 비즈니스나 연구 요구사항에 부합하는 올바른 성능 지표를 선택하고 이를 평가할 수 있는 통찰력을 갖는 데 있습니다.

다음 "분류 (2)" 포스트에서는 여러 클래스를 동시에 다루는 다중 클래스 분류(Multiclass Classification)와 다양한 앙상블 학습 기법에 대해 다루어 보겠습니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
