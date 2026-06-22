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
* **Authors**: Andrea Graziadei, ... and Juri Rappsilber
* **Journal/Conference**: Nature Communications (2024)
* **DOI**: [10.1038/s41467-024-51771-2](https://doi.org/10.1038/s41467-024-51771-2)

---

## 1. 서론 (Introduction)

단백질 복합체(Protein Complex)의 3차원 구조를 규명하는 것은 세포 내 신호 전달, 대사 경로, 약물 표적 규명 등 생명 현상의 분자 수준 메커니즘을 규명하는 데 필수적입니다. AlphaFold2의 대성공 이후 **AlphaFold-Multimer**가 출시되면서 다중 사슬 단백질 복합체의 구조 예측 역시 급격히 발전하였습니다.

그러나 AlphaFold-Multimer는 치명적인 약점을 공유합니다. 이 모델은 두 사슬 간의 인터페이스(Interface)를 올바르게 배치하기 위해 진화적 공진화 정보(Co-evolutionary Signal)에 크게 의존합니다. 따라서 다음과 같은 난제 표적들에서는 정확도가 매우 저하됩니다:
- **항원-항체(Antibody-Antigen) 및 나노바디 결합체**: 이들은 진화적 공진화 신호가 거의 없거나 인위적으로 설계된 결합체이기 때문에 공진화 검색으로 인터페이스를 맞추기 어렵습니다.
- **새로운 복합체 사슬**: 데이터베이스 상에 상동 서열(MSA)이 희소하여 정렬 정보가 부족한 고아 복합체 사슬.

이러한 문제를 해결하기 위해 실험 구조 생물학계에서는 **교차결합 질량분석(Crosslinking Mass Spectrometry, XL-MS)** 기법을 널리 사용해 왔습니다.

![Crosslinking MS Background](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/image3.png)
*Figure 1: 화학적 교차결합(Crosslinker) 처리를 통해 두 아미노산 잔기 간의 물리적 거리 범위를 제한하고 이를 질량분석기(MS)로 분석하는 물리적 메커니즘*

XL-MS는 수용액 상의 단백질 복합체에 특정 화학 작용기(예: SDA, DSS 등)를 가진 크로스linker를 주입하여 물리적으로 가깝게 배치된(예: SDA의 경우 두 아미노산 $C_\beta-C_\beta$ 거리가 약 25Å 이내) 잔기들을 공유결합으로 묶어준 뒤, 질량분석기로 단백질을 조각내어 분석함으로써 "어느 아미노산과 어느 아미노산이 인접해 있는지"에 대한 희소한 거리 정보(Distance Restraints)를 제공합니다.

기존의 방식들은 딥러닝 모델이 무작위로 구조 후보군(Decoys)을 쏟아내면 사후에 이 크로스링크 실험 데이터를 만족하는 후보만 필터링하는 방식(Post-filtering)을 사용했습니다. 이 방식은 모델이 애초에 올바른 인터페이스 영역을 하나도 샘플링하지 못하면 무용지물이라는 치명적 단점이 있습니다. **AlphaLink2**는 실험적인 크로스링크 제약 정보 데이터를 단백질 구조 예측 신경망 내부로 **직접 통합(Direct Integration)**하여 모델 접힘 과정 자체를 올바른 방향으로 유도합니다.

---

## 2. 모델 아키텍처 (Model Architecture)

AlphaLink2는 단일 사슬용 단백질 모델이었던 기존의 AlphaLink를 단백질 복합체(Multimer) 예측이 가능하도록 확장시켰으며, 오픈소스 단백질 예측 프레임워크인 **Uni-Fold** 아키텍처를 뼈대로 삼고 있습니다.

### 2.1. Uni-Fold 프레임워크 기반 설계
Uni-Fold는 AlphaFold-Multimer와 동일한 아키텍처를 구현하고 있으면서도, 사용자가 원하면 신경망 모델 전체를 처음부터 가중치 학습(Training)할 수 있도록 공개된 완전한 구현체입니다. AlphaLink2 연구진은 Uni-Fold-Multimer 모델을 수정하여 크로스링크 주입 레이어를 삽입하고 파인튜닝(Fine-tuning)을 수행했습니다.

![AlphaLink2 Architecture & Integration](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/image4.png)
*Figure 2: Uni-Fold를 기반으로 설계된 AlphaLink2의 신경망 구조. 실험적 크로스링크 제약 정보가 Pair Representation에 어떻게 직접 주입되는지 설명하는 모델 다이어그램*

### 2.2. Pair Representation에 직접 주입 (Direct Integration)
AlphaFold 및 Uni-Fold 신경망은 단백질 아미노산 서열 간의 2차원 기하학적 관계를 표현하는 **Pair Representation $z_{ij}$** (차원 크기 128)를 내부적으로 지속 갱신(Message Passing)하며 최종 3차원 좌표를 유도합니다.

AlphaLink2는 사용자가 입력한 크로스링크 데이터 세트 $\{ (i, j, \text{FDR}_{ij}) \}$를 입력받아 다음과 같이 Pair Representation에 통합합니다:
- 잔기 $i$와 잔기 $j$ 사이에 크로스링크 제약조건이 존재하는 경우, 이를 나타내는 이진 지표(Binary indicator $x_{ij} = 1$)와 실험 신뢰도를 나타내는 가중치 데이터를 벡터로 생성합니다.
- 이 벡터를 선형 프로젝션 레이어(Linear Projection Layer)를 통해 128차원의 특징 맵으로 사영한 뒤, Uni-Fold의 초기 Pair Representation 텐서에 덧셈 연산(Addition)으로 직접 결합합니다.
- 신경망 블록인 Evoformer(Evoformer Blocks)를 거치며, 이 강제된 기하학적 사전 정보(Prior)는 아미노산 잔기 쌍의 실제 거리 예측에 강력한 제약 가중치로 작용하여 최종 구조 해석 모듈(Structure Module)에서 두 단백질 사슬이 정확하게 접촉하도록 강제합니다.

---

## 3. 방법론 및 학습 (Methodology & Training)

실제 자연계에는 고품질의 3D 단백질 복합체 구조와 물리적 크로스링크 질량분석 데이터가 동시에 매핑되어 대규모로 축적된 공개 데이터베이스가 매우 부족합니다. 따라서 연구진은 **가상 크로스링크 시뮬레이션(Simulated Crosslinks)**을 적용하여 모델을 학습시켰습니다.

### 3.1. 가상 크로스링크 시뮬레이션 및 노이즈 주입
1. PDB 데이터베이스에 등재된 기지 구조 단백질 복합체 구조들로부터, 실제 실험에서 널리 쓰이는 양기능성 교차결합 화학물질인 **SDA (Succinimidyl 4,4-azipentanoate)**의 물리적 반응 반경을 반영하여 $C_\beta-C_\beta$ 거리가 25Å 이내인 모든 아미노산 잔기 쌍을 탐색합니다.
2. 이 물리적 쌍 중 일부를 무작위로 샘플링하여 가상의 크로스링크 데이터 세트로 만듭니다.
3. **노이즈 모델링 (Noise Injection)**: 실제 실험에서는 질량분석기 분석 에러 등으로 인해 물리적 거리가 멀어 결합이 불가능함에도 결합이 발생한 것으로 보고되는 오답 데이터인 **위양성(False Positive)** 데이터가 수어 개 포함됩니다. 연구진은 모델이 노이즈에 강인해지도록 학습 시 인위적으로 5% ~ 20%의 False Discovery Rate (FDR) 수준에 달하는 위양성 크로스링크(즉, 실제 거리가 30Å 이상으로 매우 먼 잔기 쌍)를 학습 피처에 섞어 주었습니다.
4. 모델은 이 노이즈 섞인 가상 크로스링크 정보로부터 모순되는 제약 정보(위양성)를 필터링해 무시하고, 상호 일관성(Consistent)이 높은 정답 제약조건을 파악하여 구조를 배치하는 기하 구조 보존법을 스스로 학습하게 됩니다.

---

## 4. 결과 및 분석 (Results & Analysis)

AlphaLink2는 CASP15 벤치마크 난제 복합체들과 공진화가 희소한 항원-항체 데이터를 활용하여 정밀 평가되었습니다.

### 4.1. CASP15 난제 복합체 구조 예측 극대화
단백질 복합체의 예측 품질은 **DockQ** 스코어로 판별합니다. DockQ 스코어가 0.23 이상이면 Acceptable(허용 수준), 0.49 이상이면 Medium(중간 정확도), 0.80 이상이면 High(고정밀 구조)를 의미합니다.

![DockQ Improvement on CASP15 Targets](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/image6.png)
*Figure 3: 크로스링크 데이터 수의 증가에 따른 CASP15 난제 타깃들의 DockQ 개선 추이. 단 몇 개의 결합 정보가 입력되더라도 정확도가 극적으로 개선되는 모습*

공진화 정보가 부족하여 기본 AlphaFold-Multimer가 완전히 잘못된 구조(DockQ 스코어 0.05 이하)로 분류했던 다수 타깃들에 대해, 가상/실제 크로스링크 정보를 주입한 결과 DockQ 스코어가 Acceptable 이상인 **0.23~0.50** 영역으로 대거 견인되는 성과를 보였습니다.
- 대표적 CASP15 타깃인 **H1141**의 경우, 기존 모델은 DockQ **0.07**에 그쳐 쓸모없는 구조를 출력했으나, AlphaLink2는 크로스링크 통합을 통해 DockQ **0.28**을 확보하여 구조를 포착하는 데 성공했습니다.

![Performance comparison with/without Crosslinks](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/image7.png)
*Figure 4: AlphaLink의 자체적인 학습 효과와 크로스링크 입력 유무에 따른 단백질 복합체 스코어 변화 양상*

### 4.2. 항원-항체 및 세포 내 sparse crosslink의 강력한 기여
나노바디 및 항체 복합체의 인터페이스 예측 성능이 비약적으로 증가했습니다. 특히, 정교한 다량의 크로스링크 실험이 아닌, 복잡한 세포 환경에서 검출된 단 한 개의 정밀한 세포 내 크로스링크(Single In-cell Crosslink) 정보만을 주입했음에도 평균 구조 신뢰도(Median Model Confidence)가 **0.42에서 0.60**으로 대폭 점프하였습니다.

![Single in-cell Crosslink effect](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/image13.png)
*Figure 5: 단 하나의 세포 내 크로스링크(SDA)를 추가함으로써 구조 예측 샘플이 참값 인터페이스 영역에 유의미하게 포커스되는 과정*

---

## 5. 한계점 및 디스커션 (Limitations & Discussions)

AlphaLink2는 실험 기하 제약 조건을 단백질 접힘 아키텍처에 직접 녹여낸 획기적인 모델이지만, AlphaFold가 가지는 태생적인 한계점들을 내포하고 있습니다.

- **측쇄(Side-chain) 인터페이스 왜곡**: 백본 $C_\alpha, C_\beta$ 수준의 인터페이스 도메인 배치는 우수하게 매핑하지만, 측쇄(Side-chain) 아톰들의 회전각을 세밀하게 최적화하지 못해 접촉 계면에서 화학적 충돌이 발생하는 한계가 있습니다.

![Side-chain Orientation limitations](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/image8.png)
*Figure 6: 예측 인터페이스에서 측쇄(Side-chain)들의 실제 방향 각도가 미세하게 틀려 충돌을 유발하는 영역(빨간 원)*

- **유연성 극복을 위한 연산 오버헤드**: 도메인 유연성이 고도로 높은 펩타이드 등의 표적은 단순 추론만으로는 정확도가 떨어지며, 모델의 샘플링 횟수를 100회로 올리고 내부 리사이클링(Recycling) 반복 횟수를 3회에서 20회로 증폭시켜야 평균 DockQ 성능이 향상(0.45 $\to$ 0.53)되므로 고사양의 GPU 인프라 리소스가 소요됩니다.

![Sampling & Recycling Improvements](/assets/images/2023-12-15-AlphaLink2-protein-complex-modeling/image12.png)
*Figure 7: 샘플 개수 및 리사이클링 반복 횟수를 확대 적용할 때 관찰되는 예측 해상도의 상관 관계 변화*

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
