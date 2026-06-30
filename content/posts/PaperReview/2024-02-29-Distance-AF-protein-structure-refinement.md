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
last_modified_at: 2025-10-03T00:00:00-17:00:00
classes: wide
---

* **Paper Title**: [Distance-AF: Modifying Predicted Protein Structure Models by AlphaFold2 with User-Specified Distance Constraints](https://doi.org/10.1038/s42003-025-08783-5)
* **Authors**: Yuanyuan Zhang, Zicong Zhang, Yuki Kagaya, Genki Terashi, Bowen Zhao, Yi Xiong, and Daisuke Kihara
* **Journal/Conference**: Communications Biology (2025)
* **DOI**: [10.1038/s42003-025-08783-5](https://doi.org/10.1038/s42003-025-08783-5)

---

> [!NOTE]
> **본 포스팅은 2023년 bioRxiv 및 PMC에 등재되었던 프리프린트(Preprint) 논문([PMC10723377](https://pmc.ncbi.nlm.nih.gov/articles/PMC10723377/))을 바탕으로 처음 리뷰되었으며, 이후 2025년 9월 *Communications Biology*에 공식 게재([s42003-025-08783-5](https://www.nature.com/articles/s42003-025-08783-5))됨에 따라 최종 출판본의 보완 사항과 공식 피규어 자료를 대조하여 전면 개정 및 재구성한 글입니다.**

---

## 1. 서론 (Introduction)

AlphaFold2의 등장은 단일 도메인 단백질(Single-domain Protein)의 3차원 구조 예측 성능을 서브 옹스트롬(Sub-angstrom) 단위의 정확도로 끌어올렸습니다. 그러나 다중 도메인(Multi-domain) 단백질이나 고도로 유연한 동적 단백질에 대해서는 여전히 다음 두 가지 한계를 지닙니다:
1. **도메인 방향성 오차(Domain Orientation Errors):** 개별 도메인의 로컬 구조는 완벽하게 예측하지만, 도메인을 연결하는 유연한 링커(Linker) 영역의 방향을 잘못 잡아 전체 글로벌 기하 구조가 찌그러지거나 잘못 배치되는 현상이 빈번합니다.
2. **다중 상태의 배제 (Static Prediction vs Conformational Dynamics):** 단백질은 리간드와의 결합 상태(Active vs Inactive)나 환경적 변화에 따라 형태(Conformation)가 변하는 동적 앙상블 성질을 지니나, AlphaFold2는 단 하나의 고정된 형태만을 예측값으로 제공합니다.

이를 해결하기 위해 FRET, NMR, Cryo-EM 밀도 맵, 화학적 크로스링크 등 다양한 생물리 실험 기법으로 측정된 희소한 거리 제약 조건(Distance Constraints)을 활용합니다. **Distance-AF는** 이미 학습된 AlphaFold2의 강력한 로컬 도메인 구조를 템플릿(Pseudo-ground truth)으로 유지하면서, 사용자가 입력한 물리적 거리 범위 제약을 만족하도록 단백질 구조의 기하학적 파라미터를 경사하강법으로 미세 조정하는 혁신적인 리파인먼트(Refinement) 프레임워크입니다.

![Distance-AF Overall Framework](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/fig01.jpg)
*Figure 1: Distance-AF의 전체 프레임워크 개요. (a) Phase 1에서 아미노산 서열을 입력받아 싱글/페어 표현자를 생성하고, Phase 2에서 사용자가 제공한 거리 제약 조건과 4가지 손실 함수(Distance, FAPE, Angle, Violation)를 기반으로 이 표현자들을 오차 역전파 및 Adam 옵티마이저를 통해 수렴할 때까지 반복 최적화하여 최종 구조를 유도하는 전체 파이프라인. (b) 첫 1,000회 반복 최적화 단계 동안 4가지 손실 함수의 수렴 곡선. (c) 반복 횟수(0, 100, 255, 400, 600, 1000)에 따라 도메인 방향성이 점진적으로 보정되는 가시적 과정과 참값(Native)과의 비교.*

---

## 2. 모델 아키텍처 및 손실 함수 (Model Architecture & Loss Functions)

Distance-AF는 새로운 신경망 가중치를 처음부터 다시 학습시키는 것이 아니라, **이미 학습된 AlphaFold2의 가중치(Weights)를 완벽히 동결(Freeze)한 상태에서** 입력 매개변수를 최적화하는 고유한 최적화 패러다임을 제안합니다.

### 2.1. 역전파를 통한 표현자 최적화 (Representation Optimization)
AlphaFold2의 Evoformer 및 Structure Module 가중치를 직접 수정하면 단백질 고유의 물리화학적 3차원 기하학적 규칙(Structural Prior)이 파괴(Catastrophic Forgetting)됩니다. 

따라서 Distance-AF는 가중치는 그대로 동결하고, Evoformer의 출력이자 Structure Module의 입력 텐서인 **싱글 표현자(Single Representation, $s_i \in \mathbb{R}^{N_{res} \times 384}$)**와 **페어 표현자(Pair Representation, $z_{ij} \in \mathbb{R}^{N_{res} \times N_{res} \times 128}$)**를 직접 최적화 매개변수(Optimization Variables)로 삼아 업데이트합니다.
1. **초기값**: AlphaFold2의 순방향 추론(Inference)을 통해 도출된 초기 $s_i$와 $z_{ij}$를 최적화의 출발점으로 설정합니다.
2. **순방향 전파**: 최적화 매개변수인 $s_i, z_{ij}$가 Structure Module을 거쳐 3차원 원자 좌표 $X = \{x_1, \dots, x_N\}$로 변환됩니다.
3. **손실 계산 및 역전파**: 변환된 3D 좌표와 사용자의 물리 제약 오차를 기반으로 총 손실(Total Loss)을 산출하고, 이에 따른 그래디언트(Gradient)를 $s_i$와 $z_{ij}$로 역전파합니다.
4. **옵티마이저**: Adam 옵티마이저(학습률 $0.001$, $\beta_1 = 0.9, \beta_2 = 0.99$)를 활용해 반복 최적화를 최대 30,000 에포크 동안 수행합니다.

### 2.2. 다중 손실 함수 (Multi-Component Loss Function) 구성
기하 구조의 안정성을 유지하면서 사용자의 제약 조건을 조화롭게 반영하기 위해 총 손실 함수를 다음과 같이 네 가지 손실 항목의 가중합으로 정의합니다:

$$
\mathcal{L}_{total} = w_{dist} \mathcal{L}_{dist} + w_{fape} \mathcal{L}_{fape} + w_{ang} \mathcal{L}_{ang} + w_{viol} \mathcal{L}_{viol}
$$

#### 1) 거리 손실 (Distance Loss, $\mathcal{L}_{dist}$)
사용자가 지정한 두 아미노산 잔기 $i$와 $j$ 사이의 $C\alpha$ 원자 허용 범위 $[d_{\min}, d_{\max}]$와 모델이 예측한 현재 유클리드 거리 $d_{ij}$ 간의 오차를 계산합니다. 이 손실은 오차가 없을 때 0이 되는 평평한 바닥(Flat-bottom) 형태의 퍼텐셜 함수를 따릅니다.

![Distance Loss Equation](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/equation01.jpg)
*Equation 1: 사용자가 제공한 $N$개의 거리 제약 조건을 반영한 Distance Loss 수식.*

이 수식은 NMR 앙상블이나 FRET 실험값과 같이 일정한 허용 범위를 갖는 실험적 불확실성 및 노이즈가 혼재된 희소 데이터를 강건하게 수용할 수 있도록 설계되었습니다.

#### 2) 로컬 구조 보존을 위한 FAPE Loss ($\mathcal{L}_{fape}$)
거리 제약조건만으로 구조를 당기면 도메인의 이동 과정에서 알파 헬릭스, 베타 시트 등 개별 도메인의 정밀한 로컬 3차원 구조가 심각하게 찌그러집니다. 이를 방지하기 위해 AlphaFold2의 핵심 손실 함수인 FAPE(Frame Aligned Point Error)를 적용합니다. 초기 AlphaFold2 예측 모델을 참값(Pseudo-ground truth)으로 삼아, 각 도메인 내부의 백본 골격과 패킹 상태를 견고하게 보존합니다.

#### 3) 각도 손실 (Angle Loss, $\mathcal{L}_{ang}$)
단백질 백본 비틀림 각도($\Phi, \Psi, \Omega$)와 사이드체인 각도($\chi$)가 비물리적인 라마찬드란(Ramachandran) 금지 영역으로 이탈하여 화학적으로 불안정한 상태가 되는 것을 효과적으로 규제합니다.

#### 4) 위반 손실 (Violation Loss, $\mathcal{L}_{viol}$)
인접하지 않은 아미노산 원자 쌍이 공간상에서 비정상적으로 겹치는 원자 충돌(Steric Clash) 및 공유결합 길이/결합각 위반 등을 모니터링하여 패널티를 부과합니다.

### 2.3. 동적 손실 가중치 (Dynamic Weighting) 조절
최적화 초기에는 모델이 제약 조건을 충족하기 위해 도메인을 크게 회전하고 이동해야 하므로, 거리 손실의 가중치 $w_{dist}$를 크게 설정하고 로컬 구조 보존을 담당하는 $w_{fape}$를 작게 둡니다.

이후 거리 손실 $\mathcal{L}_{dist}$가 임계값 이하로 감소하면, 흐트러진 각 도메인의 백본 골격과 패킹을 정교하게 고정하고 복원(Relaxation & Refinement)하기 위해 $w_{dist}$를 줄이고 $w_{fape}$의 비중을 높여야 하므로 동적 가중치 조율을 수행합니다.

![Dynamic Loss Weighting System](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/equation02.jpg)
*Equation 2: Distance Loss 수렴 범위에 따라 각 손실 가중치를 유기적으로 조율하는 동적 가중치 조율 수식.*

---

## 3. 방법론: 도메인 단위 FAPE 마스킹 (Intra-Domain FAPE Masking)

Distance-AF 연구가 거둔 핵심적인 기술적 돌파구는 **도메인 단위 FAPE 마스킹(Intra-domain FAPE Masking)의** 도입입니다.

### 3.1. 전역 FAPE 계산의 한계와 구조 붕괴 원인
일반적인 AlphaFold2 훈련에서는 모든 잔기 쌍 $(i, j)$ 간의 오차를 계산하는 전역 FAPE(Global FAPE)를 사용합니다. 

그러나 다중 도메인 단백질의 경우, 링커(Linker)의 회전에 의해 도메인 A와 도메인 B가 상대적으로 이동해야 할 때 전역 FAPE는 이를 '구조가 찌그러지는 오차'로 판정합니다. 이로 인해 거리 손실($\mathcal{L}_{dist}$)과 전역 FAPE 손실이 강하게 충돌하며 도메인 사이의 상대 운동은 막히고, 대신 개별 도메인 내부가 비정상적으로 찌그러지는 부작용이 발생합니다.

### 3.2. FAPE 마스킹 작동 방식
이를 해결하기 위해 Distance-AF는 사용자가 정의한 도메인 경계 정보(Domain Boundaries)를 기반으로 FAPE 손실 계산 시 **서로 다른 도메인에 속한 잔기 쌍의 기여도를 완전히 소거(Zero-out)하는** 마스킹 행렬을 도입했습니다:

$$
\mathcal{L}_{fape}^{masked} = \frac{1}{N_{\text{intra}}} \sum_{d \in D} \sum_{i, j \in \text{domain}(d)} \min(\text{FAPE}(i, j), Z)
$$

이 마스킹 설계를 적용하면 다음과 같은 자유도가 확보됩니다:
1. **도메인 내부 보존**: 동일 도메인 내부의 잔기 쌍에 대해서는 FAPE 손실이 엄격히 작용하여 도메인 내부의 정밀한 2차/3차 구조는 완벽히 보존됩니다.
2. **도메인 간 자유도 확보**: 도메인 경계를 교차하는 잔기 쌍은 계산에서 배제되므로, 최적화 엔진이 도메인 사이의 유연한 링커를 굽히거나 비틀어 도메인들의 상대적 배치와 방향을 제한 없이 조정할 수 있게 됩니다.

---

## 4. 결과 및 분석 (Results & Analysis)

연구진은 Cryo-EM 전자 밀도 지도 피팅, NMR 앙상블 분석, GPCR 수용체의 활성/비활성 구조 전이를 포함하는 25개의 고난도 타깃을 기반으로 Distance-AF의 유효성을 검증했습니다.

### 4.1. 정량적 모델링 성능 비교
Distance-AF는 기존 대표적인 구조 복원 기법들과 비교하여 괄목할 만한 성능 향상을 이뤄냈습니다.

![Modeling Performance of Distance-AF](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/fig02.jpg)
*Figure 2: 25개 벤치마크 표적에 대한 Distance-AF의 성능 정량 비교. (a) RMSD, TM-score, GDT_TS, GDT_HA 측면에서 Distance-AF(D-AF)와 타 방법론(AF2, Rosetta, AlphaLink)의 성능 분포. D-AF는 대부분의 타깃에서 높은 구조 정확도를 달성함. (b) 거리 제약 조건에 노이즈(Perturbation, 평균 ±5.0 Å)를 고의 주입하여 10회씩 테스트한 결과로, 노이즈가 존재하더라도 수렴 결과가 매우 안정적인 견고함을 증명함. (c) 입력 제약조건의 수(0, 1, 2, 3, 4, 6, 10, 14, 18, 22, 26, 30)에 따른 구조 정확도 추이. 단 6개의 제약조건(기본값, X표시)만으로도 최종 성능에 근접하는 뛰어난 데이터 효율성을 보임.*

---

### 4.2. 대표적인 다중 도메인 모델 예측 사례
기존 AlphaFold2가 방향성을 잘못 예측한 다중 도메인 단백질들을 Distance-AF를 통해 대폭 정밀화한 6가지 실증 사례입니다.

![Six examples of models built by AF2 and D-AF](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/fig03.jpg)
*Figure 3: (a) Nop5p 서브유닛(PDB 1NT2:B) - AF2 RMSD 11.83 Å에서 D-AF를 통해 2.28 Å으로 보정. (b) CbnR 서브유닛(PDB 1IXC:A) - AF2 16.33 Å에서 D-AF 1.96 Å으로 개선. (c) LarsR 단백질(PDB 6V7W:B) - AF2 18.69 Å에서 D-AF 2.18 Å으로 개선. (d) MgsA 프로토머(PDB 3PVS:A) - AF2 17.63 Å에서 D-AF 3.07 Å으로 개선. (e) Raf1 서브유닛(PDB 6KKN:A) - AF2 17.90 Å에서 D-AF 5.42 Å으로 개선. (f) Human antigen R 단백질(PDB 4EGL:A) - AF2 13.73 Å에서 D-AF 7.83 Å으로 대폭 보정.*

---

### 4.3. 무질서 영역(IDR)과 연결된 말단 영역 교정
신축성이 강하고 정형화되지 않은 무질서 영역(Disordered region)으로 연결되어 있어 AlphaFold2가 구조를 완전히 허공에 띄웠던 말단 도메인들의 구조 보정 결과입니다.

![Four examples of correcting terminal regions](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/fig04.jpg)
*Figure 4: (a) Nro1 규제 단백질(PDB 3MSV:A) - AF2 12.9 Å에서 D-AF 2.3 Å으로 단축. (b) focal adhesion kinase의 FERM 도메인(PDB 3ZDT:A) - AF2 5.0 Å에서 D-AF 1.7 Å으로 보정. (c) Ribosomal RNA-processing protein 5(PDB 5NLG:A) - AF2 9.6 Å에서 D-AF 1.6 Å으로 보정. (d) Serine protease 도메인(PDB 6FF0:A) - AF2 10.6 Å에서 D-AF 3.4 Å으로 말단 영역의 위상을 완벽히 규명.*

---

### 4.4. Cryo-EM 전자 밀도 지도 피팅 실증
전자 밀도 지도(Density Map)와 초기 AlphaFold2 예측 모델 간의 어긋난 도메인 방향을 거리 제약으로 환산하여 최적화한 실전 결과입니다.

![Cryo-EM Map Fitting Results](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/fig05.jpg)
*Figure 5: Cryo-EM 맵 정보(회색 외곽선)와 3~6개의 희소한 제약조건을 주입해 최적화한 결과. (a) Pyruvate carboxylase(PDB 7WTA:A, 3.9Å 해상도 맵 EMD-32773) - AF2 8.32 Å에서 D-AF(6) 2.64 Å으로 밀도 맵 내부에 정확히 안착. (b) 80S ribosome protein(PDB 7OLD:C, 3.0Å 해상도 맵 EMD-12977) - AF2 11.12 Å에서 D-AF(6) 3.30 Å으로 보정. (c) RecB 단백질(PDB 8B1R:B, 3.2Å 해상도 맵 EMD-15803) - AF2 10.40 Å에서 D-AF(6) 3.46 Å으로 피팅. (d) Rotavirus VP6 단백질(PDB EMD-1461) - AF2 8.02 Å에서 D-AF(6) 3.25 Å으로 성공적으로 맵 내부 피팅 완수.*

---

### 4.5. GPCR 구조 전이 및 활성 상태 예측
활성(Active) 및 비활성(Inactive) 3차원 형태가 크게 요동치는 GPCR(G-단백질 결합 수용체)에 대해, 타깃 상태의 핵심 거리 제약들을 적용해 구조 전이를 모사한 예시입니다.

![GPCR Conformation Switch Results](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/fig06.jpg)
*Figure 6: GPCR 수용체의 로컬 형태 전이 분석. (a) Rhodopsin(Active: 6OYA:R, Inactive: 3C9L:A) 활성형 구조에서 비활성형 구조로의 전이 보정(D-AF 3.03 Å). (b) Beta-adrenergic receptor(Active: 7BTS:A, Inactive: 7BVQ:A) 비활성형 구조에서 활성형 구조로의 전이(D-AF 2.07 Å). (c-d) AlphaFold2 모델(청색) 상태에서 타깃 상태(녹색)로 5번/6번 헬릭스를 성공적으로 당겨 실제 결합 상태에 따른 단백질 앙상블 전이를 완벽히 묘사함(자색).*

---

### 4.6. NMR 앙상블 및 동적 구조 시뮬레이션
NMR 데이터 유래 다중 상태 제약 조건들을 적용하여 동적 단백질 앙상블 분포를 통계적으로 도출한 결과입니다.

![NMR Ensemble simulation result charts](/assets/images/2024-02-29-Distance-AF-protein-structure-refinement/fig07.jpg)
*Figure 7: NMR 단백질 앙상블 분석. (a) Troponin C(PDB 1TNW) 및 HIV-1 capsid 단백질(PDB 2M8P)의 NMR 앙상블(초록색)과 Distance-AF가 생성한 앙상블 구조군(자색)의 오차 정렬 비교. (b) 두 단백질 도메인에 대한 GDT_TS 확률 밀도 분포. (c-d) 1TNW 및 2M8P 잔기 번호에 따른 주쇄 비틀림 각도(Phi, Psi)의 표준편차 추이. 링커 영역(붉은 점선 사이)에서 동적인 각도 요동 분산이 NMR 실험값 수준으로 완벽하게 모사되었음을 증명함.*

---

## 5. 결론 및 한계점 (Conclusions & Limitations)

### 5.1. 결론 (Conclusions)
Distance-AF는 AlphaFold2가 보장하는 로컬 도메인의 독보적 정확성을 Pseudo-ground truth 삼아 FAPE 마스킹 메커니즘을 통해 도메인 내부를 보존하면서, 사용자가 입력하는 거시적 물리 제약 정보를 그레이디언트 역전파 방식으로 빠르게 최적화하는 최첨단 구조 정밀화 도구입니다.

전통적인 샘플링 기반의 분자 동력학(MD) 시뮬레이션이나 Rosetta 물리 도킹 기법이 거대한 에너지 장벽으로 인해 수주일의 시간과 엄청난 컴퓨팅 파워를 요구했던 것과 달리, Distance-AF는 AlphaFold2의 구조 해석 모듈의 그래디언트 공간을 직접 최적화하여 **단 몇 시간 만에 고해상도 해를 안정적으로 구합니다.**

### 5.2. 한계점 (Limitations)
그럼에도 불구하고 향후 보완되어야 할 몇 가지 뚜렷한 한계점을 안고 있습니다:
1. **단일 사슬(Single-chain) 중심의 도메인 교정**: 멀티머 복합체의 비공유 결합 계면(Interface)을 재배치하거나 여러 단백질 체인이 얽히는 고차 어셈블리의 도킹 보정 기능은 아직 완전하게 지원되지 않습니다.
2. **천연 무질서 영역(IDR)의 적용 한계**: 고정된 템플릿 구조가 없는 무질서 단백질 영역은 FAPE 손실의 기준이 되는 초기 예측 상태 자체가 불안정하므로 Distance-AF의 로컬 구조 보존 기작이 무작위 탐색을 가로막는 장애물로 작용할 수 있습니다.
3. **도메인 경계 입력에 대한 종속성**: 도메인 단위 FAPE 마스킹의 성공 여부는 사용자가 설정하는 도메인 경계 정의의 정확도에 100% 의존합니다. 경계가 잘못 지정되면 도메인 내부가 붕괴되거나 유연한 상대 운동 자체가 차단됩니다.
4. **로컬 미니마(Local Minima) 탈출 한계**: 그레이디언트 기반 옵티마이저를 사용하기 때문에 도메인 간의 물리적 충돌 배제 장벽이 지나치게 크거나 위상 전이 장벽이 높은 극단적인 예시에서는 국소 최적해(Local Minima)에 수렴이 갇히는 현상이 발생할 수 있습니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
