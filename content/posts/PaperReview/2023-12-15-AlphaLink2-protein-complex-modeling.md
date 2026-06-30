---
layout: single
title:  "[Paper Review] AlphaLink2: Modeling protein complexes with crosslinking mass spectrometry and deep learning"
excerpt: "AlphaFold-Multimer의 한계를 극복하기 위해 화학적 교차결합 질량분석(XL-MS) 데이터를 단백질 복합체 구조 예측 네트워크에 직접 결합하여 정확도를 향상시킨 AlphaLink2 알고리즘 리뷰"
toc: true
toc_sticky: true

categories:
  - PaperReview
tags: [PaperReview, Bioinformatics, AlphaFold, AlphaLink2, XL-MS]
use_math: true

date: 2023-12-15
last_modified_at: 2023-12-15T15:30:00-17:00:00
classes: wide
---

* **Paper Title**: [Modelling protein complexes with crosslinking mass spectrometry and deep learning](https://doi.org/10.1038/s41467-024-51771-2)
* **Authors**: Kolja Stahl, Robert Warneke, Lorenz Demann, Rica Bremenkamp, Björn Hormes, Oliver Brock, Jörg Stülke, and Juri Rappsilber
* **Journal/Conference**: Nature Communications (2024)
* **DOI**: [10.1038/s41467-024-51771-2](https://doi.org/10.1038/s41467-024-51771-2)

---

## 1. 서론 (Introduction)

단백질 복합체(Protein Complex)의 3차원 구조를 규명하는 것은 세포 내 신호 전달, 대사 경로, 약물 표적 규명 등 생명 현상의 분자 수준 메커니즘을 규명하는 데 필수적입니다. AlphaFold2의 대성공 이후 **AlphaFold-Multimer가** 출시되면서 다중 사슬 단백질 복합체의 구조 예측 역시 급격히 발전하였습니다.

그러나 AlphaFold-Multimer는 치명적인 약점을 공유합니다. 이 모델은 두 사슬 간의 인터페이스(Interface)를 올바르게 배치하기 위해 진화적 공진화 정보(Co-evolutionary Signal)에 크게 의존합니다. 따라서 다음과 같은 난제 표적들에서는 정확도가 매우 저하됩니다:
- **항원-항체(Antibody-Antigen) 및 나노바디 결합체**: 이들은 진화적 공진화 신호가 거의 없거나 인위적으로 설계된 결합체이기 때문에 공진화 검색으로 인터페이스를 맞추기 어렵습니다.
- **새로운 복합체 사슬**: 데이터베이스 상에 상동 서열(MSA)이 희소하여 정렬 정보가 부족한 고아 복합체 사슬.

이러한 문제를 해결하기 위해 실험 구조 생물학계에서는 **교차결합 질량분석(Crosslinking Mass Spectrometry, XL-MS)** 기법을 널리 사용해 왔습니다. 

XL-MS는 수용액 상의 단백질 복합체에 특정 화학 작용기를 가진 크로스linker를 주입하여 물리적으로 가깝게 배치된(예: SDA의 경우 두 아미노산 $C_\beta-C_\beta$ 거리가 약 25Å 이내) 잔기들을 공유결합으로 묶어준 뒤, 질량분석기로 단백질을 조각내어 분석함으로써 "어느 아미노산과 어느 아미노산이 인접해 있는지"에 대한 희소한 거리 정보(Distance Restraints)를 제공합니다.

기존의 방식들은 딥러닝 모델이 무작위로 구조 후보군(Decoys)을 쏟아내면 사후에 이 크로스링크 실험 데이터를 만족하는 후보만 필터링하는 방식(Post-filtering)을 사용했습니다. 이 방식은 모델이 애초에 올바른 인터페이스 영역을 하나도 샘플링하지 못하면 무용지물이라는 치명적 단점이 있습니다. **AlphaLink2는** 실험적인 크로스링크 제약 정보 데이터를 단백질 구조 예측 신경망 내부로 **직접 통합(Direct Integration)하여** 모델 접힘 과정 자체를 올바른 방향으로 유도합니다.

---

## 2. 모델 아키텍처 (Model Architecture)

AlphaLink2는 단일 사슬용 단백질 모델이었던 기존의 AlphaLink를 단백질 복합체(Multimer) 예측이 가능하도록 확장시켰으며, 오픈소스 단백질 예측 프레임워크인 **Uni-Fold** 아키텍처를 뼈대로 삼고 있습니다.

### 2.1. Uni-Fold 프레임워크 기반 설계
기존 AlphaLink와 달리 복합체(Multimer) 예측을 지원해야 하므로, 멀티머 구조 학습과 인코딩이 구현된 **Uni-Fold v2.1.0을** 채택했습니다. Uni-Fold는 AlphaFold-Multimer와 동일한 아키텍처를 구현하고 있으면서도 가중치를 처음부터 독립적으로 학습시킬 수 있는 유연성을 제공합니다.

### 2.2. Pair Representation에 직접 주입 (Direct Integration)
AlphaFold 및 Uni-Fold 신경망은 단백질 아미노산 서열 간의 2차원 기하학적 관계를 표현하는 **Pair Representation** $z_{ij}$ (차원 크기 128)를 내부적으로 지속 갱신(Message Passing)하며 최종 3차원 좌표를 유도합니다.

AlphaLink2는 사용자가 입력한 크로스링크 데이터 세트 $\{ (i, j, \text{FDR}_{ij}) \}$를 입력받아 다음과 같이 Pair Representation에 통합합니다:
- 잔기 $i$와 잔기 $j$ 사이에 크로스링크 제약조건이 존재하는 경우, 이를 Soft Label contact map으로 생성한 뒤 선형 프로젝션 레이어(Linear Projection Layer)를 통해 128차원의 특징 맵으로 사영합니다.
- 이 특징 맵을 Uni-Fold의 초기 Pair Representation 텐서에 덧셈 연산(Addition)으로 직접 결합합니다.
- 신경망 블록인 Evoformer를 거치며, 이 강제된 기하학적 사전 정보(Prior)는 아미노산 잔기 쌍의 실제 거리 예측에 강력한 제약 가중치로 작용하여 최종 구조 해석 모듈(Structure Module)에서 두 단백질 사슬이 정확하게 접촉하도록 강제합니다.

---

## 3. 방법론 및 학습 (Methodology & Training)

실제 자연계에는 고품질의 3D 단백질 복합체 구조와 물리적 크로스링크 질량분석 데이터가 동시에 매핑되어 대규모로 축적된 공개 데이터베이스가 매우 부족합니다. 따라서 연구진은 **가상 크로스링크 시뮬레이션(Simulated Crosslinks)을** 적용하여 모델을 학습시켰습니다.

### 3.1. 가상 크로스링크 시뮬레이션 및 노이즈 주입
1. PDB 데이터베이스에 등재된 기지 구조 단백질 복합체 구조들로부터, 실제 실험에서 널리 쓰이는 양기능성 교차결합 화학물질인 **SDA (Succinimidyl 4,4-azipentanoate)의** 물리적 반응 반경을 반영하여 $C_\beta-C_\beta$ 거리가 25Å 이내인 모든 아미노산 잔기 쌍을 탐색합니다.
2. 이 물리적 쌍 중 일부를 무작위로 샘플링하여 가상의 크로스링크 데이터 세트로 만듭니다.
3. **노이즈 모델링 (Noise Injection):** 실제 실험 노이즈를 완벽히 흉내 내기 위해, 물리적 거리가 멀어 결합이 불가능함에도 결합이 발생한 것으로 보고되는 오답 데이터인 **위양성(False Positive)** 데이터를 학습 피처에 섞어 주었습니다. 20%의 False Discovery Rate (FDR) 수준에 달하는 위양성 크로스링크(즉, 실제 거리가 25Å 이상으로 매우 먼 잔기 중 Lys, Ser, Thr, Tyr 쌍)를 인위적으로 혼합했습니다.

---

### 3.2. AlphaFold-Multimer 파인튜닝 상세 (Fine-tuning of AlphaFold-Multimer)

처음부터 모델을 다시 학습시키는 계산적 비효율성을 피하고자, AlphaLink2 연구진은 DeepMind가 공개한 사전 학습 가중치를 시작점으로 삼아 네트워크를 파인튜닝(Refinement)했습니다.

* **사전 학습 가중치 분기**:
  - **v2 모델**: **AlphaFold-Multimer v2.2.4** 가중치(2018년 4월 30일 이전 PDB 데이터셋 학습)를 시작점으로 설정했습니다.
  - **v3 모델**: **AlphaFold-Multimer v2.3.0** 가중치(2021년 9월 30일 이전 PDB 데이터셋 학습)를 기반으로 미세조정을 진행했습니다.
* **학습 데이터셋**: PDB에서 파생된 **DIPS-Plus** 데이터셋에서 선별된 **11,424개의 단백질 복합체**(총 34,054개 사슬)와 가상 SDA 교차결합 데이터를 주입하여 학습을 진행했습니다.
* **학습 설정 및 데이터 보강**: Uni-Fold v2.1.0을 활용하여 `model_1` 설정에서 학습을 진행했습니다. 헤테로머(Heteromer) 상호작용 예측 능력을 향상시키기 위해, 학습 단계에서는 호모머(Homomer) 교차결합 역시 헤테로머 교차결합처럼 동일한 조건으로 샘플링하여 훈련 데이터의 다양성을 높였습니다.
* **크롭 사이즈 확장 및 하드웨어**: 복합체의 계면 노출도를 최대한 높이고 단백질 인터페이스 근처의 교차결합 정보 학습 효율을 극대화하기 위해 입력 크롭 크기를 **640AA**로 대폭 확장했습니다. 학습에는 **4대의 NVIDIA A100 GPU** 장비를 활용하여 **10일 동안** 파인튜닝을 진행하였으며, 2022년 이후 릴리즈된 CAMEO 데이터셋으로 구성된 검증 세트에서 조기 종료(Early Stopping)를 적용했습니다.

---

### 3.3. 평가 설정 (Evaluation Set Up)

AlphaLink2의 예측력을 엄밀히 평가하고 오리지널 AlphaFold-Multimer와 공정하게 비교하기 위해 다음과 같은 프로토콜을 정립했습니다.

* **대조군(Baseline)**: CASP15 벤치마크 평가 시, 오리지널 AlphaFold-Multimer v2에 해당하는 공식 예측 결과인 **NBIS-AF2-multimer** 모델을 기본 대조군으로 채택했습니다. 비교의 왜곡을 방지하기 위해 Arne Elofsson 연구진이 제공한 동일한 MSA 입력 데이터를 공유하여 사용했습니다.
* **매개변수 및 리사이클링 제어**: 추론 성능을 최적화하기 위해 모델의 내부 리사이클링(Recycling) 반복 횟수를 **20회**로 상향 조정했습니다.
* **시드 다중화 및 이완 (Relaxation)**: 각 타깃에 대해 10% 서열 커버리지와 20% FDR이 혼합된 무작위 교차결합 서브셋 10개를 독립적으로 샘플링하고, 각 서브셋당 서로 다른 난수 시드(Seed)를 활용하여 총 **200개의 시드 예측**을 수행했습니다. 이 중 모델 신뢰도(Model Confidence)가 가장 높은 최적의 샘플 1개만을 선별하여 **Amber Relax(이완)** 과정을 적용했습니다. 최대 MSA 클러스터 크기는 512 서열로 캡핑했습니다.
* **항원-항체 데이터셋 (SAbDab)**: 공진화 신호가 극도로 희소한 난제 복합체 평가를 위해, 2022년 1월 1일~2023년 11월 10일 사이에 기탁된 해상도 3Å 이하의 단일 어셈블리 항원-항체 복합체 **33개**를 Structural Antibody Database(SAbDab)에서 선별해 독립된 평가 데이터셋으로 구축했습니다.
* **평가 지표**: 예측 구조와 네이티브 구조의 복합체 계면 유사도를 정량화하는 **DockQ 스코어를** 주 지표로 활용했습니다.
  - DockQ 스코어는 native 접촉 비율(**$F_{\text{nat}}$**, 5Å 이내 계면 중원자 접촉), 인터페이스 RMSD(**$i\text{RMS}$**, 10Å 이내 계면 backbone 원자), 리간드 RMSD(**$L\text{RMS}$**)를 반영합니다.
  - 3개 사슬 이상의 다중 복합체에 대해서는 존재하는 모든 복합체 인터페이스의 평균 DockQ 스코어를 산출합니다.

---

## 4. 결과 및 분석 (Results & Analysis)

AlphaLink2는 CASP15 벤치마크 난제 복합체들과 공진화가 희소한 항원-항체 데이터를 활용하여 정밀 평가되었습니다.

### 4.1. CASP15 난제 복합체 구조 예측 극대화

단백질 복합체의 예측 품질은 **DockQ** 스코어로 판별합니다. DockQ 스코어가 0.23 이상이면 Acceptable(허용 수준), 0.49 이상이면 Medium(중간 정확도), 0.80 이상이면 High(고정밀 구조)를 의미합니다.

![AlphaLink2 CASP15 and SAbDab Performance](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/fig1.jpg)
*Figure 1: (a) 8개의 CASP15 난제 heteromer 표적에 대해 SDA 크로스링크를 주입했을 때의 DockQ 분포 비교. AlphaFold-Multimer 대조군(평균 0.14) 대비 AlphaLink2는 평균 0.62의 Medium/High급 정확도로 수직 상승함. (b) SAbDab 32개 항원-항체 표적에서의 DockQ 비교. (c-e) 대표적인 나노바디 표적인 H1142에 대한 PAE 맵 및 예측 구조와 크리스탈 구조(녹색) 정렬 결과.*

공진화 정보가 부족하여 기본 AlphaFold-Multimer가 완전히 잘못된 구조(DockQ 스코어 0.05 이하)로 분류했던 다수 타깃들에 대해, 가상/실제 크로스링크 정보를 주입한 결과 DockQ 스코어가 Acceptable 이상인 영역으로 대거 견인되는 성과를 보였습니다.

---

### 4.2. Bacillus subtilis 실측 데이터를 이용한 검증

시뮬레이션 데이터를 넘어, 실제 *Bacillus subtilis* 유래 135개 단백질 복합체 상호작용 표적에 대해 실측된 교차결합 MS 데이터를 투입하여 정밀 검증을 수행했습니다.

![Bacillus subtilis Real Data Predictions](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/fig2.jpg)
*Figure 2: (a) B. subtilis 데이터셋에 대한 모델 신뢰도 비교. 단 1개(빨간색), 2개(파란색)의 교차결합 제약만으로도 모델 신뢰도가 대폭 상승함. (b-c) 대표적인 성공 사례인 CodY-YppF 및 RpoA-RpoC 복합체 예측 결과. 오리지널 모델이 위양성 인터페이스를 짚은 것에 반해, AlphaLink2는 소수의 교차결합 제약(Satisfied, 청색 선)을 만족하여 크리스탈 구조를 완벽히 재현함.*

---

### 4.3. B. subtilis 내 철 항상성 조절 메커니즘 규명 (생물학적 검증)

연구진은 AlphaLink2로 모델링한 Fpa-Fur 단백질 복합체 구조를 바탕으로 생물학적 메커니즘을 상세히 입증했습니다.

![Fpa-Fur Interaction and Iron Homeostasis](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/fig3.jpg)
*Figure 3: Fpa-Fur 상호작용의 실험적 검증 및 철 항상성 조절 모형. (a) Fur와 Fpa 간의 Bacterial two-hybrid(B2H) 분석. (b-c) dhbA 프로모터 단편에 대한 Fur 결합 및 철 농도 유무에 따른 발현 스크리닝(Miller Unit). (d) AlphaLink2가 예측한 Fur 이량체 및 Fpa-Fur 복합체 3D 구조. (e) Apo-Fpa가 철 결핍 조건에서 Fur를 격리하여 DNA 결합을 해제시킴으로써 유전자 발현을 켜는 조절 메커니즘 모델.*

---

### 4.4. CRL4 복합체 및 바이러스 단백질(Vpr) 타깃 구조 예측

대형 단백질 복합체 조립 상황에서 v2.3 가중치 모델을 활용한 구조 복원력 테스트 결과도 우수한 성과를 거두었습니다.

![CRL4 Assembly and DCAF1-Vpr Predictions](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/fig4.jpg)
*Figure 4: (a-d) Cullin4 복합체의 3가지 구조 전이 상태(State 1~3)를 EM density 조건 하에 AlphaLink2가 효과적으로 배치하는 원리. (e-f) DCAF1-Vpr 인터페이스 예측 결과 비교. 기존 모델은 DockQ 0.04로 예측에 실패했으나, AlphaLink2는 DockQ 0.56의 중-고해상도 구조 복원에 성공함.*

---

## 5. 한계점 및 디스커션 (Limitations & Discussions)

AlphaLink2는 실험 기하 제약 조건을 단백질 접힘 아키텍처에 직접 녹여낸 획기적인 모델이지만, 구조 생물학적 한계와 컴퓨터 리소스에 대한 태생적 과제를 안고 있습니다.

* **교차결합 정보의 명시적 정량 효과**:
  단순히 추가 파인튜닝만으로 스코어가 상승한 것이 아니라, 교차결합 데이터가 네트워크 내 기하 제약 조건을 정밀하게 조절하여 구조 품질 향상을 이끌어낸 것임을 입증했습니다.
  
  ![Performance with and without Crosslinks](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/supplementary_fig07.jpg)
  *Figure 5: 동일 가중치 상태에서 크로스링크 유입 여부(with vs without)에 따른 CASP15 및 SAbDab 데이터셋 DockQ 비교. 크로스링크 제약조건이 빠질 경우 모델 예측력이 유의미하게 붕괴하는 모습을 보여줌.*

* **인터페이스 유연성 및 샘플링 부하**:
  인터페이스가 고도로 유연하고 유기적인 경우 단일 예측 시드로는 해상도의 분산이 극심해집니다. 따라서 이를 극복하기 위해 다중 샘플링 및 리사이클링 최적화 횟수의 증가가 필수적입니다.

  ![Flexibility and Deviations on H1134](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/supplementary_fig03.jpg)
  *Figure 6: (a) 유연한 알파 헬릭스 인터페이스로 인해 예측 방향 편차가 큰 H1134 복합체 예시. (b) 최적의 예측값을 수렴시키기 위해 다양한 시드 샘플과 crosslink satisfaction 필터링을 병행해야 성능(DockQ)이 고르게 복구됨.*

* **AlphaLink(Monomer)와의 기술적 차이점**:
  - **아키텍처 스케일**: AlphaLink는 단량체 단백질 예측에 국한되었으며 **OpenFold** 기반이었으나, AlphaLink2는 복합체 예측을 위해 다중 사슬 및 헤테로머 학습이 가능한 **Uni-Fold v2.1.0을** 뼈대로 삼았습니다.
  - **가중치 분기**: 단량체 가중치 대신 다중 체인의 상대적 배치와 체인별 진화 정보 매칭(MSA Pairing)이 학습된 **AlphaFold-Multimer** 가중치를 시작점으로 활용합니다.
  - **제약 조건의 차원**: 단일 체인 내의 접힘을 제어하는 intra-chain crosslinks 위주에서, 두 사슬 간의 인터페이스 배치를 규명하는 **inter-chain crosslinks와** 다중 체인 제약 조건을 처리할 수 있도록 피처 레이어가 대대적으로 리모델링되었습니다.

* **Fold-and-Dock 구조 왜곡과 Monomer Template 활용**:
  - AlphaFold-Multimer계열의 **Fold-and-Dock** 접근법은 각 단량체의 독자적인 접힘과 사슬 간 도킹을 신경망 내에서 동시에 수행합니다.
  - 이 과정에서 단량체 자체의 최적 구조가 복합체 도킹 압박으로 인해 오히려 왜곡되는 문제(예: H1129 체인 B는 단독 예측 시 모델 신뢰도가 0.89에 달하나 복합체 내에서는 0.79로 왜곡됨)가 발생할 수 있습니다.
  - AlphaLink2 연구진은 단독으로 예측된 단량체 구조(Monomer Prediction)를 **Monomer Template을** 통해 템플릿 정보로 함께 주입함으로써, 단량체의 왜곡을 방지하고 복합체 전체 예측 해상도를 대폭 향상시키는 하이브리드 파이프라인을 제시했습니다.

* **모델 선정 시 고려할 사항 (복합 필터링 전략)**:
  - 공진화 정보가 거의 없는 난제 표적(예: 항원-항체)의 경우, 네트워크가 출력하는 모델 신뢰도 스코어(**ipTM + 0.2 * pTM**)가 실제 구조의 기하학적 유사도(DockQ)에 비해 과대평가(Overestimation)되는 한계가 있습니다.
  - 이를 보완하기 위해 모델을 선별할 때 단순 모델 신뢰도 스코어만 맹신하기보다는, 1차적으로 실험적 **Crosslink Satisfaction을** 통해 조건에 부합하는 후보군을 필터링한 후, 2차적으로 **model confidence를** 기준으로 최종 선별하는 복합 필터링 전략이 훨씬 안전하고 정밀한 결과를 도출합니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
