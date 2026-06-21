---
title:  "[AI Hackathon] 2025 LG Aimers 7기 AI Hackathon 회고"
excerpt: "LG Aimers 7기 AI 해커톤 본선 진출(Finalist) 회고 및 N-HiTS와 군집 모델링 기반의 F&B 매장 매출 수요 예측 솔루션 공유"
categories:
  - Projects
  - Hackathon
tags:
  - Projects
  - Hackathon
  - Time Series Forecasting
  - Deep Learning
  - N-HiTS
toc: true
toc_sticky: true
use_math: true
date: 2026-01-06
last_modified_at: 2026-01-06
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

본 포스트는 **LG Aimers 7기 AI 해커톤**에 참가하여 본선(Finalist)에 진출하기까지의 기술적 시도들과 시계열 수요 예측 모델링 과정에 대한 회고입니다.

이번 해커톤의 주제는 **"식음료 매장의 메뉴별 매출 수요 예측"**이었습니다. 특정 F&B 영업장들의 과거 일별 매출 수량 및 기상 정보, 공휴일, 이벤트 등의 다양한 외부 요인(Covariates)을 바탕으로 향후 7일간의 메뉴별 판매 수량을 예측하는 과제였습니다. 본선에서는 특히 시계열 데이터의 불안정성(Volatility)을 제어하고, 매장별 또는 메뉴별 상이한 매출 흐름을 정교하게 모델링하는 것이 핵심이었습니다.

대회 당시 사용한 파이프라인 설계 및 검증 전략에 대해 아래에서 공유하고자 합니다.

---

## 해결 전략 및 시스템 아키텍처

저희 팀은 예측의 안정성을 극대화하기 위해 데이터 변환, 검증 프레임워크 일치, 정교한 손실 함수 설계, 그리고 오차가 큰 대상에 대한 군집화 모델링 전략을 차례대로 적용했습니다.

### 1. 매출 수량 Log 변환 & 데이터 정규화

시계열 데이터에서 매출 수량의 스케일 차이가 매우 크고 특정 날짜에 판매량이 급증하는 경향이 있어 모델 학습의 불안정성을 초래했습니다. 이를 해결하기 위해 다음과 같은 전처리를 적용했습니다.

