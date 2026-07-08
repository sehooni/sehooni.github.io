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

기존 단백질 구조 예측 모델들은 왜 고리형 펩타이드만 만나면 맥을 못 췄을까요? 그 비밀은 바로 **'위상적 모델링의 차이'**에 있습니다. HighFold는 인위적인 강제 고리 링커를 추가하거나 좌표를 강제로 구부리는 사후 처리 방식 대신, 신경망 전단부에서 작동하는 위치 인코딩(Positional Encoding) 자체를 순환 기하 구조에 맞추어 재설계하는 우아한 접근법을 취합니다.

![Linear Positional Encoding Issue](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image8.png)
*Figure 1: 기존 선형(Linear) 모델의 포지션 인코딩 한계와 고리형 위상을 반영한 Cyclic Offset 개념 비교. (A) 선형 모델에서는 1번 잔기와 N번 잔기의 서열상 거리가 $N-1$로 매우 멀게 계산되어, 실제로는 머리와 꼬리가 붙어 있는 고리형 백본이 길게 늘어나서 붕괴되는 기하학적 왜곡 현상이 발생합니다. (B) 반면 HighFold가 도입한 순환 오프셋(Cyclic Offset) 환경에서는 N단과 C단 사이의 최단 위상 거리가 1로 올바르게 계산되어, 신경망이 닫힌 루프(Closed-loop) 구조를 인지하고 백본을 안정적으로 형성할 수 있게 됩니다.*

---

### 2.1. CycPOEM (Cyclic Position Offset Encoding Matrix)

그렇다면 HighFold가 이 구조적 왜곡을 극복하기 위해 제안한 핵심 임베딩 기술, **CycPOEM**은 어떻게 작동할까요?

기존 AlphaFold2는 단백질 서열 상의 상대적인 1차원 거리를 기반으로 포지션 오프셋 임베딩 $P(i, j) = \text{bucket}(i - j)$를 구성하여 Pair Representation의 초기 입력값으로 주입합니다. 이 방식은 서열이 일직선으로 늘어선 선형 단백질 위상을 전제하므로, N단과 C단이 직접 연결된 머리-꼬리 순환형(Head-to-tail cyclic) 단백질을 모델링할 때 심각한 위상적 모순을 만듭니다.

![CycPOEM Overview Architecture](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig01.jpg)
*Figure 2: HighFold의 전체 아키텍처와 CycPOEM이 신경망에 융합되는 흐름도. 입력 서열 정보와 함께 FCP 알고리즘을 거쳐 생성된 CycPOEM($N \times N$) 행렬이 AlphaFold의 Pair Representation 초기화 단계에 결합됩니다. 이 정보는 Evoformer 레이어를 거치는 동안 잔기 간의 물리적 인접 관계를 강력하게 유도하며, 최종 Structural Module이 3차원 좌표를 복원할 때 백본이 뒤틀림 없이 완벽한 링 모양으로 닫히도록 안내합니다. 이황화 결합(Disulfide bonds) 정보 역시 최단 경로 그래프 상에 반영되어 예측의 정확도를 함께 끌어올립니다.*

CycPOEM은 $N \times N$ 차원의 상대 위치 인코딩 행렬로, 아미노산 잔기가 단순히 1차원 서열 상의 순서가 아닌, 고리(Cycle) 및 이황화 결합(Disulfide bond)을 포함한 실제 위상 네트워크 상에서 서로 최단 거리로 얼마나 떨어져 있는지를 계산하여 표현합니다. 이 정보가 Pair Representation에 녹아들어가면서, 신경망은 N단과 C단을 물리적으로 완전히 인접한(거리 1) 잔기로 인지하게 되며, 3D 구조 모듈이 링 모양의 안정한 백본을 자연스럽게 형성하도록 이끌어 줍니다.

---

### 2.2. FCP (Floyd for Cyclic Peptides) 알고리즘

CycPOEM 매트릭스의 각 칸에 들어갈 잔기 간 최단 위상 경로 거리를 계산하기 위해, HighFold는 그래프 최단 경로 탐색의 대명사인 Floyd-Warshall 알고리즘을 변형한 **FCP(Floyd for Cyclic Peptides) 알고리즘**을 개발했습니다.

