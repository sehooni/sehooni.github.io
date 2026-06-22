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

**고리형 펩타이드(Cyclic Peptide)**는 일반적인 선형(Linear) 단백질과 달리 서열의 양 끝단(N-term & C-term)이 공유결합으로 이어져 폐쇄 고리(Closed loop)를 형성하거나, 사슬 내부의 시스테인들이 결합하여 원형 위상(Topology)을 가지는 펩타이드 군입니다. 

이러한 고리 구조는 선형 펩타이드에 비해 약리학적으로 거대한 강점을 지닙니다:
- **구조적 강성(Rigidity) 유지**: 타깃 표적 단백질에 대한 결합 친화도(Affinity)와 특이성(Selectivity)이 극대화됩니다.
- **체내 안정성**: 세포 내 단백질 분해 효소(Proteases)의 절단 반응에 강인하여 반감기가 길어 차세대 신약 스캐폴드(Scaffold)로 각광받고 있습니다.

그러나 AlphaFold를 비롯한 현대의 딥러닝 기반 단백질 구조 예측 모델들은 "서열이 선형적으로 늘어서 있다"는 전제 하에 학습을 진행했습니다. 즉, 아미노산 잔기 $i$와 $j$ 사이의 서열상 인덱스 차이 $|i-j|$를 위치 임베딩(Positional Encoding)으로 그대로 사용합니다. 

이 선형 위치 인코딩 하에서는 고리의 1번 아미노산과 마지막 아미노산 $N$이 실제 물리적으로는 바로 옆에 인접해 연결되어 있음에도, 신경망 내에서는 $N-1$만큼 멀리 떨어진 관계로 왜곡되어 인식됩니다. 이 모순으로 인해 AlphaFold 계열 모델에 고리형 펩타이드 서열을 넣으면 고리 형태를 형성하지 못하고 억지로 길게 늘여 뺀 선형(linear) 구조를 뱉는 치명적인 오차가 발생합니다. 

본 논문에서는 물리적 공유결합 연결 관계에 기반한 그래프 최단 경로를 위치 매트릭스로 변환하여 이 한계를 깔끔하게 극복한 **HighFold** 모델에 대해 리뷰합니다.

---

## 2. 모델 아키텍처 및 핵심 이론 (Model Architecture & Core Theory)

HighFold는 인위적인 강제 고리 링커를 추가하거나 좌표를 직접 구부리는 사후 처리 방식 대신, AlphaFold2의 신경망 전단부(Positional Encoding)를 순환 기하 구조에 맞추어 재설계하는 우아한 접근법을 취합니다.

![Linear Positional Encoding Issue](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image6.png)
*Figure 1: 선형(Linear) 위치 오프셋 하에서 고리의 N단과 C단(1번과 N번)이 물리적으로는 인접함에도 오프셋이 $N-1$로 오인되어 생기는 기하 붕괴 현상*

### 2.1. CycPOEM (Cyclic Position Offset Encoding Matrix)
기존 AlphaFold2는 상대적 잔기 거리 편차를 버킷화(Binning)하여 1차원 상대 위치 오프셋 임베딩 $P(i, j) = \text{bucket}(i - j)$를 구성한 뒤, 이를 Pair Representation의 초기 채널 정보로 학습시킵니다. 

HighFold는 이 고정된 선형 오프셋 테이블을 버리고, 아미노산 간의 실제 위상 연결 경로 거리를 계산한 $N \times N$ 차원의 **CycPOEM** 매트릭스를 입력으로 주입합니다.

![CycPOEM Framework Matrix](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image8.png)
*Figure 2: 공유 결합 및 이황화 결합을 토대로 유도한 최단 경로 거리를 활용해 Positional Offset을 정비하는 CycPOEM 개념도*

