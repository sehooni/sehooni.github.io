--
layout: single
title:  "[Proteomics] Introduction of Proteomics 2"
excerpt: "Proteomics 수업 내용 정리 - Introduction of Proteomics 2"
toc: true
toc_sticky: true

categories:
  - proteomics
tags: [proteomics]
use_math: true

last_modified_at: 2023-03-14T19:23:00
classes: wide
---
“Protein을 대량으로 분석할 때의 data, 그리고 그 분석 방법”에 대한 내용을 이번시간에 이야기를 해볼까 한다.

# Proteomics: study of proteins

이전 포스팅에서 설명한 바와 같이, 단백질 연구는 크게 3가지로 나뉜다. 

1. Protein expression
2. Protein structure
3. Protein-protein interaction

위 3가지 대표적 연구 중 1. protein expression의 경우 단백질을 식별하고, 단백질의 양이 어떻게 되는가를 중점으로 진행된다. 또한 여기서 사용되는 method, 즉 방법들은 2번과 3번 연구에도 적용가능하다. 

![Untitled](https://user-images.githubusercontent.com/84653623/224967224-f9ec1c4d-9b0e-434f-a5c9-e58c1a039c60.png)

# Proteomics

단백질 분석에 있어 그 과정을 살펴보면 아래의 그림과 동일하다.

먼저 다 섞인 하나의 sample로 존재하는 용액을 분리, 분석해야한다. 질량이 너무 커서 한 번에 분석하기 어렵기 때문이다. 이때 **어떻게 잘 나누는가**가 중요하게 작용한다.  

![Untitled 1](https://user-images.githubusercontent.com/84653623/224967133-a18dc48a-68c8-4454-962a-196e875e0f70.png)

이러한 sample을 분리하는 과정에서 사용할 수 있는 방법은 대표적으로 2가지가 존재한다. `2D gel electrophoresis`와 `Liquid chromatography`이다. 이와 같이 분리하는(Separartion) 과정과 함께 때때로 digest를 동반하는데, proteomics에서의 digest는 Protein(단백질)을 자르는 것을 의미한다. 

이렇게 분리된 단백질을 **mass spectrometry(질량 분석)** 하게 된다. 최종적으로 list로 결과가 출력되며, 이때 출력된 score를 통해 DB의 데이터와 유사도를 판별하여 단백질을 최종 도출하게 된다.

# Sample - Protein Digestion

## Protein

단백질은 기본적으로 20개의 아미노산으로 이루어진 서열이다. 컴퓨터 사이언스, 즉 CS분야에서는 알파벳이 20개인 **String data**로 볼 수 있으며, 알파벳 하나하나가 아미노산 1개을 의미한다. 이들이 쭉 연결되어 있는 것이 결국 하나의 단백질인 것이다.

![Untitled 2](https://user-images.githubusercontent.com/84653623/224967145-02a62faf-cc26-45f6-b5f4-dc587a62a095.png)

기본 아미노산의 구조는 아래의 그림에 나와 있듯이 기본 `-NH-CH-CO-`의 backbone을 유지하는 `NH2-CHR-COOH`구조이다. NH와 결합한 C원자에 연결된 R, side-chain에 어떤 구조가 오느냐에 따라 아미노산이 결정되게 된다.

![Untitled 3](https://user-images.githubusercontent.com/84653623/224967152-c8d02a81-c593-4a1d-b782-a9873a487459.png)

아미노산과 아미노산이 펩타이드 결합을 할 때는, 아래 그림과 같이 아미노기의 H^+와 카복시기의 OH^-가 결합하면서 H_2O가 나오는 탈수 현상을 동반한다. 또한 화학 구조식을 작성할 때에는 H가 종종 생략됨에 유의하자.

![Untitled 4](https://user-images.githubusercontent.com/84653623/224967156-b9574d91-4cd1-4969-a835-3c4a81055bbc.png)

![Untitled 5](https://user-images.githubusercontent.com/84653623/224967166-f7b02dcf-986b-4e4c-babf-e0a3a8c701b9.png)

단백질은 원래 어디가 앞, 뒤인지 정해져 있지 않다. 그러나 우리가 처리하기 용이하도록 **단백질의 화학적인 구조**를 기반으로 앞과 뒤를 정했다.

- N-terminal: NH_2 가 붙어 있는 곳 → 앞
- C-terminal: COOH가 붙어 있는 곳 → 뒤

사이드 체인(Side-chain)에 붙어 있는 R의 종류에 따라 아미노산이 무엇인지에 따라 아미노산이 무엇인지 결정되게 된다. 

## Amino acid

아미노산은 위에서 언급했듯이, 20개의 종류로 구성되어 있으며, 아래의 그림을 통해 확인할 수 있다.

![Untitled 6](https://user-images.githubusercontent.com/84653623/224967170-d97a0f9a-2ade-4bc6-bce8-6337dacc4f81.png)

**AA Codes**를 통해 이러한 아미노산들을 표기하는 방법이 명시되어 있다. 즉 오른쪽과 같이 **알파벳**만으로 표현하기도 하고, 왼쪽과 같이 **세글자**로 표현하기도 한다. **Structure**를 보면 우리가 이미 알고 있듯이,   `-NH-CH-CO-` 에서 붙은 것들이 살짝 다른 것을 확인할 수 있다. 이는 R에 붙는것이 무엇이냐에 따라 아미노산이 결정되며, 이에 따라 질량이 달라짐을 보인다.

**Leucine**과 **Isoleucine**은 화학식과 질량이 모두 같음을 확인할 수 있다. 그러나 이 둘은 **화학 구조식에서 차이**를 보인다. 기본 아미노산 구조에서 붙은 R이 다른 것인데, L은 중간에 있는 탄소(C)에 CH_3이 붙었고, I는 왼쪽에 위치한 탄소(C)에 CH_3이 결합하였음을 확인할 수 있다.

즉, `구조식에서만 차이를 보이며, 질량과 화학식이 모두 같기 때문에 질량 분석기를 통해서는 구분할 수 없음`을 유의하면 된다.

다음으로 **Glutamine**과 **Lysine**을 살펴보면 앞서 언급한 Leu와 Ile와 달리 화학식과 질량이 모두 다르다. 그러나 질량을 유심히 보면, 정수부분은 동일하고, 소수 첫째자리에서 차이가 나타난다. 거의 유사한 것이다. 이전에 존재하던 해상도가 낮은 질량분석기라면 문제가 되었겠지만, 요즘은 해상도도 좋기 때문에 어렵지 않게 분석이 가능하다.

## Protein, Peptide and Trypsin

단백질은 수차례 언급했듯이, 아미노산 시퀀스로 이루어져 있다. 이를 더 작은 단위로 자른 것이 **Peptide**이다. 단백질의 질량은 너무 크기 때문에 한번에 질량분석을 하기에는 어려움이 존재한다. 따라서 작게 peptide로 잘라서 분석을 진행하게 된다. 지금의 질량 분석기에서 분석이 가능한 peptide의 크기는 대게 아미노산 6 ~ 50개 정도이다. 이를 다시 정리하면 아래의 그림과 같다.

 

![Untitled 7](https://user-images.githubusercontent.com/84653623/224967172-5758cc45-b7fb-447f-92dc-dc69ed022920.png)

Trypsin는 효소의 종류 중 하나로, 단백질을 자르는 일(digestion)을 한다. Trypsin은 **arginine(R)과 lysine(K)** 의 **C-terminal side**를 기준으로 digestion을 진행한다. 효율이 좋기는 하지만 성능이 100%는 아니다. 원래는 잘라야하는 부분인데 못자르기도 하는 것이다.

## Miscleavage(Faulty cleavage), Semitryptic, Nontryptic, Fully tryptic and NTT (Number of Termini)

앞서 이야기한 잘라야하는 부분인데 못자르기도 하는 것, 즉 자르는 부분을 놓친 것을 **Miscleavage**라고 한다. 단어 그대로 cleavage를 해야하는데 mis(놓친) 것이다. 

![Untitled 8](https://user-images.githubusercontent.com/84653623/224967177-b5b41ffe-be9a-4a5a-a11d-d51fcec1e8b2.png)

Trypsin은 K와 R의 C-terminal 부분을 자른다고 했었는데, 위의 그림을 보면 빨간 시퀀스 안에 수많은 K와 R이 존재한다. 즉 miscleavage가 발생한 것이다.

**Semitryptic**은 한쪽만 잘못 자른 케이스를, **Nontryptic**은 양쪽 다 잘못 자른 케이스를, **Fully tryptic**은 양쪽을 제대로 다 자른 케이스를 말한다. (여기서 한쪽이라 함은, N-terminal과 C-terminal 중 한 부분을 말한다.)

![Untitled 9](https://user-images.githubusercontent.com/84653623/224967178-0f2f1604-c10f-4db8-9a22-822cb46b43d4.png)

이러한 케이스들을 구분하는 방법으로 **NTT (Number of Tryptic Termini)** 가 있다. NTT가 0이면 Nontryptic을, NTT가 1이면 Semitryptic을, NTT가 2이면 Fully tryptic을 의미한다. 

## Why are peptides, and not proteins, sequenced?

그렇다면 왜 단백질이 아닌 펩타이드를 시퀀싱하는 것일까에 대해 살펴보자. 우선 앞서 언급하였듯이 **단백질의 경우, 질량이 큰 이유를 포함해 다루기에 어려움이 있다**. 또한 **모든 것이 녹는 것이 아닌 이유도 존재**하며, 이와 더불어 **민감도 또한 단백질에 비해 펩타이드가 낮다**.

결정적으로 `단백질 식별에 있어 펩타이드 시퀀싱으로도 충분하기 때문`에, 이러한 근거들을 바탕으로 **시퀸싱을 하는데 있어 단백질보다는 펩타이드를 이용하게 된다**.

## Different proteases may be used

우리는 이전에 단백질 분해 효소로서 역할을 수행하는 trypsin(트립신)을 먼저 알아보았었다. 사실 이러한 역할을 트립신만이 수행하는 것이 아니다. 트립신이 아닌 단백질 분해 효소에 대해 살펴보면, **Lys-C**와 **Asp-N**, **Glu-C**가 존재한다.

- Lys-C : 아미노산 Lys(Lysine)의 C-terminal을 자르는 효소이다. 트립신에 비해 보다 안정적이며, 가혹하고 용해도가 높은 조건에서 트립신 소화를 사용하기 이전에 사용되고는 한다.
- Asp-N, Glu-C : 아미노산 Asp(Aspartic acid)의 N-terminal과 Glu(Glutamic acid)의 C-terminal을 자르는 효소이다. 이들은 고도로 서열 특이적인 (그러나 덜 활성화되는) 단백질 분해 효소로, 트립신에 의한 펩타이드를 보완하는 펩타이드를 형성하는데 사용될 수 있다.

## 정리하자면

기본적으로 string으로 된 긴 protein이 주어지게 된다. 그러나 다양한 이유들로 인해 바로 해석할 수 는 없다. 따라서 Trypsin, Lys-C, Asp-N and Glu-C와 같은 효소들을 이용하여 잘라내어 peptide로 만든다. 이때 random하게 자르는 것이 아닌 효소별로 정해진 위치에 근거하여 자르게 된다. 그러나 그 정해진 위치를 100%로 자르는 것이 아니기 때문에, 벗어나는 경우 또한 고려하여 데이터 해석을 해야 한다.


# Separation

이전까지는 단백질을 digestion해서 peptide로 만들었다. 이러한 peptide를 분리를 하는 과정이 질량 분석 전에 필요하다. 질량 분석을 통해 단백질을 연구하는 일에 다양한 어려움이 존재하고, 그렇기에 꼭 필요한가에 대한 의문이 들 수 있는데, 그에 대해 먼저 살펴보고 방법론적인 부분에 대한 설명을 해보자.

## 질량 분석을 해서 Protein을 연구하는 일이 왜 어려운가?

아래의 사진은 혈장에 있는 70가지의 단백질에 대해 정리해놓은 표이다. y축은 log scale로 나타낸 양이고 x축은 그에 해당하는 단백질이 작성되어 있다. 

![Untitled 10](https://user-images.githubusercontent.com/84653623/224967183-69da1fea-8f89-4974-b12d-e0ad8919ba29.png)

x축 가장 좌측에 위치한 단백질은 헤모글로빈으로 10^11~10^12(pg/mol) 정도 존재함을 확인할 수 있는데 반해 오른쪽에 위치한 사이토카인의 경우 0에 가까운 값을 갖는 양상을 확인할 수 있다. gemone과 같이 양을 증폭하여 분석할 수 있으면 좋지만, 단백질은 양을 증폭할 수 없다. 즉, 양이 많은 친구들을 걷어내야 우리가 원하는 친구들의 분석이 가능한 것이다.

이러한 양상은 빙하에 비유하여 설명할 수 있다.

![Untitled 11](https://user-images.githubusercontent.com/84653623/224967185-eb12f72b-9d02-4686-a4ed-678abf44daca.png)

맨 위의 Albumin은 양이 많은 대표적인 예시이다.  우리는 현재 Alkaline Phosphatase 근처까지는 볼 수 있지만, 빙하와 같이 밑부분은 아직 우리가 보지 못하고 있다. 따라서 양이 많은 것들을 걷어내야 볼 수 있는 경우가 있는 것이다. 이러한 이유로 separation을 통해 단백질들을 분리하는 과정이 꼭 필요한 것이다.

## GEL, LC and HPLC

**Separation 방법**은 크게 두가지로 나뉜다. 예전에 많이 사용하였으나, 사람의 손이 많이 가는 **GEL**의 경우, 다양한 양을 갖는 단백질들이 한꺼번에 분석되어야하기 때문에, 넓게 펼쳐서 하나하나 차례대로 분석해야한다. 따라서 대량에는 적합하지 않고 지금은 극히 제한되어 잘 사용하지 않는다.

**LC(Liquid chromatography)** 는 자동화가 가능하다는 장점을 갖고 있는 분리 방법으로, 아주 가는 마이크로미터의 관을 특정 시양으로 채워놓고, 압력을 주어 단백질이 포함된 시료가 지나가도록 한다. 이때 단백질이 지나가는 속도의 차이 (다양한 분리 조건)를 이용하여 protein seperation을 진행한다. LC는 이때 중력을 이용하여 액체가 이동하게 한다면, **HPLC(High-Performance LC)** 는 펌프를 통한 높은 압력을 통해 액체가 이동하도록 한다는 차이점이 존재한다. 

![Untitled 12](https://user-images.githubusercontent.com/84653623/224967191-710118f2-66ec-4178-801a-37590ba27b3c.png)

Proteomics를 공부하는 입장에서 방법을 자세히 알 필요보다는, 개념적으로 이렇다~ 정도로만 이해하고 넘어가면 될 것 같다!!


# Mass spectrometry

Mass spectrometry는 질량 분석기 안에서 일어나는 일로서 주어지는 input의 형태가 `ion 형태`이여야 분석이 가능하다. 크게 2가지가 존재하는데 **ion source**와 **Mass analyzer**이다.  

![Untitled 13](https://user-images.githubusercontent.com/84653623/224967193-9bcf8ace-8285-45cb-90c6-5f568e0ddebb.png)

## Ion source

단백질을 이온화하는 과정이 오랫동안 난제로 존재했었는데, 그 이유는 큰 힘 또는 에너지를 가하면 단백질이 훼손, 변형 및 파괴되었었기 때문에 이온의 형태로 만들기가 어려웠다. 이러한 문제점을 `Soft ionization`을 통해 해결하였다. 변형이 발생하지 않았고, 단백질을 위한 이온화 방법이었다. MALDI와 ESL가 존재하는데, **MALDI**는 matrix-assisted laser desorption의 약자로 단백질을 에너지를 대신 받아주는 물질로 감싸고 레이저로 쏘아 이온화 시켜 분석하는 방법이다. **ESI**는 electrospray ionization의 약자로 spray안의 단백질을 뒤에서 밀면 앞으로 분사하면서 동시에 전기를 걸어주는 방식이다. 두 가지 방법 다 현재 사용 중이며 장단점이 존재한다. 단, ESI가 LC와의 연결도 쉽고, 대용량에 적합하다보니 많이 사용한다.

![Untitled 14](https://user-images.githubusercontent.com/84653623/224967198-40c0b113-c4fe-4fdf-bce8-94b31147ceed.png)

(참고로 단백질을 이온화하는 방법은 오랜기간 난제이었기 때문에, Soft ionization 방법은 2002년에 노벨 화학상을 받기도 했다..!!)

## Ion selection

아무리 앞에서 잘 separation 했어도 다른 이온들도 섞일 수 있다. 막 쏟아져 들어오면, 특정 아온만 통과하도록 할 필요가 있다. 일종의 filter역할을 해주는 것이다. Quadrupole과 Ion Trap이 있는데, 자세히보다는 참고만 하고 넘어가도록 하자.

![Untitled 15](https://user-images.githubusercontent.com/84653623/224967200-4df5968f-8ee6-4992-9d41-8b97ae1bbb7c.png)

위의 그림과 같이 quardrupole은 pole에 교류를 흘려주어서 원하는 이온이 공명하여 통과하도록 하는 방법이고, ion trap은 이온들이 섞여 들어오면 trap안에 가둔 다음, quadrupole과 공일하게 교류 전류를 흘려서 원하는 것만 나오도록 energy level을 조절하여 이용하는 방법이다.

## Measurement

이렇게 고른 이온들을 분석을 하기위해서는 특정 조건을 통해 질량을 구해야한다. 이를 목표로 하는 다양한 방법이 존재하는데, 대표적인 방법을 살펴보면 **TOF Mass analyzer**가 있는데 여기서 TOF는 Time-of-flight의 준말로, 문자 그대로 이온이 날아가는 시간을 측정하여 질량을 측정하게 된다. 

![Untitled 16](https://user-images.githubusercontent.com/84653623/224967202-e85e442e-9718-4758-b541-9810b9522778.png)

위의 그림에서 이를 살펴볼 수 있는데, b. reflectron은  같은 전하를 걸어줌으로서 반사를 시키고, d. detector에서는 전기적 힘을 통해 끌어당기게 된다. 이러한 메커니즘을 통해 측정기의 크기를 반으로 줄이는 효과 또한 보이며, 질량은 `m/z (질량/이온의 전하량)`을 통해 측정된다. 

![Untitled 17](https://user-images.githubusercontent.com/84653623/224967204-348b4c11-004d-4141-a9cf-c62795080a84.png)

이때 측정되는 시간은 거리를 커버하게 되며 이온에 따라 다르게 나타나며, **시간(숫자개념으로 보면)은 이온의 질량에 비례 (질량이 클수록 걸리는 시간 커), 전하량에 반비례(전하량이 클수록 걸리는 시간 작아)하는 양상을 보인다**. 

측정되는 값은 결국 m/z로 이온화된 물질이 반드시 필요하며, 시간을 측정하는 것이므로 정확도가 일정 수준을 넘어가기 어렵다는 특징을 갖고 있다.

또 다른 방법으로 **ICR(Ion Cyclontron Resonance) Mass analyzer**가 존재하는데, 이온이 chamber안에서 돌면서 분리되는 메커니즘을 갖고 있다. 질량이 작으면 작게, 질량이 크면 크게 돌고, 전하량이 크면 더 빨리, 작으면 천천히 도는 특징을 갖고 있다. 회전하는 frequency를 chamber 밖에서 측정할 수 있으며 최근 ICR이 TOF보다 Resolution이 좋아 더 자주 사용하는 양상을 보인다. 

그러나 결국 중요한 것은, **우리가 분석하는 것**은 `m/z`라는 점이다.

![Untitled 18](https://user-images.githubusercontent.com/84653623/224967206-d1cbf980-f8f7-4329-b537-584d0d1b60df.png)

# Single stage MS

이전까지 우리는 단백질에서 digestion을 통해 peptide를 만들고, 시퀀싱한 peptide를 이온화하여 질량 분석하는 방법에 대해 살펴보았다. peptide의 질량만 알아도 dB 분석을 통해 sequence를 도출할 수 있다. 즉, 단백질을 파악하고 결정하게 되는 것이다.

![Untitled 19](https://user-images.githubusercontent.com/84653623/224967208-216ae547-3cf9-42a6-aead-a7dedb782a90.png)

위 그림에서 밑의 빨간 박스 안의 표 MS는 Mass Spectrum으로 일종의 2D 정보(array)가 생긴다고 보면 된다. MS를 통해 어떤 m/z를 가진 이온이 몇번 detect되었는지 확인할 수 있다.

# Tandem MS (MS/MS, MS2)

Single stage MS에서 ionization이후 바로 Mass spectrometry를 진행하였다면, 이번에는 Isolation과 Fragmentation이 추가된 **Tandem Mass sepectrometry**에 대해 이야기하여 보자.

아래의 그림은 Tandem Mass spectrometry (줄여서 MS/MS 혹은 MS2로 표기)의 과정을 나타낸 것이다. Ionization까지는 동일하나, 그 이후 Isolation이 진행된다. 

Isolation은 아래의 왼쪽 MS 스펙트럼과 동일하다. 제일 양이 많은 친구를 선택하여 MS/MS를 진행하는 것이다.

![Untitled 20](https://user-images.githubusercontent.com/84653623/224967213-312d1775-fe8d-4356-be0e-57a193d4b46d.png)

Fragmentation은 vaccum chamber 안에서 아르곤 gas와의 collision을 통해 진행되며, 자세한 설명은 다음 단락에서 진행하겠다. 

앞서 이야기 했듯, 제일 양이 많은 친구를 대상으로 MS/MS를 진행하며, 이후 MS1 scan 후 또 다시 진행하게 된다. 이미 찍은 친구는 dynamic exclusion을 진행한다. (제외 후 나머지를 다시 똑같이 MS/MS를 진행하는 것이다.)

## Mass spectrometry - fragmentation

본 단락에서는 fragmentation의 방법에 대해 소개한다. fragmentation이란, disruption of a covalent bond in a protein as a result of either spontaneous or enzymatic reaction. 즉 자발적 또는 효소적 반응의 결과로 단백질의 공유 결합이 붕괴되는 것을 말한다. 즉 peptide 중 하나의 이온에 있어 그 공유결합을 분리하여 안에 갖고 있는 peptide fragments들을 분석하는 기법인 것이다. 

fragmentation의 방법에는 크게 4가지가 존재하는데, 아래의 그림에서 보이듯이, CID (Collision Induced Dissociation)을 주로 사용한다. 

![Untitled 21](https://user-images.githubusercontent.com/84653623/224967217-e421694d-5a0b-41f8-947c-63add4486e72.png)

여기서 precursor ion이란, MS에서 선별한 가장 양이 많은 이온을 의미한다. Quadrupole에서 precursor ion이 들어오면, 아르곤 가스 혹은 N_2 질소 가스와 충돌을 하여 precursor ion이 조각 나된다. 이러한 과정을 Fragmentation의 CID 기법이라고 한다.

# MS vs. MS/MS

아래의 그림을 유심히 살펴보자.  우측 상단의 그래프는 시간에 따라 어떠한 peptide가 많이 나오는 지를 보여주며, 아래의 그래프를 통해 MS와 MS/MS 사이의 관계를 확인할 수 있다.

시간에 따른 m/z는 완전히 다르지는 않으나, 차이가 존재하게 된다. 시간에 따른 MS에서 가장 많은 양을 갖고 있는 precursor ion은 다르게 나타나고 이러한 이온들 중 가장 양이 많은 것을 선정하여 MS/MS 를 한 것이 주황색 화살표가 가르키는 파란색 스펙트럼이다.  

![Untitled 22](https://user-images.githubusercontent.com/84653623/224967218-b3fb26f4-9ed1-4831-aedd-3de4f92865e1.png)

이를 통해 어떠한 아미노산 시퀀스로 이루어진 펩타이드인지를 DB와의 비교 분석을 통해 선정하고 최종적으로 단백질을 유추할 수 있는 것이다.

# Mass vs. Intensity vs. Time

이전 단락에서 본 그래프와 전체적으로 같으나 차이점은 하나의 이온에 대해 시간에 따른 펩타이드의 chromatography를 진행한 것이다. 

![Untitled 23](https://user-images.githubusercontent.com/84653623/224967221-fd10a42e-5c84-4098-b2d0-8a8bf16b27a4.png)

3차원 그래프에서 1000.2에 해당하는 부분의 넓이는 peptide의 양을 뜻한다. 결국 어디서 온 peptide인가, 즉 peptide의 출처를 알아야 잘 해석할 수 있다.

# 내용 요약 및 정리

단백질의 질량분석을 위해서는 우선 단백질의 구조를 바탕으로 펩타이드, 아미노산에 대해 알아보았고, digestion 과정에서 발생할 수 있는 케이스에 대해 살펴보았다.
이후 MS과정과 MS/MS과정을 통해 우리가 얻게되는 스펙트럼을 DB에 존재하는 스펙트럼과 비교 분석을 통해 이 단백질이, peptide가 어디에서 왔는가를 통해, 최종적으로 해석에 도달하게 된다.

앞으로의 강의에서는 주로 MS1과 MS2 scan data를 보고 분석하는 내용을 다룰 것 같다.

이번 내용을 정리하면서 일전에 정리한 Sequest 논문이 생각났다. 읽을 당시에는 proteomics 갓 입문한 사람이었어서 글자 그대로 머릿속으로 입력했는데 본 내용을 공부하고 정리하면서 생각이 나는 걸 보니 꽤나 대학원생같은데...? 핳
이번 달 내로 proteomics 논문들에 있어 기본이 되는 sequest와 target-decoy 논문도 다시 정리해서 업로드 해야 겠다.

---
본 내용은 한양대학교 컴퓨터소프트웨어학과 및 인공지능학과 백은옥 교수님의 강의자료에 근거하여 작성되었습니다!

PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요.:)