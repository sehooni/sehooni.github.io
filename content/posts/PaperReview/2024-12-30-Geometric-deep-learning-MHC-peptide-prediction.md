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
1. **데이터 편향성 (Data Bias):** 실험 데이터가 극소수이거나 전무한 희귀 HLA 유전자에 대해서는 예측력이 급격히 붕괴합니다.
2. **일반화 능력 결여**: 서열 유사성만을 암기하여 학습하므로, 유사성이 낮은 바이러스 변종이나 새로운 펩타이드 변이가 유발하는 물리적인 구조적 친화력 변화를 포착하지 못합니다.

본 논문에서는 3D 물리 공간의 기하 정보를 직접 인코딩하는 **구조 기반 기하학적 딥러닝(Structure-based Geometric Deep Learning, StrB GDL)** 모델과 데이터 희소성을 해소하는 3D 자가지도학습(3D-SSL) 기법을 접목하여 희귀 유전체 결합 성능을 돌파하는 방법론을 제안합니다.

---

## 2. 모델 아키텍처 및 특징 (Model Architecture & Features)

연구진은 3차원 분자 그래프 형태를 처리하고, 물리 기하 공간의 대칭성을 활용하여 면역 결합 구조를 효과적으로 평가하기 위해 다음과 같은 고성능 아키텍처 파이프라인을 구축했습니다.

### 2.1. PANDORA를 이용한 3D 모델 초고속 생성
구조 기반 예측 모델의 가장 큰 장벽은 입력에 필요한 3차원 복합체 구조를 규명하는 데 비정상적으로 많은 시간(실험 결정학에 수개월, 분자 도킹 시뮬레이션에 수시간)이 소요된다는 점입니다. 이를 극복하기 위해 연구진은 초고속 pMHC 3D 모델링 툴킷인 **PANDORA**를 전면 도입하였습니다.
- PANDORA는 펩타이드가 MHC 포켓 홈에 결합할 때 양 끝단이 수소결합 등으로 강하게 잠기는 앵커(Anchor) 잔기 거리를 물리적 제약조건으로 수용하는 **앵커 제약 모델링(Anchor-Restrained Modeling)** 방식을 채택합니다.
- 이를 통해 분자 동력학 등 복잡한 시뮬레이션 없이도 **1분 이내에** 실험 구조와 매우 일치하는 고품질의 pMHC 3D 템플릿 좌표 구조를 초고속으로 출력해 냅니다.

![PANDORA pipeline](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image5.png)
*Figure 2: 앵커 거리 제한법(Anchor-Restrained Modeling)을 활용하여 pMHC 3D 구조 모델을 빠르게 생성하는 PANDORA 툴킷 구성*

### 2.2. pMHC 인터페이스 그래프 변환
PANDORA로 예측된 3D 구조의 원자 좌표들을 기반으로 아미노산 잔기 수준 그래프 $\mathcal{G} = (\mathcal{V}, \mathcal{E})$를 구축합니다.
- **노드(Node $\mathcal{V}$):** 각 아미노산 잔기(주로 $C_\alpha$ 원자 위치)를 노드로 정의합니다. 노드 피처에는 아미노산 종류, 물리화학적 성질 등이 포함됩니다.
- **엣지(Edge $\mathcal{E}$):** 수용체 MHC 결합 홈의 계면 포켓으로부터 $12$Å 반경 이내에 인접한 잔기 쌍들을 엣지로 연결합니다.
- **물리화학적 엣지 특징**: 엣지 상호작용 피처에는 단순히 공간적 거리뿐만 아니라, 분자 간의 인력/척력을 규명하는 쿨롱 정전기 에너지(Coulomb Electrostatic potential), 반데르발스 힘(van der Waals/Lennard-Jones potential), 수소 결합 친화성 등 정밀한 물리 기하 수치를 인코딩하여 모델이 구조의 안정성을 인지할 수 있는 기반을 다집니다.

![pMHC Interface Graph](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image6.png)
*Figure 3: MHC 결합 포켓 홈 내부와 펩타이드 간의 상호작용(물리 거리 및 결합력)을 잔기 단위 그래프 노드와 엣지로 모델링한 모습*

### 2.3. EGNN 아키텍처 도입 (E(n)-Equivariant GNN)