#### A. 위상 그래프 모델링 (Topological Graph Modeling)
먼저 고리형 펩타이드 내부의 공유결합 관계를 기반으로 위상 그래프(Topological Graph)를 구축합니다. 
- 인접한 아미노산 잔기 간의 펩타이드 백본 결합 (가중치 1)
- N단 잔기(1번)와 C단 잔기($N$번) 간의 머리-꼬리 순환 결합 (가중치 1)
- 시스테인 잔기 간의 이황화 결합 가교 (가중치 1)
이 세 가지 공유결합 엣지(Edge)들을 모두 연결하여 하나의 위상 연결망 그래프를 만듭니다.

![Background: Floyd-Warshall chalkboard explanation](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image10.png)
*Floyd-Warshall 알고리즘의 작동 방식을 설명하는 개념도. 칠판 그림처럼, 노드 $i$에서 노드 $j$로 바로 가는 직통 경로와 임의의 중간 노드 $k$를 경유해서 가는 우회 경로의 거리를 비교하고 최솟값으로 계속 업데이트하는 방식으로 모든 잔기 쌍의 최단 경로를 탐색합니다.*

#### B. 동적 계획법(DP) 기반 최단 경로 계산
FCP 알고리즘은 아래의 동적 계획법(Dynamic Programming) 점화식을 활용하여 3중 루프 연산을 수행하고, 모든 잔기 쌍 $(i, j)$ 간의 최단 위상 거리 $D_{ij}$를 최종 도출합니다.

![Equation: Floyd-Warshall DP](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/equation01.jpg)
*FCP 알고리즘의 최단 위상 거리 계산을 위한 핵심 점화식 공식. $D_{ij}^{(k)}$는 $1$번부터 $k$번까지의 노드들만 경유지로 고려했을 때 노드 $i$에서 노드 $j$까지의 최단 거리를 의미합니다. 매 단계마다 기존 경로 $D_{ij}^{(k-1)}$와 $k$번 노드를 거쳐가는 새 경로 $D_{ik}^{(k-1)} + D_{kj}^{(k-1)}$ 중 더 짧은 거리를 선택합니다.*

FCP 알고리즘의 구체적인 구현 흐름을 담은 의사코드(Pseudocode)는 다음과 같습니다.

![Algorithm: Floyd for Cyclic Peptides](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/algorithm01.jpg)
*Algorithm 1: Floyd for Cyclic Peptides (FCP) 의사코드. 입력으로 아미노산 잔기 개수 $N$과 이황화 결합을 형성하는 시스테인 인덱스 쌍의 집합 $S_{db}$를 받습니다. 인접 백본과 머리-꼬리 연결, 이황화 결합 정보를 가중치 1의 엣지로 초기화한 후, 3중 `for` 루프를 돌며 동적 계획법으로 최단 위상 거리 행렬 $D$를 갱신합니다.*

#### C. 방향성 부호(Sign) 할당 전략
여기서 중요한 문제 하나가 발생합니다. 단순히 Floyd-Warshall로 구한 최단 경로 거리 $D_{ij}$는 무방향성이기 때문에 양수 값만 가집니다($D_{ij} = D_{ji}$). 하지만 AlphaFold2의 상대 위치 임베딩은 방향성(N단 $\to$ C단 방향으로의 순서 관계)을 인지하기 위해 부호($i - j$가 양수인지 음수인지)가 포함된 상대적 위치 값을 요구합니다.

방향 정보가 상실되면 백본의 진행 순서가 뒤섞일 수 있기 때문에, 연구진은 아래 3가지 부호 할당 전략을 고안하여 비교 실험을 진행했습니다:
1. **Full Positive (FP):** 모든 위상 거리를 단순 양수($+D_{ij}$)로 처리합니다. 방향 정보가 누락되어 백본의 극성(N $\to$ C)을 학습하는 데 한계가 있습니다.
2. **Upper Negative (UN):** 행렬의 대각선을 기준으로 상삼각 행렬 성분은 음수, 하삼각 행렬 성분은 양수($d_{ij} = -d_{ji}$)로 강제 매핑하여 반대칭(Skew-symmetric) 행렬을 구현합니다. 순환 구조의 비대칭 방향성을 가장 효과적으로 학습하여 우수한 성능을 보여줍니다.
3. **Weighted Sign (WS):** 선형 서열 상의 기본 흐름 방향(N $\to$ C)과 순환 기하 구조상 최단 경로의 방향(순방향 순환인지, 이황화 결합을 통한 지름길 순환인지)을 물리적 대칭성에 맞춰 가중 합산하는 정교한 부호 정의 전략입니다.

