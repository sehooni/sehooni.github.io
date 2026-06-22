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

AlphaFold2의 혁신은 단백질 3차원 구조 예측(Protein Structure Prediction, PSP)의 지평을 완전히 바꾸어 놓았습니다. 그러나 AlphaFold2 아키텍처의 내면을 들여다보면, 입력되는 **다중 서열 정렬(Multiple Sequence Alignment, MSA)**의 풍부함에 절대적으로 의존한다는 중대한 아킬레스건이 존재합니다. 

AlphaFold2는 진화 과정에서 함께 보존(Co-conservation)되며 동시 돌연변이가 발생한 아미노산 잔기 쌍의 패턴을 추적하여 물리적인 거리를 유도합니다. 만약 상동 서열 데이터가 극도로 부족한 **"고아 단백질(Orphan Protein)"**이나 메타게노믹스 유래의 희귀 서열(전체 메타게노믹스 단백질의 약 20%를 차지)을 구조 예측할 경우, 깊이가 얕은 MSA로 인해 AlphaFold2의 구조 정확도는 급격하게 무너집니다.

![Low-MSA Regime Challenge](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/image4.png)
*Figure 1: 진화 서열 검색 데이터가 희소한 고아 단백질(Orphan Protein)에 대해 AlphaFold2의 구조 정확도가 손실되는 문제 분석*

이를 보완하기 위해 가상의 진화 서열을 인위적으로 합성해 내는 생성 AI 기술들이 등장했으나, 기존 방식들은 아미노산 서열 간의 복잡한 2차원 공진화 맥락을 충분히 모사하지 못해 실효성이 떨어졌습니다. 본 논문에서는 대규모 언어 모델(LLM)의 자기회귀(Autoregressive) 생성 기법에 기하/진화 구조 인코딩과 **AlphaFold2의 물리적 피드백**을 융합하여 고품질의 가상 MSA를 증강해 내는 **MSAGPT** (28억 파라미터 크기) 프레임워크를 제안합니다.

---

## 2. 모델 아키텍처 (Model Architecture)

MSAGPT는 다중 서열 정렬(MSA) 행렬을 하나의 2차원 텍스트 시퀀스 프롬프트로 간주하여 학습을 전개합니다. 이를 위해 모델 아키텍처 단에서 다음과 같은 두 가지 수학적 혁신을 도입했습니다.

### 2.1. 2D Evolutionary Rotary Positional Encoding (2D-RoPE)
기존의 Transformer 언어 모델은 1차원 순서만을 반영하는 위치 임베딩(RoPE)을 사용합니다. 하지만 $M \times N$ 크기의 MSA 행렬은 잔기의 순서(가로축, Sequence index $i$)와 진화 사촌 서열 간의 진화 관계(세로축, Evolutionary index $j$)라는 독립된 2차원 위상을 가집니다.

MSAGPT는 가로와 세로 축의 관계를 동시에 포착하기 위해 **Dual-axis 2D-RoPE**를 설계하였습니다. 특정 위치 $(i, j)$의 Query 및 Key 벡터에 가해지는 로터리 변환 행렬 $\mathbf{R}_{2D}(i, j)$는 다음과 같이 텐서곱(Kronecker product)으로 정의됩니다:

$$\mathbf{R}_{2D}(i, j) = \mathbf{R}_{\text{seq}}(i) \otimes \mathbf{R}_{\text{evo}}(j)$$

이 인코딩을 통해 신경망은 특정 아미노산이 몇 번째 잔기에 위치해 있는지뿐만 아니라, 이 상동 서열이 쿼리 서열과 진화적으로 어느 정도 거리에 배치되어 있는지를 다차원적으로 구별하여 학습할 수 있게 됩니다.

![MSAGPT Framework Overview](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/image5.png)
*Figure 2: 2D Evolutionary RoPE 및 1D 오토레그레시브 디코딩에 기반하여 가상 MSA를 생성하는 MSAGPT 아키텍처 아웃라인*

### 2.2. 1D Flattening 및 오토레그레시브 디코딩
2차원 행렬 데이터를 효율적인 LLM 디코더로 처리하기 위해, MSAGPT는 MSA 행렬을 서열 단위로 평탄화(Flattening)하여 1차원 토큰 시퀀스로 나열합니다:

$$\mathbf{S} = [\text{Seq}_1, \text{sep}, \text{Seq}_2, \text{sep}, \dots, \text{Seq}_M]$$

이 나열된 시퀀스를 대상으로 **Next-token-prediction(다음 토큰 예측)** 형태의 오토레그레시브 디코딩을 수행합니다. FlashAttention 및 KV-Cache 기법을 총동원해 대량의 시퀀스 병렬 연산 속도와 효율성을 확보했습니다.

