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
last_modified_at: 2024-06-28T15:30:00-17:00:00
classes: wide
---

* **Paper Title**: [MSAGPT: Neural Prompting Protein Structure Prediction via MSA Generative Pre-Training](https://arxiv.org/abs/2406.05347)
* **Authors**: Bo Chen, Zhilei Bei, Xingyi Cheng, Pan Li, Jie Tang, and Le Song
* **Journal/Conference**: NeurIPS 2024 (arXiv:2406.05347)
* **DOI**: [10.52202/079017-1184](https://arxiv.org/abs/2406.05347)

---

## 1. 서론 (Introduction)

AlphaFold2의 혁신은 단백질 3차원 구조 예측(Protein Structure Prediction, PSP)의 지평을 완전히 바꾸어 놓았습니다. 그러나 AlphaFold2 아키텍처의 내면을 들여다보면, 입력되는 **다중 서열 정렬(Multiple Sequence Alignment, MSA)의** 풍부함에 절대적으로 의존한다는 중대한 아킬레스건이 존재합니다. 

AlphaFold2는 진화 과정에서 함께 보존(Co-conservation)되며 동시 돌연변이가 발생한 아미노산 잔기 쌍의 패턴을 추적하여 물리적인 거리를 유도합니다. 만약 상동 서열 데이터가 극도로 부족한 **"고아 단백질(Orphan Protein)"이나** 메타게노믹스 유래의 희귀 서열(전체 메타게노믹스 단백질의 약 20%를 차지)을 구조 예측할 경우, 깊이가 얕은 MSA로 인해 AlphaFold2의 구조 정확도는 급격하게 무너집니다.

![Low-MSA Regime Challenge](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/image4.png)
*Figure 1: 진화 서열 검색 데이터가 희소한 고아 단백질(Orphan Protein)에 대해 AlphaFold2의 구조 정확도가 손실되는 문제 분석*

이를 보완하기 위해 가상의 진화 서열을 인위적으로 합성해 내는 생성 AI 기술들이 등장했으나, 기존 방식들은 아미노산 서열 간의 복잡한 2차원 공진화 맥락을 충분히 모사하지 못해 실효성이 떨어졌습니다. 본 논문에서는 대규모 언어 모델(LLM)의 자기회귀(Autoregressive) 생성 기법에 기하/진화 구조 인코딩과 **AlphaFold2의 물리적 피드백**을 융합하여 고품질의 가상 MSA를 증강해 내는 **MSAGPT** (28억 파라미터 크기) 프레임워크를 제안합니다.

---

## 2. 모델 아키텍처 (Model Architecture)

MSAGPT는 다중 서열 정렬(MSA) 행렬을 단순한 2차원 문자 배열이 아닌, 잔기 위치(가로축)와 진화적 깊이(세로축)라는 두 가지 독립된 위상을 갖는 고도로 구조화된 2차원 데이터 객체로 취급합니다. 28억 개(2.8B)의 매개변수를 지닌 대규모 디코더 전용(Decoder-only) Transformer 아키텍처를 기반으로 하며, 이 복잡한 2D 공진화 패턴을 포착하기 위해 다음과 같은 두 가지 핵심 기술적 돌파구를 도입했습니다.

### 2.1. 2D Evolutionary Rotary Positional Encoding (2D-RoPE)

일반적인 1차원 자연어 처리용 LLM에 사용되는 로터리 위치 임베딩(RoPE)은 문장의 순서 정보만을 보존합니다. 그러나 MSA 데이터는 다음과 같은 독특한 2차원 구조적 특징을 지닙니다:
- **서열 축 (Sequence Axis, 가로축 $i$):** 단백질 서열 내에서 아미노산 잔기가 몇 번째 위치에 있는지를 나타냅니다. (아미노산 간의 물리적 거리와 2차/3차 구조적 인접성에 직접 영향)
- **진화 축 (Evolutionary Axis, 세로축 $j$):** 정렬된 상동 서열들이 쿼리 서열(Query Sequence)로부터 진화적으로 얼마나 떨어져 배치되었는지를 나타냅니다. (진화적 변이 및 보존 정도를 판별)

만약 이를 단순 1차원 임베딩으로 처리하면, 신경망은 '아미노산 잔기의 위치'와 '상동 서열의 깊이'를 혼동하여 공진화(Co-evolution) 관계를 학습하지 못하게 됩니다. 이를 해결하기 위해 MSAGPT는 가로와 세로 축의 기하학적 관계를 동시에 인코딩하는 **이중축 2D-RoPE (Dual-axis 2D-RoPE)를** 설계하였습니다.

특정 위치 $(i, j)$의 Query ($q$) 및 Key ($k$) 벡터에 가해지는 2차원 로터리 회전 변환 행렬 $\mathbf{R}_{2D}(i, j)$는 가로축 변환 $\mathbf{R}_{\text{seq}}(i)$와 세로축 변환 $\mathbf{R}_{\text{evo}}(j)$의 **크로네커 곱(Kronecker Product, $\otimes$)을** 통해 계산됩니다:

$$
\mathbf{R}_{2D}(i, j) = \mathbf{R}_{\text{seq}}(i) \otimes \mathbf{R}_{\text{evo}}(j)
$$

이 2차원 인코딩을 적용하면 Attention 연산 시 특정 잔기 쌍의 유사도(Score)가 두 잔기의 시퀀스 상의 거리와 상동 서열 간의 진화적 거리 모두에 종속되어 계산됩니다. 결과적으로 모델은 단백질 서열의 진화적 보존 및 동시 돌연변이 패턴(Covariation)을 다차원적으로 구별하여 온전히 보존된 형태로 학습할 수 있게 됩니다.

![MSAGPT Framework Overview](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/image5.png)
*Figure 2: 2D Evolutionary RoPE 및 1D 오토레그레시브 디코딩에 기반하여 가상 MSA를 생성하는 MSAGPT 아키텍처 아웃라인*

### 2.2. 1D 평탄화 및 자기회귀 디코딩 (1D Flattening & Autoregressive Decoding)

2차원 정렬 행렬 데이터를 기존의 효율적인 디코더 전용 Transformer 연산 최적화 인프라에 통합하기 위해, MSAGPT는 $M \times N$ 크기의 MSA 행렬을 다음과 같이 **서열 단위 평탄화(Sequence-wise Flattening)를** 거쳐 1차원 토큰 스트림 $\mathbf{S}$로 변환합니다:

$$
\mathbf{S} = [\text{Seq}_1, \langle\text{sep}\rangle, \text{Seq}_2, \langle\text{sep}\rangle, \dots, \langle\text{sep}\rangle, \text{Seq}_M]
$$

여기서 $\text{Seq}_1$은 구조 예측 대상인 쿼리 단백질 서열(Query Sequence)이며, $\langle\text{sep}\rangle$는 상동 서열 간의 경계를 구분하는 특수 토큰(Separator Token)입니다.
1차원으로 펼쳐진 토큰 스트림 상에서 모델은 이전 토큰들이 주어졌을 때 다음 아미노산 토큰을 예측하는 **다음 토큰 예측(Next-Token Prediction)** 방식의 자기회귀(Autoregressive) 최적화를 수행합니다.

이때, 매우 길어지는 컨텍스트 길이로 인한 연산량 및 메모리 폭증 문제를 해결하기 위해 **FlashAttention-2**를 전면 도입하여 하드웨어 효율을 극대화했으며, 추론 단계에서는 키-값 캐싱(**KV-Cache**) 기법을 적용하여 생성 지연 시간(Latency)을 단축했습니다.

이러한 유연한 1차원 디코딩 형태 덕분에 모델은 상황에 따라 다양한 방식의 프롬프팅 지시(In-Context Learning)를 수행할 수 있습니다:
- **Zero-Shot 생성**: 프롬프트로 쿼리 서열 $\text{Seq}_1$과 경계 토큰만을 입력한 후, 무(無)의 상태에서 진화적으로 유효한 가상 상동 서열들을 순차적으로 디코딩해 냅니다.
- **Few-Shot 생성**: 검색을 통해 획득한 소수의 부실하고 얕은 자연계 상동 서열들(예: 2~5개)을 프롬프트 앞단에 가이드라인 서열로 선제 배치하여, 이 진화적 흐름을 모방 및 확장하는 고품질의 MSA 시퀀스를 뒤이어 확장 증강해 냅니다.

![Autoregressive MSA Decoding](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/image7.png)
*Figure 3: 생성 언어 모델(LLM) 기반의 차례대로 토큰을 생성(Next-token-prediction)해 나가는 1D 오토레그레시브 디코더 구조*

---

## 3. 방법론: AlphaFold2 피드백 정렬 (Alignment from Structural Feedback)

아미노산 서열 텍스트 데이터의 언어적 확률 분포만을 학습(MLE 기반 Pre-training)하면, 생성 모델은 통계적으로 그럴싸해 보이지만 실제 3차원 공간 상에서는 접힐 수 없는 모순된 서열(환각, Hallucination)을 생성하기 쉽습니다. 

MSAGPT는 단순히 서열 텍스트의 정합성을 넘어 실제 3D 접힘 물리(3D Folding Physics)를 준수하도록 유도하기 위해, 단백질 구조 예측 소프트웨어(AlphaFold2)의 예측 신뢰도를 피드백으로 직접 모델 최적화에 환류시키는 **구조적 피드백 정렬(Alignment from Structural Feedback, RLAF)** 기법을 수립했습니다.

### 3.1. 거부 미세 조정 (Rejective Fine-Tuning, RFT)

가장 직관적인 피드백 루프는 고품질의 생성 서열만을 필터링하여 재학습에 사용하는 거부 미세 조정(Rejective Fine-Tuning) 단계입니다.

1. **가상 MSA 풀 생성**: Pre-trained MSAGPT 모델로부터 동일 쿼리 서열 $x$에 대해 다양한 샘플링 기법(Nucleus Sampling 등)을 가동하여 수천 개의 가상 MSA 후보들을 무작위 생성합니다.
2. **구조 신뢰도 평가**: 생성된 가상 MSA들을 AlphaFold2(AF2) 파이프라인에 주입하여 각각 3차원 구조 예측을 수행합니다. 이때 AF2가 출력하는 잔기별 신뢰도 지표인 **pLDDT** 점수와 전체 글로벌 위상 유사도 지표인 **TM-score**를 수집합니다.
3. **선별적 데이터셋 재구축**: 무작위 결합에 의해 생성된 가상 MSA 중, AlphaFold2의 구조 예측 TM-score가 사전에 설정한 임계값(예: TM-score > 0.70)을 초과하거나 기존 자연계 MSA 검색 대비 구조 정확도가 대폭 향상된 **우수 생성 서열 조합**만을 선택(Accept)하고 나머지는 폐기(Reject)합니다.
4. **SFT 재학습**: 이렇게 필터링된 고품질의 가상 MSA 데이터셋만을 활용하여 MSAGPT를 지도 미세 조정(Supervised Fine-Tuning)함으로써, 모델이 자연스럽게 높은 구조적 가치를 지닌 진화 서열들을 생성하도록 유도합니다.

![Rejective Fine-Tuning Loop](/assets/images/2024-06-28-MSAGPT-generative-pretuning-protein-structure/image8.png)
*Figure 4: AlphaFold2에 가상 생성된 MSA를 입력하여 획득한 구조 평가 스코어를 기반으로, 좋은 생성 서열만 선별 및 재학습하는 RFT 루프*

### 3.2. Direct Preference Optimization (DPO / RLAF)

더욱 엄밀하고 촘촘한 물리적 정렬을 위해, MSAGPT 연구진은 인간 피드백 강화학습(RLHF)의 한계를 보완한 **Direct Preference Optimization (DPO)** 기법을 **RLAF (Reinforcement Learning from AlphaFold Feedback)** 단계로 이식했습니다.

기존 강화학습 기법은 별도의 보상 모델(Reward Model)을 정의하고 PPO(Proximal Policy Optimization) 알고리즘을 수행해야 하므로 훈련 과정이 매우 불안정하고 비용이 컸습니다. 반면 DPO는 수학적 트릭을 통해 생성 정책 네트워크의 예측 확률 비율 자체로 보상 스코어를 대체하여 직접 손실 함수를 계산합니다.

특정 쿼리 단백질 서열 $x$에 대해, 더 높은 AF2 TM-score를 유도한 가상 MSA $y_w$ (winning/preferred)와 구조적 정밀도가 낮거나 찌그러진 모델을 야기한 가상 MSA $y_l$ (losing/rejected)의 쌍을 묶어 선호도 학습 데이터셋을 정의합니다. DPO 손실 함수는 다음과 같이 정의됩니다:

$$
\mathcal{L}_{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w | x)}{\pi_{\text{ref}}(y_w | x)} - \beta \log \frac{\pi_\theta(y_l | x)}{\pi_{\text{ref}}(y_l | x)} \right) \right]
$$

