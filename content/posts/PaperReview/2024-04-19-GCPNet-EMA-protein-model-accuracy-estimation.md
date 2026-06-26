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

## 1. 서론 (Introduction)

단백질 3차원 구조 예측(Protein Structure Prediction, PSP) 분야는 AlphaFold2와 ESMFold 등의 모델들이 나오면서 급격한 혁신을 겪었습니다. 그러나 이 모델들이 내놓은 예측 구조(Decoys)가 실제로 얼마나 신뢰할 수 있고 정확한지를 정밀하게 판별해내는 **모델 정확도 추정(Estimation of Model Accuracy, EMA)** 분야는 신약 개발 및 도킹 시뮬레이션의 신뢰성 확보를 위해 여전히 가장 핵심적인 독립 과제로 남아 있습니다.

기존의 EMA 방법론들은 다음과 같은 두 가지 명확한 한계에 부딪혔습니다:
1. **파이프라인 종속성 (Pipeline Dependency):** 특정 구조 예측 모델 내부의 특징 맵(예: AlphaFold의 임베딩 정보)을 입력으로 필요로 하기 때문에, Rosetta나 ESMFold 등 다른 모델이 예측한 구조에 대해서는 범용적으로 활용할 수 없습니다.
2. **3D 기하 정보 활용의 미흡 (Geometric Incompleteness):** 단백질 구조의 3차원 좌표 데이터가 가지는 물리적인 회전 및 이동 대칭성(SE(3)-Equivariance)을 딥러닝 신경망 내에서 수학적으로 보존하지 못해, 방향성이나 손대칭성(Chirality) 정보를 누락하는 경향이 있었습니다.

본 논문에서는 3D 단백질 구조 본연의 3차원 대칭성을 보존하고 기하학적 특성을 완벽히 반영(Geometry-complete)하는 SE(3)-Equivariant Graph Neural Network 기반의 범용 EMA 예측 모델인 **GCPNet-EMA를** 제안합니다.

---

## 2. 모델 아키텍처 (Model Architecture)

GCPNet-EMA는 입력된 단백질 3차원 구조의 원자 좌표만을 바탕으로 3차원 Euclidean 그래프 $\mathcal{G} = (\mathcal{V}, \mathcal{E})$를 구축합니다. 그래프의 노드 $\mathcal{V}$는 각 아미노산 잔기의 $C_\alpha$ 원자 위치를 대변하며, 아미노산 잔기 간의 물리적 인접성(기본 임계값 $10$Å 이내의 잔기 쌍)을 기준으로 엣지 $\mathcal{E}$를 형성합니다.

![GCPNet-EMA Architecture & Frames](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image4.png)
*Figure 1: GCPNet-EMA의 아키텍처 다이어그램 및 각 노드(아미노산)에서 정의되는 기하학적 로컬 준거 프레임(Local Frame) 투영 메커니즘*

### 2.1. 로컬 준거 프레임 정의 (Geometry-Complete Local Frame)

3차원 공간에서 회전 및 이동 대칭성(SE(3)-equivariance)을 엄밀하게 유지하면서도 단백질의 비대칭적/방향성 기하 구조(Chirality 및 Orientation)를 손실 없이 인코딩하기 위해, GCPNet-EMA는 각 잔기 노드 $i$마다 백본 원자($\text{N}, \text{C}_\alpha, \text{C}$)들의 상대 좌표 결합 방향을 기준으로 독립적인 직교 좌표계 프레임 $\mathbf{Q}_i = [\vec{q}_{i,1}, \vec{q}_{i,2}, \vec{q}_{i,3}] \in \text{SO}(3)$을 정의합니다:

$$
\vec{q}_{i,1} = \frac{\vec{x}_{C_\alpha} - \vec{x}_N}{\|\vec{x}_{C_\alpha} - \vec{x}_N\|}
$$

$$
\vec{q}_{i,2} = \frac{\vec{q}_{i,1} \times (\vec{x}_C - \vec{x}_{C_\alpha})}{\|\vec{q}_{i,1} \times (\vec{x}_C - \vec{x}_{C_\alpha})\|}
$$

$$
\vec{q}_{i,3} = \vec{q}_{i,1} \times \vec{q}_{i,2}
$$

여기서 $\vec{x}_{C_\alpha}, \vec{x}_N, \vec{x}_C$는 노드 $i$에 해당하는 아미노산 백본 원자들의 3차원 절대 좌표 벡터입니다.
- $\vec{q}_{i,1}$은 질소 원자에서 $C_\alpha$로 향하는 결합 벡터 방향의 단위 벡터입니다.
- $\vec{q}_{i,2}$는 백본 평면의 법선 벡터를 구하기 위해 $\vec{q}_{i,1}$과 백본의 $C_\alpha - \text{C}$ 결합 벡터의 외적을 계산하여 정규화한 값입니다.
- $\vec{q}_{i,3}$는 두 벡터에 동시에 직교하는 세 번째 축을 정의하여 완비된 오른손잡이 직교 좌표계를 형성합니다.