![Metrics: Sign strategy comparison](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics03.jpg)
*Table 1: 세 가지 부호 할당 전략(FP, UN, WS)에 따른 예측 구조 성능 비교 데이터. 모노머 및 멀티머 평가 결과 모두에서 반대칭 행렬을 강제 적용한 Upper Negative (UN) 전략이 가장 낮은 RMSD 값(원자 및 잔기 평균 기준)을 기록하며 월등한 예측력을 증명했습니다. WS 전략도 정교하게 설계되었으나, UN 방식의 단순하면서도 강력한 반대칭 위상 규제가 신경망 학습에 가장 최적이었음을 보여줍니다.*

FCP 알고리즘이 어떻게 고리 위상을 해석하고, 최종 CycPOEM 매트릭스로 변환되어 신경망에 들어가는지 전체적인 파이프라인 흐름을 시각적으로 살펴보면 이해가 훨씬 쉽습니다.

![Flow: CycPOEM and FCP process](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/algorithm02.jpg)
*FCP 알고리즘과 CycPOEM 매트릭스 생성의 상세 흐름. 펩타이드 백본 결합 정보와 사용자가 정의한 이황화 결합 후보 정보가 FCP 알고리즘의 입력으로 들어가 최단 위상 거리 행렬 $D$를 계산합니다. 이후 부호(Sign) 할당 과정을 거쳐 Signed 최단 위상 거리 행렬 $S$를 생성하고, 이를 AlphaFold2의 기존 Positional Embedding 버킷 수식과 매핑하여 최종 $N \times N \times 65$ 차원의 CycPOEM 임베딩 텐서를 완성합니다.*

![FCP Algorithm dynamic programming](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig02.jpg)
*Figure 3: 백본 및 이황화 결합 엣지를 포함하여 아미노산 잔기 간의 최단 순환 위상 거리를 도출하는 FCP 알고리즘의 단계별 메커니즘. (A) 백본 공유결합(검은 실선)과 머리-꼬리 연결(빨간 점선), 이황화 결합 가교(파란 점선)가 그래프 상에서 어떻게 결합하는지 아미노산 물리적 배치와 매핑하여 보여줍니다. (B) 이 그래프 정보를 FCP 알고리즘에 통과시켜 얻은 최종 최단 위상 거리 행렬의 모습입니다. (C) 여러 개의 시스테인 잔기가 존재할 때, 가능한 모든 disulfide bridge 결합 조합들을 열거하고 FCP 알고리즘을 각각 돌려 입력값을 준비하는 방식을 도식화했습니다.*

---

### 2.3. HighFold-Multimer 확장

실제 신약 개발 환경에서는 고리형 펩타이드 리간드가 표적 수용체 단백질에 어떻게 도킹하여 결합하는지가 핵심입니다. HighFold는 표적 단백질(선형)과 리간드 고리형 펩타이드(순환 위상) 간의 상호작용 및 결합 구조를 모델링하기 위해, 입력 포지셔널 매트릭스를 **블록 대각 행렬(Block Diagonal Matrix)** 형태로 확장하는 영리한 설계를 제안했습니다.

$$\mathbf{P}_{\text{complex}} = \begin{bmatrix} \mathbf{P}_{\text{receptor}}^{\text{linear}} & \mathbf{P}_{\text{cross}} \\ \mathbf{P}_{\text{cross}}^T & \mathbf{P}_{\text{ligand}}^{\text{CycPOEM}} \end{bmatrix}$$

![Equation: Block Diagonal Matrix](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/equation02.jpg)
*HighFold-Multimer의 결합 복합체 입력을 위한 블록 대각 행렬 구성 수식. Receptor 도메인은 선형 행렬로 표현하고, Ligand 도메인은 고리 위상이 반영된 CycPOEM 행렬로 표현한 뒤 두 체인을 교차 영역 매트릭스($P_{cross}$)로 엮어냅니다.*