- $\pi_\theta(y | x)$: 현재 최적화 중인 MSAGPT 정책 모델의 생성 확률
- $\pi_{\text{ref}}(y | x)$: SFT 단계를 마친 기준(Reference) 모델의 생성 확률
- $\beta$: 기준 정책으로부터 학습이 급격히 벗어나지 않도록 통제하는 쿨백-라이블러(KL) 다이버전스 페널티 조율 계수
- $\sigma$: 시그모이드(Sigmoid) 활성화 함수

이 DPO 목적함수를 최소화함으로써, MSAGPT는 단순히 텍스트적으로 어울리는 아미노산 서열이 아닌, **3차원 공간 상에서 안정적인 상호작용과 결합 물리(Co-evolutionary contacts)를 완벽히 충족하는 고품질 공진화 서열의 발현 확률을 극대화**하도록 정밀 튜닝됩니다.

![Direct Preference Optimization (DPO)](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/image9.png)
*Figure 5: 선호도 정렬 기법(DPO)을 단백질 가상 서열 생성 모델(MSAGPT)에 확장 적용하여 AF2 스코어를 직접 최적화하는 구조*

---

## 4. 결과 및 분석 (Results & Analysis)

MSAGPT는 CAMEO, CASP15 벤치마크 및 고아 단백질 데이터들을 기반으로 정교한 성능 검증을 마쳤습니다.

