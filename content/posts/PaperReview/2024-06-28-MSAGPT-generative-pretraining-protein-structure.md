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
MSAGPT의 사전 학습 단계에서는 대규모 진화 정보를 효과적으로 이식하기 위해 대용량 단백질 데이터베이스로부터 가공된 다중 서열 정렬(MSA) 데이터셋을 활용하였습니다.

![Pre-training dataset profile](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig07.jpg)
*Figure 7: 사전 학습에 활용된 단백질 서열 데이터셋의 서열 길이(Sequence Length) 및 MSA 깊이(MSA Depth) 분포.*

#### 데이터셋 프로파일링 및 데이터 누수 방지 (Data Leakage Mitigation)
사전 학습 코퍼스는 OpenProteinSet의 **Uniclust30 데이터베이스**를 기반으로 하며, HHblits all-against-all 서열 검색을 통해 구축된 **약 1,600만 개의 MSA 파일**로 구성됩니다. 데이터의 분포를 파악하기 위한 **Figure 7**을 보면, 서열 길이(Sequence Length)와 MSA 깊이(MSA Depth)는 생물학적 다양성을 고르게 대변하도록 다양하게 분포하고 있습니다.
* **학습 한계 필터링**: 모델 학습의 안정성과 리소스 효율성을 보장하기 위해 단백질 서열 길이 $L \le 1024$, MSA 깊이 $N \le 64$를 초과하는 데이터는 사전 학습 대상에서 전처리 단계로 제외되었습니다.
* **철저한 데이터 누수(Data Leakage) 차단**: 독립적인 평가 신뢰성을 보장하기 위해 벤치마크 평가 데이터셋(CAMEO, CASP14/15, PDB)에 포함된 타겟 서열 및 이와 **서열 유사도가 90%(0.90) 이상인 서열**을 사전 학습 세트에서 완전히 배제하는 필터링을 수행했습니다. HHblits 검색 결과 검증(유사도 최대 0.89 확인)을 통해 평가 벤치마크에 대한 데이터 오염이 전혀 없음이 증명되었습니다.

![Compute latency and VRAM footprint scaling](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig08.jpg)
*Figure 8: 전체 토큰 길이(서열 길이 $\times$ MSA 깊이) 증가에 따른 추론 지연 시간(Inference Latency) 및 GPU 메모리 점유율(VRAM Footprint)의 스케일링 관계 분포.*

#### 하드웨어 연산량 스케일링 및 지연 시간 분석 (Inference Efficiency)
MSAGPT 아키텍처는 MSA의 2차원 공간적 특징을 보존하면서도 1D 자기회귀 디코딩을 수행하기 때문에, 연산 복잡도는 전체 입력 토큰 크기($L \times M$)에 비례합니다. **Figure 8**은 전체 토큰 길이에 따른 추론 지연 시간(Inference Latency) 및 GPU VRAM 메모리 사용량의 스케일링 경향성을 시각화합니다.
* **FlashAttention-2의 효과**: 일반적인 축 분할 어텐션(Axial Attention)과 달리 1D 평탄화 시퀀스는 FlashAttention-2 기법을 기본적으로 활용할 수 있으므로, 하드웨어 레벨(GPU SRAM/HBM) 연산 속도가 극대화됩니다.
* **KV-Cache를 통한 메모리 선형성**: 디코딩 시 이전에 연산된 토큰들을 메모리에 유지하는 KV-Cache 기술을 통합하여 중복 계산을 완벽히 방지합니다. 그 결과, 전체 토큰 길이가 기하급수적으로 길어지는 상황(예: $L \times M \ge 15,000$ 토큰 이상)에서도 메모리 상승세가 선형적으로 통제되어 28억(2.8B) 파라미터 스케일의 모델에서도 실현 가능한 연산 속도와 안정성을 확보했습니다.

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
MSAGPT는 실제 서열 검색을 통해 획득한 상동 서열이 극히 적은 환경(Low-MSA Regime)에서 기존 구조 예측 및 서열 생성 모델들을 큰 폭으로 압도하는 성능을 보여주었습니다.

![Table 1: Benchmark overall results](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table01.jpg)
*Table 1: 3가지 대표적인 희소 MSA 자연계 단백질 데이터셋에 대해 기존 서열 탐색 엔진 및 다양한 가상 MSA 생성 모델의 구조 예측 TM-Score 비교 테이블.*