이 대형 입력 행렬을 구성하는 각 블록들의 물리적 역할은 다음과 같습니다:
- $\mathbf{P}_{\text{receptor}}^{\text{linear}}$: 표적 단백질(수용체) 내부의 아미노산 간 상대적 위치를 표현하는 기존의 선형 포지셔널 인코딩 블록입니다. 수용체는 고리가 아니므로 일반적인 포지셔널 계산을 따릅니다.
- $\mathbf{P}_{\text{ligand}}^{\text{CycPOEM}}$: 고리형 펩타이드 리간드 내부 아미노산 간의 순환 기하 구조와 이황화 가교 조건을 정밀하게 묘사한 CycPOEM 인코딩 블록입니다.
- $\mathbf{P}_{\text{cross}}$ & $\mathbf{P}_{\text{cross}}^T$: 표적 단백질과 고리형 펩타이드 리간드 사이의 상대적인 위치 관계를 나타내는 교차 블록입니다. 두 사슬은 물리적으로 서로 다른 객체이므로, 사슬 간의 거리는 기존 Multimer 모델과 동일하게 충분히 먼 값(인피니티/서열 연결 없음 버킷)으로 채워져 독립성을 보존합니다.

이 블록 대각 행렬의 구성을 통해, 신경망은 단백질 수용체의 물리 기하학적 형태는 표준적인 방법으로 안정되게 예측하면서도, 리간드인 고리형 펩타이드에 대해서는 CycPOEM의 순환 기하학적 제약조건을 엄밀히 적용할 수 있게 됩니다. 그 결과 복합체 계면(Interface) 결합과 고리의 링 형성이 모순 없이 완벽하게 Co-folding(공동 접힘) 도킹되도록 최적화됩니다.

![Block Diagonal Multimer positional matrix](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig03.jpg)
*Figure 4: 표적 단백질(선형)과 고리형 펩타이드 리간드(CycPOEM)의 입력 포지셔널 행렬을 블록 대각 행렬로 결합하는 Multimer 입력 구조도. 복합체 모델링 시 두 사슬을 한 번에 입력하기 위해 행렬을 대각 블록들로 나누어 처리하는 형태를 보여줍니다. 이 설계를 통해 단일 모델 안에서 서로 다른 위상(선형 위상과 순환 위상)을 지닌 단백질들을 충돌 없이 동시에 처리할 수 있게 됩니다.*

---

## 3. 결과 및 분석 (Results & Analysis)

HighFold는 단독 모노머 고리 펩타이드(Monomer Target)와 단백질-고리형 펩타이드 복합체(Multimer Target) 모두에 대해 기존 단백질 구조 예측 모델들과 비교하여 정량적, 정성적으로 압도적인 성능 향상을 입증했습니다. 그 세부적인 벤치마크 평가 데이터와 실제 예측된 3D 구조들을 하나씩 파헤쳐 보겠습니다.

---

### 3.1. 단독 모노머 고리 펩타이드 예측 성능 (Monomer Target Results)

HighFold는 기존의 선형 서열 전제 모델(AlphaFold2) 및 고리 구조 예측을 시도했으나 disulfide bond 제약이 없었던 대조 모델(AfCycDesign) 대비 압도적인 모노머 구조 예측력을 보였습니다.

![Monomer prediction performance comparisons](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig04.jpg)
*Figure 5: HighFold 모노머 구조 예측 성능의 정량적 평가 분포 그래프. (좌측) RMSD(Cα 및 All-atom) 분포를 보면, HighFold_Monomer(초록색)가 기존 AF2(파란색) 및 AF2CycDesign(주황색)에 비해 확연히 낮은 RMSD 구역에 조밀하게 몰려 있어 예측 정확도가 훨씬 높음을 보여줍니다. (우측) 모델의 신뢰도 스코어인 pLDDT와 실제 구조 오차(RMSD) 간의 상관관계 그래프입니다. 일반적으로 딥러닝 모델이 실무에서 유용하려면 '자기 신뢰도 점수가 높을 때 실제 오차도 낮아야' 합니다. HighFold는 pLDDT가 90 이상인 고신뢰도 영역에서 실제 RMSD가 2.0Å 이하로 수렴하는 강한 음의 상관관계를 나타내어, 예측 구조의 신뢰성을 정량적으로 입증했습니다.*