- **구조 예측 성능 향상**: 상동 서열이 극히 부족한 저-MSA 표적 및 고아 단백질 환경에서, 기존의 MSA-Augmenter 등 대조군 증강 방식들과 비교했을 때 TM-Score 기준 최대 **+8.5%**의 눈부신 성능 향상을 보이며 AlphaFold2의 고사 상태를 완벽히 치유했습니다.

![Structure prediction scores chart](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/image10.png)
*Figure 6: 대조군 생성 모델들과 비교한 CAMEO/CASP 벤치마크 상의 TM-Score 개선 성과 데이터*

- **Few-Shot 맥락 효과 분석**: 쿼리 단백질 서열 하나만 던지는 Zero-shot에 비해, 검색으로 찾은 소수의 부실한 자연계 서열을 1~5개 프롬프트로 추가 배치할 경우 생성된 MSA의 품질과 최종 3D 구조 정밀도가 지수함수적으로 증가하는 우수한 프롬프트 엔지니어링 성능이 관찰되었습니다.

![Zero-shot vs Few-shot comparisons](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/image12.png)
*Figure 7: 쿼리 서열의 자연 검색 크기(Few-shot context size)에 따른 MSAGPT의 상대적 스코어 증가량 그래프*

---

## 5. 결론 및 토의 (Conclusions)