#### 자연계 희소 MSA 벤치마크 평가 (Natural MSA-scarce Benchmark)
자연계 데이터베이스 검색을 통한 상동 서열 개수가 20개 미만인 단백질 타겟군(200개 시퀀스; CAMEO 8개, CASP14/15 13개, PDB 179개)을 평가한 **Table 1**의 주요 분석 결과는 다음과 같습니다:
* **기존 기법의 한계**: 검색된 얕은 자연계 MSA만을 사용한 AlphaFold2(AF2 MSA)는 TM-Score 기준 최저 성능을 기록하며 한계를 드러냈습니다. MSA-Augmentor나 EvoGen과 같은 기존 가상 MSA 생성 모델은 AF2 MSA 대비 향상을 보이나 상승 폭이 제한적이었습니다.
* **MSAGPT의 우위**: MSAGPT 프레임워크는 모든 벤치마크에서 타 모델들을 압도하였습니다. 특히 **MSAGPT-DPO** 모델은 자연계 희소 MSA 벤치마크 상에서 기존 검색 기반 AF2 대비 **CAMEO에서 +1.4%, CASP에서 +8.5%, PDB에서 +4.7%**의 TM-Score 향상을 달성했습니다. 이는 데이터베이스상 진화 정보가 부재한 Orphan 단백질이라도 물리적 제약조건을 학습한 생성 모델을 통해 구조 예측을 고정밀하게 활성화(Prompting)할 수 있음을 입증합니다.

![Table 2: Zero-shot performance on artificial benchmarks](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table02.jpg)
*Table 2: 인위적으로 얕은 상동 서열 환경을 모사한 데이터셋에 대해 Zero-shot 기반 가상 MSA 증강 후 측정한 정확도 변화 테이블.*

#### 인위적 희소 MSA 벤치마크 및 Zero-shot 환경 평가
실제 상동 서열 검색 정보를 완전히 차단한 인위적 희소 환경(Artificial MSA-scarce Benchmark, 약 8k 단백질 세트)을 대상으로 Zero-shot MSA 생성을 테스트한 **Table 2**의 분석 결과입니다:
* **Zero-shot 활성화**: 프롬프트 시퀀스(Query Sequence) 단 하나만 제공된 극단적 상황에서도, MSAGPT-DPO는 아미노산 잔기 간의 물리적 거리 관계 및 기본 진화적 제약을 온전히 파악해내며 단일 서열 기반 예측 모델 성능을 대폭 넘어섰습니다.
* **RFT 및 DPO 정렬 효과**: 사전 학습 모델(Base) 대비, 거부 미세조정(RFT) 및 피드백 강화학습(DPO) 정렬 단계를 거치면서 Zero-shot 및 Few-shot 환경 모두에서 예측 성능(TM-Score)이 계단식으로 크게 향상되었습니다.

![Table 5: Detailed quality metrics on benchmarks](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table05.jpg)
*Table 5: 3가지 벤치마크 데이터셋 상에서의 pTM, GDT_TS, lDDT 품질 평가 상세 지표 비교 테이블.*

#### 구조 품질 지표 정밀 비교 및 '신뢰도 과대평가 편향' 분석
TM-Score 외에 GDT_TS, lDDT 및 AlphaFold2의 자체 예측 평가지표인 pTM, pLDDT를 종합 수록한 **Table 5**에서는 흥미로운 성능 지표 괴리가 발견됩니다:
* **참값 지표(TM-Score, GDT_TS, lDDT)의 개선**: DPO 기반 정렬 모델은 실제 3D 좌표 기준 유사도 지표인 TM-Score, GDT_TS, lDDT에서 베이스 모델 대비 일관되게 높은 성적을 거두었습니다.
* **예측 신뢰도 지표(pTM, pLDDT)의 상대적 하락**: 반면, AlphaFold2가 추정하는 pTM 및 pLDDT 점수는 정렬 과정을 거친 모델(RFT, DPO)이 단순 사전 학습(Base) 모델보다 소폭 낮게 나오는 경향이 관찰되었습니다.
* **이유 분석 (Hallucinated Decoys 제거)**: 이는 사전 학습 베이스 모델이 생성한 가상 MSA 중 일부가 AlphaFold2 아키텍처를 교란하는 '환각된 패턴(Linguistically confident but structurally unrealistic decoys)'을 유발하기 때문입니다. AlphaFold2는 이러한 환각 서열에 속아 높은 pLDDT(예측 신뢰도)를 출력하지만, 실제 참값 구조와는 크게 왜곡된 결과를 낳습니다. RFT와 DPO 정렬은 이러한 환각을 유발하는 비물리적 잔기 패턴을 억제하고 실제 3D 접힘에 기여하는 진짜 진화 정보를 생성하도록 모델을 교정하므로, 참값 지표(TM-Score 등)는 올라가고 허황된 신뢰도 지표는 현실화(안정화)되는 것입니다.