#### A. 구조 오차 평가 지표: RMSD
모노머 구조 예측의 정확도는 실제 참값 구조(Ground Truth)의 원자 좌표와 모델이 예측한 원자 좌표 간의 거리를 평균한 **RMSD(Root Mean Square Deviation)** 지표를 사용하여 평가합니다.

![Equation: RMSD formula](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image27.png)
*구조 비교의 표준 척도인 RMSD 계산 수식. 두 분자 구조의 대응되는 원자 쌍 $i$에 대해 최적으로 겹친(Superposition) 상태에서 구한 평균 제곱근 편차입니다. 이 값이 작을수록 예측 구조가 실험값(PDB 데이터)에 가깝다는 것을 의미하며, 통상적으로 2.0Å 이하이면 고해상도의 매우 정확한 예측으로 판단합니다.*

연구진이 구축한 모노머 데이터셋에 대해 잔기별(Residue-level) 및 전체 원자별(All-atom) RMSD를 비교 분석한 상세 결과는 다음과 같습니다.

![Metrics: Monomer target RMSD comparisons](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics01.jpg)
*Table 2: 기존 AlphaFold2 및 AF2CycDesign 대비 HighFold_Monomer의 평균 RMSD 성능 비교. Cα 백본 원자만 비교했을 때와 수소 원자를 제외한 모든 원자(All-atom)를 비교했을 때 모두 HighFold가 가장 우수한 스코어(평균 Cα RMSD 1.39Å, All-atom RMSD 2.06Å)를 달성했습니다. 이는 CycPOEM이 백본 골격뿐만 아니라 아미노산 측쇄(Side-chain)의 3차원 배치까지도 올바르게 배치되도록 강력하게 유도하고 있음을 보여줍니다.*

![Metrics: Monomer target RMSD statistics](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics02.jpg)
*Table 3: 고리의 위상 형태(Simple Cycle vs. Disulfide-constrained Cycle)와 이황화 결합(Disulfide bond) 개수에 따른 세부 RMSD 통계 데이터. 이황화 결합 가교 수가 1개, 2개, 3개로 늘어남에 따라 그래프의 위상적 복잡도가 극도로 증가함에도 불구하고, HighFold는 평균 RMSD 1.25Å~1.55Å 수준을 안정적으로 유지합니다. 반면 이황화 결합 제약이 없거나 부족한 기존 모델들은 결합 개수가 늘어날수록 급격한 성능 저하를 겪음을 확인할 수 있습니다.*

#### B. 실제 모노머 3D 구조 복원 결과
선형 포지션 인코딩으로 인해 고리가 연결되지 못하고 양 끝단이 길게 찢어져 일그러졌던 AlphaFold2 결과물과 달리, HighFold는 실제 PDB 결정 구조와 거의 싱크로율 100%에 달하는 완벽한 고리를 형성해 냅니다.

![Monomer 3D structure predictions](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig05.jpg)
*Figure 6: AF2CycDesign(주황색)과 HighFold_Monomer(녹색)가 예측한 3D 구조를 실제 실험값인 PDB 결정 구조(회색)와 중첩하여 비교한 그림. (A) PDB ID 7l53 구조에서 AF2CycDesign은 고리 연결 부위가 일그러지며 큰 편차를 보인 반면, HighFold는 백본 전체가 회색의 참값 구조 위에 완벽하게 중첩됩니다. (B) 이황화 가교가 포함된 7m3u 구조에서도 HighFold는 이황화 결합의 3차원 기하 구조를 정밀하게 예측하여 참값과 일치하는 안정된 고리를 복원했습니다.*

---

### 3.2. 복합체 예측 성능 (Multimer Target Results)

표적 수용체 단백질과 고리형 펩타이드 리간드 사이의 상호작용을 모델링하는 HighFold-Multimer 역시 단백질 도킹 구조 예측 성능 테스트에서 대조군들을 압도했습니다.

