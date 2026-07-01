---
layout: single
title:  "[Paper Review] MSAGPT: Neural Prompting Protein Structure Prediction via MSA Generative Pre-Training"
excerpt: "희소한 상동 서열(orphan protein) 환경에서 단백질 구조 예측 한계를 극복하기 위해 다중 서열 정렬(MSA)을 생성 모델링으로 학습하고 AlphaFold2 피드백을 결합한 MSAGPT 프레임워크 리뷰"
toc: true
toc_sticky: true

categories:
  - PaperReview
tags: [PaperReview, Bioinformatics, GenerativeAI, MSAGPT, AlphaFold]
use_math: true

date: 2024-06-28
last_modified_at: 2026-07-01T00:00:00-17:00:00
classes: wide
---

* **Paper Title**: [MSAGPT: Neural Prompting Protein Structure Prediction via MSA Generative Pre-Training](https://arxiv.org/abs/2406.05347)
* **Authors**: Bo Chen, Zhilei Bei, Xingyi Cheng, Pan Li, Jie Tang, and Le Song
* **Journal/Conference**: NeurIPS 2024
* **DOI**: [10.52202/079017-1184](https://arxiv.org/abs/2406.05347)

---

## 1. 서론 (Introduction)

AlphaFold2의 등장은 단백질 3차원 구조 예측(Protein Structure Prediction, PSP)의 성능을 비약적으로 끌어올렸습니다. 하지만 AlphaFold2 아키텍처는 입력으로 주어지는 **다중 서열 정렬(Multiple Sequence Alignment, MSA)의** 진화 정보 깊이에 극도로 의존한다는 한계를 지닙니다. AlphaFold2는 상동 서열들 간의 보존성과 함께 변이하는 공진화(Co-evolution) 경향성을 분석하여 3차원 접힘 거리를 모델링하기 때문에, 데이터베이스 상동 서열이 매우 부족한 **"고아 단백질(Orphan Protein)"이나** 메타게노믹스(Metagenomics) 유래의 희귀 단백질을 예측할 때 예측 신뢰도가 급격하게 붕괴합니다.

![MSA Co-evolution concept and overall comparisons](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig01.jpg)
*Figure 1: (a) 상동 서열 정렬(MSA)에서 잔기 간 공진화(Co-evolution)를 포착해 3차원 구조(Contact)를 예측하는 기본 개념. (b) 상동 서열이 부족한 희소 MSA 벤치마크 환경에서 기존 방식(AF2 MSA, MSA-Aug., EvoGen) 대비 MSAGPT와 피드백 최적화(RFT & DPO) 기법을 적용했을 때의 성능(TM-Score) 비교.*

이를 극복하기 위해 가상의 진화 서열을 인위적으로 합성하려는 시도가 있었으나, 기존 모델들은 아미노산 서열 내 2차원적인 기하/진화 구조적 맥락을 반영하지 못해 물리적으로 불가능한 서열을 생성(환각 현상)하는 한계가 있었습니다. 

본 논문에서 제시하는 **MSAGPT는** 28억(2.8B) 파라미터 규모의 디코더 전용(Decoder-only) Transformer 언어 모델을 바탕으로, 단백질 2차원 진화 공간을 보존하는 위치 부호화 기법과 **AlphaFold2의 물리적 구조 피드백을** 통합하여 물리적으로 타당하고 진화적 다양성을 갖춘 고품질의 가상 MSA를 자율적으로 생성하는 최첨단 프레임워크입니다.

![MSAGPT overall framework](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig02.jpg)
*Figure 2: 가상 MSA 생성을 통한 단백질 구조 예측 프롬프팅 프레임워크. Left: 상동 서열이 희소하여 AlphaFold2 예측력이 저조한 상태(pLDDT=32.0, TM-Score=21.5). Middle-to-Right: 2D Evolutionary Positional Encoding과 1D 디코딩을 활용하여 MSAGPT로 virtual MSA를 생성하는 과정. 오른쪽: 증강된 가상 MSA를 주입하여 최종 3D 구조를 정밀하게 재구성하고 구조 신뢰도를 획기적으로 개선한 상태(pLDDT=65.0, TM-Score=78.1).*

---

## 2. 모델 아키텍처 및 학습 설계 (Model Architecture & Training Setup)

### 2.1. 2D Evolutionary Rotary Positional Encoding (2D-RoPE)
MSA 데이터는 가로축(서열 상 잔기 위치)과 세로축(상동 서열의 진화적 깊이)이라는 독립된 두 위상적 정보를 갖습니다. 기존의 1차원 위치 부호화 방식(RoPE)을 단순 적용하면 이 2차원 관계가 얽혀 진화적 변이와 잔기 접힘 거리를 동시에 학습하기 어렵습니다. 

이를 해결하기 위해 MSAGPT는 두 축의 기하 구조를 동시에 인코딩하는 **이중축 2D-RoPE(Dual-axis 2D-RoPE)를** 제안합니다. 특정 위치 $(i, j)$의 Query 및 Key 벡터에 곱해지는 회전 변환 행렬 $\mathbf{R}_{2D}(i, j)$는 서열 축 회전 변환 $\mathbf{R}_{\text{seq}}(i)$와 진화 축 회전 변환 $\mathbf{R}_{\text{evo}}(j)$의 **크로네커 곱(Kronecker Product, $\otimes$)으로** 정의됩니다:

$$
\mathbf{R}_{2D}(i, j) = \mathbf{R}_{\text{seq}}(i) \otimes \mathbf{R}_{\text{evo}}(j)
$$

이 기법은 Attention 연산 과정에서 잔기 간의 물리적 거리와 진화적 거리를 다차원적으로 반영할 수 있도록 돕습니다.

![Axial Attention vs 2D Evolutionary position enhanced attention](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig03.jpg)
*Figure 3: Axial Attention(가로/세로축 어텐션을 각각 독립적으로 연산)과 MSAGPT의 2D Evolutionary Position Enhanced Attention의 구조 비교. 단량체 "G"에 정보를 통합하는 과정에서 2D positional encoding을 결합한 원스텝 통합 방식이 정보 손실을 막고 연산 효율성을 제고함.*

#### Axial Attention과의 차별점 및 기술적 우위
기존의 MSA 언어 모델(예: ESM-MSA, MSA-Transformer)이나 가상 생성 모델(EvoGen 등)은 연산 복잡도를 줄이기 위해 가로축(Row-wise)과 세로축(Column-wise) 어텐션을 서로 분리하여 번갈아 계산하는 **축 분할 어텐션(Decoupled Axial Attention, $O(N^2L + NL^2)$)**을 채택해 왔습니다. 
* **Row-wise Attn**: 동일 서열 내 잔기 간 결합 정보 수렴 ($P^{\alpha}_0 \neq P^{\beta}_0, P^{\alpha}_1 = P^{\beta}_1$)
* **Column-wise Attn**: 동일 위치 잔기들의 진화 변이 흐름 파악 ($P^{\alpha}_0 = P^{\beta}_0, P^{\alpha}_1 \neq P^{\beta}_1$)

그러나 이러한 분할 구조는 가로축과 세로축이 대각선 방향으로 복잡하게 얽히는 고차원 공진화 정보($P^{\alpha}_0 \neq P^{\beta}_0, P^{\alpha}_1 \neq P^{\beta}_1$)를 효과적으로 확산(Diffusion)하지 못하고 정보 손실을 발생시키는 구조적 결함이 있었습니다. 

반면, **MSAGPT의 2D Evolutionary Position Enhanced Attention은** 크로네커 곱 변환 행렬을 통해 모든 아미노산 토큰 쌍이 단일 어텐션 레이어 안에서 서로의 2차원 좌표 관계를 온전히 인지한 상태로 **직접 참조할 수 있는 일원화된 정보 확산 경로(One-step Aggregation)**를 제공합니다. 이는 customization된 복합 어텐션 방식보다 단백질 내부 잔기들의 3차원 접힘 거리에 기인하는 복잡한 물리 화학적 상호작용(Co-evolutionary contacts)을 모사하는 데 압도적인 학습 효율성을 발휘합니다.

---

### 2.2. 1D 평탄화 및 자기회귀 디코딩 (1D Flattening & Autoregressive Decoding)
2차원 정렬 행렬을 효율적인 LLM 연산 가속기에 통합하기 위해, MSAGPT는 $M \times N$ 크기의 MSA 행렬을 서열 단위로 펼쳐서 특수 구분 토큰($\langle\text{sep}\rangle$)으로 나열하는 **서열 단위 평탄화(Sequence-wise Flattening)를** 거칩니다:

$$
\mathbf{S} = [\text{Seq}_1, \langle\text{sep}\rangle, \text{Seq}_2, \langle\text{sep}\rangle, \dots, \langle\text{sep}\rangle, \text{Seq}_M]
$$

여기서 $\text{Seq}_1$은 구조 예측의 대상이 되는 쿼리 서열(Query Sequence)이며, 각 상동 서열의 시작과 끝은 $\langle\text{start}\rangle$와 $\langle\text{end}\rangle$ 특수 토큰으로 감싸 모델이 서열 경계를 명확하게 식별하도록 설계되었습니다.

모델은 1차원으로 직렬화된 토큰 스트림 상에서 이전 아미노산 토큰이 주어졌을 때 다음 아미노산을 유추하는 자기회귀(Autoregressive) 학습을 수행합니다. 사전 학습(Pre-training) 과정에서는 아래의 Cross-Entropy 손실 함수를 최소화합니다:

![Cross Entropy Loss Equation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/equation01.jpg)
*Equation 1: MSA 생성 토큰 열에 대한 교차 엔트로피 손실 함수.*

#### LLM 가속화 기술과의 융합 및 복잡도 분석
이러한 1D 평탄화 디코딩 설계는 이론적인 시간 복잡도를 축 분할 어텐션의 $O(N^2L + NL^2)$에서 **$O(N^2L^2)$**으로 상승시킵니다. 하지만 고정된 2차원 격자 구조로 인해 최신 거대 언어 모델(LLM) 가속화 엔진을 적용하기 까다로웠던 축 분할 어텐션과 달리, 1D 직렬화 구조는 업계 표준인 **FlashAttention-2**를 다이렉트로 탑재할 수 있습니다. 

FlashAttention-2는 GPU의 SRAM과 HBM 간의 메모리 읽기/쓰기를 하드웨어 친화적으로 최적화하여 텐서 연산 코어의 효율을 극대화하므로, 복잡도 상승에도 불구하고 실제 학습 및 추론 속도가 수배 이상 빨라집니다. 

또한 추론 단계에서 이미 디코딩된 토큰들의 연산 중간값을 메모리에 유지하는 **KV-Cache** 기법을 원활히 통합함으로써, 가상 MSA를 64개 깊이까지 생성하는 대형 추론 연산 시 중복되는 행렬-벡터 연산을 완벽히 제거하여 극도로 빠른 추론 처리량(Inference Throughput)을 확보할 수 있게 되었습니다.

---

### 2.3. 사전 학습 데이터셋 및 하드웨어 스케일링 경향성
사전 학습에는 UniRef50 데이터베이스 유래의 대규모 다중 서열 정렬 세트가 사용되었으며, 토큰 길이에 따른 연산 부하를 제어하기 위해 다양한 세부 인프라 튜닝이 동반되었습니다.

![Pre-training dataset profile](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig07.jpg)
*Figure 7: 사전 학습에 활용된 단백질 서열 데이터셋의 서열 길이(Sequence Length) 및 MSA 깊이(MSA Depth) 분포.*

![Compute latency and VRAM footprint scaling](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig08.jpg)
*Figure 8: 전체 토큰 길이(서열 길이 $\times$ MSA 깊이) 증가에 따른 추론 지연 시간(Inference Latency) 및 GPU 메모리 점유율(VRAM Footprint)의 스케일링 관계 분포.*

사전 학습 코퍼스는 OpenProteinSet의 **Uniclust30 데이터베이스**를 활용하여, HHblits all-against-all 서열 검색을 수행해 추출한 **약 1,600만 개(16M)의 MSA 파일**로 구축되었습니다. 

하드웨어 리소스와 학습 시간 효율을 고려하여 시퀀스 길이 $L \le 1024$, MSA 깊이 $N \le 64$를 초과하는 데이터는 학습 대상에서 제외하는 데이터 전처리를 거쳤습니다. 28억 파라미터 모델의 가중치를 수렴시키기 위해 수많은 A100 GPU 클러스터 환경에서 고도의 분산 학습 프로토콜이 수행되었습니다.

---

## 3. 방법론: AlphaFold2 피드백 정렬 (Alignment from Structural Feedback)

서열 언어 모델의 확률 분포에만 의존해 생성하면 3D 공간 상에서 실제로 접힐 수 없는 비물리적인 구조가 유도되기 쉽습니다. MSAGPT는 이를 방지하기 위해 단백질 구조 예측 소프트웨어(AlphaFold2)의 신뢰도를 피드백으로 취하는 **구조적 피드백 정렬(RLAF) 기법을** 제안합니다.

![RFT and DPO Alignment pipeline](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig06.jpg)
*Figure 6: MSAGPT의 전체 학습 파이프라인. 사전 학습(Pre-training) 단계를 거친 후, AlphaFold2의 구조 신뢰도 지표를 통해 우수 샘플만 필터링해 재학습하는 RFT(Rejective Fine-Tuning) 단계와 더 우수한 구조 스코어를 유도하는 서열을 선호하도록 학습하는 DPO(Direct Preference Optimization) 선호도 정렬 파이프라인.*

### 3.1. 거부 미세 조정 (Rejective Fine-Tuning, RFT)
사전 학습(Pre-training)을 마친 베이스 모델은 단백질 데이터베이스에 고질적으로 분포하는 시퀀스 공백(Deletions/Insertions) 노이즈까지 과적합하여 학습하게 됩니다. 이 상태의 모델이 가상 MSA를 생성하면 형태학적으로는 그럴듯하지만, 실제로 3D 구조를 예측하면 형태를 전혀 잡지 못하는 **"서열 환각(Sequence Hallucinations)"** 현상이 다수 나타납니다. 

이를 교정하기 위한 1차 피드백 정렬 루프가 **거부 미세 조정(Rejective Fine-Tuning, RFT)**입니다:

1. **RFT 데이터 수집**: Protein Data Bank(PDB)에서 실험적으로 구조가 검증된 **120,780개의 단백질 서열**을 기준 쿼리군으로 준비합니다.
2. **서브셋 샘플링**: 각 쿼리 서열 $Q$에 대해 HHblits로 획득한 전체 자연계 MSA 풀에서 중복 허용 복원 추출 방식으로 깊이 $n=16$의 작은 MSA 서브셋들을 무작위 추출($m = \{m_1, \dots, m_i\}, i=10$)합니다. 이때 데이터의 최저 밀도를 확보하기 위해 전체 깊이가 최소 $\lceil n \times i/2 \rceil$ 미만인 대상은 필터링에서 배제합니다.
3. **구조 신뢰도 평가**: 샘플링된 서브셋들을 각각 AlphaFold2에 인풋으로 흘려보내 예측 구조의 정확도 지표 $\mathbb{I}_{\text{acc}}(Q, m_i)$(TM-score)를 산출합니다.
4. **거부 조건 적용**: 아래의 임계 필터 수식을 통과하는 정예 고품질 데이터 쌍만을 수집하고 기준 미달의 가상 MSA는 완전 거부(Reject)합니다.

![RFT dataset filtering equation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/equation02.jpg)
*Equation 2: 사전에 정의한 임계치 $\theta_1$ 및 대조군 대비 상대 향상량 임계치 $\theta_2$를 활용한 RFT 데이터셋 필터 조건.*

여기서 절대 임계치 $\theta_1 = 0.9$는 예측 결과가 고정밀 Native 수준에 도달했는지를 통제하며, 상대 개선량 임계치 $\theta_2 = 0.2$는 MSA 증강 효과가 단일 서열 예측 대비 유의미한 구조 변형 개선을 달성했는지를 평가합니다. 이 과정을 통해 정밀하게 필터링된 **약 6만 개(60k)의 정예 학습 샘플**로 MSAGPT를 지도 미세 조정(SFT)하여 서열 환각 생성 문제를 대폭 제거합니다.

---

### 3.2. Direct Preference Optimization (DPO / RLAF)
RFT를 거친 모델도 우수한 서열들의 정답 가중치만을 모방(Supervised imitation)할 뿐, "비물리적인 구조를 유도하는 부적절한 아미노산 패턴을 억제하고 피하는 법"을 명시적으로 배우지는 못합니다. 

이러한 지도 학습의 단방향 한계를 정밀하게 극복하기 위해, MSAGPT는 인간 피드백 강화학습(RLHF)을 인코딩한 **Direct Preference Optimization(DPO)** 기법을 생물학 도메인에 최초로 최적화한 **RLAF(Reinforcement Learning from AF2 Feedback)** 단계를 구동합니다.

#### RLAF Preference 데이터셋 구축
RLAF는 쿼리 단백질 $Q$에 대해 RFT 모델로부터 가상 MSA를 무작위 생성하게 한 후, 생성된 서브셋들 중 AlphaFold2 구조 점수가 상대적으로 가장 뛰어난 서열 $m_w$ (Winning)와 가장 찌그러지고 오류가 심한 서열 $m_l$ (Losing)을 쌍으로 묶어 선호도 preference 데이터셋을 확보합니다:

![DPO Preference Dataset Equation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/equation03.jpg)
*Equation 3: Winning과 Losing 가상 MSA 간의 구조 스코어 차이가 $\theta_3$ 이상인 데이터셋 선별 조건.*

여기서 마진 임계값 $\theta_3 = 0.3$을 부과하여, 두 생성 서열 간의 3D 접힘 품질 차이가 확연한 대비를 이루는 최적의 선호도 데이터 **11,000개 쌍(11k DDPO pairs)**을 선별하였습니다.

#### RLAF 최적화 목적함수 및 학습 안정화
학습 목적함수는 참조 모델(Reference Model, $\pi_{\text{ref}}$) 대비 정책 모델(Policy Model, $\pi_\theta$)의 우수 서열 발현 로그 비율과 불량 서열 발현 로그 비율의 상대 차이를 계산하여 시그모이드 오차를 최소화합니다:

![DPO Loss Equation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/equation04.jpg)
*Equation 4: MSAGPT에 최종적으로 가해지는 DPO 손실 함수.*

여기서 $\beta = 0.1$은 KL-divergence 페널티 계수로 작용하여, 모델의 생성 확률 분포가 RFT의 안전 장치 가중치 영역에서 급격하게 이탈해 모델이 붕괴하는 현상을 예방합니다. 

특히 훈련 도중 DPO 손실값에만 전량 최적화를 의존할 경우 언어 모델 고유의 토큰 정합성 분포가 왜곡되어 학습이 극도로 불안정해지는 고질적 현상을 포착하였습니다. 이를 방지하기 위해 MSAGPT 연구진은 선호 서열 $m_w$에 대한 사전 학습 Cross-Entropy 손실함수($\mathcal{L}_{\text{CE}}$)를 정규화 항(Regularization term, 가중치 $\lambda = 0.1$)으로 혼합한 최종 손실 함수를 설계하였습니다:

$$
\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{DPO}} + \lambda \mathcal{L}_{\text{CE}}
$$

이 RLAF 손실 조합을 통해 MSAGPT는 **"3차원 접힘 공간 내 상호 작용을 만족하는 공진화 잔기 쌍"의 생성 확률은 비약적으로 상향하고, "구조적 충돌이나 비물리적 배치를 야기하는 불량 패턴"의 유도 확률은 완벽히 차단**하는 자기 정렬(Self-alignment)을 달성하게 됩니다.

---

## 4. 결과 및 분석 (Results & Analysis)

### 4.1. 정량적 벤치마크 평가 결과
MSAGPT는 CAMEO 및 CASP15 벤치마크 데이터셋에서 기존 상동 서열 증강 기법들을 압도하는 정확도 개선을 증명했습니다.

![Table 1: Benchmark overall results](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table01.jpg)
*Table 1: 3가지 대표적인 희소 MSA 자연계 단백질 데이터셋에 대해 기존 서열 탐색 엔진 및 다양한 가상 MSA 생성 모델의 구조 예측 TM-Score 비교 테이블.*

![Table 2: Zero-shot performance on artificial benchmarks](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table02.jpg)
*Table 2: 인위적으로 얕은 상동 서열 환경을 모사한 데이터셋에 대해 Zero-shot 기반 가상 MSA 증강 후 측정한 정확도 변화 테이블.*

![Table 5: Detailed quality metrics on benchmarks](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table05.jpg)
*Table 5: 3가지 벤치마크 데이터셋 상에서의 pTM, GDT_TS, lDDT 품질 평가 상세 지표 비교 테이블.*

---

### 4.2. 생성 정밀화 제어 변수 분석 (MSA 깊이 및 필터링 임계치)
제약 조건을 변화시키며 가상 MSA의 생성 품질과 최적화의 민감도를 심층 분석했습니다.

![MSA Depth and Selection effects](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig04.jpg)
*Figure 4: (a) 생성해 내는 가상 MSA 깊이(Depth)가 8, 16, 32, 64로 늘어남에 따른 최종 예측 구조 성능 추이. (b) RFT 및 Preference 데이터 구축 시 구조 평가 및 유사도 선정 방법(STA, DYN, TM, pLDDT 등)이 학습 성능에 미치는 효과 비교.*

![Table 6: Data source and threshold ablation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table06.jpg)
*Table 6: RFT 단계의 학습 데이터 필터링 임계치 $\theta_1$ 값 및 데이터 공급원 조합 설정에 따른 최종 예측 TM-Score 비교 테이블.*

![Table 7: Threshold theta 2 ablation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table07.jpg)
*Table 7: RFT 데이터셋 필터 시 기존 검색값 대비 상대 개선 효율 임계치인 $\theta_2$ 값에 따른 성능 민감도 비교 테이블.*

![MSA depth distribution and sequence similarity](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig09.jpg)
*Figure 9: (a) 벤치마크 표적들의 실제 데이터베이스 내 상동 서열 분포도. (b) 생성된 가상 상동 서열들이 갖는 시퀀스 유사도 분포 비교.*

---

### 4.3. 아키텍처 요소별 소거법 연구 (Ablation Study)
신경망 내부의 핵심 설계 요소(위치 부호화 변이, 미세조정 방식, 전이 학습 효과)에 대해 정량 분석을 거쳤습니다.

![Positional encoding ablation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig05.jpg)
*Figure 5: 1D-RoPE 변이들(1D-gpt, 1D-2nd, 1D-1st) 대비 이중축을 완벽히 인코딩하는 2D-RoPE(2D-full)가 최종 구조 예측 TM-Score 상에서 갖는 월등한 기여도 분석.*

![Table 3: Selection methods evaluation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table03.jpg)
*Table 3: RFT 및 DPO를 통한 피드백 학습 정렬이 Zero-shot 및 Few-shot 환경 구조 예측을 개선하는 양상 정량 비교 테이블.*

![Table 4: Downstream task transfer learning](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table04.jpg)
*Table 4: MSAGPT의 사전 학습 진화 가중치가 다른 단백질 분석 다운스트림 태스크(Transfer Learning)로 전이되었을 때의 성능 개선 증명 테이블.*

---

### 4.4. 3D 구조 정밀화 및 생성 서열 시각화
실질적으로 개선된 단백질 3차원 구조의 변화 양상과 아미노산 생성 확률 분포를 직관적으로 관찰한 결과입니다.

![pLDDT scores change along optimize iterations](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig10.jpg)
*Figure 10: 최적화 이터레이션 진행에 따라 쿼리 잔기 위치별 신뢰 스코어(pLDDT)가 점진적으로 상승 및 개선되는 정량 곡선 그래프.*

![Structure prediction improvements visualization](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig11.jpg)
*Figure 11: 기존 상동 서열 부실 기법들과 비교하여 참값(Native, 노란색) 대비 구조 왜곡을 극적으로 보정한 3차원 예측 결과 시각화.*

![Virtual MSA vs Natural MSA predictions](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig12.jpg)
*Figure 12: 자연계 검색에서 얻은 빈약한 MSA를 통한 예측 결과(청색)와 MSAGPT의 virtual MSA를 가동해 예측한 결과(자색)를 참값(노란색)과 정렬 비교한 결과.*

![Structure prediction accuracy before and after DPO](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig13.jpg)
*Figure 13: DPO 선호도 최적화를 가하기 이전의 예측 결과(청색)와 DPO 최적화로 물리적 타당성을 이식한 후의 예측 결과(자색) 비교.*

![Residue distribution comparison for 7wme_A](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig14.jpg)
*Figure 14: 표적 단백질 7wme_A에 대해 생성된 가상 MSA의 아미노산 잔기 분포 분석. 붉은 박스 영역은 실제 자연계 상동 서열이 갖는 고유한 서열 변이 패턴을 모델이 매우 정교하게 학습하여 복원했음을 보여줌.*

![Residue distribution comparison for 7sxb_A](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig15.jpg)
*Figure 15: 표적 단백질 7sxb_A에 대해 생성된 가상 MSA의 아미노산 잔기 분포 분석. 자연계 상동 서열 고유의 변이 패턴이 높은 유사도로 복제 및 복원되어 풍부한 공진화 분포를 확보함.*

---

## 5. 결론 및 한계점 (Conclusions & Limitations)

### 5.1. 결론 (Conclusions)
MSAGPT는 단백질 데이터베이스 상동 서열이 부족하여 성능이 하락하는 저-MSA 환경의 3D 구조 예측 한계를 극복하기 위해, 대규모 디코더 LLM 아키텍처에 2차원 진화 정보의 위상을 결합한 2D-RoPE를 제시하고 **AlphaFold2의 구조 평가 피드백(RLAF)을** 통해 진화 접힘 물리 법칙을 효과적으로 내재화시킨 연구입니다. 이는 텍스트 수준의 서열 학습을 넘어 실제 물리적 타당성을 보증하는 바이오 생성 모델 아키텍처의 혁신적인 표준을 수립했습니다.

### 5.2. 한계점 및 향후 과제 (Limitations & Future Directions)
뛰어난 구조 보정 능력에도 불구하고, 실제 필드에 안정적으로 적용하기 위해 극복해야 할 문제들이 존재하며 이는 향후 단백질 생성 모델이 반드시 규명해 나가야 할 핵심적 지평입니다:

#### 1. 추론 연산 복잡도와 메모리 부하의 문제 (Computational Bottleneck)
MSAGPT는 2차원 MSA 데이터를 1차원의 단일 토큰 배열로 직렬화하여 처리합니다. 이로 인해 모델이 처리해야 하는 컨텍스트의 길이는 단백질의 잔기 수 $L$과 디코딩하려는 가상 상동 서열 수 $M$의 곱인 **$L \times M$** 크기로 폭증하게 됩니다. 

* **Quadratic Attention Cost**: 어텐션 연산은 입력 시퀀스 길이에 대해 제곱 스케일인 **$O((L \cdot M)^2)$**의 복잡도를 수반합니다. 예를 들어 잔기 수 400AA인 단백질에 대해 32개 깊이의 MSA를 생성할 경우, 12,800개에 달하는 거대한 토큰 스트림을 연산해야 합니다.
* **VRAM Bottleneck**: 이로 인해 어텐션 소프트맥스 행렬과 KV-Cache가 소모하는 GPU 메모리(VRAM) 및 지연 시간(Latency)이 기하급수적으로 팽창하여, 한 번에 수만 개의 신규 유전자 후보군을 빠르게 발굴하고 처리해야 하는 실시간 대규모 게놈 스크리닝 파이프라인에서 작동하기에는 여전히 컴퓨팅 비용이 매우 높다는 연산상의 한계를 지닙니다.

#### 2. 다중 체인 복합체(Multimer/Complex) 예측으로의 확장 한계
현 구현체는 단일 백본 사슬만 갖는 단량체(Monomer) 단백질 학습에 완전 종속되어 있습니다. 두 개 이상의 독립된 체인이 기하학적으로 결합하여 기능하는 다량체(Complex) 예측으로 본 기법을 확장하려면 차원이 다른 복잡성이 나타납니다:
* **종 매칭 제약 (Species-linking Constraint)**: 이종 복합체(Hetero-multimer) 예측용 MSA를 생성할 때는 임의로 A 사슬 상동 서열과 B 사슬 상동 서열을 엮어 디코딩하면 진화 역사가 완전히 다른 서열 간의 비물리적 도킹을 지시하게 됩니다. 반드시 동일한 숙주 생물종(Species)에서 유래하여 공진화한 유전 쌍끼리만 정확하게 묶어주는 메타 데이터 매칭 제약 조건을 만족해야 합니다.
* **Cross-chain Attention의 부재**: 현 1D 평탄화 배열 및 2D-RoPE 설계로는 각 체인 간의 물리적 헤더 및 결합 계면(Interface)을 동시 정의하는 격자 좌표를 형성할 수 없기 때문에, 체인 간 상호 작용 피처를 명시적으로 인코딩하는 체인-크로스 어텐션 프레임워크로의 전면적인 구조 재설계가 필수적입니다.

#### 3. AlphaFold2 자체 편향의 전이와 복제 (Bias Cascade)
MSAGPT의 두 가지 중추적인 정렬 파이프라인인 RFT와 DPO에서 생성 품질을 규정하는 핵심 평가 기준(Reward Model)은 생물리학적 참값이 아닌 AlphaFold2의 자체 예측 연산 결과인 TM-score 및 pLDDT 점수입니다. 
* **AF2 편향 종속**: 이는 MSAGPT가 AlphaFold2가 잘 정의하는 구형 단백질(Globular protein)의 3D 공간적 분포는 매우 정확하게 학습하지만, 반대로 AlphaFold2가 구조를 잡지 못하는 본질적 결함 영역(예: 고도로 역동적인 천연 무질서 영역, 다중 형태로 전이되는 동적 링커)에 대해서는 학습 피드백 신호 자체가 오염되거나 왜곡되는 심각한 신호 고착 문제를 야기합니다.
* **신뢰도 과대평가 복제**: 피드백 모델의 한계적 취약성(Confidence Bias)이 생성 정책 가중치에 그대로 전이되어, 물리적으로 불완전한 상태인데도 AlphaFold2 신뢰도 지표만 맹신하여 이상 서열을 우대하는 피드백 루프 고착 현상이 발생할 수 있습니다.

#### 4. 완전한 고아 단백질(Strict Orphan Protein)에서의 생성 모호성
Few-shot 프롬프트 가이드를 배치할 수 있는 일반적인 저-MSA 단백질군과 달리, 자연계에 유사 서열이 아예 존재하지 않는 완전한 고아 단백질은 오직 Zero-shot 생성에 의존해야만 합니다.
* **정보 유도 성능 결핍**: 이 경우 1D sequence-wise decoding 흐름 속에 참조할 만한 어떠한 자연계의 보존 피처도 주어지지 않으므로, 2.8B 매개변수가 지니는 일반적인 사전 학습 사전 확률(Prior Probability)만으로 잔기 간 진화 관계를 창조해야 합니다. 이는 생성 다양성이 극도로 제한되거나 무작위 노이즈 서열로 수렴하여 결과적으로 AlphaFold2의 예측력을 회복시키지 못하는 구조적 무능 상태에 도달합니다.
* **대안적 프롬프트의 필요성**: 이를 극복하려면 서열 정보 외에도 2차 구조 예측 템플릿이나 단백질 결합 포켓의 3차원 기하학적 형태 프롬프트(Geometric prompts) 등을 추가 조건(Conditioning)으로 수용할 수 있는 다중 양식(Multi-modal) 프롬프팅 기술로의 진화가 촉구됩니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