---

### 4.2. 생성 정밀화 제어 변수 분석 (MSA 깊이 및 필터링 임계치)
가상 MSA의 생성 규모와 이를 선별하는 필터링 조건에 대해 제어 변수 분석(Ablation Study)을 거쳤습니다.

![MSA Depth and Selection effects](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig04.jpg)
*Figure 4: (a) 생성해 내는 가상 MSA 깊이(Depth)가 8, 16, 32, 64로 늘어남에 따른 최종 예측 구조 성능 추이. (b) RFT 및 Preference 데이터 구축 시 구조 평가 및 유사도 선정 방법(STA, DYN, TM, pLDDT 등)이 학습 성능에 미치는 효과 비교.*

#### 가상 MSA 깊이의 포화 효과 (Figure 4(a))
가상으로 생성하는 상동 서열의 개수(Depth)가 8개에서 64개까지 증가할 때 구조 예측 정확도의 추이를 추적한 결과입니다:
* **진화 신호 희석 (Dilution Effect)**: 생성 깊이가 16개 또는 32개까지 늘어날 때는 유익한 공진화 정보가 누적되며 정확도가 가파르게 상승합니다. 그러나 깊이를 64개 이상으로 설정하는 경우 성능이 정체되거나 오히려 하락하는 경향이 관찰됩니다. 이는 생성 모델의 내재적 노이즈가 과도하게 누적되어, 원래 쿼리 서열이 가진 미세한 물리적 공진화 신호(Co-evolutionary Signals)를 흐리는 희석 효과가 발생하기 때문입니다.

#### 서열 유사도 vs 구조적 친화도 기반 필터링 (Figure 4(b))
생성된 다량의 가상 서열 중 최적의 부분 집합을 필터링해 내는 전략의 우열을 가린 실험입니다:
* **서열 기반 필터링의 비효율성**: 단순히 쿼리 서열과의 서열 유사도가 높은 순으로 정렬하는 정적 유사도(STA-SIM)나 동적 유사도(DYN-SIM) 필터링 방식은 무필터(N/A) 방식보다 성능이 낮거나 유사했습니다. 오히려 쿼리 서열과 거리가 있는 다양성을 보존하는 정적/동적 다양성(STA-DIV, DYN-DIV) 방식이 더 우수한 성과를 보였습니다.
* **3D 구조 기반 친화도(Structure Affinity)의 압도적인 우위**: 가상 서열들을 삽입해 AlphaFold2로 가fold한 뒤, 출력되는 구조 스코어(TM-score, pTM, pLDDT) 순서대로 가상 MSA를 선별하는 전략이 가장 높은 최종 구조 예측 스코어를 보장했습니다. 특히 AlphaFold2의 자체 잔기별 신뢰 점수인 **pLDDT를 기준으로 가상 서열들을 필터링(pLDDT selection)**했을 때, 비물리적 노이즈가 완벽히 거동되어 가장 정밀한 MSA 증강 효과를 보였습니다.

![Table 6: Data source and threshold ablation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table06.jpg)
*Table 6: RFT 단계의 학습 데이터 필터링 임계치 $\theta_1$ 값 및 데이터 공급원 조합 설정에 따른 최종 예측 TM-Score 비교 테이블.*

![Table 7: Threshold theta 2 ablation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table07.jpg)
*Table 7: RFT 데이터셋 필터 시 기존 검색값 대비 상대 개선 효율 임계치인 $\theta_2$ 값에 따른 성능 민감도 비교 테이블.*