3차원 물리 구조를 인코딩할 때 단순 GNN을 활용하면 분자의 절대 회전이나 평행 이동에 따라 출력 예측값이 달라지는 비일관적인 결함이 발생합니다. 본 연구진은 3차원 유클리드 공간의 대칭 이동 및 회전 변환에 대해 출력이 공변적(Equivariant) 또는 불변적(Invariant)으로 대응하는 **E(n)-equivariant Graph Neural Network (EGNN)를** 중추 모델로 사용합니다.

![StrB Deep Learning architectures](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image7.png)
*Figure 4: 구조 기반 딥러닝 모델들의 입출력 및 연산 방식(3D-CNN, GNN, EGNN) 특징 비교*

EGNN은 각 메시지 패싱 블록마다 노드 특징값 $h_i^l \in \mathbb{R}^d$와 3D 공간 좌표 $x_i^l \in \mathbb{R}^3$를 다음과 같이 유기적으로 연동하여 갱신합니다:

1. **메시지 계산**:
   $$
   m_{ij} = \phi_m\left(h_i^l, h_j^l, \|x_i^l - x_j^l\|^2, a_{ij}\right)
   $$
   여기서 $\|x_i^l - x_j^l\|^2$는 노드 간의 회전 불변 유클리드 거리이며, $a_{ij}$는 물리화학적 엣지 피처입니다. $\phi_m$은 비선형 신경망 레이어입니다.
2. **좌표 업데이트**:
   $$
   x_i^{l+1} = x_i^l + \sum_{j \in \mathcal{N}(i)} (x_i^l - x_j^l) \phi_x(m_{ij})
   $$
   각 원자의 3D 좌표는 상대 좌표 차이 $(x_i^l - x_j^l)$ 벡터의 방향에 메시지 스칼라 가중치 $\phi_x(m_{ij})$를 곱한 값의 합만큼 업데이트됩니다. 이 연산은 3차원 회전 및 이동 변환에 대해 완벽한 공변성(Equivariance)을 보장합니다.
3. **노드 상태 업데이트**:
   $$
   h_i^{l+1} = \phi_h\left(h_i^l, \sum_{j \in \mathcal{N}(i)} m_{ij}\right)
   $$
   이전 상태의 노드 정보 $h_i^l$과 인접 노드들로부터 유입된 불변 메시지들의 합을 조합하여 새로운 노드 특징을 산출합니다.

이 연산을 통해 예측값은 입력 분자 구조가 공간상에서 회전하거나 대칭 이동하더라도 완벽하게 일관된 물리 예측치(Invariance)를 보장받습니다.

![EGNN Math Update formulas](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image8.png)
*Figure 5: EGNN 내부에서 좌표 차이($x_i - x_j$)와 거리($d_{ij}^2$)를 사용하여 3D 등변성 벡터 및 불변성 특징을 갱신하는 수학적 연산 흐름*

---

## 3. 방법론: 3D 자가지도학습 (3D Self-Supervised Learning)

실제 면역 결합 친화성(BA) 실험 데이터를 대량으로 측정하는 것은 극심한 시간과 예산이 소모됩니다. 이를 극복하고자 연구진은 결합 친화성 라벨이 없는 일반 PDB 단백질 구조 좌표 데이터만을 활용하여 분자의 결합 물리 화학 환경을 사전에 학습하는 **3D 자가지도학습(3D-SSL)** 프레임워크를 수립했습니다.

![3D Self-Supervised Learning Masked Residue Recovery](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image9.png)
*Figure 6: 3D 구조 노드 중 일부 아미노산(20%)의 정체(Identity)를 지운 뒤 주변 기하 물리 특성을 토대로 원래 잔기를 복원하는 SSL 사전 학습 흐름*

### 3.1. Masked Residue Prediction (MRP, 마스킹 잔기 복원)
자연어 처리의 BERT 모델이 단어의 일부를 마스킹하고 앞뒤 문맥을 통해 이를 예측하듯, 3D 단백질 구조에서도 동일한 태스크를 적용합니다:
1. **아미노산 마스킹**: 입력 3D 그래프 노드 중 결합 홈에 끼워지는 펩타이드 잔기의 약 $20\%$를 무작위로 선택하여 노드 아미노산 정체성(Residue Identity) 정보를 지우고 공백(Mask Token)으로 전환합니다. 단, 3차원 $C_\alpha$ 원자 위치 좌표 $x_i$는 그대로 노출하여 3D 기하 구도는 유지시킵니다.
2. **주변 환경 학습**: EGNN 모델은 마스킹되지 않은 주변 잔기들의 3D 입체적 배치 구조와 엣지에 연결된 전하, 반데르발스 결합 특성들을 취합합니다.
3. **아미노산 분류 예측**: 취합된 정보를 바탕으로 마스킹된 공백 위치에 들어갈 아미노산이 20가지 표준 아미노산 중 어느 것일 확률이 높은지($P(x_i | \text{context})$) 분류 확률 값을 계산하여 원래의 잔기를 올바르게 복원하도록 학습합니다.

