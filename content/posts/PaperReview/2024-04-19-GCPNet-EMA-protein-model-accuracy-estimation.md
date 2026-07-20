---
layout: single
title:  "[Paper Review] GCPNet-EMA: Protein structure accuracy estimation using geometry-complete perceptron networks"
excerpt: "3차원 단백질 구조의 기하학적 정보와 회전/이동 불변성(SE(3)-equivariance)을 반영하는 geometry-complete perceptron network(GCPNet)를 도입하여 구조 모델 평가 속도와 신뢰도를 향상시킨 GCPNet-EMA 모델 리뷰"
toc: true
toc_sticky: true

categories:
  - PaperReview
tags: [PaperReview, Bioinformatics, DeepLearning, GCPNet, EMA]
use_math: true

date: 2024-04-19
last_modified_at: 2024-04-19T14:40:00-17:00:00
classes: wide
---

* **Paper Title**: [Protein structure accuracy estimation using geometry-complete perceptron networks](https://doi.org/10.1002/pro.4932)
* **Authors**: Alex Morehead, Jian Liu, and Jianlin Cheng
* **Journal/Conference**: Protein Science (2024)
* **DOI**: [10.1002/pro.4932](https://doi.org/10.1002/pro.4932)

---

## 1. 서론 및 연구 배경 (Introduction)

단백질 3차원 구조 예측(Protein Structure Prediction, PSP) 분야는 AlphaFold2와 ESMFold 등의 인공지능 모델이 도입되면서 대전환을 맞이했습니다. 그러나 예측 모델이 출력한 3차원 구조(Decoy)가 실제로 얼마나 물리화학적으로 타당하고 정밀한지 판별하는 **모델 정확도 추정(Estimation of Model Accuracy, EMA)** 분야는 신약 개발 및 분자 도킹 시뮬레이션의 신뢰성 확보를 위해 여전히 핵심적인 독립 과제로 남아 있습니다.

기존의 EMA 방법론들은 다음과 같은 두 가지 주요 한계점을 안고 있었습니다:

1. **특징 파이프라인 종속성 (Pipeline Dependency):** 특정 구조 예측 모델 내부의 중간 임베딩 정보(예: AlphaFold의 Pair/Evoformer representation)를 필요로 하여, Rosetta나 ESMFold 등 다른 모델이 예측한 구조에 대해서는 범용적으로 활용하기 어렵습니다.
2. **3차원 기하 구조의 불완전한 모델링 (Geometric Incompleteness):** 단백질 구조의 3D 물리 기하학적 특성을 수학적으로 보존하기 위해 이동 및 회전 동변성(SE(3)-Equivariance)을 보장해야 하지만, 기존 방법론들은 Clebsch-Gordan 텐서곱(Tensor Product)과 같은 극도로 무거운 물리 계산에 의존하여 연산 속도가 매우 느리거나, 혹은 단순한 Euclidean 거리 기반 그래프를 사용하여 Chirality(거울상 대칭성)와 같은 국소적인 3D 방향 정보를 소실했습니다.

GCPNet-EMA는 이러한 두 가지 한계를 극복하기 위해, 텐서곱 없이도 국소 프레임 투영을 통해 SE(3)-equivariant하면서도 geometry-complete한 GCPNet 아키텍처를 도입하여 빠르고 신뢰성 높은 평가를 구현했습니다.

---

## 2. 모델 아키텍처 및 기하-완비 메시지 패싱 (Model Architecture & GCP Message Passing)

GCPNet-EMA는 입력받은 단백질 3D 좌표 분자 점구름을 기반으로 3차원 유클리드 그래프 $\mathcal{G} = (\mathcal{V}, \mathcal{E})$를 구축합니다.

![GCPNet-EMA Architecture Overview](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/fig01.png)
*Figure 1: 3D point cloud 입력으로부터 그래프를 구축하고, 노이즈 복구 사전 학습 및 GCPConv 레이어를 거쳐 잔기별/글로벌 lDDT 정확도를 예측하는 GCPNet-EMA 아키텍처 개요.*

### 2.0. 그래프 입력 피처 및 채널 구성
* **노드 $\mathcal{V}$**: 각 아미노산 잔기(Residue)의 $C_\alpha$ 원자 위치를 대표 노드로 삼습니다.
  * **노드 스칼라 특징 ($s_i \in \mathbb{R}^t$)**: 아미노산 종류(20차원 One-hot vector), 잔기의 전하량 및 친수성 등 생화학적 물성치, 그리고 서열상 위치 정보를 표현하는 Sinusoidal Positional Encoding이 결합됩니다.
  * **노드 벡터 특징 ($V_i \in \mathbb{R}^{r \times 3}$)**: $C_\alpha$ 원자에서 백본 원자 $N, C$ 및 측쇄(Side-chain) 중심을 향하는 상대적 단위 벡터들이 기하 벡터 채널을 채웁니다.
* **엣지 $\mathcal{E}$**: 각 잔기의 $C_\alpha$ 좌표를 기준으로 16-최근접 이웃(16-NN)을 연결하여 구축합니다.
  * **엣지 스칼라 특징 ($e_{ij} \in \mathbb{R}^d$)**: 잔기 간의 물리적 거리 $d_{ij} = \|\mathbf{x}_i - \mathbf{x}_j\|_2$를 16차원의 Radial Basis Functions (RBF)로 확장한 값과, 백본 이면각($\phi, \psi$) 정보를 가집니다.
  * **엣지 벡터 특징 ($V_{ij} \in \mathbb{R}^{r \times 3}$)**: 두 노드 사이의 단위 상대 변위 벡터 $\mathbf{u}_{ij} = \frac{\mathbf{x}_i - \mathbf{x}_j}{\|\mathbf{x}_i - \mathbf{x}_j\|_2}$가 포함됩니다.

![Table 5: Features used by the GCPNet-EMA models](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/table05.png)
*Table 5: GCPNet-EMA 모델이 사용하는 잔기 노드 및 엣지 특징들의 대칭성(Invariant/Equivariant) 및 속성 요약.*

### 2.1. 로컬 준거 프레임 정의 (Chirality-Sensitive Local Frame)
3차원 공간 상의 강체 변환(SE(3) 변환) 하에서 기하학적 방향성과 거울상 구조(Chirality)를 완벽하게 보존하기 위해, GCPNet은 각 아미노산 잔기 쌍 $i, j$에 대해 상대 좌표 결합 방향과 외적을 활용하여 $\text{SO}(3)$-equivariant 로컬 준거 프레임 $\mathcal{F}_{ij} = [\mathbf{a}_{ij}, \mathbf{b}_{ij}, \mathbf{c}_{ij}] \in \mathbb{R}^{3 \times 3}$를 정의합니다.

$$
\mathbf{a}_{ij} = \frac{\mathbf{x}_i - \mathbf{x}_j}{\|\mathbf{x}_i - \mathbf{x}_j\|_2}
$$

$$
\mathbf{b}_{ij} = \frac{\mathbf{x}_i \times \mathbf{x}_j}{\|\mathbf{x}_i \times \mathbf{x}_j\|_2}
$$

$$
\mathbf{c}_{ij} = \mathbf{a}_{ij} \times \mathbf{b}_{ij}
$$

여기서 $\mathbf{x}_i, \mathbf{x}_j$는 질량 중심이 제거된 노드들의 3차원 위치 벡터이며, 외적($\times$) 연산을 포함함으로써 단백질 구조 내 카이랄성(Chirality, 거울상 이성질체 구별 능력) 변화를 수학적으로 포착할 수 있게 돕습니다. 단백질을 구성하는 아미노산은 거의 예외 없이 L-아미노산 형태이므로, 이러한 카이랄성 감지는 물리적으로 생성될 수 없는 비정상적 구조(예: D-아미노산 배치를 띠는 예측 오류 구조)를 감별하는 중추적인 기하 힌트가 됩니다.

---

### 2.2. Geometry-Complete Perceptron (GCP) 모듈
GCP 모듈은 스칼라 특징 $s \in \mathbb{R}^t$와 3D 유클리드 공간 상의 벡터 특징 $V \in \mathbb{R}^{r \times 3}$를 한 쌍의 튜플 $(s, V)$로 묶어 처리하는 동변성 퍼셉트론입니다. 로컬 프레임 $\mathcal{F}_{ij}$와 벡터 특징들을 상호 투영하여 회전 불변 스칼라 정보와 회전 동변 벡터 정보를 선형 시간 복잡도 내에 유기적으로 변환합니다.

![GCP Conv and Message Passing Layer](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/fig02.png)
*Figure 2: GCPNet-EMA의 기하-완비 어텐션 및 메시지 패싱 세부 연산 과정. 스칼라 특징과 벡터 특징이 상호 상향/하향 투영(Projection) 및 게이팅(Gating)을 거쳐 전파됩니다.*

GCP 모듈 내부의 연산 파이프라인은 다음과 같이 4단계로 구성되어 순차적으로 수행됩니다:

#### 1단계: 벡터 표현 다운스케일링 및 투영용 벡터 생성
입력 벡터 채널 수 $r$을 다운스케일링 인자 $\lambda$ (기본값 3)로 나누어 차원을 대폭 축소하고 투영 기반 프레임 축들과 매칭되는 3개의 행렬을 연산합니다.
$$
z = \left\{\mathbf{v}\mathbf{w}_{d_z} \;\middle|\; \mathbf{w}_{d_z} \in \mathbb{R}^{r \times (r/\lambda)}\right\} \quad \text{(Equation 1)}
$$
$$
V_s = \left\{\mathbf{v}\mathbf{w}_{d_s} \;\middle|\; \mathbf{w}_{d_s} \in \mathbb{R}^{r \times (3 \times 3)}\right\} \quad \text{(Equation 2)}
$$
여기서 $\mathbf{w}_{d_z}$와 $\mathbf{w}_{d_s}$는 학습 가능한 선형 가중치 매트릭스입니다.

#### 2단계: 로컬 프레임으로의 투영 및 이웃 노드 방향 집계
벡터들의 좌표 축 성분을 로컬 준거 프레임 $\mathcal{F}_{ij}$에 투영(내적)하여 글로벌 회전에 상관없는 9차원의 기하 불변 스칼라 정보 $q_{ij}$를 추출합니다. 노드의 경우에는 이웃 노드 방향에 대한 내적 평균으로 집계합니다.
$$
q_{ij} = (V_s \cdot \mathcal{F}_{ij}) \in \mathbb{R}^9 \quad \text{(Equation 3)}
$$
$$
q = \begin{cases} 
\frac{1}{|\mathcal{N}(i)|} \sum_{j \in \mathcal{N}(i)} q_{ij} & \text{if } V_s \text{ represents nodes} \\
q_{ij} & \text{if } V_s \text{ represents edges}
\end{cases} \quad \text{(Equation 4)}
$$

#### 3단계: 불변 스칼라 표현 병합 및 비선형 활성화 (Scalar-to-Scalar)
원래의 노드/엣지 스칼라 특징 $s$와 투영으로 유도된 기하 스칼라 $q$, 그리고 다운스케일링된 벡터의 L2 노름(크기 정보) $\|\mathbf{z}\|_2$를 결합하여 물리 특징을 병합하고 비선형 활성화 함수 $\sigma_s$를 적용합니다.
$$
s_{(s,q,z)} = s \cup q \cup \|\mathbf{z}\|_2 \quad \text{(Equation 5)}
$$
$$
s_v = \left\{s_{(s,q,z)}\mathbf{w}_s + \mathbf{b}_s \;\middle|\; \mathbf{w}_s \in \mathbb{R}^{(t+9+(r/\lambda)) \times t'}\right\} \quad \text{(Equation 6)}
$$
$$
s' = \sigma_s(s_v) \quad \text{(Equation 7)}
$$

#### 4단계: 동변 벡터의 게이팅 및 비선형 가중 업데이트 (Scalar-to-Vector Gating)
스칼라 특징의 출력을 가중치 삼아 벡터 특징의 크기 흐름을 게이팅 연산 $\sigma_g$로 제어합니다. 활성화된 스칼라 값을 다시 벡터 공간으로 선형 사영하는 과정입니다.
$$
V_u = \left\{\mathbf{z}\mathbf{w}_{u_z} \;\middle|\; \mathbf{w}_{u_z} \in \mathbb{R}^{(r/\lambda) \times r'}\right\} \quad \text{(Equation 8)}
$$
$$
V' = \left\{V_u \odot \sigma_g(\sigma^+ (s_v)\mathbf{w}_g + \mathbf{b}_g) \;\middle|\; \mathbf{w}_g \in \mathbb{R}^{t' \times r'}\right\} \quad \text{(Equation 9)}
$$
여기서 $\odot$는 행 단위 엘리먼트 곱(gating operation)을 지칭하며, $\sigma_g$와 $\sigma^+$는 각각 동변성을 훼손하지 않는 게이팅용 비선형 함수입니다.

이 GCP 블록 연산은 구면 조화 함수(Spherical Harmonics)나 Clebsch-Gordan 텐서곱 등 막대한 계산량이 요구되는 복잡한 수학 연산 대신, 오른손잡이 직교 프레임 투영과 선형 결합을 활용하기 때문에 연산 부하가 매우 작으면서도 기하학적 완전성(Geometry-Completeness)을 만족시킵니다.

---

### 2.3. 그래프 합성곱 레이어 (GCPConv Layer) 및 알고리즘
GCPConv 레이어는 앞서 구축한 GCP 모듈을 메시지 패싱(Message Passing) 신경망 구조로 확장하여, 그래프 내의 3D 공간 위상을 점진적으로 업데이트합니다. 레이어 $l$에서의 노드 특징 $n_i^l = (h_i^l, \chi_i^l)$와 엣지 특징 $e_{ij} = (e_{ij}^0, \xi_{ij}^0)$의 갱신 공식은 다음과 같습니다:

![Algorithm 1: GCPNet Algorithm](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/algorithm01.png)
*Algorithm 1: 분자 3D 그래프 입력을 중심으로 노이즈 제거 사전 학습 및 최종 상태까지 업데이트를 수행하는 GCPNet-EMA 학습/추론 파이프라인.*

* **기하 메시지 정의 및 생성**:
  노드와 엣지, 그리고 로컬 3D 프레임 $\mathcal{F}_{ij}$를 연결하여 초기 메시지를 정의합니다.
  $$
  m_{ij}^0 = \text{GCP} \left( n_i^0 \cup n_j^0 \cup e_{ij}, \mathcal{F}_{ij} \right) \quad \text{(Equation 11)}
  $$
* **메시지 누적 및 잔차(Residual) 갱신**:
  복수의 GCP 모듈을 직렬로 연결하고 잔차 연결 구조($\text{ResGCP}$)를 형성하여 깊은 레이어에서도 그래디언트 소실 없이 안정적으로 메시지를 갱신합니다.
  $$
  \Omega^l_{\omega} = \text{ResGCP}^l_{\omega} (m_{ij}^{l-1}, \mathcal{F}_{ij}) \quad \text{(Equation 12)}
  $$
  $$
  \text{ResGCP}^l_{\eta} (z_i^{l-1}, \mathcal{F}_{ij}) = z_i^{l-1} + \text{GCP}^l_{\eta} (z_i^{l-1}, \mathcal{F}_{ij}) \quad \text{(Equation 13)}
* **어텐션 기반 메시지 집계**:
  이웃 노드들의 메시지를 모을 때 노드 순서가 바뀌어도 출력이 동일하도록 순서 불변 집계 함수 $f$(sum 또는 mean)를 적용하되, 스칼라 에지 어텐션 게이트 $g^l_{e\omega}$를 활용해 주의 집중 가중치를 부여합니다.
  $$
  \hat{n}^l = n^{l-1} \cup f\left( \left\{ (g^l_{e\omega, v_i} \Omega^l_{e\omega, v_i}, \Omega^l_{\xi\omega, v_i}) \;\middle|\; v_i \in \mathcal{V} \right\} \right) \quad \text{(Equation 14)}
  $$
* **피드포워드 노드 업데이트**:
  집계된 특징은 노드 전용 피드포워드 함수 $\phi_f^l$ 및 최종 $r$개의 GCP 레이어를 거쳐 다음 합성곱 레이어의 새로운 노드 정보 $n_i^l$로 완성됩니다.
  $$
  \bar{n}_{r-1}^l = \phi_f^l (\hat{n}^l) \quad \text{(Equation 15)}
  $$
  $$
  n^l = \text{GCP}_r^l (\bar{n}_{r-1}^l) \quad \text{(Equation 16)}

### 2.4. EMA 예측 헤드 (Prediction Heads)
GCPNet 백본을 통해 학습된 최종 레이어 $L$의 노드 표상 $n_i^L = (h_i^L, \chi_i^L)$은 단백질의 로컬 및 글로벌 신뢰도 스코어를 도출하기 위해 최종 예측 헤드(Prediction Head)로 들어갑니다.

1. **로컬(Residue-level) lDDT 예측 헤드**:
   각 잔기 노드별 기하 정보가 반영된 스칼라 표현 $h_i^L$과 벡터 표상의 L2 노름인 $\|\chi_i^L\|_2$를 결합한 뒤, 다층 퍼셉트론(MLP) 및 시그모이드 활성화 함수를 통과시켜 개별 아미노산 잔기 $i$의 예측 lDDT 점수인 $\hat{y}_i \in [0, 1]$를 산출합니다.
   $$
   \hat{y}_i = \text{Sigmoid}\left(\text{MLP}\left(h_i^L \cup \|\chi_i^L\|_2\right)\right) \quad \text{(Equation 17)}
   $$
2. **글로벌(Global-level) lDDT 예측 헤드**:
   구조 모델 전체의 기하학적 신뢰성을 종합 평가하는 글로벌 스코어 $\hat{Y} \in [0, 1]$는 개별 노드에서 생성된 로컬 lDDT 예측치들의 단순 산술 평균으로 집계합니다.
   $$
   \hat{Y} = \frac{1}{L} \sum_{i=1}^L \hat{y}_i \quad \text{(Equation 18)}
   $$
3. **다량체 결합 계면(PPI Interface) 예측**:
   다량체(Multimer) 평가 환경에서는 체인 간의 상대적 배치 오차를 평가하는 계면 정확도가 필수적입니다. 이를 위해 두 서로 다른 체인에 속한 노드 쌍 $i, j$ 사이의 경계 인터페이스 에지 임베딩 $e_{ij}^L$을 MLP에 흘려보내 결합 계면의 접촉 신뢰 점수를 별도로 도출하며, 최종 계면 lDDT 점수 갱신에 결합합니다.

---

## 3. 방법론 및 사전 학습 (Methodology & Pre-Training)

GCPNet-EMA는 무레이블 단백질 구조 데이터셋으로부터 물리 기하 제약을 보존하는 우수한 사전 학습 모델 가중치를 유도한 뒤, 지도 평가 목표(lDDT 예측)를 향해 미세 조정하는 2단계 학습 방법론을 가집니다.

### 3.1. 대규모 구조 디노이징 사전 학습 (Denoising Pre-training)
단백질 결합 각도 및 물리화학적 에너지가 최적화된 상태를 자가 학습하기 위해, GCPNet-EMA는 AlphaFold DB(AFDB)의 비중복 클러스터 대표 구조 데이터셋 **afdb_rep_v4** (약 230만 개 단백질)를 기반으로 자가지도 디노이징을 진행합니다.

![Denoising Pre-training Pipeline](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/fig03.png)
*Figure 3: 입력 구조에 인위적인 가우시안 섭동(Noise)을 추가한 후 원래의 3D 물리 기하 상태로 되돌리는 복원 사전 학습 과정*

* **노이즈 주입**: 잔기 노드의 원래 $C_\alpha$ 좌표 $\mathbf{x}_i$에 가우시안 섭동 $\mathbf{e}_i \sim \mathcal{N}(0, \sigma^2 \mathbf{I})$을 더해 인위적인 구조 파괴를 발생시킵니다. 이때 섭동 스케일은 단백질 물리 좌표 매니폴드를 훼손하지 않는 최소한의 범위인 $\sigma = 0.1\text{Å}$로 제약됩니다.
  $$
  \tilde{\mathbf{x}}_i = \mathbf{x}_i + \mathbf{e}_i
  $$
* **디노이징 스코어 매칭 (Denoising Score Matching)**:
  노이즈가 주입된 불안정한 3D 그래프 구조를 입력받아, 원래의 올바른 3D 위치로 복구하는 방향의 그래디언트(즉, 강제로 주입된 노이즈 벡터 $\mathbf{e}_i$)를 모델이 역으로 예측하도록 학습합니다.
  $$
  L_{\text{denoise}} = \mathbb{E}_{\mathbf{x}, \mathbf{e}} \left[ \frac{1}{L} \sum_{i=1}^L \| \mathbf{e}_i - \mathbf{s}_\theta(\tilde{\mathbf{x}}_i) \|^2 \right]
  $$
  여기서 $\mathbf{s}_\theta(\tilde{\mathbf{x}}_i)$는 모델이 예측한 노이즈 복구 스코어 벡터입니다. 이를 통해 모델은 볼츠만 분포 하의 에너지 최적 상태(물리적으로 안정한 결합 거리 및 각도)의 분자 구배 매니폴드를 자연스럽게 인지하게 됩니다.

### 3.2. 지도 미세 조정 (Supervised Fine-Tuning)
사전 학습을 통해 물리 구조 감각을 익힌 GCPNet 백본 모델 위에 2.4 세션의 예측 헤드를 결합하고, 참값(Ground-Truth) 구조 대비 인위적으로 생성된 오차 모델(Decoy)들을 학습하여 실제 lDDT 스코어를 회귀(Regression)하도록 지도 학습을 거칩니다.

* **훈련 및 검증 데이터셋**:
  CASP14 및 CASP15에 출품되었던 단량체/다량체 예측 모델 데코이 구조셋, 그리고 PDB 유래의 대규모 예측 에러 스펙트럼 구조 데이터를 정밀하게 필터링하여 활용합니다.
* **학습 목적함수 (Loss Functions)**:
  * **로컬 손실 함수 ($L_{\text{local}}$)**: 아미노산 잔기별로 참값 lDDT 점수 $y_i$와 모델의 예측치 $\hat{y}_i$ 사이의 평균 절대 오차(L1 Loss)를 최소화합니다.
    $$
    L_{\text{local}} = \frac{1}{L} \sum_{i=1}^L | y_i - \hat{y}_i |
    $$
  * **글로벌 손실 함수 ($L_{\text{global}}$)**: 모델 전체의 예측 평가 신뢰도를 안정화하기 위해, 전체 전역 스코어 참값 $Y$와 예측 스코어 $\hat{Y}$ 사이의 L1 Loss를 계산합니다.
    $$
    L_{\text{global}} = | Y - \hat{Y} |
    $$
  * **최종 손실 함수 ($L_{\text{total}}$)**: 두 손실 함수의 가중 결합을 통해 모델 가중치를 역전파 업데이트합니다.
    $$
    L_{\text{total}} = L_{\text{local}} + \alpha L_{\text{global}}
    $$
    실제 최적 모델 가중치는 검증 데이터셋 상에서 로컬 lDDT L1 Loss($L_{\text{local}}$)가 최소값에 이르는 에포크(Epoch)의 체크포인트를 채택하는 방식으로 결정됩니다.

GCPNet은 구면 조화 함수(Spherical Harmonics)나 Clebsch-Gordan 텐서곱(Tensor Product)과 같이 막대한 계산 비용이 소모되는 고차원 텐서 연산 대신, 직교 프레임 투영과 외적 기반의 로컬 좌표 투영 방식을 사용하여 계산 복잡도를 혁신적으로 낮췄습니다. 이를 통해 SE(3)-동변성(Equivariance)의 엄밀함은 유지하면서도 연산 속도를 대폭 향상시켰습니다.

---

## 4. 결과 및 분석 (Results & Analysis)

GCPNet-EMA는 단일 구조 평가와 복합체(Multimer) 평가 벤치마크셋(CASP15 및 일반 PDB multimer 등)에서 기존 최선 모델들과 비교 평가되었습니다.

- **lDDT 상관관계의 우수성**: 예측된 lDDT와 실제 3D 구조 정답 간의 상관성이 매우 높게 나타납니다. 기존 최고 수준의 모델인 EnQA-MSA와 비교했을 때 Pearson 및 Spearman 상관계수 지표에서 10% 이상의 뚜렷한 향상을 이루어내며 모델의 정확도 평가 신뢰성을 증명했습니다.

![Table 1: Performance comparison against baseline methods](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/table01.png)
*Table 1: 단백질 단량체(Tertiary structure) EMA에 대한 GCPNet-EMA와 기존 베이스라인 모델들과의 성능 비교 (MAE, Pearson Correlation 등).*

![Table 2: Performance on CASP15 Multimer](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/table02.png)
*Table 2: CASP15 단백질 다량체(Multimer) 구조 평가 모델들과의 성능(Cor, SpearCor, Loss) 비교.*

![Table 3: Performance on PDB Multimer](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/table03.png)
*Table 3: 일반 PDB 다량체(Multimer) 구조 평가 모델들과의 성능 비교.*

- **추론 연산의 압도적 속도**: 기존의 고성능 SE(3) 동변성 네트워크들은 구면 하모닉스(Spherical Harmonics)나 Clebsch-Gordan 텐서 프로덕트 등 고비용의 복잡한 물리 계산 레이어를 사용하여 연산 속도가 매우 느렸습니다. 반면 GCPNet-EMA는 외적(Cross-product) 기반의 정교한 로컬 좌표 투영 방식을 사용하여, 경쟁 모델 대비 **약 47% 빠른 추론 속도를** 자랑합니다. 이는 수백만 개의 구조 스크리닝 파이프라인에 즉시 적용 가능한 수준의 극단적인 실용성을 의미합니다.

![Table 4: Inference Speed Comparisons](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/table04.png)
*Table 4: 대형 복잡체 및 단백질 크기에 따른 추론 처리 속도 비교 차트 (GCPNet-EMA의 47% 이상 연산 속도 개선).*

---

## 5. 결론 및 한계점 (Conclusions & Limitations)

### 5.1. 결론 (Conclusions)

GCPNet-EMA는 글로벌 절대 좌표계의 배치에 의존하지 않고 단백질 구조의 기하학적 대칭성을 SE(3)-동변성(Equivariance) 조건 하에 엄밀하게 학습할 수 있음을 증명한 우수한 아키텍처 모델입니다. 

특히 텐서 기반의 동변성 네트워크가 지녔던 극심한 연산 병목 현상을 로컬 준거 프레임 투영과 외적 연산의 기발한 융합으로 해결하여 추론 속도를 47% 이상 단축했습니다. 이 뛰어난 범용성과 가벼운 계산 비용 덕분에, GCPNet-EMA는 생성 AI 모델을 활용한 신약 후보 물질 구조 생성 스크리닝이나 대규모 인실리코(In-silico) 단백질 설계(de novo design) 파이프라인에서 품질을 선별하는 강력한 핵심 필터로 자리매김할 것입니다.

### 5.2. 한계점 및 향후 연구 과제 (Limitations & Future Directions)

그럼에도 불구하고 GCPNet-EMA는 다음 몇 가지 명확한 기술적 한계점과 개선 과제를 안고 있습니다:

1. **정적 단일 형태(Static Conformation) 기반 평가의 한계**: 단백질은 고정된 고체 구조가 아니라 용액 속에서 다이나믹하게 상태가 변화하는 앙상블(Conformational Ensemble)의 형태로 존재합니다. GCPNet-EMA는 정적인 좌표 단 한 가지만을 입력받아 성능을 평가하므로, 다중 안정 상태나 일시적 과도 상태(Transition State)가 지니는 에너제틱스 및 동적 특성을 온전히 반영하기 어렵습니다.
2. **다량체 복합체(Multimer) 평가를 위한 인터페이스 사전 학습 부재**: 단백질 복합체 평가를 지원하지만, 사전 학습용 디노이징 데이터셋(AFDB 등)의 주류가 단일 체인 모노머(Monomer) 구조로만 이루어져 있어, 두 개 이상의 서로 다른 체인이 이루는 상호작용 인터페이스(Protein-Protein Interface, PPI) 영역의 결합 친화성이나 정밀도를 평가하는 지각 성능은 상대적으로 저하될 수 있습니다.
3. **가우시안 노이즈 모델과 실제 모델 오차 간의 불일치**: 자가지도학습에서 도입한 등방성 가우시안 노이즈(Gaussian Noise)는 실제 단백질 구조 예측 소프트웨어(AlphaFold2, ESMFold 등)가 내뱉는 도메인 오정렬(Domain Orientation error)이나 루프(Loop) 영역의 뒤틀림 같은 비대칭적이고 물리적인 예측 오류 형태와는 양상이 다릅니다. 이 간극은 사전 학습 효과의 일부를 감소시킬 우려가 있습니다.
4. **거대 고분자 복합체에 대한 그래프 스케일 병목**: 리보솜이나 바이러스 캡시드와 같이 수십만 개의 잔기로 이루어진 극대형 고분자의 경우, 잔기 간의 완전한 기하 그래프 구축 및 동변성 메시지 패싱 연산 과정에서 메모리(VRAM) 사용량이 급격히 증가하여 단일 GPU 디바이스에서 OOM(Out of Memory) 에러가 발생할 가능성이 존재합니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