#### 데이터 정렬 임계치 민감도 분석 (Table 6, Table 7)
RFT 및 DPO 정렬 파이프라인에서 데이터 필터 조건인 임계치 $\theta_1$, $\theta_2$, $\theta_3$가 훈련 모델의 성능에 미치는 정량적 결과입니다:
* **상대 개선율 임계치 $\theta_2$ (Table 7)**: 단일 서열 구조 예측 대비 MSA 추가 시의 상대적 TM-Score 향상 폭을 규정하는 임계치 $\theta_2$는 0.2에서 최적의 밸런스를 달성했습니다. 만약 임계치를 0.5로 급격하게 높이면 데이터셋의 볼륨이 20% 이상 급감하여 수렴 성능이 오히려 훼손됩니다. 즉, 극소수 정예 데이터로 정밀 조정하는 것과 고품질 데이터의 최소 볼륨을 사수하는 것 사이의 정교한 트레이드오프가 존재합니다.
* **DPO 정렬 데이터 구성 (Table 6)**: 선호도 마진 임계값 $\theta_3$가 커질수록(즉, 승리 서열과 패배 서열 간의 물리적 점수차가 뚜렷할수록) DPO 정책 최적화가 더 명확한 대조를 학습하여 최종 예측 스코어가 증가합니다. 또한 자연계 MSA와 인공 생성 가상 MSA 데이터를 혼용하여 선호도 학습에 투입할 경우 성능이 오히려 하락했습니다. 이는 두 데이터 군의 본질적인 분포 차이(Distribution Heterogeneity)로 인해 DPO 정렬 가중치가 왜곡되기 때문이며, 오직 일원화된 생성 모델 데이터 풀만 정제해 공급해야 최적의 정렬 성능을 낸다는 것을 보여줍니다.

![MSA depth distribution and sequence similarity](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig09.jpg)
*Figure 9: (a) 벤치마크 표적들의 실제 데이터베이스 내 상동 서열 분포도. (b) 생성된 가상 상동 서열들이 갖는 시퀀스 유사도 분포 비교.*

#### 벤치마크의 상동 서열 깊이 및 서열 유사도 스펙트럼 (Figure 9)
* **Figure 9(a)**는 본 연구에서 발굴한 PDB 및 CASP 테스트 셋의 실제 자연계 MSA 검색 깊이의 가시적 분포를 보여주며, 대다수의 어려운 타겟이 20개 미만의 고도로 희소한 진화 계통을 가지고 있음을 보여줍니다.
* **Figure 9(b)**는 MSAGPT가 생성해 낸 가상 상동 서열들과 원래 쿼리 서열 간의 유사성 분포를 보여줍니다. 단순 카피에 치중하지 않고 $40\% \sim 80\%$ 대역의 다양하고 생물학적으로 유의미한 시퀀스 스펙트럼을 폭넓게 복원해 내고 있음을 확인할 수 있습니다.

---

### 4.3. 아키텍처 요소별 소거법 연구 (Ablation Study)
MSAGPT 신경망 아키텍처의 설계 요인들이 진화 정보를 보존하고 학습하는 데 어떠한 기여를 하였는지 정량 분석한 소거법 연구 결과입니다.

![Positional encoding ablation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig05.jpg)
*Figure 5: 1D-RoPE 변이들(1D-gpt, 1D-2nd, 1D-1st) 대비 이중축을 완벽히 인코딩하는 2D-RoPE(2D-full)가 최종 구조 예측 TM-Score 상에서 갖는 월등한 기여도 분석.*

#### 이중축 위치 부호화(2D-RoPE)의 효용성 입증 (Figure 5)
MSA의 위상학적 물리 구조를 모사하기 위해 고안된 변이별 성능 분포 분석 결과입니다:
* **1D GPT Positional Encoding (1D-gpt)**: MSA의 격자 구조에 대한 공간적 이해 없이 단순 단백질 서열들을 이어 붙인 형태로 다뤄져 어텐션 레이어가 공진화 관계를 전혀 규명하지 못했고, 성능이 가장 부실했습니다.
* **1D Column-wise (1D-1st) & Row-wise (1D-2nd) Encoding**: 두 차원 중 하나만을 각각 독립 학습한 변이들은 1D-gpt 대비 큰 도약을 보여줍니다. 특히 동일 residue 위치 내 변이를 나타내는 column-wise (1D-1st) 정보의 인코딩 성능이 row-wise (1D-2nd)보다 눈에 띄게 뛰어났습니다. 이는 단백질 접힘 거리 추정 시 서열의 순서나 유사성 배열보다, 아미노산 부위별 상관관계(Covariance)를 학습하는 것이 결정적으로 기여한다는 구조생물학적 이해와 일치합니다.
* **2D-RoPE (2D-full)**: 두 차원의 기하적 격자 관계를 크로네커 곱(Kronecker Product)을 통해 일체형 위치 좌표로 포착하는 2D-full 아키텍처가 최정상 TM-Score 성능을 획득하며 제안 프레임워크의 완결성을 입증하였습니다.