이를 완수하기 위해 모델은 'MHC 홈의 좁은 틈에 특정 크기의 아미노산이 들어갈 수 있는가(공간적 부피 제한)', '주변 전하와 양전하/음전하 매칭이 맞는가(정전기적 매칭)', '수소결합 네트워크가 형성되는가' 등의 복잡한 3D 결합 물리학을 역으로 이해하게 됩니다.

### 3.2. 볼츠만 분포 차용 통계적 에너지 변환 (Boltzmann Potential)

자가지도학습을 성공적으로 마친 모델은, 라벨링된 실제 물리 결합 친화성 데이터를 전혀 사용하지 않고도 마스킹 잔기 예측 확률인 $P(x_i | \text{context})$ 정보를 통계 열역학의 **볼츠만 분포(Boltzmann Distribution)** 공식에 적용하여 즉각적으로 **통계적 에너지(Statistical Potential, $E(x_i)$)** 점수로 변환할 수 있습니다:

$$
E(x_i) = -k_B T \ln \frac{P(x_i | \text{context})}{P_0(x_i)}
$$

- $k_B$: 볼츠만 상수
- $T$: 절대 온도
- $P_0(x_i)$: 단백질 데이터베이스 상에서 아미노산 $x_i$가 가지는 고유한 배경 빈도 분포(Background probability)

통계 물리적으로, 결합 환경에 적합하고 안정한 아미노산일수록 복원 확률 $P(x_i | \text{context})$가 높게 측정되며, 위 볼츠만 역산 수식을 거친 $E(x_i)$ 에너지는 낮아지게 됩니다. 이 에너지 점수를 수집하여 펩타이드와 MHC 포켓 홈 간의 최종 결합 강도 및 친화력을 정밀하게 예측 및 순위화할 수 있게 됩니다.

![Thermodynamic energy transformation chart](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image10.png)
*Figure 7: 아미노산 복원 확률 $P(x_i | \text{context})$로부터 볼츠만 수식을 적용하여 상대적 결합 자유 에너지를 추정해내는 기하 모델 설명*

---

## 4. 결과 및 분석 (Results & Analysis)

- **희귀 MHC에 대한 일반화 성능 돌파**: 훈련 데이터셋에 전혀 등재되지 않았던 생소한 HLA Allele 변이체 군에 대한 검증에서, 기존 서열 기반 모델(MHCflurry)은 아웃오브디스트리뷰션(OOD) 오류로 인해 AUC 성능이 크게 급락한 반면, EGNN 구조 기반 모델은 결합 홈의 3D 물리적 기하 상태를 정밀하게 분석하여 흔들림 없이 높은 성능 점수(AUC/AUPRC)를 수호했습니다.

![Generalizability to unseen alleles](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image11.png)
*Figure 8: 훈련 데이터셋에 노출되지 않았던 비대중적인 HLA alleles에서의 성능 검증 결과(EGNN 기반 기하학적 모델들의 일반화 승리)*

- **압도적인 데이터 효율성 (1/90 비교):** 사전 학습(3D-SSL)을 거친 EGNN은 기존 서열 기반 지도학습 모델들이 학습에 필요로 했던 대량의 바인딩 친화도 데이터 크기의 **90분의 1(1/90)** 수준에 불과한 데이터만으로도 대등하거나 능가하는 성능을 확보했습니다.

![Data efficiency comparison curves](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image13.png)
*Figure 9: 미세 조정(Fine-tuning) 시 주입하는 지도학습 데이터 양에 따른 성능 도달 속도 및 데이터 효율 지표*

- **만성 B형 간염 바이러스(HBV) 백신 임상 실증**: C-터미널 부근에 전하와 크기가 무시되는 글라이신(Glycine) 돌연변이가 발생하여 서열 기반 모델들이 데이터 편향성으로 인해 무조건 바인딩이 안 될 것이라며 놓쳤던(False Negative) 면역 타깃 펩타이드들을, EGNN은 물리 공간의 결합 자유 포켓 깊이를 입체적으로 스캔하여 성공적으로 결합 대상(True Positive)으로 예측해 냈습니다.