### 2.2. FCP (Floyd for Cyclic Peptides) 알고리즘
CycPOEM에 들어갈 최단 경로 거리 행렬을 생성하기 위해, HighFold 개발진은 그래프 최단 경로 탐색 알고리즘인 Floyd-Warshall을 수정한 **FCP 알고리즘**을 제안했습니다.
1. **노드 및 엣지 구성**: 개별 아미노산 잔기를 노드로 설정하고, N-C 백본 펩타이드 공유결합(가중치 1)과 내부 이황화 결합(가중치 1)을 엣지로 연결한 위상 연결 그래프를 만듭니다.
2. **동적 계획법 최적화**: 3중 루프 연산을 수행하여 모든 잔기 쌍 $(i, j)$ 간의 최단 위상 거리 $D_{ij}$를 계산합니다.
3. **부호(Sign) 할당 전략**: 상대 위치 인코딩은 방향성(앞으로의 거리인지 뒤로의 거리인지)을 인지해야 하므로 부호 결정이 필수적입니다. 연구진은 다음 세 가지 부호 할당 전략을 검증했습니다:
   - **FP (Full Positive)**: 모든 거리를 양수로 처리.
   - **UN (Upper Negative)**: 상삼각 행렬 성분은 음수, 하삼각은 양수로 인위적 분할.
   - **WS (Weight Sign)**: 백본의 기본 N $\to$ C 방향성을 기준으로 최단 경로가 순방향 순환인지 역방향 순환인지를 판별하여 부호를 부여하는 가장 완벽한 물리 대칭 보존법. 최종 모델에는 **WS 전략**이 채택되었습니다.

![FCP Algorithm dynamic programming](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image10.png)
*Figure 3: 백본 및 이황화 엣지를 모두 포함하여 아미노산 잔기 간의 최단 순환 위상 거리를 도출하는 Floyd 기반 FCP 알고리즘 흐름*

### 2.3. HighFold-Multimer 확장
표적 수용체 단백질(선형 구조)과 고리형 펩타이드 리간드(고리 구조)가 맞물려 결합하는 복합체 예측을 위해, 입력 포지셔널 매트릭스를 **블록 대각 행렬(Block Diagonal Matrix)**로 유기적으로 통합 구성합니다.

$$\mathbf{P}_{\text{complex}} = 
\begin{bmatrix}
\mathbf{P}_{\text{receptor}}^{\text{linear}} & \mathbf{P}_{\text{cross}} \\
\mathbf{P}_{\text{cross}}^T & \mathbf{P}_{\text{ligand}}^{\text{CycPOEM}}
\end{bmatrix}$$

이 매트릭스 구성을 통해 복합체 신경망은 수용체 도메인은 기존 방식대로 예측을 유도하고, 고리형 리간드는 CycPOEM의 제약 조건을 적용하여 동시에 접힘 도킹이 수행되도록 정밀 조율합니다.

![Block Diagonal Multimer positional matrix](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image13.png)
*Figure 4: 표적 단백질(선형)과 고리형 펩타이드를 하나의 입력으로 정렬하여 학습하기 위한 Block Diagonal positional encoding 정렬*

---

## 3. 결과 및 분석 (Results & Analysis)

HighFold는 단독 모노머 고리 펩타이드 및 단백질 복합체 표적(Multimer Target)을 대상으로 성능 평가를 수행했습니다.

![Monomer prediction performance comparisons](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image15.png)
*Figure 5: 선형으로 예측해 왜곡되었던 기존 AlphaFold 결과(주황색)와 HighFold가 고리 제약을 반영해 원형으로 완벽 복원한 결과(녹색) 비교*

- **모노머 고리 복원**: 억지로 길게 뽑힌 선형으로 예측되어 붕괴되었던 기존 AlphaFold2 출력물과 달리, HighFold는 CycPOEM 덕분에 결합 영역의 왜곡 없이 도메인 참값 구조(PDB ground truth)와 거의 일치하는 완벽한 고리형 3차원 골격(RMSD < 1.0Å)을 안정적으로 예측해냈습니다.
- **도킹 계면 예측(DockQ / Mconf) 향상**: 수용체 포켓 내부에서 고리형 펩타이드가 가지는 정확한 물리적 배치와 결합력을 도출해내는 ipTM 및 DockQ 평가 지표에서 대조군 대비 유의미한 정확도 증가를 보였습니다.

![Binding interface results](/assets/images/2024-09-26-HighFold-cyclic-peptide-structure-prediction/image18.png)
*Figure 6: HighFold를 적용하여 도킹 결합 계면(Interface)을 극대화하고 결합 형태의 오차를 최소화한 3D 복합체 시각화*

---

## 4. 결론 (Conclusions)

HighFold는 선형 서열 결합의 한계를 탈피하고 아미노산 잔기 간의 최단 위상 거리 매트릭스(CycPOEM)를 주입함으로써 고리 위상 및 복잡한 이황화 가교 구조 예측 장벽을 완벽하게 허문 탁월한 아키텍처입니다. 이는 향후 고리형 펩타이드 기반의 항암 약물 디자인 및 매크로사이클(Macrocycle) 화합물 라이브러리 가상 도킹 스크리닝에서 실무 핵심 예측 모듈로 자리매김할 것입니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