![Table 3: Selection methods evaluation](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table03.jpg)
*Table 3: RFT 및 DPO를 통한 피드백 학습 정렬이 Zero-shot 및 Few-shot 환경 구조 예측을 개선하는 양상 정량 비교 테이블.*

#### 단계별 미세조정 정렬(Alignment Stages)의 점진적 향상 (Table 3)
* **Pre-train $\rightarrow$ RFT $\rightarrow$ DPO** 단계로의 이행에 따른 성능 추이를 측정한 **Table 3**을 보면, 사전 학습 베이스 모델의 거친 확률 분포에서 RFT(거부 조정)를 통해 환각 노이즈를 걸러내고, 최종 DPO(RLAF)를 활용하여 최적의 AlphaFold2 예측 효율 구조로 모델의 확률 분포를 밀착 정렬시켜 나가는 단계별 최적화의 연속성이 매우 유기적으로 증명됩니다.

![Table 4: Downstream task transfer learning](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/table04.jpg)
*Table 4: MSAGPT의 사전 학습 진화 가중치가 다른 단백질 분석 다운스트림 태스크(Transfer Learning)로 전이되었을 때의 성능 개선 증명 테이블.*

#### 다양한 다운스트림 태스크로의 전이 학습 효과 (Table 4)
단백질의 3D 구조를 정교화하는 과정에서 내재화된 진화 지식이 다른 바이오 생태적 다운스트림 응용 태스크에도 효율적으로 전이(Transfer Learning)되는지 분석한 결과입니다 (MSA Transformer 백본 모델을 기반으로 평가):
* **수행 태스크**: 접촉 지도 예측 (Contact Prediction, CtP), 2차 구조 예측 (Secondary Structure Prediction, SsP), 금속 이온 결합성 분류 (Metal Ion Binding, MIB), 세포 내 위치 예측 (Localization Prediction, LocP).
* **성능 양상**: 단량체 쿼리 단일 서열(Single Sequence)을 활용하여 다운스트림을 수행한 대조군과 비교해 볼 때, MSAGPT-DPO가 생성한 고품질의 가상 MSA 정보를 결합했을 때 대부분의 물리-화학적 예측 정확도가 획기적으로 상승했습니다. 단, LocP(세포 내 정위) 태스크에서는 유의미한 성능 향상이 정체되었는데, 이는 대형 단백질 언어 모델(PLM)의 스케일링 법칙이 세포 전체 수준의 정위나 복잡한 거시적 발현 특성 등 일부 property 예측에서는 둔화한다는 기존 연구 보고와 일치합니다. 이를 제외한 구조/접촉 관련 태스크에서는 압도적 전이 역량을 증명해 보였습니다.

---

### 4.4. 3D 구조 정밀화 및 생성 서열 시각화
학습 정렬 단계에 따른 예측 구조의 실제 복원 양상과 아미노산 생성 확률 변화를 직관적으로 비교·시각화한 내용입니다.

![pLDDT scores change along optimize iterations](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig10.jpg)
*Figure 10: 최적화 이터레이션 진행에 따라 쿼리 잔기 위치별 신뢰 스코어(pLDDT)가 점진적으로 상승 및 개선되는 정량 곡선 그래프.*

#### 최적화 진행에 따른 국소 신뢰도(pLDDT)의 점진적 개선 (Figure 10)
* DPO 정렬 학습이 심화됨에 따라 표적 단백질의 잔기 번호별 AlphaFold2 예측 신뢰 점수(pLDDT)의 변화 양상을 분석한 **Figure 10**을 보면, 학습 초기 대비 후기 스텝으로 갈수록 전체 잔기 영역에 걸쳐 pLDDT 프로파일이 일관되게 상승 및 수렴하는 모습을 확인할 수 있습니다. 특히 초기 모델이 구조를 전혀 잡지 못하던 접힘(Folding) 루프나 터미널 도메인 부분의 스코어가 큰 폭으로 보정됩니다.