![HBV Case study predictions](/assets/images/2024-12-30-Geometric-deep-learning-MHC-peptide-prediction/image16.png)
*Figure 10: 만성 B형 간염 바이러스(HBV) 변종 서열에서 Glycine 변이가 일어날 때, 구조적 결합력을 정확하게 캐치해내는 EGNN 및 MRR 에너지 결합 시뮬레이션*

---

## 5. 결론 및 한계점 (Conclusions & Limitations)

### 5.1. 결론 (Conclusions)

본 연구는 서열 정보의 상관관계 암기에만 기댔던 기존 immunoinformatics 예측 모델의 한계를 극복하고, 3차원 기하 대칭성(E(n)-equivariance)을 지닌 EGNN 아키텍처와 3D 자가지도학습(3D-SSL/MRP)을 접목하여 면역 도킹 분야의 고질적 난제인 '유전체 편향 및 희귀 alleles 일반화 오류'를 해결한 탁월한 연구 성과입니다. 

실험 데이터가 부족한 상태에서도 단 1,000여 개의 PDB 구조 템플릿만으로도 높은 물리적 일반화 성능에 도달한 데이터 효율성은, 향후 암 환자 개개인의 서열 유전체를 타겟팅하는 환자 맞춤형 항암 neoantigen 백신 에피토프(Epitope) 스크리닝 파이프라인에서 위양성 오차율을 낮추고 유효 후보물질을 빠르게 정밀 스캔하는 데에 중추적인 역할을 담당하게 될 것입니다.

### 5.2. 한계점 및 향후 연구 과제 (Limitations & Future Directions)

하지만 이 기하학적 딥러닝 면역 프레임워크가 실무적인 백신 설계 파이프라인의 완성형 모듈로 작동하기 위해서는 몇 가지 핵심적인 극복 과제를 안고 있습니다:

1. **PANDORA의 3D 템플릿 구조 품질에 대한 극단적 의존성**: EGNN 모델에 입력으로 제공되는 3차원 원자 좌표 $x_i$는 PANDORA가 예측한 결합 포즈 템플릿 구조입니다. 만약 펩타이드가 특이한 굽힘 현상을 가지거나, 링커 및 앵커 예측 pose가 실제(Ground-truth) X-ray 구조에서 벗어날 경우 입력 좌표의 오차가 EGNN의 엣지 물리 특징 계산 및 에너제틱스 예측 오류로 그대로 전달(Error cascade)되는 구조적 취약점이 존재합니다.
2. **펩타이드 결합 유연성(Flexibility) 및 엔트로피 효과 배제**: 본 모델은 PANDORA로 생성된 단일 정적 3D 결정형 구조 좌표 정보만을 사용합니다. 그러나 실제 생체 내 환경에서 펩타이드와 MHC 포켓 결합면은 열역학적 섭동과 유도 적합(Induced-fit) 작용을 겪으며 끊임없이 요동칩니다. 이 과정에서 유발되는 형태 엔트로피(Conformational Entropy)의 손실이나 분자간 동적 앙상블 특성은 정적 3D 그래프 상에서 정확히 평가되지 못하는 한계가 있습니다.
3. **MHC Class II 복합체 예측으로의 확장 한계**: MHC Class I 분자는 펩타이드 양 끝단이 닫힌 결합 포켓 홈 구조(8~11개 잔기 결합)를 이루어 PANDORA의 앵커 거리 제한 예측이 완벽히 작동합니다. 반면, MHC Class II 분자는 결합 홈의 양 끝이 뚫려있어 긴 펩타이드(13~25개 잔기)가 포켓 밖으로 삐져나온 형태로 결합하므로, 앵커 거리를 고정하기 어렵고 3D 그래프의 12Å 반경 및 마스킹 복원(MRP) 최적화 효율성이 저하될 가능성이 큽니다.
4. **번역 후 변형(PTM) 항원에 대한 지원 부재**: 종양 신항원(Neoantigen)이나 바이러스 에피토프 중에는 인산화(Phosphorylation), 당화(Glycosylation) 등의 화학적 번역 후 변형(PTM)이 발생하여 T-세포 면역 반응에 중대한 변동을 유발하는 경우가 많습니다. 본 모델의 20가지 천연 아미노산 기준 마스킹 분류 및 원자 전하/반데르발스 엣지 피처 체계 하에서는 비정상적인 PTM 원자 클러스터를 유기적으로 인코딩하는 확장 레이어가 부재합니다.

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