### 5.1. 결론 (Conclusions)

MSAGPT는 생물학적 데이터 검색(Database Search)의 한계로 인해 깊이가 얕고 부실해지는 MSA 입력 환경에서 현대 3D 구조 예측 파이프라인(AlphaFold2 등)이 겪는 치명적인 성능 저하 문제를 생성 언어 모델(LLM)과 물리 피드백 기술로 명쾌하게 극복해 낸 기념비적인 연구입니다. 

특히 단백질의 2차원 진화적 위상을 고려한 2D-RoPE의 도입과, 단순 서열 모방을 넘어 3D 물리 정보를 내재화할 수 있도록 설계된 Direct Preference Optimization(DPO) 정렬 기법은 향후 분자 진화 및 생체 고분자 생성 모델 분야에 있어 중요한 아키텍처적 표준을 제시합니다.

### 5.2. 한계점 및 향후 과제 (Limitations & Future Directions)

하지만 성공적인 성능 증명에도 불구하고, 실무 적용을 위해 극복해야 할 과제들이 산재해 있습니다:

1. **극심한 추론 연산 오버헤드 (Inference Latency & KV-Cache footprint):** MSAGPT는 2.8B 크기의 거대 모델인 데다가, 2차원 MSA 데이터를 1차원으로 길게 풀어 헤쳐 입력받기 때문에 컨텍스트 길이가 잔기 수 $L$과 상동 서열 수 $M$의 곱인 $L \times M$ 스케일로 폭증합니다. 이로 인해 Attention 연산량과 GPU VRAM의 KV-Cache 메모리 부하가 기하급수적으로 커져 실시간 대규모 서열 스크리닝 파이프라인에 활용하기에는 자원 소모가 매우 큽니다.
2. **단백질 다량체(Complex/Multimer) 확장 한계**: 현재 프레임워크는 단일 사슬 모노머(Monomer) 단백질의 MSA 생성을 표적으로 훈련되었습니다. 두 개 이상의 단백질 체인이 서로 물리적으로 결합하는 복합체(Complex) 구조 예측을 위해서는 체인 간 종(Species) 매칭 관계와 복합체 공동 진화 정보(Inter-chain co-evolution)가 동시 고려된 가상 MSA를 생성해야 하므로, 향후 다중 체인 링커 토큰 매핑 및 크로스-체인 Attention 설계 연구가 수반되어야 합니다.
3. **피드백 모델(AlphaFold2) 편향에 대한 종속성**: DPO 학습 단계에서 선호도를 매기는 절대적인 채점관이 AlphaFold2의 자체 계산 예측값(TM-score 및 pLDDT)이기 때문에, AF2가 지니는 내재적인 구조적 취약점이나 특정 단백질 패밀리에 대한 편향(Bias)이 생성 모델인 MSAGPT에 고스란히 복제 및 누적(Bias cascade)될 가능성이 큽니다.
4. **완전 고아 단백질(Strict Orphan Protein)에서의 한계**: 자연계에 상동 서열이 아예 존재하지 않는 완전 고아 단백질의 경우, Few-shot 프롬프트 가이드라인을 제공할 수 없어 오직 Zero-shot 생성에만 의존해야 합니다. 이때 모델이 진화적 맥락 정보 없이 의미 있는 공진화 패턴을 무에서 유로 유도해 내는 것은 여전히 확률적으로 어려우며 생성 다양성이 한계에 부딪힐 수 있습니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