![Structure prediction improvements visualization](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig11.jpg)
*Figure 11: 기존 상동 서열 부실 기법들과 비교하여 참값(Native, 노란색) 대비 구조 왜곡을 극적으로 보정한 3차원 예측 결과 시각화.*

#### 기존 생성 기법과의 구조 예측 정밀도 비교 시각화 (Figure 11)
* **Figure 11**은 대표적인 표적 단백질(예: 7mnv_B, 7tdv_B, 7ywg_B 등)을 대상으로 Native 구조(노란색) 대비 EvoGen, MSA-Augmentor, MSAGPT의 3D 예측 결과를 중첩하여 시각화한 결과입니다.
* 기존 모델들은 복잡한 베타 시트 구조가 무너지거나 긴 알파 나선 영역이 꺾이는 예측 오류를 다수 보인 반면, MSAGPT-DPO의 예측 구조(보라색)는 복잡한 헤어핀 및 루프 구간까지 Native 구조에 매우 밀착하여 정렬(최대 0.90에 근접하는 국소 TM-Score 기록)되는 압도적인 3D 복원도를 보였습니다.

![Virtual MSA vs Natural MSA predictions](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig12.jpg)
*Figure 12: 자연계 검색에서 얻은 빈약한 MSA를 통한 예측 결과(청색)와 MSAGPT의 virtual MSA를 가동해 예측한 결과(자색)를 참값(노란색)과 정렬 비교한 결과.*

#### 빈약한 자연계 MSA vs MSAGPT 가상 MSA 구조 비교 (Figure 12)
* 자연계 검색으로는 매우 단편적이고 파편화된 상동 서열(20개 이하)만 얻어져 예측 구조가 형편없이 왜곡·찌그러진 대조군(Figure 12의 청색)과 비교하여, MSAGPT가 생성해 낸 고밀도 가상 MSA를 결합하여 예측한 구조(보라색)는 Native(노란색)의 실제 백본 곡률과 잔기 패킹(Residue Packing)을 극도로 모사하여 정밀 재구성해 내는 양상을 극명하게 보여줍니다.

![Structure prediction accuracy before and after DPO](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig13.jpg)
*Figure 13: DPO 선호도 최적화를 가하기 이전의 예측 결과(청색)와 DPO 최적화로 물리적 타당성을 이식한 후의 예측 결과(자색) 비교.*

#### DPO 최적화 전후의 구조 복원도 개선 (Figure 13)
* RFT만 적용했을 때의 예측 구조(Figure 13의 청색)는 대략적인 방향성은 잡았으나 국소 결합 잔기들의 물리적 충돌과 왜곡이 남아 있던 반면, RLAF(DPO) 정렬을 완료한 후의 예측 구조(보라색)는 물리적 결합 제약조건과 잔기 간 거리 분포가 완벽히 보정되어 Native 결합 면을 매끄럽게 재현해 냅니다.

![Residue distribution comparison for 7wme_A](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig14.jpg)
*Figure 14: 표적 단백질 7wme_A에 대해 생성된 가상 MSA의 아미노산 잔기 분포 분석. 붉은 박스 영역은 실제 자연계 상동 서열이 갖는 고유한 서열 변이 패턴을 모델이 매우 정교하게 학습하여 복원했음을 보여줌.*

![Residue distribution comparison for 7sxb_A](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/fig15.jpg)
*Figure 15: 표적 단백질 7sxb_A에 대해 생성된 가상 MSA의 아미노산 잔기 분포 분석. 자연계 상동 서열 고유의 변이 패턴이 높은 유사도로 복제 및 복원되어 풍부한 공진화 분포를 확보함.*

