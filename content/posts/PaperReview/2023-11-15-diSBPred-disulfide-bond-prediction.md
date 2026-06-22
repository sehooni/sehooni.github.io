---
layout: single
title:  "[Paper Review] diSBPred: A Machine Learning Based Approach for Disulfide Bond Prediction"
excerpt: "단백질 3차원 구조 예측 및 번역 후 변형 분석의 핵심 요소인 시스테인 잔기의 이황화 결합 상태 및 연결성을 다양한 서열/구조 기반 피처와 스태킹 앙상블 기법으로 예측하는 diSBPred 프레임워크 리뷰"
toc: true
toc_sticky: true

categories:
  - PaperReview
tags: [PaperReview, Bioinformatics, MachineLearning, diSBPred, DisulfideBond]
use_math: true

date: 2023-11-15
last_modified_at: 2023-11-15T14:20:00-17:00:00
classes: wide
---

* **Paper Title**: [diSBPred: A Machine Learning Based Approach for Disulfide Bond Prediction](https://doi.org/10.1016/j.compbiolchem.2021.107436)
* **Authors**: Avdesh Mishra, Md Wasi Ul Kabir, and Md Tamjidul Hoque
* **Journal/Conference**: Computational Biology and Chemistry (2021)
* **DOI**: [10.1016/j.compbiolchem.2021.107436](https://doi.org/10.1016/j.compbiolchem.2021.107436)

---

## 1. 서론 (Introduction)

단백질 내에서 **이황화 결합(Disulfide Bond)**은 펩타이드 결합(Peptide Bond) 다음으로 가장 빈번하게 발생하는 아미노산 간의 공유 결합입니다. 두 개의 시스테인(Cysteine) 잔기 사이의 황 원자(S-S)가 결합하여 형성되는 이황화 결합은 단백질의 3차원 구조적 안정성을 유지하는 데 결정적인 역할을 수행합니다.

이황화 결합의 형성은 단백질의 열역학적 엔트로피를 감소시켜 접힌(folded) 상태의 자유 에너지를 안정화합니다. 생물정보학 분야에서 이황화 결합의 위치를 정확하게 파악하는 것은 다음과 같은 세 가지 이유에서 결정적인 기여를 합니다.
1. **구조 탐색 공간 축소**: 3차원 구조 예측(PSP) 시 물리적인 제약 조건으로 작용하여 결합 가능한 형태의 무수히 많은 경우의 수(Conformational Search Space)를 극적으로 줄여줍니다.
2. **Ab Initio 구조 예측(aiPSP)의 성공률 향상**: 물리적인 템플릿 없이 아미노산 서열만으로 3차원 구조를 예측하는 기법에서 성능을 크게 높일 수 있습니다.
3. **단백질 기능 및 변형 분석**: 포스트 번역 변형(Post-translational Modification, PTM)에 따른 활성화 상태 분석 및 산업용 효소의 열안정성 엔지니어링에 활용됩니다.

본 포스팅에서는 서열 및 구조 기반의 다차원 피처 추출과 스태킹(Stacking) 기반 앙상블 학습을 결합하여 개별 시스테인의 결합 상태와 시스테인 쌍의 연결성을 예측하는 **diSBPred** 모델에 대해 리뷰합니다.

---

## 2. 모델 아키텍처 (Model Architecture)

diSBPred의 가장 핵심적인 설계 기조는 복잡한 이황화 결합 문제를 **2단계 계층적 분류(Two-stage Hierarchical Classification)**로 나누어 해결하고, 다양한 모델의 이질적인 강점을 결합하는 **스태킹 앙상블(Stacking Ensemble)**을 도입했다는 점입니다.

### 2.1. 2단계 예측 프레임워크 (Two-Stage Framework)
단백질 서열 내에 존재하는 $N$개의 시스테인 잔기 사이에서 단순 조합으로 결합 쌍을 찾으려고 하면, $O(N^2)$의 결합 쌍 후보를 전부 계산해야 하므로 연산 복잡도가 높을 뿐만 아니라 절대다수의 비결합 쌍으로 인해 극심한 데이터 불균형(Class Imbalance) 문제에 직면하게 됩니다. diSBPred는 이를 다음과 같이 영리하게 분할하여 해결합니다.

1. **Stage 1 (Single Cysteine Bonding State Prediction)**: 
   - 개별 시스테인 잔기 $C_i$에 대해 슬라이딩 윈도우 기반의 환경 피처를 생성합니다.
   - 해당 시스테인이 이황화 결합에 실제로 기여하고 있는 상태(Bonding state)인지 혹은 자유 상태(Non-bonding/Free state)인지를 이진 분류(Binary Classification)합니다.
   - 각 시스테인의 결합 확률 $P(\text{bonding}_i)$를 출력합니다.
2. **Stage 2 (Cysteine-Pair Connectivity Prediction)**:
   - Stage 1에서 결합 상태일 확률이 높게 나타난 시스테인 잔기들의 조합만을 추출하여 쌍(Pair)을 구성합니다. 이 단계에서 연산 대상이 대폭 필터링되므로 $O(N^2)$ 공간이 매우 조밀한 $O(M^2)$ ($M \ll N$)으로 압축됩니다.
   - 시스테인 쌍 $(C_i, C_j)$에 대해, 개별 예측 확률인 $P(\text{bonding}_i)$, $P(\text{bonding}_j)$, 서열상 거리 $|i-j|$, 그리고 두 잔기 간의 공진화 결합 피처를 결합하여 최종적인 결합 여부(Bonding/Non-bonding)를 분류합니다.

### 2.2. 스태킹 앙상블 구조 (Stacking Ensemble)
하나의 머신러닝 알고리즘은 특정 데이터 분포에 오버피팅되거나 일부 피처 공간의 비선형적 관계를 놓치기 쉽습니다. diSBPred는 **Stacking** 구조를 활용하여 이를 보완합니다.

- **1단계: Base Classifiers**: 다양한 의사결정 경계를 가진 알고리즘들을 1차 분류기로 배치합니다.
  - **Extra Trees (ET)**: 랜덤 포레스트보다 무작위성이 강화된 트리 앙상블로 피처 분할의 분산(Variance)을 억제합니다.
  - **LightGBM**: 리프 중심(Leaf-wise) 트리 분할을 지원하여 대량 피처 학습 시 연산 효율과 성능을 극대화합니다.
  - **Logistic Regression (LR)**: 피처와 정답 간의 기본적인 선형 관계적 가중치를 학습합니다.
  - **K-Nearest Neighbors (KNN)**: 피처 공간 상에서 데이터 인스턴스들 간의 기하학적 거리를 기반으로 국소적 패턴을 파악합니다.
- **2단계: Meta Classifier**:
  - Base Classifier들이 예측한 결합 확률값($P_{\text{ET}}, P_{\text{LGB}}, P_{\text{LR}}, P_{\text{KNN}}$)을 새로운 피처 벡터로 구성합니다.
  - 이 메타 피처 공간에서 **LightGBM** 모델을 학습시켜 최종 분류 결정을 내립니다. 이 방식은 단일 모델을 사용하는 것에 비해 모델 결정을 블렌딩(blending)하여 일반화 성능을 획기적으로 개선합니다.

---

## 3. 방법론 및 피처 엔지니어링 (Methodology & Feature Engineering)

diSBPred의 우수한 예측력은 단백질 서열로부터 진화, 구조, 물리화학적 정보를 다차원적으로 융합해내는 정교한 피처 마이닝 과정에 기반합니다.

![diSBPred Overall Pipeline](/assets/images/2023-11-15-diSBPred-disulfide-bond-prediction/image5.png)
*Figure 1: diSBPred의 전체적인 데이터 전처리, 피처 추출 및 2단계 예측 프레임워크 파이프라인*

### 3.1. 데이터셋 전처리 및 필터링
UniProt 데이터베이스로부터 실험적으로 아미노산 및 이황화 결합이 확인된 단백질들을 수집하고, CD-HIT 알고리즘을 활용하여 서열 유사도가 25% 이상인 중복 서열을 제거하여 독립성을 보장했습니다.
- **Set-A**: 2,276개의 고품질 비유사 서열 데이터셋.
- **Set-B**: 3,474개의 서열 데이터셋으로 검증의 다양성을 확보.

### 3.2. 슬라이딩 윈도우를 통한 피처 마이닝 (Feature Extraction)
시스테인 잔기 자체의 정보만으로는 주변 3D 구조 공간에서 다른 시스테인과 접촉 가능한 환경인지를 알기 어렵습니다. 따라서 타깃 시스테인을 중심으로 좌우 $L$ 크기의 슬라이딩 윈도우를 적용하여 총 17개 잔기(윈도우 크기 $W = 17$, 즉 좌우 8개 잔기씩)의 미시적 환경 데이터를 추출합니다.

![diSBPred Sliding Window & Feature Mining](/assets/images/2023-11-15-diSBPred-disulfide-bond-prediction/image6.png)
*Figure 2: 슬라이딩 윈도우(Sliding Window) 기법을 활용한 아미노산 주변 환경의 다차원 피처 추출 과정*

추출되는 피처 종류는 다음과 같습니다:

1. **Residue Profile (서열 프로파일)**:
   - 윈도우 내의 각 아미노산을 20차원 One-hot 인코딩으로 변환합니다.
   - 단백질 서열의 양 끝단(N-term, C-term)과의 거리를 반영하여 말단 영역의 구조적 유연성 차이를 모델에 제공합니다.
2. **Physiochemical Profile (물리화학적 프로파일)**:
   - 아미노산 고유의 5가지 물리화학적 속성인 극성(Polarity), 소수성(Hydrophobicity), 정전기 전하(Charge), 분자 부피(Volume), 코돈 다양성 등을 반영한 수치 벡터를 구성합니다.
3. **Conservation Profile (진화 보존 프로파일 - PSSM)**:
   - PSI-BLAST를 실행하여 획득한 위치 특이적 점수 행렬(Position-Specific Scoring Matrix, PSSM)을 사용합니다.
   - **1D Monogram (MG)**: 특정 위치에서 특정 아미노산이 나타날 진화적 보존 강도를 추출합니다.
   - **2D Bi-gram (BG)**: 서열 상에서 인접한 두 아미노산 쌍의 공동 보존 패턴을 반영하여 2차원 진화 관계를 인코딩합니다.
4. **Structural Profile (예측 구조 프로파일)**:
   - 서열만으로 3D 구조를 간접 추론하기 위해, **DisPredict2** 예측 모델을 실행하여 각 잔기가 코일(Coil), 시트(Sheet), 헬릭스(Helix) 등의 이차 구조를 이룰 확률값(3차원)과 용매 접근성(Accessible Surface Area, ASA) 수치값을 피처로 추가합니다. 용매에 노출된 시스테인은 자유 상태일 확률이 높고, 중심부에 묻혀 있는 시스테인은 이황화 결합을 형성할 확률이 높기 때문입니다.
5. **Flexibility Profile (유연성 및 무질서도)**:
   - $C_\alpha$ 백본의 비틀림 각도인 $\Phi$(Phi)와 $\Psi$(Psi)의 예측 변동 값과 함께, 고유 무질서도 영역(Intrinsically Disordered Region, IDR) 점수를 추가하여 결합 형성 시의 엔트로피 장벽을 수치화합니다.
6. **Energy Profile (에너지 분포)**:
   - 각 잔기 주변의 국소적 물리 화학적 평형 상태를 측정하는 위치 특이적 추정 자유 에너지(Position-Specific Estimated Free Energy, PSEE)를 계산하여 추가합니다.

### 3.3. Meta-Classifier를 통한 Stacking 기법
Stage 1과 Stage 2의 학습 시, 1레벨 Base Classifier들의 결과를 가중 통합하기 위한 최적의 Meta-Classifier 조합으로 LightGBM이 채택되었습니다.

![diSBPred Stacking Architecture](/assets/images/2023-11-15-diSBPred-disulfide-bond-prediction/image7.png)
*Figure 3: Base-Classifier의 예측값을 Meta-Classifier의 입력으로 활용하는 Stacking Ensemble 아키텍처*

---

## 4. 결과 및 분석 (Results & Analysis)

diSBPred는 과적합을 철저히 배제하기 위해 10-fold 교차 검증과 단백질 단위의 독립적인 Jackknife 검증을 수행하여 공정한 평가를 받았습니다.

![diSBPred Results Table](/assets/images/2023-11-15-diSBPred-disulfide-bond-prediction/image9.png)
*Figure 4: diSBPred 모델의 10-fold 교차 검증 성능 및 기존 분류 방식들과의 비교*

- **Stage 1 (Single Cysteine) 예측 성능**: 
  - Balanced Accuracy 기준 **82.29%**를 기록했습니다. 이는 개별 시스테인 잔기가 단백질 내부에서 반응에 참여할 준비가 되어 있는지를 매우 정밀하게 판별함을 의미합니다.
- **Stage 2 (Cysteine-Pair) 예측 성능**:
  - Balanced Accuracy 기준 **94.20%**의 압도적인 성능을 보였습니다. 1단계에서 좁혀진 후보군을 기반으로 공진화 정보와 거리를 결합한 결과, 오답(False Positive)의 비율을 혁신적으로 제어할 수 있었습니다.

![diSBPred Analysis Charts](/assets/images/2023-11-15-diSBPred-disulfide-bond-prediction/image10.png)
*Figure 5: 다양한 데이터셋(Set-A, Set-B)에서의 모델별 Balanced Accuracy 비교 그래프*

초보자의 이해를 돕기 위해, 기존의 가장 직관적인 분류 방식이었던 **Nearest Neighbor Algorithm (NNA)**과 비교했을 때 Balanced Accuracy가 무려 **43.25% 향상**되는 극적인 변화를 보였습니다. 이는 NNA가 단순한 서열 유사성에만 집착하는 반면, diSBPred는 3차원 물리화학적 환경 정보와 앙상블 결정을 동시 다발적으로 분석하기 때문입니다.

![diSBPred Disulfide Connectivity Analysis](/assets/images/2023-11-15-diSBPred-disulfide-bond-prediction/image14.png)
*Figure 6: 이황화 결합 연결성 예측 성능 및 다양한 Meta-Classifier 조건 성능 비교*

---

## 5. 결론 및 토의 (Conclusions)

diSBPred는 다차원 물리 화학 피처 추출과 스태킹 기반 메타 학습을 접목하여 서열 기반 이황화 결합 예측 연구에서 가장 높은 정확도를 보고한 우수한 프레임워크입니다.
- **의의**: 단백질 3차원 구조 예측(PSP) 프레임워크의 연산 탐색 공간을 사전에 극단적으로 좁히고 물리적 정확성을 유도하는 전처리 모듈로서 큰 가치를 지닙니다.
- **한계 및 향후 방향**: 구조 정보가 전혀 알려지지 않은 완전한 미지의 단백질군에 대해서는 외부 도구(DisPredict2 등)를 통한 2차 구조 예측 오차가 diSBPred의 최종 성능으로 전파될 가능성(Error Cascade)이 존재합니다. 향후 엔드투엔드(End-to-End) 신경망 구조를 통해 이를 직접 통합하는 연구가 기대됩니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