신경망은 이 로컬 준거 프레임 $\mathbf{Q}_i$의 각 축 방향으로 주변 잔기들의 상대적 방향 벡터와 거리 좌표들을 투영(Projection)합니다. 이 투영 연산을 거친 결합 각도 및 거리는 글로벌 좌표계의 회전 및 이동 변환에 대해 완벽하게 불변(Invariant)한 스칼라 정보로 기능하게 되며, 동시에 공간 상의 구조적 뒤틀림을 완벽하게 재구성할 수 있는 기하학적 완전성(Geometry-Completeness)을 확보합니다.

### 2.2. SE(3)-Equivariant GCP Message Passing

GCPNet-EMA의 핵심 연산 엔진은 기하학적 벡터와 일반 스칼라 피처를 쌍으로 결합하여 처리하는 **GCP(Geometry-Complete Perceptron) 레이어입니다**. 이 구조는 스칼라 피처 $s_i \in \mathbb{R}^{d_s}$와 3차원 공간 상의 방향과 크기를 갖는 벡터 피처 $\vec{v}_i \in \mathbb{R}^{d_v \times 3}$를 유기적으로 커플링(coupled)하여 레이어 간에 전달하고 업데이트합니다.

![SE(3)-Equivariant Message Passing](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image5.png)
*Figure 2: 스칼라와 벡터 특징값을 함께 전달 및 업데이트하여 물리 기하 구조를 엄밀하게 학습하는 Equivariant Message Passing 레이어 상세*

GCP 레이어 내부에서는 다음과 같은 기하학적 관계 연산들이 엄밀하게 이루어집니다:
1. **벡터 간 선형 결합 (Vector-to-Vector updates):** 기존 벡터 피처들의 선형 조합을 통해 새로운 회전 동변 벡터를 학습합니다.
2. **벡터의 스칼라화 (Vector-to-Scalar, $V \to S$):** 두 벡터 피처 간의 내적(Inner Product) 및 벡터의 L2 노름(L2 Norm) 연산을 통해 회전 불변인 물리 스칼라 값을 획득합니다.
3. **스칼라에 의한 벡터 제어 (Scalar-to-Vector, $S \to V$):** 다층 퍼셉트론(MLP)을 거쳐 나온 스칼라 값을 가중치로 삼아 기하학적 벡터의 스케일을 조율합니다.
4. **벡터 외적 연산 (Vector Cross Product, $V \times V$):** 두 벡터 피처 간의 외적 연산(Cross-product)을 수행하여 의사벡터(Pseudovector)를 산출합니다. 이는 카이랄성(Chirality, 거울상 이성질체 구별 능력)을 직접적으로 인식하게 해주는 중추적인 역할을 합니다.

GCPNet은 구면 조화 함수(Spherical Harmonics)나 Clebsch-Gordan 텐서곱(Tensor Product)과 같이 막대한 계산 비용이 소모되는 고차원 텐서 연산 대신, 직교 프레임 투영과 외적 기반의 로컬 좌표 투영 방식을 사용하여 계산 복잡도를 혁신적으로 낮췄습니다. 이를 통해 SE(3)-동변성(Equivariance)의 엄밀함은 유지하면서도 연산 속도를 대폭 향상시켰습니다.

---

## 3. 방법론 및 사전 학습 (Methodology & Pre-Training)

GCPNet-EMA의 뛰어난 성능은 대규모 단백질 구조 데이터를 통한 **구조 노이즈 복원 자가지도학습(Denoising Self-Supervised Learning)** 사전 학습(Pre-training)과 CASP 데이터셋을 이용한 미세 조정(Fine-tuning) 파이프라인의 조화에서 비롯됩니다.

![Denoising Pre-training Pipeline](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image8.png)
*Figure 3: 입력 구조에 인위적인 가우시안 섭동(Noise)을 추가한 후 원래의 3D 물리 기하 상태로 되돌리는 복원 사전 학습 과정*

### 3.1. 구조 디노이징 사전 학습 (Denoising Pre-training) 메커니즘

모델의 정확도 평가(EMA)를 위해서는 물리적으로 타당한 자연계 단백질 구조가 가지는 구조적 특징을 깊이 이해해야 합니다. 그러나 실험으로 구조가 규명된 고해상도 단백질 정보는 매우 제한적입니다. GCPNet-EMA는 이를 극복하기 위해 AlphaFold 데이터베이스(AFDB)의 수백만 개 무레이블 구조 예측 모델을 활용하여 다음과 같은 자가지도 자가복원 태스크를 학습합니다:

1. **노이즈 주입 (Noise Injection):** 단백질 구조 모델의 원래 원자 좌표 $\vec{x}_i$에 인위적인 3차원 가우시안 노이즈(Gaussian Noise)를 더해 구조를 붕괴시킵니다:
   $$
   \vec{x}_i^{\text{noisy}} = \vec{x}_i + \vec{\epsilon}_i, \quad \vec{\epsilon}_i \sim \mathcal{N}(0, \sigma^2 \mathbf{I})
   $$