![Multimer target results](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig06.jpg)
*Figure 7: HighFold-Multimer 복합체 예측 성능의 정량 평가 분포 그래프. 복합체 예측 성능을 다각도로 평가하기 위해 DockQ 스코어, 인터페이스 RMSD(iRMSD), 리간드 백본 RMSD(lRMSD), 그리고 네이티브 접촉 유지 비율(Fnat)의 누적 분포 함수(CDF)를 비교했습니다. 초록색 실선으로 표현된 HighFold-Multimer가 모든 지표에서 가장 가파른 누적 상승 곡선을 그리며 높은 품질의 도킹 구조를 훨씬 더 높은 비율로 예측해 냈음을 명확히 보여줍니다.*

#### A. 복합체 평가를 위한 핵심 정량 지표와 기준
단백질 복합체의 예측 성능을 정밀하게 모사하기 위해 연구진은 크게 세 가지 수식적 지표를 도입했습니다:

1. **Model Confidence (Mconf) 스코어**:
   AlphaFold-Multimer에서 사용하는 예측 신뢰도 함수로, 복합체 구조들의 서열 랭킹을 매기는 데 활용됩니다.
   
   ![Equation: Mconf formula](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image21.png)
   *Mconf 스코어 계산 수식. 전체적인 구조 유사도 점수인 pTM과 체인 간 인터페이스 영역의 정밀 도킹 신뢰도 점수인 ipTM을 8:2 비율로 가중 합산하여 계산합니다. 인터페이스 접촉면의 신뢰도(ipTM)에 큰 가중치를 부여함으로써, 실제 두 단백질이 결합 포켓에서 올바르게 맞물렸는지를 정교하게 평가합니다.*

2. **Fraction of Native Contacts (Fnat)**:
   실제 결정 구조에서 접촉하고 있는 아미노산 잔기 쌍이 예측 구조에서도 얼마나 잘 보존되었는지를 측정하는 비율 지표입니다.
   
   ![Equation: Fnat formula](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image19.png)
   *Fnat 계산 수식. 참값 인터페이스 내의 총 잔기 접촉 쌍 수($N_{native}$) 대비 예측 구조에서 동일하게 접촉이 재현된 쌍 수($N_{predicted\_native}$)의 비율입니다.*

3. **CAPRI 기준에 따른 예측 등급 분류**:
   Fnat 점수를 기반으로 도킹 모델들의 예측 품질 등급을 정량적으로 분류하는 기준입니다.
   
   ![Fnat Criteria](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image20.png)
   *CAPRI 챌린지 표준에 기반한 예측 등급 기준표. Fnat 비율과 인터페이스/리간드 RMSD 값의 충족 여부에 따라 Incorrect, Acceptable, Medium, High Quality 등 네 단계로 도킹 품질을 엄밀하게 분류합니다.*

#### B. 타 모델들과의 다각도 벤치마크 비교
기존의 AlphaFold-Multimer 및 일반적인 분자 도킹(Docking) 알고리즘들과 정량적으로 성능을 대조한 결과는 다음과 같습니다.

![Metrics: Multimer target performance comparisons](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics04.jpg)
*Table 4: 다양한 복합체 구조 예측 방법론들과 HighFold-Multimer의 성능 비교표. HighFold-Multimer는 성공적으로 예측된 모델의 비율(Acceptable 등급 이상)에서 63.8%를 기록하여, 표준 AlphaFold-Multimer(43.8%) 및 도킹 전용 툴들을 큰 차이로 앞섰습니다. 특히 DockQ 점수 평균이 0.50을 넘어, 실제 신약 스크리닝 단계에서 활용 가능한 수준의 정밀한 인터페이스 형태를 예측할 수 있음을 보여줍니다.*

![Metrics: Multimer target details](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics05.jpg)
*Table 5: HighFold-Multimer 모델의 상세 성능 지표 분석. 고리형 펩타이드 리간드의 물리적 결합 자유도가 매우 큼에도 불구하고, CycPOEM의 순환 제약 덕분에 리간드 자체의 왜곡(lRMSD)이 최소화되며 이것이 고스란히 인터페이스 결합 정밀도(iRMSD 및 Fnat) 향상으로 이어짐을 수치적으로 나타냅니다.*

