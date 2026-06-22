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
1. **파이프라인 종속성 (Pipeline Dependency)**: 특정 구조 예측 모델 내부의 특징 맵(예: AlphaFold의 임베딩 정보)을 입력으로 필요로 하기 때문에, Rosetta나 ESMFold 등 다른 모델이 예측한 구조에 대해서는 범용적으로 활용할 수 없습니다.
2. **3D 기하 정보 활용의 미흡 (Geometric Incompleteness)**: 단백질 구조의 3차원 좌표 데이터가 가지는 물리적인 회전 및 이동 대칭성(SE(3)-Equivariance)을 딥러닝 신경망 내에서 수학적으로 보존하지 못해, 방향성이나 손대칭성(Chirality) 정보를 누락하는 경향이 있었습니다.

본 논문에서는 3D 단백질 구조 본연의 3차원 대칭성을 보존하고 기하학적 특성을 완벽히 반영(Geometry-complete)하는 SE(3)-Equivariant Graph Neural Network 기반의 범용 EMA 예측 모델인 **GCPNet-EMA**를 제안합니다.

---

## 2. 모델 아키텍처 (Model Architecture)

GCPNet-EMA는 입력된 단백질 3차원 구조의 원자 좌표만을 기반으로 3D Euclidean 그래프를 생성합니다. 그래프의 노드(Node)는 각 아미노산 잔기($C_\alpha$ 원자 위치)를 나타내며, 기준 거리(예: 10Å) 이내의 인접 잔기들을 엣지(Edge)로 연결합니다.

![GCPNet-EMA Architecture & Frames](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image4.png)
*Figure 1: GCPNet-EMA의 아키텍처 다이어그램 및 각 노드(아미노산)에서 정의되는 기하학적 로컬 준거 프레임(Local Frame) 투영 메커니즘*

### 2.1. 로컬 준거 프레임 정의 (Geometry-Complete Local Frame)
방향성과 손대칭성을 온전히 보존하기 위해, GCPNet-EMA는 각 노드 $i$마다 백본의 화학 결합 방향을 기준으로 수학적으로 직교하는 준거 프레임 $\mathbf{Q}_i = [\vec{q}_1, \vec{q}_2, \vec{q}_3]$을 독립적으로 구축합니다:

$$\vec{q}_1 = \frac{\vec{x}_{C_\alpha} - \vec{x}_N}{\|\vec{x}_{C_\alpha} - \vec{x}_N\|}$$

$$\vec{q}_2 = \frac{\vec{q}_1 \times (\vec{x}_C - \vec{x}_{C_\alpha})}{\|\vec{q}_1 \times (\vec{x}_C - \vec{x}_{C_\alpha})\|}$$

$$\vec{q}_3 = \vec{q}_1 \times \vec{q}_2$$

여기서 $\vec{x}_{C_\alpha}, \vec{x}_N, \vec{x}_C$는 각각 백본 아톰들의 3차원 좌표 벡터입니다. 
신경망은 이 로컬 직교 좌표 프레임 $\mathbf{Q}_i$ 상으로 기하학적 방향 벡터들을 투영(Projection)함으로써, 글로벌 좌표계의 회전 및 이동에 영향을 받지 않는 불변 스칼라 표현들을 왜곡 없이 완벽하게 인코딩합니다.

### 2.2. SE(3)-Equivariant GCP Message Passing
GCPNet-EMA는 각 레이어마다 불변 스칼라(Scalar, $s_i$) 피처와 동변 벡터(Vector, $\vec{v}_i$) 피처를 커플링(coupled)하여 함께 전달 및 업데이트합니다.

![SE(3)-Equivariant Message Passing](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image5.png)
*Figure 2: 스칼라와 벡터 특징값을 함께 전달 및 업데이트하여 물리 기하 구조를 엄밀하게 학습하는 Equivariant Message Passing 레이어 상세*

이 연산 구조는 물리계의 벡터 힘과 에너지 상호작용 법칙을 내재화하여 학습하므로, 복잡하게 뒤틀린 단백질 백본 구조의 안정성을 판단하는 데 매우 정밀한 물리 기하학적 표현력을 발휘합니다.

---

## 3. 방법론 및 사전 학습 (Methodology & Pre-Training)

GCPNet-EMA는 모델 정확도 평가(lDDT 예측)를 정교하게 수행하기 위해, 수백만 개의 구조 정보를 활용할 수 있는 **구조 노이즈 복원 자가지도학습(Denoising Self-Supervised Learning)**을 구축하여 사전 학습(Pre-training)을 선행했습니다.

