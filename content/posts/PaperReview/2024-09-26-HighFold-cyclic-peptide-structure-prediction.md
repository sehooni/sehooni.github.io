---
layout: single
title:  "[Paper Review] HighFold: Predicting cyclic peptide structures and complexes with head-to-tail and disulfide bridge constraints"
excerpt: "기존 단백질 구조 예측 모델이 처리하기 어려운 고리형 펩타이드(Cyclic Peptide)의 머리-꼬리 연결성 및 이황화 결합 구조적 형태를 Cyclic Position Offset Encoding Matrix(CycPOEM)로 극사화한 HighFold 모델 리뷰"
toc: true
toc_sticky: true

categories:
  - PaperReview
tags: [PaperReview, Bioinformatics, AlphaFold, HighFold, CyclicPeptides]
use_math: true

date: 2024-09-26
last_modified_at: 2024-09-26T14:15:00-17:00:00
classes: wide
---

* **Paper Title**: [HighFold: accurately predicting structures of cyclic peptides and complexes with head-to-tail and disulfide bridge constraints](https://doi.org/10.1093/bib/bbae215)
* **Authors**: Chenhao Zhang, Chengyun Zhang, Tianfeng Shang, Ning Zhu, Xinyi Wu, and Hongliang Duan
* **Journal/Conference**: Briefings in Bioinformatics (2024)
* **DOI**: [10.1093/bib/bbae215](https://doi.org/10.1093/bib/bbae215)

---

## 1. 서론 (Introduction)

**고리형 펩타이드(Cyclic Peptide)는** 일반적인 선형(Linear) 단백질과 달리 서열의 양 끝단(N-term & C-term)이 공유결합으로 이어져 폐쇄 고리(Closed loop)를 형성하거나, 사슬 내부의 시스테인들이 결합하여 원형 위상(Topology)을 가지는 펩타이드 군입니다. 

이러한 고리 구조는 선형 펩타이드에 비해 약리학적으로 거대한 강점을 지닙니다:
- **구조적 강성(Rigidity) 유지**: 타깃 표적 단백질에 대한 결합 친화도(Affinity)와 특이성(Selectivity)이 극대화됩니다.
- **체내 안정성**: 세포 내 단백질 분해 효소(Proteases)의 절단 반응에 강인하여 반감기가 길어 차세대 신약 스캐폴드(Scaffold)로 각광받고 있습니다.

그러나 AlphaFold를 비롯한 현대의 딥러닝 기반 단백질 구조 예측 모델들은 "서열이 선형적으로 늘어서 있다"는 전제 하에 학습을 진행했습니다. 즉, 아미노산 잔기 $i$와 $j$ 사이의 서열상 인덱스 차이 $|i-j|$를 위치 임베딩(Positional Encoding)으로 그대로 사용합니다. 

이 선형 위치 인코딩 하에서는 고리의 1번 아미노산과 마지막 아미노산 $N$이 실제 물리적으로는 바로 옆에 인접해 연결되어 있음에도, 신경망 내에서는 $N-1$만큼 멀리 떨어진 관계로 왜곡되어 인식됩니다. 이 모순으로 인해 AlphaFold 계열 모델에 고리형 펩타이드 서열을 넣으면 고리 형태를 형성하지 못하고 억지로 길게 늘여 뺀 선형(linear) 구조를 뱉는 치명적인 오차가 발생합니다. 

본 논문에서는 물리적 공유결합 연결 관계에 기반한 그래프 최단 경로를 위치 매트릭스로 변환하여 이 한계를 깔끔하게 극복한 **HighFold** 모델에 대해 리뷰합니다.

---

## 2. 모델 아키텍처 및 핵심 이론 (Model Architecture & Core Theory)

HighFold는 인위적인 강제 고리 링커를 추가하거나 좌표를 직접 구부리는 사후 처리 방식 대신, AlphaFold2의 신경망 전단부(Positional Encoding)를 순환 기하 구조에 맞추어 재설계하는 우아한 접근법을 취합니다.

![Linear Positional Encoding Issue](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image8.png)
*Figure 1: 선형(Linear) 위치 오프셋 하에서 고리의 N단과 C단(1번과 N번)이 물리적으로는 인접함에도 오프셋이 $N-1$로 오인되어 생기는 기하 붕괴 현상과 이를 해결하는 Cyclic Offset*

### 2.1. CycPOEM (Cyclic Position Offset Encoding Matrix)

기존 AlphaFold2는 단백질 서열 상의 상대적인 거리를 기반으로 포지션 오프셋 임베딩 $P(i, j) = \text{bucket}(i - j)$를 구성하여 Pair Representation의 초기 입력값으로 주입합니다. 이 방식은 선형 서열의 위상을 전제하므로, N단과 C단이 강하게 결합된 고리형 단백질의 닫힌 루프(Closed-loop) 기하 구조를 모델링할 때 심각한 위상적 모순을 야기합니다.

이를 극복하기 위해 HighFold는 고리형 펩타이드 내부 잔기 간의 실제 위상 연결 경로를 반영한 **CycPOEM** 매트릭스를 제안했습니다. CycPOEM은 $N \times N$ 차원의 상대 위치 인코딩 행렬로, 아미노산 잔기가 선형 1차원 순서가 아닌 고리(Cycle) 및 이황화 결합(Disulfide bond)을 포함한 네트워크 상에서 서로 얼마나 멀리 떨어져 있는지를 최단 경로 단위로 모델링하여 네트워크에 제공합니다. 이 정보가 Pair Representation에 융합됨에 따라, 신경망은 N단과 C단을 물리적으로 완전히 인접한 잔기로 인지하게 되며, 3D 구조 모듈이 링 모양의 안정한 백본을 일그러짐 없이 자연스럽게 형성하도록 안내합니다.

![CycPOEM Overview Architecture](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig01.jpg)
*Figure 2: CycPOEM을 핵심으로 하여 고리형 펩타이드의 구조적 특징과 이황화 결합 제약을 학습 네트워크에 반영하는 HighFold 전체 프레임워크*

### 2.2. FCP (Floyd for Cyclic Peptides) 알고리즘

CycPOEM 매트릭스의 각 원소에 들어갈 최단 위상 경로 거리를 도출하기 위해, HighFold는 그래프 최단 경로 탐색 알고리즘인 Floyd-Warshall을 변형한 **FCP 알고리즘을** 개발하여 적용했습니다.

1. **위상 그래프 모델링**: 고리형 펩타이드의 공유 결합 결합 관계를 엣지(Edge)로 정의합니다. 인접 아미노산 간의 펩타이드 백본 결합(가중치 1)과 N단-C단 간의 머리-꼬리 순환 결합(가중치 1), 그리고 시스테인 잔기 간의 이황화 결합 가교(가중치 1)를 연결한 위상 연결망 그래프를 구성합니다.
   
   ![Background: Floyd-Warshall chalkboard explanation](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image10.png)
   *Floyd-Warshall 알고리즘의 최단 경로 행렬 계산 방식을 직관적으로 표현한 예시*

2. **동적 계획법 기반 최단 경로 계산**: 다음과 같은 점화식을 활용하여 3중 루프 동적 계획법 연산을 수행하고 모든 잔기 쌍 $(i, j)$ 간의 최단 위상 거리 $D_{ij}$를 계산합니다:
   $$
   D_{ij}^{(k)} = \min\left(D_{ij}^{(k-1)}, D_{ik}^{(k-1)} + D_{kj}^{(k-1)}\right)
   $$
   여기서 $k$는 경유 노드의 인덱스입니다.
   
   ![Equation: Floyd-Warshall DP](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/equation01.jpg)
   *최단 위상 거리 행렬 계산에 사용된 FCP 동적 계획법 점화식 공식*

   ![Algorithm: Floyd for Cyclic Peptides](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/algorithm01.jpg)
   *Algorithm 1: Floyd for Cyclic Peptides (FCP) 의사코드*

3. **방향성 부호(Sign) 할당 전략**: AlphaFold2의 상대 위치 임베딩은 방향성($i \to j$ 인가 $j \to i$ 인가)을 나타내기 위해 부호를 가집니다. 단순 최단 경로 거리 $D_{ij}$는 무방향성이므로, 이를 signed matrix로 변환하기 위해 연구진은 아래의 세 가지 부호 할당 전략을 고안하여 실험했습니다:
   - **Full Positive (FP):** 모든 거리를 단순 양수($+D_{ij}$)로 처리하여 무방향 그래프 상태로 임베딩합니다. 방향성이 누락되어 백본의 진행 방향(N $\to$ C) 정보를 상실하는 단점이 있습니다.
   - **Upper Negative (UN):** 행렬의 대각선을 기준으로 상삼각 행렬 성분은 음수, 하삼각 행렬 성분은 양수($d_{ij} = -d_{ji}$)로 강제 매핑하여 반대칭(Skew-symmetric) 행렬을 구현합니다. 순환 위상의 비대칭 방향성을 효과적으로 모델링하여 가장 우수한 기하 학습 능력을 보였습니다.
   - **Weighted Sign (WS):** 백본의 기본 흐름 방향(N $\to$ C)과 최단 위상 경로의 진행 방향(순방향 순환인지, 이황화 결합을 통한 지름길 순환인지)을 가중 합산하여 물리적 대칭성이 정교하게 보존되도록 부호를 정의하는 전략입니다.

   ![Metrics: Sign strategy comparison](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics03.jpg)
   *Table 1: 세 가지 부호(Sign) 할당 전략(FP, UN, WS)에 따른 모형 성능(RMSD 등) 비교*

   ![Flow: CycPOEM and FCP process](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/algorithm02.jpg)
   *FCP 알고리즘을 통한 최단 경로 매핑 및 CycPOEM 생성 상세 흐름*

![FCP Algorithm dynamic programming](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig02.jpg)
*Figure 3: 백본 및 이황화 엣지를 모두 포함하여 아미노산 잔기 간의 최단 순환 위상 거리를 도출하는 Floyd 기반 FCP 알고리즘 흐름 (A: 아미노산 잔기 거리 매핑, B: FCP 최단 경로 행렬 생성, C: 시스테인 잔기들의 disulfide 조합 선별)*

### 2.3. HighFold-Multimer 확장

수용체 표적 단백질(선형)과 리간드 고리형 펩타이드(순환 위상) 간의 도킹 결합 모델링을 위해, 입력 포지셔널 매트릭스를 **블록 대각 행렬(Block Diagonal Matrix)** 형태로 확장 결합하는 방식을 도입했습니다:

$$
\mathbf{P}_{\text{complex}} = 
\begin{bmatrix}
\mathbf{P}_{\text{receptor}}^{\text{linear}} & \mathbf{P}_{\text{cross}} \\
\mathbf{P}_{\text{cross}}^T & \mathbf{P}_{\text{ligand}}^{\text{CycPOEM}}
\end{bmatrix}
$$

![Equation: Block Diagonal Matrix](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/equation02.jpg)
*HighFold-Multimer의 복합체 입력 포지셔널 매트릭스를 표현한 블록 대각 행렬 수식*

- $\mathbf{P}_{\text{receptor}}^{\text{linear}}$: 표적 단백질 도메인 내부의 아미노산 간 상대적 위치를 나타내는 기존의 선형 포지셔널 행렬입니다.
- $\mathbf{P}_{\text{ligand}}^{\text{CycPOEM}}$: 고리형 펩타이드 내부 아미노산 간의 닫힌 위상을 반영한 CycPOEM 행렬입니다.
- $\mathbf{P}_{\text{cross}}$: 표적 단백질과 고리형 펩타이드 리간드 상호작용 간의 교차 위치 관계를 보존하는 행렬입니다.

이 블록 대각 행렬의 구성을 통해, 신경망은 단백질 수용체의 물리 기하학적 형태는 표준적인 방법으로 유도하면서도 고리형 펩타이드에 대해서는 CycPOEM 제약조건을 엄밀히 적용하여, 복합체 계면(Interface) 결합과 고리 링 형성이 모순 없이 유기적으로 co-folding 도킹되도록 최적화합니다.

![Block Diagonal Multimer positional matrix](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig03.jpg)
*Figure 4: 표적 단백질(선형)과 고리형 펩타이드 리간드(CycPOEM)의 입력 포지셔널 행렬을 블록 대각 행렬로 결합하는 Multimer 입력 구조*

---

## 3. 결과 및 분석 (Results & Analysis)

HighFold는 단독 모노머 고리 펩타이드(Monomer Target)와 단백질-고리형 펩타이드 복합체(Multimer Target) 모두에 대해 기존 단백질 구조 예측 모델들과 비교하여 정량적, 정성적으로 우수한 성능을 입증했습니다.

### 3.1. 단독 모노머 고리 펩타이드 예측 성능 (Monomer Target Results)

HighFold는 기존 선형 학습 전제 모델(AlphaFold2) 및 disulfide bond 제약이 없는 모델(AfCycDesign) 대비 압도적인 모노머 구조 예측력을 보였습니다.

![Monomer prediction performance comparisons](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig04.jpg)
*Figure 5: HighFold 모노머 구조 예측 성능 정량 평가 (RMSD 분포 및 pLDDT-RMSD 상관관계 그래프)*

- **정량 평가 결과**: HighFold_Monomer는 기존 AlphaFold2 및 AF2CycDesign 대비 낮은 RMSD 분포(대부분 2.0Å 이하)를 기록했으며, 예측 신뢰도 점수인 pLDDT와 실제 구조 오차(RMSD) 간의 강한 음의 상관관계를 통해 신뢰성을 입증했습니다.

  ![Equation: RMSD formula](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image27.png)
  *정량 평가 지표로 활용된 RMSD(Root Mean Square Deviation) 계산 수식*

  ![Metrics: Monomer target RMSD comparisons](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics01.jpg)
  *Table 2: 기존 af2, AF2CycDesign 대비 HighFold_Monomer의 잔기별 및 원자별 RMSD 예측 정확도 비교*

  ![Metrics: Monomer target RMSD statistics](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics02.jpg)
  *Table 3: 고리 구조 형태 및 이황화 결합 수에 따른 모너머 예측 모델의 정량적 RMSD 분포 상세 통계*

- **모노머 고리 복원**: 억지로 길게 뽑힌 선형으로 예측되어 붕괴되었던 기존 AlphaFold2 출력물과 달리, HighFold는 CycPOEM 덕분에 결합 영역의 왜곡 없이 도메인 참값 구조(PDB ground truth)와 거의 일치하는 완벽한 고리형 3차원 골격을 안정적으로 예측해냈습니다.

![Monomer 3D structure predictions](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig05.jpg)
*Figure 6: AF2CycDesign(주황색)과 HighFold_Monomer(녹색)의 실제 고리형 펩타이드 예측 구조(PDB 7l53, 7m3u) 비교*

### 3.2. 복합체 예측 성능 (Multimer Target Results)

HighFold-Multimer는 표적 수용체 단백질과 고리형 펩타이드 리간드 간의 도킹 결합 구조 예측에서도 뛰어난 성능을 보였습니다.

![Multimer target results](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig06.jpg)
*Figure 7: HighFold-Multimer 복합체 예측 성능 정량 평가 (DockQ, RMSD, Fnat 비교)*

- **도킹 계면 예측(DockQ / Mconf) 향상**: 수용체 포켓 내부에서 고리형 펩타이드가 가지는 정확한 물리적 배치와 결합력을 도출해내는 ipTM 및 DockQ 평가 지표에서 대조군 대비 유의미한 정확도 증가를 보였습니다.

  ![Equation: Mconf formula](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image21.png)
  *복합체 예측 랭킹 지표로 사용된 Mconf(Model Confidence) 스코어 계산 수식*

  ![Equation: Fnat formula](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image19.png)
  *인터페이스 접촉 비율을 정량화하는 Fnat(Fraction of native contacts) 계산 수식*

  ![Fnat Criteria](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image20.png)
  *Fnat 지표에 따른 예측 구조 품질(Quality) 분류 기준*

  ![Metrics: Multimer target performance comparisons](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics04.jpg)
  *Table 4: 다양한 복합체 모델들 간의 인터페이스 예측 정확도(DockQ, Fnat 등) 종합 비교*

  ![Metrics: Multimer target details](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics05.jpg)
  *Table 5: HighFold-Multimer의 세부 성능 지표 및 기존 결합 예측 모듈과의 비교 데이터*

  ![Metrics: Template effect on Multimer](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics06.jpg)
  *Table 6: 표적 단백질 템플릿(with/without template) 적용에 따른 복합체 예측 구조의 정밀 평가 결과*

  ![Metrics: Contact prediction accuracy](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics07.jpg)
  *Table 7: 고리형 펩타이드와 수용체 간의 접촉면(Contact interface) 예측 성능 평가*

  ![Receptor template RMSD comparison](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig08.jpg)
  *Figure 9: 수용체 단백질의 템플릿 정보 유무(with template vs. without template)에 따른 표적 단백질 Cα RMSD 값 비교*

![Binding interface results](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig07.jpg)
*Figure 8: HighFold-Multimer를 통해 예측된 고리형 펩타이드 복합체(PDB 6d3z, 4gux, 9xxy)의 결합 계면(Interface) 3D 시각화*

![Native vs Predicted structural comparisons](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig09.jpg)
*Figure 10: 고리형 펩타이드 복합체 예측 모델과 실제 결정 구조(Native vs. Predicted) 간의 추가적인 3D 구조적 중첩 비교 (예: 3avm, 1sfi)*

---

## 4. 결론 및 한계점 (Conclusions & Limitations)

### 4.1. 결론 (Conclusions)

HighFold는 기존 AlphaFold의 선형 아미노산 순서 전제조건을 완전히 탈피하고, 아미노산 잔기 간의 순환 경로 및 가교 결합 상태를 탐색하는 최단 위상 거리 행렬(CycPOEM)을 최적화 루프에 녹여내어 고리 위상 예측 장벽을 성공적으로 허문 획기적인 모델입니다. 

특히 링 결합 영역의 화학적 긴장(Clash)이나 백본 결합의 단절 없이 참값 구조와 거의 일치하는 매크로사이클(Macrocycle) 3D 골격을 복원함으로써, 고리형 펩타이드 신약 개발 및 타깃 단백질 가상 결합 도킹 스크리닝 과정에서 강력하고 실용적인 예측 모듈로 자리매김할 것입니다.

### 4.2. 한계점 및 향후 연구 과제 (Limitations & Future Directions)

그럼에도 불구하고 HighFold 프레임워크는 실제 신약 설계 워크플로우에 적용하기 위해서 해결해야 할 다음과 같은 한계들을 마주하고 있습니다:

1. **이황화 가교 조합 탐색의 연산 복잡도 (Combinatorial Disulfide Bridge Search):** 고리형 펩타이드 내부에 시스테인 잔기가 4개 혹은 6개 이상 다수 포함된 경우, 이들 간에 형성 가능한 이황화 결합 쌍의 조합(예: 시스테인 6개 기준 15가지 조합)의 수가 늘어납니다. HighFold는 각 조합별로 CycPOEM을 별도 구성하여 모델을 여러 번 포워딩한 후 높은 pLDDT 값 순으로 랭킹을 매겨야 하므로, 가교 수가 많은 대형 펩타이드에서는 추론 병목 현상이 극심해집니다.
2. **비천연 아미노산(Unnatural Amino Acids, unAAs) 수용 한계**: 치료용 고리형 펩타이드는 생체 내 단백질 분해 효소에 대한 내성을 기르기 위해 D-아미노산, N-메틸화 아미노산, 혹은 인공 화학 모이어티 등의 비천연 아미노산을 빈번하게 포함합니다. 기존 AlphaFold2의 아미노산 표현 체계(20가지 천연 아미노산)에 종속된 HighFold는 이러한 비천연 원자 결합 상태를 고차원적으로 직접 표현하는 데 한계가 있습니다. (최근 이를 보강한 AlphaFold3 기반의 HighFold3 등으로의 고도화 연구가 활발히 진행 중입니다.)
3. **거대 고리형 펩타이드의 형태 유연성 (Conformational Flexibility):** 잔기 수가 30개 이상인 매우 큰 매크로사이클릭 펩타이드의 경우, 고리가 가지는 내부 자유도가 매우 커서 용액 속에서 여러 개의 안정된 구조 상태(Conformational Ensemble)를 넘나듭니다. 고정된 정적 구조 한 가지만을 최적화하여 뱉는 HighFold의 특성상 실제 동적 평형 상태를 표현하는 데 한계가 따릅니다.
4. **결합 시 표적 단백질의 유연성(Receptor Flexibility) 미반영**: 수용체 단백질과 고리형 펩타이드 리간드가 결합할 때, 수용체의 결합 포켓이 리간드의 진입에 맞추어 유도 적합(Induced-fit) 형태로 구조가 동적으로 변할 수 있습니다. HighFold-Multimer는 단백질 포켓의 대대적인 3차원 유연 변형을 정밀하게 모사하는 데에는 여전히 다소 취약한 모습을 보입니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