#### C. 템플릿(Template) 정보의 영향력 검증
구조 예측 시 기존에 알려진 상동 단백질의 3D 좌표 템플릿 정보를 입력으로 주는 경우가 많습니다. HighFold가 템플릿 정보 유무에 따라 얼마나 강건하게 도킹을 예측하는지 검증했습니다.

![Metrics: Template effect on Multimer](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics06.jpg)
*Table 6: 수용체 단백질 템플릿의 유무(With vs. Without Template)가 복합체 예측 성능에 미치는 영향 분석 데이터. 놀랍게도 템플릿 정보가 아예 없는 상황(w/o template)에서도 HighFold-Multimer는 예측 성공률(DockQ ≥ 0.23)이 크게 떨어지지 않고 높은 수준을 유지합니다. 이는 모델이 템플릿의 3D 좌표에 의존해 억지로 끼워 맞추는 것이 아니라, CycPOEM과 신경망 자체의 물리적 기하 학습에 기반해 결합을 예측한다는 점을 시사합니다.*

![Receptor template RMSD comparison](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig08.jpg)
*Figure 9: 템플릿 적용 여부에 따른 수용체 단백질 백본의 Cα RMSD 분포 변화. 템플릿을 제공했을 때(With Template, 초록색)가 예측 오차(RMSD)가 0에 가깝게 조밀하지만, 없는 경우(Without Template, 주황색)에도 대부분 2.0Å 이하의 우수한 오차 범위 내에서 표적 수용체의 형태를 안정적으로 모델링하고 있음을 보여줍니다.*

![Metrics: Contact prediction accuracy](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/metrics07.jpg)
*Table 7: 복합체 계면 내 실제 접촉 잔기 쌍(Contact Interface Residues)에 대한 정밀 예측 성능 평가. 수용체와 고리형 펩타이드 간에 어떤 아미노산들이 직접 맞닿아 결합하는지 접점 예측률을 평가한 수치로, HighFold가 리간드의 닫힌 구조를 올바르게 인지함으로써 물리적 접촉 부위의 매칭 정확도를 획기적으로 끌어올렸음을 입증합니다.*

#### D. 실제 복합체 도킹 계면 3D 시각화 및 중첩
실제 표적 단백질의 활성 부위(Active Site) 포켓에 고리형 펩타이드가 어떻게 완벽하게 끼어 들어가 결합하는지 3D 렌더링을 통해 확인해 보겠습니다.

![Binding interface results](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig07.jpg)
*Figure 8: HighFold-Multimer를 통해 도킹 예측된 대표적인 고리형 펩타이드 복합체들의 결합 인터페이스 3D 시각화 (PDB ID: 6d3z, 4gux, 9xxy). 회색의 실제 실험 구조와 색상이 있는 예측 구조가 수용체 결합 포켓 안에서 거의 분간하기 어려울 정도로 일치합니다. 리간드가 원형 링 모양을 매끄럽게 유지하면서 표적 단백질 표면의 기하학적 굴곡에 입체적으로 밀착해 들어가는 모습을 관찰할 수 있습니다.*

![Native vs Predicted structural comparisons](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/fig09.jpg)
*Figure 10: 추가적인 복합체 예측 구조와 실제 실험 결정 구조(Native vs. Predicted) 간의 3D 백본 중첩 정밀 비교 (예: PDB ID 3avm, 1sfi).*

---

## 4. 결론 및 한계점 (Conclusions & Limitations)

### 4.1. 결론 (Conclusions)

HighFold는 기존 AlphaFold의 선형 아미노산 순서 전제조건을 완전히 탈피하고, 아미노산 잔기 간의 순환 경로 및 가교 결합 상태를 탐색하는 최단 위상 거리 행렬(CycPOEM)을 최적화 루프에 녹여내어 고리 위상 예측 장벽을 성공적으로 허문 획기적인 모델입니다. 

특히 링 결합 영역의 화학적 긴장(Clash)이나 백본 결합의 단절 없이 참값 구조와 거의 일치하는 매크로사이클(Macrocycle) 3D 골격을 안정적으로 복원함으로써, 고리형 펩타이드 신약 개발 및 타깃 단백질 가상 결합 도킹 스크리닝 과정에서 강력하고 실용적인 예측 도구로 큰 기대를 받고 있습니다.