#### 생성 서열의 국소 잔기 분포 및 진화 패턴 복원도 분석 (Figure 14, Figure 15)
DPO 튜닝이 단순 아미노산 문맥 매칭을 넘어, 실제 생물학적인 '진화 변이 분포'를 물리적 타당성에 맞게 창조하는지 Sequence Logo로 입증한 결과입니다.
* **표적 7wme_A (Figure 14)**: 붉은색 점선으로 강조된 영역(특히 잔기 43, 53, 71-79, 105-111, 122, 132, 157-166 부위)의 아미노산 알파벳 출현 빈도를 자연계 상동 서열과 비교해 볼 때, MSAGPT-DPO는 자연적 보존성(Conservation)과 상관 변이(Covariation) 유형을 거의 일치하게 재현했습니다.
* **표적 7sxb_A (Figure 15)**: 잔기 22-27, 53, 73 영역에서 관찰되는 고유 변이 패턴 역시 DPO 정렬을 거친 생성 서열에서 아주 높은 통계적 유사도로 복제되었습니다. 이는 모델이 단순히 그럴듯한 아미노산의 나열을 무작위 복사하는 것이 아니라, AlphaFold2의 피드백 신호를 역전파받아 **"3D 결합 상호작용을 파괴하지 않고 진화 과정에서 허용될 수 있는 아미노산 변이의 확률적 반경"을 수학적으로 내재화**하였음을 완벽히 증명해 줍니다.

---

## 5. 결론 및 한계점 (Conclusions & Limitations)

### 5.1. 결론 (Conclusions)
MSAGPT는 단백질 데이터베이스 상동 서열이 부족하여 성능이 하락하는 저-MSA 환경의 3D 구조 예측 한계를 극복하기 위해, 대규모 디코더 LLM 아키텍처에 2차원 진화 정보의 위상을 결합한 2D-RoPE를 제시하고 **AlphaFold2의 구조 평가 피드백(RLAF)을** 통해 진화 접힘 물리 법칙을 효과적으로 내재화시킨 연구입니다. 이는 텍스트 수준의 서열 학습을 넘어 실제 물리적 타당성을 보증하는 바이오 생성 모델 아키텍처의 혁신적인 표준을 수립했습니다.

---

### 5.2. 한계점 및 향후 과제 (Limitations & Future Directions)
뛰어난 구조 보정 능력에도 불구하고, MSAGPT를 실제 바이오/신약 개발 파이프라인에 안정적으로 탑재하기 위해 극복해야 할 한계점들이 존재하며, 이는 향후 AI 기반 분자 생물학 연구가 규명해야 할 지평입니다.

> [!CAUTION]
> #### 1. 추론 연산 복잡도와 메모리 부하 (Computational Bottleneck)
> MSAGPT는 2차원 MSA 데이터를 1차원의 단일 토큰 배열로 직렬화하여 처리합니다. 이로 인해 모델이 처리해야 하는 컨텍스트의 길이는 단백질의 잔기 수 $L$과 디코딩하려는 가상 상동 서열 수 $M$의 곱인 **$L \times M$** 크기로 폭증하게 됩니다.
> * **시간 복잡도**: 어텐션 연산은 입력 시퀀스 길이에 대해 제곱 스케일인 **$O((L \cdot M)^2)$**의 복잡도를 수반합니다. 예컨대 400AA 단백질에 대해 32개 깊이의 가상 MSA를 생성하려면 12,800 토큰을 연산해야 합니다.
> * **메모리 병목**: FlashAttention-2와 KV-Cache로 메모리 상승세를 제어하더라도, 대형 스크리닝 파이프라인(실시간 수만 개 유전자 처리)에 올리기에는 여전히 GPU VRAM 점유율과 추론 시간 비용이 높습니다. 향후 선형 어텐션(Linear Attention)이나 상태 공간 모델(SSM; Mamba 등)의 도입이 요구됩니다.

> [!WARNING]
> #### 2. 다중 체인 복합체(Multimer/Complex) 예측으로의 확장성 결여
> 현 구현체는 단일 백본 사슬만 갖는 단량체(Monomer) 단백질 학습에 완전 종속되어 있습니다. 복수 체인이 결합하는 복합체(Multimer) 구조 예측으로 확장하기엔 아래의 제약이 있습니다.
> * **종 매칭 제약 (Species-linking Constraint)**: 이종 복합체(Hetero-multimer) 예측용 MSA를 생성할 때는 임의로 A 사슬 상동 서열과 B 사슬 상동 서열을 엮어 디코딩하면 안 되며, 반드시 동일한 숙주 생물종(Species)에서 유래하여 공진화한 유전 쌍끼리만 정확하게 묶어주는 메타 데이터 매칭 제약 조건을 만족해야 합니다.
> * **Cross-chain 어텐션 부재**: 현 1D 평탄화 배열 및 2D-RoPE 설계로는 각 체인 간의 물리적 결합 계면(Interface)을 동시 정의하는 격자 좌표를 형성할 수 없으므로, 체인 간 상호 작용 피처를 인코딩하는 체인-크로스 어텐션 프레임워크로의 전면적인 구조 재설계가 필수적입니다.