![Denoising Pre-training Pipeline](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image8.png)
*Figure 3: 입력 구조에 인위적인 가우시안 섭동(Noise)을 추가한 후 원래의 3D 물리 기하 상태로 되돌리는 복원 사전 학습 과정*

### 3.1. Denoising Pre-training 메커니즘
1. AlphaFold 데이터베이스(AFDB) 등 대규모 단백질 구조 데이터에서 레이블이 없는 구조 좌표를 로드합니다.
2. 각 원자 좌표 $\vec{x}_i$에 임의의 가우시안 노이즈(Gaussian Noise)를 추가하여 붕괴된 형태를 유도합니다:
   $$\vec{x}_i^{\text{noisy}} = \vec{x}_i + \vec{\epsilon}_i, \quad \vec{\epsilon}_i \sim \mathcal{N}(0, \sigma^2 \mathbf{I})$$
3. GCPNet 신경망은 이 붕괴된 구조 그래프를 입력받아 각 잔기 노드가 원래 위치해 있어야 할 방향과 거리 복원 가중치를 예측하여 노이즈 $\vec{\epsilon}_i$를 복원하도록 학습합니다.
4. 이 자가지도학습을 통해 모델은 화학적 공유 결합 거리, 원자 간 반발 각도, 수소 결합 네트워크 등 **자연계 단백질 구조가 가지는 고유한 물리화학적 매니폴드(Manifold)**를 사전에 완벽히 내재화합니다.

### 3.2. Fine-tuning 및 출력
사전 학습을 마친 GCPNet은 최종 단에서 각 아미노산 노드의 국소적 구조 오차 지표인 **lDDT (local distance difference test)** 점수(0~1 사이)를 예측하도록 CASP 데이터셋을 이용해 지도 학습으로 미세 조정됩니다.

---

## 4. 결과 및 분석 (Results & Analysis)

GCPNet-EMA는 단일 구조 평가와 복합체(Multimer) 평가 벤치마크셋(CASP15 등)에서 기존 최선 모델들과 비교 평가되었습니다.

![lDDT Correlation comparisons](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image9.png)
*Figure 4: 예측 lDDT 스코어와 참값 lDDT 사이의 높은 피어슨 상관계수(Pearson Correlation)를 보여주는 분포도*

- **lDDT 상관관계의 우수성**: 예측된 lDDT와 실제 3D 구조 정답 간의 상관성이 매우 높게 나타납니다. 기존 최고 수준의 모델인 EnQA-MSA와 비교했을 때 Pearson 및 Spearman 상관계수 지표에서 10% 이상의 뚜렷한 향상을 이루어내며 모델의 정확도 평가 신뢰성을 증명했습니다.

![Performance Tables vs EnQA-MSA](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image12.png)
*Figure 5: EnQA-MSA 및 기타 평가 모델들과의 성능 비교 지표(MAE, Pearson, Spearman)*

- **추론 연산의 압도적 속도**: 기존의 고성능 SE(3) 동변성 네트워크들은 구면 하모닉스(Spherical Harmonics)나 Clebsch-Gordan 텐서 프로덕트 등 고비용의 복잡한 물리 계산 레이어를 사용하여 연산 속도가 매우 느렸습니다. 반면 GCPNet-EMA는 외적(Cross-product) 기반의 정교한 로컬 좌표 투영 방식을 사용하여, 경쟁 모델 대비 **약 47% 빠른 추론 속도**를 자랑합니다. 이는 수백만 개의 구조 스크리닝 파이프라인에 즉시 적용 가능한 수준의 극단적인 실용성을 의미합니다.

![Inference Speed Comparisons](/assets/images/2024-04-19-GCPNet-EMA-protein-model-accuracy-estimation/image15.png)
*Figure 6: 대형 복잡체 및 단백질 크기에 따른 추론 처리 속도 비교 차트(GCPNet-EMA의 47% 이상 연산 속도 개선)*

---

## 5. 결론 (Conclusions)

GCPNet-EMA는 글로벌 좌표계 설정에 휘둘리지 않고 단백질 구조의 기하학적 대칭성과 물리 관계를 동변적으로 보존하는 SE(3)-equivariant 아키텍처의 강력한 실증 연구입니다. 빠른 추론 속도와 뛰어난 모델 신뢰성 덕분에 인공 단백질 디자인 생성 모델의 품질 평가 및 가상 신약 스크리닝 프로세스의 중추적인 필터링 도구로 기능할 것입니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