![Autoregressive MSA Decoding](/assets/images/2024-06-28-MSAGPT-generative-pretraining-protein-structure/image7.png)
*Figure 3: 생성 언어 모델(LLM) 기반의 차례대로 토큰을 생성(Next-token-prediction)해 나가는 1D 오토레그레시브 디코더 구조*

- **Zero-Shot 생성**: 오직 대상 쿼리 단백질 서열($\text{Seq}_1$)만을 프롬프트로 던져 무(無)에서부터 정렬 서열들을 차례로 생성해 냅니다.
- **Few-Shot 생성**: 데이터베이스에서 수집한 아주 소수의 불완전한 자연계 상동 서열(예: 3~5개)을 가이드라인 프롬프트로 선제 배치하여 고품질의 진화 서열들을 확장 증강합니다.

---

## 3. 방법론: AlphaFold2 피드백 정렬 (Alignment from Structural Feedback)

단순히 텍스트 차원의 Cross-Entropy 손실만으로 pre-training을 진행하면, 모델이 그럴싸하지만 3D 구조적 모순을 품고 있는 가상 서열(환각, Hallucination)을 생성할 확률이 높습니다. MSAGPT는 이를 방지하기 위해 구조 예측 모델(AlphaFold2)의 물리적 채점 결과를 직접 생성 모델에 환류하는 피드백 학습(Alignment) 기법을 설계했습니다.

### 3.1. Rejective Fine-Tuning (RFT)
1. pre-trained 생성기 모델로부터 다중 가상 MSA 후보들을 무작위 디코딩하여 대량으로 생성해 냅니다.
2. 이 가상 MSA들을 실제로 AlphaFold2에 입력하여 각각 3D 구조를 예측하게 한 뒤, AF2의 자체 신뢰도 지표인 **pLDDT** 점수 및 **TM-score**를 측정합니다.
3. 생성된 MSA 중 오직 AlphaFold2가 매긴 신뢰도 점수가 극적으로 향상(구조가 정밀하게 조밀화됨)되는 우수 가상 MSA 조합만을 엄격히 필터링(Rejection)하여 최종 Supervised Fine-Tuning(SFT) 지도 학습 데이터셋으로 재활용합니다.

![Rejective Fine-Tuning Loop](/assets/images/2024-06-28-MSAGPT-generative-pretuning-protein-structure/image8.png)
*Figure 4: AlphaFold2에 가상 생성된 MSA를 입력하여 획득한 구조 평가 스코어를 기반으로, 좋은 생성 서열만 선별 및 재학습하는 RFT 루프*

### 3.2. Direct Preference Optimization (DPO / RLAF)
더 나아가, 인간 피드백 강화학습을 대체하여 AlphaFold2의 평가 선호도를 생성기에 직접 주입하는 **RLAF (Reinforcement Learning from AlphaFold Feedback)** 단계를 적용했습니다.

동일 서열 입력 $x$에 대해, 더 높은 AF2 구조 스코어를 유도하는 가상 MSA $y_w$ (winning)와 낮은 구조 품질을 야기하는 가상 MSA $y_l$ (losing)의 쌍을 구성하여 DPO 손실 함수를 최적화합니다:

$$\mathcal{L}_{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w | x)}{\pi_{\text{ref}}(y_w | x)} - \beta \log \frac{\pi_\theta(y_l | x)}{\pi_{\text{ref}}(y_l | x)} \right) \right]$$

이 선호도 정렬을 통해 MSAGPT는 단순히 그럴듯한 아미노산 조합이 아닌, **실제 3차원 단백질 접힘 구조를 온전히 지탱하고 3D 기하 정보를 결합해내는 유효한 공진화 진화 패턴**만을 타겟팅하여 생성하도록 정밀 정렬됩니다.

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

MSAGPT는 공진화 정보 탐색 한계로 무너지는 현대 3D 단백질 예측 알고리즘의 장벽을 생성형 pre-training과 DPO 기반 물리 피드백 기술로 영리하게 해소한 기념비적인 연구입니다.

다만, 28억 개의 매개변수 크기를 지닌 거대 언어 모델인 만큼 **생성 추론(Inference) 단계의 GPU 연산 오버헤드와 KV-Cache 메모리 부하**가 상당히 큽니다. 향후 모노머를 넘어 거대한 인터페이스를 가진 단백질-단백질 상호작용(PPI) 복합체의 멀티사슬 MSA를 생성할 수 있도록 모델 차원을 고도화하는 방향이 필요할 것입니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