> [!IMPORTANT]
> #### 3. AlphaFold2 자체 편향의 전이와 복제 (Bias Cascade & Confidence Bias)
> MSAGPT의 두 가지 중추적인 정렬 파이프라인인 RFT와 DPO에서 생성 품질을 규정하는 핵심 평가 기준(Reward Model)은 생물리학적 참값(Native structure)이 아닌 AlphaFold2의 자체 예측 연산 결과인 TM-score 및 pLDDT 점수입니다.
> * **AF2 결함 영역 전이**: 이는 MSAGPT가 AlphaFold2가 잘 정의하는 구형 단백질(Globular protein)의 3D 공간적 분포는 매우 정확하게 학습하지만, 반대로 AlphaFold2가 구조를 잡지 못하는 본질적 결함 영역(예: 고도로 역동적인 천연 무질서 영역, 다중 형태로 전이되는 동적 링커)에 대해서는 학습 피드백 신호 자체가 오염되거나 왜곡되는 심각한 신호 고착 문제를 야기합니다.
> * **신뢰도 과대평가 복제**: 피드백 모델의 한계적 취약성이 생성 정책 가중치에 그대로 전이되어, 물리적으로 불완전한 상태인데도 AlphaFold2 신뢰도 지표만 맹신하여 이상 서열을 우대하는 피드백 루프 고착 현상이 발생할 수 있습니다.

> [!NOTE]
> #### 4. 완전한 고아 단백질(Strict Orphan Protein)에서의 생성 모호성
> Few-shot 프롬프트 가이드를 배치할 수 있는 일반적인 저-MSA 단백질군과 달리, 자연계에 유사 서열이 아예 존재하지 않는 완전한 고아 단백질은 오직 Zero-shot 생성에 의존해야만 합니다.
> * **정보 유도 성능 결핍**: 이 경우 1D sequence-wise decoding 흐름 속에 참조할 만한 어떠한 자연계의 보존 피처도 주어지지 않으므로, 2.8B 매개변수가 지니는 일반적인 사전 학습 사전 확률(Prior Probability)만으로 잔기 간 진화 관계를 창조해야 합니다. 이는 생성 다양성이 극도로 제한되거나 무작위 노이즈 서열로 수렴하여 결과적으로 AlphaFold2의 예측력을 회복시키지 못하는 구조적 무능 상태에 도달합니다.
> * **대안적 프롬프트의 필요성**: 이를 극복하려면 서열 정보 외에도 2차 구조 예측 템플릿이나 단백질 결합 포켓의 3차원 기하학적 형태 프롬프트(Geometric prompts) 등을 추가 조건(Conditioning)으로 수용할 수 있는 다중 양식(Multi-modal) 프롬프팅 기술로의 진화가 촉구됩니다.

> [!IMPORTANT]
> #### 5. 파라미터 스케일링 법칙(Scaling Law) 검증 부재 및 데이터베이스 오염 위험 (Social Impact)
> * **스케일링 법칙 검증**: MSAGPT 연구는 2.8B 파라미터 모델을 기본으로 제안되었으나, 모델 파라미터 크기, 학습 데이터 양, 그리고 소모 연산량 간의 비례 법칙(Scaling Laws)이 바이오 MSA 생성 도메인에서도 LLM처럼 일관되게 성립하는지에 대해 추가 검증이 필요합니다.
> * **데이터베이스 오염 가능성 (Contamination Risk)**: 고도의 물리적 타당성을 갖는 가상 MSA가 공공 서열 데이터베이스(UniProt, UniRef 등)에 필터링 없이 대량 수집될 경우, 자연적 진화 역사의 흔적을 추적하는 진화 계통 연구 데이터의 순수성을 교란시킬 수 있습니다. 따라서 가상 생성 MSA를 식별해 내는 분류기(Classifier) 개발 연구가 병행되어야 합니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