2. **노이즈 예측 및 복원**: GCPNet은 붕괴된 좌표 그래프 $\mathcal{G}^{\text{noisy}}$를 입력받아 각 아미노산 잔기 노드가 원래 있어야 할 올바른 3D 위치를 가리키는 벡터(즉, 주입된 노이즈 $\vec{\epsilon}_i$)를 예측하도록 학습합니다.
3. **손실 함수 (Denoising Loss):** 예측된 노이즈 벡터 $\vec{\epsilon}_i^{\text{pred}}$와 실제 주입된 가우시안 노이즈 $\vec{\epsilon}_i$ 사이의 평균 제곱 오차(MSE)를 최소화합니다:
   $$
   \mathcal{L}_{\text{denoise}} = \frac{1}{N_{\text{res}}} \sum_{i=1}^{N_{\text{res}}} \|\vec{\epsilon}_i^{\text{pred}} - \vec{\epsilon}_i\|^2
   $$

이 디노이징 과정을 통해 모델은 단백질 백본의 공유결합 최적 길이, 안정한 결합 각도 범위, 아미노산 잔기 간의 수소 결합 및 정전기적 힘의 밸런스, 물리적 충돌(Steric Clash)을 피하려는 에너지 매니폴드(Manifold)의 구배를 스스로 내재화합니다. 즉, 고도의 물리화학적 사전 지식을 데이터로부터 직접 습득하게 됩니다.

### 3.2. CASP 기반 Fine-tuning 및 lDDT 스코어 출력

사전 학습을 마친 GCPNet은 최종 예측 헤드(Prediction Head)를 결합하여 CASP(Critical Assessment of Structure Prediction) 벤치마크 데이터를 통해 미세 조정(Fine-tuning)됩니다.
GCPNet-EMA의 예측 목표는 각 아미노산 잔기 $i$의 국소적 물리 기하 정확도를 평가하는 **lDDT (local distance difference test)** 점수(0~1 사이)입니다.

- **lDDT의 동작 원리**: 단백질 내에서 기준 반경(예: 15Å) 이내의 인접 원자 쌍 간의 상대적 거리가 예측 모델과 참값 구조(Experimental Structure) 사이에서 일치하는 비율을 네 가지 오차 허용 임계값($0.5$Å, $1.0$Å, $2.0$Å, $4.0$Å)을 기준으로 평가하는 지표입니다.
- **최종 출력**: 각 잔기 노드마다 스칼라 출력 레이어를 거쳐 예측 lDDT 점수를 산출합니다. 전체 모델의 글로벌 품질 평가는 각 아미노산 노드별 예측 lDDT 점수의 단순 산술 평균으로 계산됩니다.

---

## 4. 결과 및 분석 (Results & Analysis)

GCPNet-EMA는 단일 구조 평가와 복합체(Multimer) 평가 벤치마크셋(CASP15 등)에서 기존 최선 모델들과 비교 평가되었습니다.

![lDDT Correlation comparisons](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image9.png)
*Figure 4: 예측 lDDT 스코어와 참값 lDDT 사이의 높은 피어슨 상관계수(Pearson Correlation)를 보여주는 분포도*

- **lDDT 상관관계의 우수성**: 예측된 lDDT와 실제 3D 구조 정답 간의 상관성이 매우 높게 나타납니다. 기존 최고 수준의 모델인 EnQA-MSA와 비교했을 때 Pearson 및 Spearman 상관계수 지표에서 10% 이상의 뚜렷한 향상을 이루어내며 모델의 정확도 평가 신뢰성을 증명했습니다.

![Performance Tables vs EnQA-MSA](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image12.png)
*Figure 5: EnQA-MSA 및 기타 평가 모델들과의 성능 비교 지표(MAE, Pearson, Spearman)*

- **추론 연산의 압도적 속도**: 기존의 고성능 SE(3) 동변성 네트워크들은 구면 하모닉스(Spherical Harmonics)나 Clebsch-Gordan 텐서 프로덕트 등 고비용의 복잡한 물리 계산 레이어를 사용하여 연산 속도가 매우 느렸습니다. 반면 GCPNet-EMA는 외적(Cross-product) 기반의 정교한 로컬 좌표 투영 방식을 사용하여, 경쟁 모델 대비 **약 47% 빠른 추론 속도를** 자랑합니다. 이는 수백만 개의 구조 스크리닝 파이프라인에 즉시 적용 가능한 수준의 극단적인 실용성을 의미합니다.

![Inference Speed Comparisons](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image15.png)
*Figure 6: 대형 복잡체 및 단백질 크기에 따른 추론 처리 속도 비교 차트(GCPNet-EMA의 47% 이상 연산 속도 개선)*

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