* **타깃 변환 (Target Transformation)**:
  매출 수량 $y$에 대해 로그 변환 $y' = \log(y + 1)$을 적용하여 안정적인 학습 분포를 유도했습니다. 모델을 통해 예측된 결과 $y_{pred}'$는 역변환 $\exp(y_{pred}') - 1$을 거쳐 최종 제출 값으로 복원되었습니다.
* **공변량 정규화 (Covariate Normalization)**:
  그 외 외부 변수(기온, 강수량 등)에 대해서는 매장별, 메뉴별 시리즈(Series) 단위로 MinMaxScaling ($0$에서 $1$ 사이)을 적용했습니다. 전체 데이터를 기준으로 정규화할 경우 특정 비인기 메뉴의 공변량이 묻히는 문제를 방지하기 위함이었습니다.

---

### 2. N-HiTS 기반 모델링 전략

시계열 예측 모델로는 다층 계층적 구조를 통해 복잡한 장단기 주기를 효과적으로 포착하는 **N-HiTS (Neural Hierarchical Interpolation for Time Series)** 아키텍처를 베이스라인으로 채택했습니다.

![Train Process](/assets/images/2025-09-18-ai-hackathon-2025-lg-aimers-7--ai-hackathon-/image.png)

* **시간 순서를 유지한 단순 시점 분할 (Simple Temporal Split)**:
  시계열 데이터의 특성상 미래의 정보가 과거에 유출되는 데이터 누수(Data Leakage)를 원천 차단하기 위해 시간 순서를 엄격히 준수하여 Train과 Validation 세트를 분리했습니다.
* **실전과 동일한 Multi-Window Validation 구성**:
  실제 해커톤 제출 방식이 **"최근 28일의 데이터(Lookback Window)를 기반으로 향후 7일(Forecast Horizon)을 예측"**하는 형태였습니다. 검증 데이터셋 역시 $28 \to 7$ 예측 윈도우를 여러 개 겹쳐 테스트할 수 있도록 $42$~$56$일 수준의 넉넉한 검증 스팬을 설정하여 평균적인 오차를 도출했습니다.

![Predict Process](/assets/images/2025-09-18-ai-hackathon-2025-lg-aimers-7--ai-hackathon-/image-1.png)

* **공변량 정합성 (Covariate Alignment)**:
  예측 시점의 공변량 정렬 에러(Length Mismatch)를 방지하기 위해 타깃 값과 동적 외부 변수의 시점을 동일하게 정합시키는 데이터 파이프라인을 구축했습니다.

---

### 3. 평가 산식 맞춤형 Loss 설계

예선과 본선에서 채점하는 정량평가 지표가 달라짐에 따라, 손실 함수(Loss Function) 역시 이에 맞추어 전환하였습니다.

* **예선 단계 (Weighted SMAPE)**:
  예선에서는 영업장별 가중치가 부과된 SMAPE(Symmetric Mean Absolute Percentage Error)가 사용되었습니다. 특히 '미라시아'와 같은 특정 고가중치 매장의 성능이 총점에 큰 영향을 주었습니다. 이를 타깃팅하기 위해 고가중치 매장의 시계열 데이터를 의도적으로 복사해 학습 데이터 분포를 늘리는 **오버샘플링(Over-sampling)** 방식을 도입해 가중 학습을 유도했습니다.
* **본선 단계 (SMAPE, NMAE, NRMSE, R-squared 균등 가중)**:
  본선에서는 특정 매장 중심이 아닌 다각적인 지표 평가로 변경되었습니다. 이에 따라 인위적인 오버샘플링을 배제하고 전체 영업장 가중치를 동일하게 조정했습니다. 또한 실제 매출값이 $0$이거나 음수인 구간은 최종 평가에서 제외되는 점을 감안하여, 해당 구간을 계산에서 제외시키는 **지표 마스킹(Masking)** 기법을 손실 함수에 직접 내재화하여 불필요한 예측 낭비를 줄였습니다.

---

### 4. 잔차 분석 기반 군집별 모델링 (Cluster-Based Modeling)

단일 N-HiTS 모델로 전체 영업장과 메뉴를 통합 학습시켰을 때, 특정 대형 매장의 고수요 메뉴에서 지속적으로 예측 오차가 누적되는 현상이 발견되었습니다.

![Develop process step by step](/assets/images/2025-09-18-ai-hackathon-2025-lg-aimers-7--ai-hackathon-/image-2.png)

1. **오차 지점 탐색**:
   검증 데이터 예측값과 실제값의 잔차(Residual) 분석을 수행한 결과, 잔차가 $10$ 이상 벌어지는 이상 항목(Anomalies) 대부분이 고가중치 영업장('미라시아')에 집중되어 있었습니다.
2. **Spearman 상관계수 기반 군집화**:
   잔차가 크게 나타나는 메뉴들의 매출 변동 패턴에 대해 Spearman 상관계수를 구하고 계층적 군집화를 진행했습니다.
3. **3가지 군집 맞춤형 모델링**:
   분석을 통해 패턴이 뚜렷하게 나뉘는 3개의 군집(Cluster)을 분류할 수 있었습니다.
   * **군집 1**: 주말에만 급격하게 매출이 증가하는 주말 특화형 메뉴
   * **군집 2**: 기온과 강수 패턴에 민감한 계절/날씨 민감형 메뉴
   * **군집 3**: 기복이 거의 없는 꾸준한 저수요 메뉴
   이후 각 군집별로 하이퍼파라미터가 다르게 설정된 별도의 N-HiTS 모델을 분기 학습하여 최종 예측 성능을 약 $12\%$ 추가 향상시킬 수 있었습니다.

---

## 대회 회고 및 느낀 점

이번 LG Aimers 해커톤을 치르면서 가장 깊게 느낀 점은 **"시계열 데이터에서는 검증 데이터셋의 신뢰성(Consistency)이 곧 결과의 전부"**라는 사실입니다. public score를 올리는 것에만 급급해 과도하게 피처를 조작하거나 앙상블을 남발할 경우, 검증 데이터 구조가 탄탄하지 않다면 private 제출 단계에서 반드시 벼랑 끝으로 몰리게 됨을 배웠습니다.

실제 비즈니스 환경에서도 모든 고객 군집을 하나의 거대한 신경망 모델로 커버하려 하기보다, 비즈니스 도메인의 특성과 데이터의 오차 패턴을 뜯어보고 적절히 군집화하여 분할 접근(Divide and Conquer)하는 것이 현실적이면서도 강력한 해결책이 될 수 있음을 체감했습니다.

좋은 동료들과 함께 시계열 최적화 모델을 한 단계씩 발전시켜 나갔던 뜻깊은 해커톤이었습니다. 앞으로도 더 정교한 머신러닝/딥러닝 모델링을 설계하여 실생활의 난제들을 풀 수 있도록 연구를 지속하겠습니다!

---

**Contact & Inquiries**
* **LinkedIn**: [Sehoon Park](www.linkedin.com/in/sehoon-park)
* **GitHub**: [https://github.com/sehooni](https://github.com/sehooni)
* **Email**: 74sehoon@gmail.com
* 댓글 혹은 메일을 통해 다양한 기술적 피드백을 환영합니다! :)