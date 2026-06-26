---
layout: single
title:  "[Paper Review] Distance-AF: Modifying Predicted Protein Structure Models by AlphaFold2 with User-Specified Distance Constraints"
excerpt: "AlphaFold2 구조 예측 모델에 사용자가 지정한 물리적 거리 제약조건(Distance Constraints)을 반영하여 도메인 방향성 및 다중 형태 변화 등을 최적화하는 Distance-AF 프레임워크 리뷰"
toc: true
toc_sticky: true

categories:
  - PaperReview
tags: [PaperReview, Bioinformatics, AlphaFold, Distance-AF, DistanceConstraints]
use_math: true

date: 2024-02-29
last_modified_at: 2024-02-29T16:00:00-17:00:00
classes: wide
---

* **Paper Title**: [Distance-AF: Modifying Predicted Protein Structure Models by AlphaFold2 with User-Specified Distance Constraints](https://doi.org/10.1038/s42003-025-08783-5)
* **Authors**: Yuanyuan Zhang, Zicong Zhang, Yuki Kagaya, Genki Terashi, Bowen Zhao, Yi Xiong, and Daisuke Kihara
* **Journal/Conference**: Communications Biology (2025)
* **DOI**: [10.1038/s42003-025-08783-5](https://doi.org/10.1038/s42003-025-08783-5)

---

## 1. 서론 (Introduction)

AlphaFold2의 등장은 단일 도메인 단백질(Single-domain Protein)의 3차원 구조 예측 성능을 서브 옹스트롬(Sub-angstrom) 단위의 정확도로 끌어올렸습니다. 그러나 다중 도메인(Multi-domain) 단백질이나 고도로 유연한 동적 단백질에 대해서는 여전히 다음 두 가지 한계를 지닙니다:
1. **도메인 방향성 오차(Domain Orientation Errors):** 단일 도메인은 잘 풀지만 도메인과 도메인을 잇는 유연한 링커(Linker) 영역의 방향을 잘못 잡아 전체 복합 구조가 찌그러지는 현상이 빈번합니다.
2. **다중 상태의 배제 (Static Prediction vs Conformational Dynamics):** 단백질은 외부 리간드나 수용체와의 결합 상태(Active vs Inactive)에 따라 3차원 모양이 달라지는 동적 앙상블 성질을 지니나, AlphaFold2는 단 하나의 고정된 형태만을 예측값으로 제공합니다.

이를 해결하기 위해 FRET, NMR, 화학적 크로스링크 등 다양한 생물리 실험 기법으로 측정된 희소한 거리 제약 조건(Distance Constraints)을 활용합니다. **Distance-AF는** 기존 AlphaFold2 모델이 보장하는 정밀한 로컬 도메인 구조를 기초 템플릿(Pseudo-ground truth)으로 두고, 사용자가 지정한 물리적 거리 범위 제약을 만족하도록 단백질 구조 모듈의 기하학적 파라미터를 경사하강법으로 미세 조정하는 최첨단 리파인먼트(Refinement) 프레임워크입니다.

![AlphaFold2 Domain Orientation Limitation](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/image3.png)
*Figure 1: AlphaFold2의 전체 신경망 구조(Evoformer 및 Structure Module) 파이프라인 개념도*

---

## 2. 모델 아키텍처 및 손실 함수 (Model Architecture & Loss Functions)

Distance-AF는 AlphaFold2(AF2)의 고정밀 로컬 구조 예측력과 외부 물리적 제약 조건(Distance Constraints)을 결합하여 3차원 구조 모델을 정밀화하는 최적화 프레임워크입니다. 이 모델의 핵심 특징은 새로운 신경망을 학습시키는 것이 아니라, **이미 학습된 AlphaFold2의 가중치(Weights)를 고정한 상태에서** 물리적 제약 조건을 만족하는 최적의 단백질 형태(Conformation)를 탐색한다는 점입니다.

### 2.1. 역전파를 통한 표현자 최적화 (Representation Optimization)

AlphaFold2의 Evoformer 및 Structure Module 가중치는 동결(Freeze)됩니다. 만약 이 가중치들을 직접 수정하게 되면, AlphaFold2가 데이터셋으로부터 학습한 단백질 고유의 물리 화학적/기하학적 규칙(Structural Prior)이 파괴(Catastrophic Forgetting)되어 비자연스러운 구조가 생성될 위험이 큽니다.

대신, Distance-AF는 Evoformer의 출력이자 Structure Module의 입력으로 사용되는 두 가지 핵심 텐서인 **싱글 표현자(Single Representation)**, $s_i \in \mathbb{R}^{N_{res} \times 384}$와 **페어 표현자(Pair Representation)**, $z_{ij} \in \mathbb{R}^{N_{res} \times N_{res} \times 128}$를 최적화 매개변수(Optimization Variables)로 삼습니다.

1. **초기값 설정**: AlphaFold2 추론을 통해 생성된 초기 $s_i$와 $z_{ij}$를 최적화의 출발점으로 설정합니다.
2. **순방향 전파 (Forward Pass):** 최적화 대상인 $s_i, z_{ij}$가 Structure Module을 거쳐 3차원 원자 좌표 $X = \{x_1, x_2, \dots, x_N\}$로 변환됩니다.
3. **손실 계산 및 역전파 (Loss computation & Backpropagation):** 변환된 3D 좌표와 사용자가 제공한 거리 제약 조건 간의 차이를 계산하여 총 손실(Total Loss)을 산출하고, 이를 바탕으로 $s_i$와 $z_{ij}$에 대한 그래디언트(Gradient)를 역전파합니다.
4. **Adam 업데이트**: Adam 옵티마이저(학습률 $0.001$, $\beta_1 = 0.9, \beta_2 = 0.99$)를 활용해 싱글 및 페어 표현자를 반복적으로 업데이트합니다. 이 과정은 최대 30,000 에포크(Epoch) 동안 수행되며 손실이 수렴할 때까지 지속됩니다.

![Distance-AF Method Flowchart](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/image6.png)
*Figure 2: 초기 AlphaFold2 예측 모델로부터 오차 역전파 및 최적화 루프를 통해 유연하게 구조를 업데이트하는 Distance-AF 파이프라인*

### 2.2. 다중 손실 함수 (Multi-Component Loss Function) 구성

물리적으로 타당한 구조적 무결성을 유지하면서도 사용자의 거리 요구사항을 조화롭게 충족하기 위해, Distance-AF는 아래와 같이 네 가지 손실 항목의 가중합으로 구성된 총 손실 함수를 정의합니다:

$$
\mathcal{L}_{total} = w_{dist} \mathcal{L}_{dist} + w_{fape} \mathcal{L}_{fape} + w_{ang} \mathcal{L}_{ang} + w_{viol} \mathcal{L}_{viol}
$$

![Loss Function slide details](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/image9.png)
*Figure 3: 최적화에 적용되는 각 가중 손실 함수 항목(거리 손실, FAPE 오차, 각도 제약, 충돌 위반)의 최적화 설정 및 손실 조합 구성*

#### 1) 거리 손실 (Distance Loss, $\mathcal{L}_{dist}$)
사용자가 지정한 두 아미노산 잔기 $i$와 $j$ 사이의 $C\alpha$ 원자 허용 범위 $[d_{\min}, d_{\max}]$를 입력받아, 모델이 예측한 현재 Euclidean 거리 $d_{ij}$와의 오차를 계산합니다. 이 손실은 아래와 같이 평평한 바닥(Flat-bottom) 형태의 퍼텐셜 함수 $\phi(d_{ij})$를 따릅니다:

$$
\mathcal{L}_{dist} = \sum_{(i,j) \in C} \phi(d_{ij})
$$

$$
\phi(d_{ij}) = 
\begin{cases} 
(d_{ij} - d_{\min})^2 & \text{if } d_{ij} < d_{\min} \\
(d_{ij} - d_{\max})^2 & \text{if } d_{ij} > d_{\max} \\
0 & \text{otherwise}
\end{cases}
$$

여기서 $C$는 사용자가 지정한 거리 제약 조건 쌍의 집합입니다. 거리가 허용 범위 내에 있으면 손실이 $0$이 되므로, NMR 앙상블 분석이나 FRET 측정값과 같은 실험적 불확실성 및 노이즈가 내포된 희소 데이터에 매우 강건(Robust)하게 대응할 수합니다.

#### 2) 로컬 구조 보존을 위한 FAPE Loss ($\mathcal{L}_{fape}$)
거리 제약조건에만 집중하여 최적화를 수행하면 도메인이 서로 이동하는 과정에서 각 도메인 자체의 정밀한 2차/3차 로컬 구조(알파 헬릭스, 베타 시트 등)가 완전히 찌그러지는 붕괴 현상이 발생합니다. 이를 방지하기 위해 AlphaFold2의 핵심 손실 함수인 FAPE(Frame Aligned Point Error)를 적용합니다.

초기 AlphaFold2 예측 모델을 참값(Pseudo-ground truth)으로 간주하고, 모든 잔기 $i$의 로컬 좌표계(Local Frame, $T_i$)를 기준으로 다른 모든 잔기 $j$의 원자 위치를 투영하여 좌표 간 기하학적 어긋남을 감시합니다. 이를 통해 각 도메인의 내부 골격(Backbone Geometry)과 패킹 상태를 초기 예측 모델 수준으로 견고하게 유지합니다.

#### 3) 각도 손실 (Angle Loss, $\mathcal{L}_{ang}$)
단백질 백본의 비틀림 각도(Dihedral Angles)인 $\Phi$ (Phi), $\Psi$ (Psi), $\Omega$ (Omega) 및 사이드체인(Sidechain) 비틀림 각도 $\chi$들이 물리적으로 불가능한 화학적 에너지 장벽을 넘어 왜곡되는 것을 방지합니다. 초기 AlphaFold2 모델의 회전 상태로부터 각도가 급격히 변하지 않도록 조절함으로써 물리적으로 안정한 라마찬드란(Ramachandran) 허용 영역을 이탈하지 않도록 규제합니다.

#### 4) 위반 손실 (Violation Loss, $\mathcal{L}_{viol}$)
인접하지 않은 아미노산 원자 쌍이 공간상에서 비정상적으로 겹쳐 발생하는 화학적 반발력인 원자 충돌(Steric Clash) 및 공유결합 길이/결합각 위반 등을 모니터링하여 강한 패널티를 부과합니다. 이는 구조가 극적으로 비틀릴 때 원자들이 서로 침범하여 비물리적인 모델이 생성되는 것을 방지합니다.

### 2.3. 동적 손실 가중치 (Dynamic Weighting) 조절

최적화 초기에는 모델이 제약 조건을 충족하기 위해 도메인을 크게 이동시켜야 하므로, 거리 손실의 가중치 $w_{dist}$를 크게 설정하여 이동을 유도합니다. 반면, 로컬 구조를 보존하려는 FAPE 손실 가중치 $w_{fape}$는 상대적으로 작게 둡니다.

최적화가 진행되면서 거리 손실 값 $\mathcal{L}_{dist}$가 수렴 조건 이하로 떨어지면, 가중치를 동적으로 조율(Dynamic Weights Adjustment)합니다. $w_{dist}$의 영향력을 줄이고 $w_{fape}$의 비중을 높여, 흐트러진 각 도메인의 백본 골격과 사이드체인 패킹을 다시 고정밀 상태로 복원(Relaxation & Refinement)합니다. 이 유기적 제어 흐름은 전체 구조가 제약 조건을 만족하면서도 높은 물리적 타당성을 갖추도록 조화롭게 이끕니다.

![Dynamic Loss Weights Adjustment](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/image16.png)
*Figure 4: 최적화 단계에서 $\mathcal{L}_{dist}$ 값의 추이에 따라 $w_{dist}$와 $w_{fape}$ 가중치를 유기적으로 조절하는 동적 가중치(Dynamic Weights) 제어 흐름*

---

## 3. 방법론: 도메인 단위 FAPE 마스킹 (Intra-Domain FAPE Masking)

Distance-AF 연구가 거둔 기술적 돌파구의 핵심은 **도메인 단위 FAPE 마스킹(Intra-domain FAPE Masking)의** 도입입니다.

### 3.1. 전역 FAPE 계산의 한계와 구조 붕괴 원인
일반적인 AlphaFold2 학습이나 정밀화 과정에서는 모든 잔기 쌍 $(i, j)$ 간의 오차를 계산하는 **전역 FAPE(Global FAPE)를** 사용합니다. 

그러나 다중 도메인 단백질(Multi-domain Protein)의 경우, 도메인 A와 도메인 B를 연결하는 링커(Linker) 영역의 회전 등으로 인해 도메인 간의 거리를 조정해야 할 때 전역 FAPE는 심각한 장애물이 됩니다. 도메인 A가 도메인 B에 가까워지는 상대적인 운동 자체를 전역 FAPE가 "구조가 왜곡되는 에러"로 판단하기 때문입니다.

결과적으로 두 가지 대립하는 힘이 상충합니다:
- **거리 손실($\mathcal{L}_{dist}$):** 도메인 A와 B를 끌어당김
- **전역 FAPE 손실($\mathcal{L}_{fape}$):** 두 도메인의 초기 상대적 위치 배치를 고수하려고 함

이로 인해 도메인이 부드럽게 미끄러지거나 회전하지 못하고 제자리에 고정된 상태에서, 도메인 내부의 백본 구조가 억지로 찌그러지거나 붕괴(Local Structural Distortion)되는 심각한 부작용이 발생합니다.

### 3.2. FAPE 마스킹 공식 및 작동 방식

이를 극복하기 위해 Distance-AF는 사용자가 입력한 도메인 경계 정보(Domain Boundaries)를 기반으로 FAPE 손실 계산 시 **서로 다른 도메인에 속한 잔기 쌍의 오차를 계산에서 완전히 배제(Masking out)하는** 마스킹 행렬(Masking Matrix)을 도입했습니다:

$$
\mathcal{L}_{fape}^{masked} = \frac{1}{N_{\text{intra}}} \sum_{d \in D} \sum_{i, j \in \text{domain}(d)} \min(\text{FAPE}(i, j), Z)
$$

- $D$: 단백질 전체에 정의된 개별 구조 도메인들의 집합
- $\text{domain}(d)$: 도메인 $d$에 속하는 잔기들의 인덱스 집합
- $N_{\text{intra}}$: 동일한 도메인 내부에 속한 잔기 쌍 $(i, j)$의 총 개수
- $Z$: 기하학적 클램프(Clamp) 임계값 (기본 $10$ Å)

![Modified FAPE Masking Mechanism](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/image9.png)
*Figure 5: 도메인 간의 상대 운동을 허용하기 위해 상이한 도메인 결합 쌍의 FAPE 손실 기여를 강제 마스킹(Zero-out)하는 구조 설계*

이 마스킹 설계를 적용하면 다음과 같은 기하학적 자유도가 보장됩니다:
1. **도메인 내부 보존**: 동일 도메인 내부의 잔기 쌍에 대해서는 FAPE 손실이 엄격히 적용되므로, 알파 헬릭스나 베타 시트 등 고정밀 로컬 3차원 형태는 완벽히 유지됩니다.
2. **도메인 간 자유도 확보**: 도메인 간의 결합쌍(Cross-domain pairs)은 FAPE 계산에서 마스킹되어 손실이 $0$이 되므로, 최적화 엔진은 도메인 사이의 유연한 링커를 굽히거나 비틀어 도메인 간 상대적 방향성과 거리를 제한 없이 조정할 수 있습니다.
3. **경사하강의 수렴성**: 불필요한 충돌 에너지가 소거되므로 거리 제약 조건을 만족하는 안정한 글로벌 구조 배치를 훨씬 빠른 연산 속도로 안정적으로 찾아냅니다.

---

## 4. 결과 및 분석 (Results & Analysis)

연구진은 Cryo-EM 전자 밀도 지도 피팅, NMR 앙상블 분석, GPCR 수용체의 구조 전이를 포함하는 25개의 고난도 타깃을 기반으로 성능을 검증했습니다. Distance-AF는 기존 AlphaFold2 모델 대비 native 구조로의 RMSD 오차를 평균 11.75 Å 감소시키는 압도적인 교정 능력을 입증했습니다.

### 4.1. Cryo-EM 전자 밀도 맵 피팅 실증 (PDB 7WTA, 7O1D, 8B1R)
실험적으로 관찰된 Cryo-EM 전자 밀도 지도 영역과 AlphaFold2 예측 모델 간에 도메인 방향성 어긋남이 있을 때, 밀도 맵의 기하학적 중심 좌표들을 거리 제약 조건으로 변환하여 Distance-AF에 입력했습니다. 그 결과, 내부 도메인 붕괴나 백본 찌그러짐 없이 단백질 백본 프레임 전체가 밀도 맵 내부로 매끄럽게 포지셔닝되었습니다.

![Cryo-EM Density Fitting Results](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/image24.png)
*Figure 6: Cryo-EM 밀도 맵(Density Map)에 맞추어 모델 도메인 영역을 변형해 매핑에 도달시키는 Cryo-EM 피팅 실증 (PDB 7WTA, 7O1D, 8B1R)*

### 4.2. GPCR 구조 전이 및 활성 상태 예측 (PDB 3C9L:A, 7BTS:A)
G 단백질 결합 수용체(GPCR)와 같이 활성(Active) 및 비활성(Inactive) 상태에 따라 대대적인 3차원 배치가 변하는 타깃에 대해 실험 데이터를 적용했습니다. Distance-AF는 결합 상태에 따른 구조적 재배열 교정을 예측함으로써 실제 단백질이 가지는 다중 상태 변화를 성공적으로 모사하였습니다.

![GPCR Conformation switch results](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/image27.png)
*Figure 7: GPCR 수용체의 활성 및 비활성 상태 전이와 이에 따른 구조적 재배열 교정 예측 시각화 (3C9L:A, 7BTS:A)*

### 4.3. NMR 앙상블 및 상태 전이 성공적 묘사 (PDB 1TMW_A, 1DMO_A, 2M8P_A)
NMR 실험을 통해 확인되는 다중 상태(Multi-state) 거리 제약 조건에 도달하는 모델들을 각각 생성함으로써 동적 앙상블 분포를 묘사했습니다. 기존 분자 동력학(Molecular Dynamics) 시뮬레이션이나 Rosetta 기반의 제한 조건 도킹 방식과 비교했을 때, Distance-AF는 수 시간 내에 훨씬 적은 제약 조건 정보만으로도 참값 구조 대비 RMSD 오차를 대폭 감축시키는 높은 데이터 효율성을 보여주었습니다.

![NMR Ensemble simulation result charts](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/image29.png)
*Figure 8: NMR 앙상블 타깃 분석에 대해 Distance-AF를 통해 획득한 다양한 구조 변형 양상과 원자 오차 분포 변화 (1TMW_A, 1DMO_A, 2M8P_A)*

---

## 5. 결론 및 한계점 (Conclusions & Limitations)

### 5.1. 결론 (Conclusions)
Distance-AF는 AlphaFold2가 지닌 독보적인 로컬 구조 정밀도 위에, 사용자가 수동 또는 실험적으로 지정하는 거시적 물리 제약 정보를 조화롭게 엮어내어 전체 모델의 글로벌 기하학적 오류를 효과적으로 교정하는 혁신적인 구조 정밀화 도구입니다.

샘플링 기반의 전통적인 분자 동력학(MD)이나 Rosetta 기반 물리적 도킹 기법이 거대한 에너지 장벽으로 인해 수 주일의 연산 시간을 소모했던 것에 비해, Distance-AF는 AlphaFold2 구조 모듈의 연속적인 그래디언트 공간을 활용하여 수 시간 내에 고해상도 최적화 해를 구합니다. 이는 고해상도 단백질 구조 연구를 고도화할 수 있는 강력한 무기가 될 것입니다.

### 5.2. 한계점 (Limitations)
그럼에도 불구하고 Distance-AF는 향후 해결해야 할 몇 가지 뚜렷한 한계점을 안고 있습니다:

1. **단일 사슬(Single-chain) 중심의 도메인 교정**: 현재 구현체는 단일 사슬 내 도메인 기하 구조 교정에 초점이 맞추어져 있어, 다량체 복합체(Multi-chain Complexes)의 비공유 결합 인터페이스를 재배치하거나 여러 단백질 체인이 결합하는 복잡한 어셈블리 형태 변화에 대한 최적화 메커니즘은 아직 완전하지 않습니다.
2. **천연 무질서 단백질(IDP) 적용 한계**: 고정된 템플릿 모델이 존재하지 않는 무질서 영역(Intrinsically Disordered Regions)의 경우, FAPE 손실 계산의 기준이 되는 '초기 예측 상태(Pseudo-ground truth)' 자체가 무의미하기 때문에 Distance-AF의 구조 보존 메커니즘이 오히려 동적 무작위 구조 탐색을 방해할 수 있습니다.
3. **도메인 경계 입력에 대한 높은 의존성**: 도메인 단위 FAPE 마스킹의 성공 여부는 사용자가 입력하는 도메인 경계 정의의 정확도에 완전히 종속됩니다. 만약 도메인 경계가 부적절하게 지정되면 도메인 내부가 찌그러지거나 반대로 도메인 간의 유연한 움직임이 잠겨버리는 오류가 발생합니다.
4. **로컬 미니마(Local Minima) 탈출 한계**: 그레이디언트 기반의 Adam 옵티마이저를 사용하기 때문에 두 도메인 간의 충돌 에너지 장벽이 지나치게 높거나 구조 전이를 위해 큰 위상 변화가 요구되는 경우에는 최적화 과정이 국소 최적해(Local Minima)에 갇히는 현상이 발생할 수 있습니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