### 4.2. 한계점 및 향후 연구 과제 (Limitations & Future Directions)

그럼에도 불구하고 HighFold 프레임워크가 실제 신약 설계 워크플로우에 매끄럽게 적용되기 위해서는 아직 극복해야 할 몇 가지 뚜렷한 기술적 과제들을 마주하고 있습니다:

1. **이황화 가교 조합 탐색의 연산 복잡도 (Combinatorial Disulfide Bridge Search)**
   고리형 펩타이드 내부에 시스테인 잔기가 4개 혹은 6개 이상 다수 포함된 경우, 이들 간에 형성 가능한 이황화 결합 쌍의 조합의 수가 급격하게 증가합니다. 예를 들어, 시스테인이 6개인 경우 가능한 이황화 결합 쌍 조합은 총 15가지가 됩니다. 
   FCP 알고리즘을 돌리기 위해서는 사전에 어떤 시스테인끼리 결합해 있는지 엣지 정보를 그래프에 입력해주어야 하므로, HighFold는 가능한 모든 이황화 결합 조합마다 개별적으로 CycPOEM을 구성해 모델을 여러 번 실행(Forward Pass)해야 합니다. 이후 생성된 구조들의 평균 pLDDT 값을 비교하여 가장 신뢰도가 높은 조합을 역으로 최종 예측 구조로 채택하게 됩니다. 이 방식은 가교 수가 많은 복잡한 펩타이드에서 심각한 연산 병목 현상을 유발하므로, 향후 결합 쌍 자체를 모델 내부에서 엔드투엔드로 동적 예측하는 기법이 필요할 것입니다.

2. **비천연 아미노산(Unnatural Amino Acids, unAAs) 수용 한계**
   실제 의약품으로 개발되는 많은 고리형 펩타이드 리간드들은 체내 단백질 분해 효소(Proteases)의 절단 반응을 피하고 혈중 반감기를 늘리기 위해 D-아미노산, N-메틸화 아미노산, 혹은 합성 인공 모이어티 등 비천연 아미노산을 빈번하게 포함합니다. 
   하지만 HighFold는 기존 AlphaFold2의 20가지 표준 천연 아미노산 아키텍처 및 원자 표현 체계에 종속되어 있어, 이러한 비천연 원자 결합 상태를 고차원적으로 직접 표현하는 데 한계가 있습니다. 비천연 잔기를 천연 잔기로 치환하여 예측을 시도할 수는 있지만, 이는 실제 기하학적 형태에 오차를 유발하므로, 비천연 원자 그래프를 네이티브하게 학습할 수 있는 범용 모델로의 확장이 중요한 연구 과제입니다.

3. **거대 고리형 펩타이드의 형태 유연성 (Conformational Flexibility)**
   잔기 수가 30개 이상인 거대 매크로사이클릭 펩타이드의 경우, 고리가 가질 수 있는 내부 구조적 자유도가 매우 높기 때문에 용액 속에서 단 하나의 고정된 상태가 아니라 여러 개의 안정된 구조 상태(Conformational Ensemble)를 넘나들며 존재합니다. 단일 정적 결정 구조 상태만을 최적화하여 출력하도록 설계된 HighFold는 이러한 생체 내의 동적인 형태 평형 및 구조 유연성을 완벽하게 대변하기 어렵다는 물리적 한계가 존재합니다.

4. **결합 시 표적 단백질의 유연성(Receptor Flexibility) 미반영**
   수용체 단백질과 고리형 펩타이드 리간드가 결합할 때, 수용체의 결합 포켓 영역이 리간드의 결합에 맞추어 형태가 변하는 유도 적합(Induced-fit) 메커니즘이 발생하기 쉽습니다. 하지만 HighFold-Multimer는 표적 단백질의 대대적인 3차원 구조적 유연 변형을 완벽히 모사하기에는 다소 취약하며, 종종 정적인 수용체 템플릿 구조에 리간드가 억지로 도킹되는 한계를 보여줍니다. 수용체의 유연성을 고려한 도킹 예측 고도화가 향후 결합력 예측 성능을 한 단계 더 끌어올리는 열쇠가 될 것입니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
