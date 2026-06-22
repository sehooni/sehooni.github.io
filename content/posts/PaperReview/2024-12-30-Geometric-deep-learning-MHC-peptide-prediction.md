---
layout: single
title:  "[Paper Review] Geometric deep learning improves generalizability of MHC-bound peptide prediction"
excerpt: "기존 서열 기반 방식(SeqB)의 데이터 편향성과 일반화 오류 한계를 극복하기 위해 3D 구조 정보와 회전/이동 불변성(SE(3)-equivariance) 기반 기하학적 딥러닝(GDL) 및 자가지도학습(3D-SSL)을 적용한 pMHC 결합 예측 모델 리뷰"
toc: true
toc_sticky: true

categories:
  - PaperReview
tags: [PaperReview, Bioinformatics, DeepLearning, GDL, MHC]
use_math: true

date: 2024-12-30
last_modified_at: 2024-12-30T14:30:00-17:00:00
classes: wide
---

* **Paper Title**: [Geometric deep learning improves generalizability of MHC-bound peptide predictions](https://doi.org/10.1038/s42003-024-07292-1)
* **Authors**: Dario F. Marzella, Giulia Crocioni, Tadija Radusinović, and Li C. Xue
* **Journal/Conference**: Communications Biology (2024)
* **DOI**: [10.1038/s42003-024-07292-1](https://doi.org/10.1038/s42003-024-07292-1)

---

## 1. 서론 (Introduction)

세포가 내포하고 있는 바이러스 단백질이나 돌연변이 단백질의 단편(펩타이드)은 **주조해 적합성 복합체(Major Histocompatibility Complex, MHC)** 분자와 결합하여 세포 표면에 표지됩니다. 면역 T-세포는 이 pMHC 복합체를 인식하여 감염되거나 암화된 세포를 파괴하는 항원 면역 반응을 촉발합니다. 

따라서 특정 펩타이드가 환자의 MHC 유전체와 성공적으로 결합하는지(pMHC 결합 친화도)를 분석하는 것은 암 환자 맞춤형 신항원 백신(Neoantigen Vaccine) 및 면역 요법 개발의 가장 핵심적인 설계 출발점입니다.

![pMHC polymorphic challenge](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image4.jpeg)
*Figure 1: 무수히 많은 변이를 가진 HLA 대립유전자(Alleles)와 다양한 길이의 펩타이드 간의 상호작용 개념도*

인간의 HLA 유전자는 약 14,000종이 넘는 극심한 다형성(Polymorphism)을 나타내어, 특정 환자가 어떤 HLA 대립유전자(Alleles)를 가지고 있는지에 따라 결합 홈(Binding groove)의 모양이 완전히 달라집니다. 기존 연구들은 대개 아미노산 서열 패턴만을 분석하는 **서열 기반 모델(Sequence-based, SeqB)**(예: NetMHCpan, MHCflurry)을 사용했습니다. 이들은 학습 데이터가 풍부한 일부 메이저 HLA(예: HLA-A*02:01)에 대해서는 높은 정확도를 보이나 다음 한계를 지닙니다:
1. **데이터 편향성 (Data Bias)**: 실험 데이터가 극소수이거나 전무한 희귀 HLA 유전자에 대해서는 예측력이 급격히 붕괴합니다.
2. **일반화 능력 결여**: 서열 유사성만을 암기하여 학습하므로, 유사성이 낮은 바이러스 변종이나 새로운 펩타이드 변이가 유발하는 물리적인 구조적 친화력 변화를 포착하지 못합니다.

본 논문에서는 3D 물리 공간의 기하 정보를 직접 인코딩하는 **구조 기반 기하학적 딥러닝(Structure-based Geometric Deep Learning, StrB GDL)** 모델과 데이터 희소성을 해소하는 3D 자가지도학습(3D-SSL) 기법을 접목하여 희귀 유전체 결합 성능을 돌파하는 방법론을 제안합니다.

---

## 2. 모델 아키텍처 및 특징 (Model Architecture & Features)

연구진은 3차원 분자 그래프 형태를 처리하기 위해 다음과 같은 고성능 아키텍처 파이프라인을 구축했습니다.

### 2.1. PANDORA를 이용한 3D 모델 초고속 생성
구조 기반 예측 모델의 가장 큰 병목은 3차원 구조를 규명하는 데 많은 시간(X-ray 결정학 실험에 수개월, 분자 도킹 시뮬레이션에 수시간)이 걸린다는 점입니다. 
- 본 연구진은 앵커 제약 모델링 툴인 **PANDORA**를 도입하였습니다. PANDORA는 펩타이드가 MHC 포켓 홈에 결합할 때 고정되는 두 끝단 앵커(Anchor) 잔기 거리를 물리적 제약조건으로 사용하여 **1분 이내에** 고품질의 pMHC 3D 구조 템플릿을 생성해 냅니다.

![PANDORA pipeline](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image5.png)
*Figure 2: 앵커 거리 제한법(Anchor-Restrained Modeling)을 활용하여 pMHC 3D 구조 모델을 빠르게 생성하는 PANDORA 툴킷 구성*

### 2.2. pMHC 인터페이스 그래프 변환
- 생성된 3D 좌표를 기반으로 잔기 수준 그래프(Residue-level Graph)를 구성합니다. 노드는 아미노산 잔기를 나타내며, 포켓 결합 홈 계면에서 12Å 이내의 잔기 쌍을 엣지로 연결합니다.
- 엣지에는 쿨롱 전하 상호작용(Electrostatics) 및 반데르발스 힘(van der Waals) 등의 물리화학적 특징을 인코딩합니다.

![pMHC Interface Graph](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image6.png)
*Figure 3: MHC 결합 포켓 홈 내부와 펩타이드 간의 상호작용(물리 거리 및 결합력)을 잔기 단위 그래프 노드와 엣지로 모델링한 모습*

### 2.3. EGNN 아키텍처 도입 (E(n)-Equivariant GNN)
- 단순 3D-CNN이나 표준 GNN 대조군들과 비교하여, 기하학적 회전/이동 대칭성을 수학적으로 보존하는 **EGNN**을 중추 모델로 사용합니다.

![StrB Deep Learning architectures](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image7.png)
*Figure 4: 구조 기반 딥러닝 모델들의 입출력 및 연산 방식(3D-CNN, GNN, EGNN) 특징 비교*

EGNN은 각 메시지 패싱 블록마다 노드 특징값 $h_i$와 3D 공간 좌표 $x_i$를 다음과 같이 독립적이면서도 유기적으로 연동하여 갱신합니다:

$$m_{ij} = \phi_m(h_i^l, h_j^l, \|x_i^l - x_j^l\|^2, a_{ij})$$

$$x_i^{l+1} = x_i^l + \sum_{j \in \mathcal{N}(i)} (x_i^l - x_j^l) \phi_x(m_{ij})$$

$$h_i^{l+1} = \phi_h(h_i^l, \sum_{j \in \mathcal{N}(i)} m_{ij})$$

여기서 $\|x_i^l - x_j^l\|^2$는 노드 간 불변 Euclidean 거리이고, $a_{ij}$는 엣지 특징입니다. 이 연산을 통해 예측값은 입력 분자 구조가 공간상에서 회전하거나 대칭 이동하더라도 완벽하게 일관된 물리 예측치(Invariance)를 보장받습니다.

![EGNN Math Update formulas](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image8.png)
*Figure 5: EGNN 내부에서 좌표 차이($x_i - x_j$)와 거리($d_{ij}^2$)를 사용하여 3D 등변성 벡터 및 불변성 특징을 갱신하는 수학적 연산 흐름*

---

## 3. 방법론: 3D 자가지도학습 (3D Self-Supervised Learning)

실제 면역 결합 친화성(BA) 실험 데이터를 얻는 비용은 막대합니다. 이를 극복하고자 연구진은 결합 친화성 레이벨 없이도 3D 구조 좌표 데이터(PDB 구조)만으로 단백질의 물리 화학 환경을 선제적으로 학습할 수 있는 **3D-SSL** 기법을 제안했습니다.

![3D Self-Supervised Learning Masked Residue Recovery](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image9.png)
*Figure 6: 3D 구조 노드 중 일부 아미노산(20%)의 정체(Identity)를 지운 뒤 주변 기하 물리 특성을 토대로 원래 잔기를 복원하는 SSL 사전 학습 흐름*

### 3.1. Masked Residue Recovery (MRR, 마스킹 복원)
1. 입력 3D 그래프 노드 중 임의의 아미노산 잔기 20%의 정보(아미노산 종류)를 숨깁니다(Zero-out).
2. EGNN 모델은 주변 잔기들의 3D 기하 배치와 물리화학적 엣지 결합 강도 정보를 취합하여 마스킹된 아미노산이 20가지 표준 아미노산 중 어떤 것일 확률이 높은지($P(x_i | \text{context})$)를 분류 예측합니다.
3. 전하 매칭, 공간적 찌그러짐 방지, 수소 결합 결합 가능성 등의 기하학적 제약 조건을 올바르게 이해해야만 원래 아미노산을 복원할 수 있으므로, 모델은 이 복원 태스크를 수행하면서 고품질의 구조 도메인 지식을 축적하게 됩니다.

### 3.2. 볼츠만 통계적 에너지 변환
자가지도학습을 거친 모델은 라벨링 데이터를 활용하지 않고도, 마스킹 복원 확률 $P(x_i | \text{context})$을 통계 열역학의 **볼츠만 분포(Boltzmann Distribution)**식을 차용하여 통계적 에너지(Statistical Potential) $E(x_i)$ 점수로 즉시 치환하여 친화성을 평가합니다:

$$E(x_i) = -k_B T \ln \frac{P(x_i | \text{context})}{P_0(x_i)}$$

여기서 $P_0(x_i)$는 아미노산 고유의 배경 분포 확률입니다. 이 에너지 값이 낮을수록 물리적으로 조화롭고 결합 친화도가 높은 안정한 pMHC 구조임을 의미하게 됩니다.

![Thermodynamic energy transformation chart](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image10.png)
*Figure 7: 아미노산 복원 확률 $P(x_i | \text{context})$로부터 볼츠만 수식을 적용하여 상대적 결합 자유 에너지를 추정해내는 기하 모델 설명*

---

## 4. 결과 및 분석 (Results & Analysis)

- **희귀 MHC에 대한 일반화 성능 돌파**: 훈련 데이터셋에 전혀 등재되지 않았던 생소한 HLA Allele 변이체 군에 대한 검증에서, 기존 서열 기반 모델(MHCflurry)은 아웃오브디스트리뷰션(OOD) 오류로 인해 AUC 성능이 크게 급락한 반면, EGNN 구조 기반 모델은 결합 홈의 3D 물리적 기하 상태를 정밀하게 분석하여 흔들림 없이 높은 성능 점수(AUC/AUPRC)를 수호했습니다.

![Generalizability to unseen alleles](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image11.png)
*Figure 8: 훈련 데이터셋에 노출되지 않았던 비대중적인 HLA alleles에서의 성능 검증 결과(EGNN 기반 기하학적 모델들의 일반화 승리)*

- **압도적인 데이터 효율성 (1/90 비교)**: 사전 학습(3D-SSL)을 거친 EGNN은 기존 서열 기반 지도학습 모델들이 학습에 필요로 했던 대량의 바인딩 친화도 데이터 크기의 **90분의 1(1/90)** 수준에 불과한 데이터만으로도 대등하거나 능가하는 성능을 확보했습니다.

![Data efficiency comparison curves](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image13.png)
*Figure 9: 미세 조정(Fine-tuning) 시 주입하는 지도학습 데이터 양에 따른 성능 도달 속도 및 데이터 효율 지표*

- **만성 B형 간염 바이러스(HBV) 백신 임상 실증**: C-터미널 부근에 전하와 크기가 무시되는 글라이신(Glycine) 돌연변이가 발생하여 서열 기반 모델들이 데이터 편향성으로 인해 무조건 바인딩이 안 될 것이라며 놓쳤던(False Negative) 면역 타깃 펩타이드들을, EGNN은 물리 공간의 결합 자유 포켓 깊이를 입체적으로 스캔하여 성공적으로 결합 대상(True Positive)으로 예측해 냈습니다.

![HBV Case study predictions](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image16.png)
*Figure 10: 만성 B형 간염 바이러스(HBV) 변종 서열에서 Glycine 변이가 일어날 때, 구조적 결합력을 정확하게 캐치해내는 EGNN 및 MRR 에너지 결합 시뮬레이션*

---

## 5. 결론 (Conclusions)

본 연구는 서열 패턴의 한계를 넘어 3D 구조의 물리 법칙과 E(n)-등변성 그래프 신경망을 활용한 기하학적 딥러닝이 면역 도킹 예측의 고질적인 유전자 편향과 일반화 난제를 해결할 수 있음을 입증했습니다. 이는 향후 환자 맞춤형 암 백신 에피토프(Epitope) 스크리닝의 위양성 오차를 극단적으로 제어하는 필수적인 구조 엔진이 될 것입니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
