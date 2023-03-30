---
layout: single
title:  "[Proteomics] Peptide Identification - DB Search"
excerpt: "Proteomics 수업 내용 정리 - PeptID_DBSearch"
toc: true
toc_sticky: true

categories:
  - proteomics
tags: [proteomics]
use_math: true

last_modified_at: 2023-03-30T20:10:00
classes: wide
---
이번 시간에는 **“Peptide identification”** 에 대해 이야기해보자. Peptide identification은 서열 밝히기라고 볼 수 있다.

# Outline

Peptide identification은 크게 3가지 단계로 나뉘어 진다.

>**Tandem Mass Spectrometry** → **Peptide Sequencing** → **Database search**

이 중, **DB search**에서 가장 기본이 되는 논문은 **Sequest**이며 추후 논문 리뷰 포스팅에서 다시 한번 이야기 해보도록 하자.

# Proteomic Data Analysis Pipeline

단백질 데이터 분석의 전체 파이프 라인은 아래의 사진을 통해 쉽게 이해할 수 있다.

![Untitled](https://user-images.githubusercontent.com/84653623/228815575-cb5a9a48-f376-4839-ad68-f0a6ce1f4b7f.png)

먼저 샘플을 통해 단백질을 추출한 다음, 효소를 통한 Protein digestion을 진행한다. 이 과정에서 Protein sequence는 peptide sequence로 바뀌게 되며, 이온화 과정을 통해 Mass spectrometry (MS) 정보를 추출하여 MS1, 즉 precursor 이온을 선별하게 된다. 이후, precursor 이온을 Mass spectrometry를 통해 MS2 spectra 정보를 얻고 (이를 어떠한 방법으로 분석하느냐에 따라 분석법이 나뉜다.) 분석을 통해 peptide의 정보를 얻고, 최종적으로 본 단백질이 무엇인가를 판별하게 된다. 

단백질 분석 방법을 단계에 따라 나누어 다시한번 이야기해보자. 우리는 다음과 같은 Protein sequence를 분석해야 한다.

![Untitled 1](https://user-images.githubusercontent.com/84653623/228815499-68c3b9e2-03e8-421d-9f12-0440b2a9b37c.png)

## Generate Peptides using Specific Enzyme

>Protein complex → **Enzyme** → Peptides

특정 효소를 사용하여 protein sequence를 digest 하여 peptide를 형성한다. 본 그림에서는 절단 효소로서 Trypsin이 작용하였다. Trypsin은 K와 R의 C-terminal을 절단한다는 특징을 갖고 있다.

![Untitled 2](https://user-images.githubusercontent.com/84653623/228815510-4a700a84-bc25-4d51-aa63-7a5d4f74f391.png)

## Mass spectrum

>Protein complex → **Enzyme** → Peptides → **Mass spectrometry (MS)** → MS1 spectra

이후 각 펩타이드의 질량을 분석하게 된다. 이때 측정되는 질량은 **m/z**로 `질량/전하량` 으로 x축에 위치한다. 무게가 적은 쪽부터 큰 쪽으로 하여 그래프 나타내게 된다. y축은 intensity로 얼마만큼의 펩타이드가 존재하는지를 보여준다.

본 과정은 아래의 그림과 같이 표현할 수 있으며, MS1이 본 과정에 해당한다. 본 과정을 통해 protein을 구성하는 peptide의 종류와 그 크기를 확인할 수 있다.

![Untitled 3](https://user-images.githubusercontent.com/84653623/228815514-f499ceca-a71e-4d7f-befb-90d4b50874eb.png)

## Select one peak

>Protein complex → **Enzyme** → Peptides → **Mass spectrometry (MS)** → MS1 spectra → **Mass spectrometry (collision energy)** → MS2 spectra

이 중 하나의 peak을 선택하게 되며, 선택된 peak(peptide)는 precursor라고 부르며 이후 과정에 계속 참여하게 된다.

![Untitled 4](https://user-images.githubusercontent.com/84653623/228815518-b858ecdc-f117-4252-9af1-c0f0c255ce2e.png)

## Tandem Mass spectrum

>Protein complex → **Enzyme** → Peptides → **Mass spectrometry (MS)** → MS1 spectra → **Mass spectrometry (collision energy)** → MS2 spectra

MS1에서 선택된 precursor는 비활성기체와의 충돌을 통해 Energy를 부여 받게 되며, 이온의 형태(precursor ion)로 쪼개지게 된다 **(Fragmentation)**. 이때 side-chain은 그대로 있고 backbone이 잘 끊어지는데, 그러나 이 backbone의 어디가 깨지는지는 모른다.  

![Untitled 5](https://user-images.githubusercontent.com/84653623/228815519-d7ec63cb-45fb-419d-ae8f-8e20acc73bef.png)

>Protein complex → **Enzyme** → Peptides → **Mass spectrometry (MS)** → MS1 spectra → **Mass spectrometry (collision energy)** → MS2 spectra

backbone의 어느 부분이 깨지는지 모르기 때문에 모든 경우의 수를 고려한다. **Precursor 이온의 charge에 따라 어느 한 쪽은 이온이, 다른 한 쪽은 이온의 형태가 아닐 수 있으며, 둘 다 이온일 수도 있다.** 또한 peptide sequence에 K나 R이 있으면 이온화에 유리하다. 이 때문에 Trypsin을 사용하는 경우도 있다. 

MS부터 MS1 spetra 분석, MS2(collision energy)까지의 과정을 Tandem Mass Spectrometry(MS/MS)라고 부르며 몇가지 특징들이 존재한다.

- Tandem Mass Spectrometry (MS/MS) : mainly generates partial N- and C- terminal peptides.
    
    `Fragmentation이 발생한 부분을 기준으로 앞 부분을 N-term 혹은 prefix`라고 부르며, `뒷 부분을 C-term 혹은 suffix`라고 부른다. 
    
- Spectrum consists of different ion types because peptides can be broken in several places.
    
    앞에서 이미 언급한 바와 같이, backbone의 어디가 깨지느냐, 즉 어느 고리가 잘릴지 모른다. 어느 쪽이 이온이 될지 모르며, 아미노산의 서열에 따라 잘 깨지는 곳이 존재하지만, 이를 표현하는 계산식은 따로 존재하지 않는다. 
    
- Chemical noise often complicates the spectrum.
    
    화학적 noise는 spectrum을 복잡하게 할 수 있다. 즉 상당히 민감하다는 것이다. 이러한 노이즈는 외부의 노이즈일 수 있는데, 대표적으로 실험하는 사람의 머리카락 protein인 케라틴, 혹은 internal fragment를 예로 들 수 있다.
    
- Represented in 2-D: mass/charge axis vs. intensity axis
    
    2D로 표현되며, MS1에서와 같이 mass/charge (m/z) 축과 intensity 축으로 나타난다. 
    

또한 아래의 그림에 보이는 스펙트럼에서 각 부분의 질량차이는 각 아미노산의 질량을 의미한다고 볼 수 있다. 예시로 주어진 스펙트럼(아래 사진의 노란색 박스)은 비교적 깔끔하고 예쁜 상태이나, 현실에서는 이보다 더 지저분한 스펙트럼이 나오게 된다.

![Untitled 6](https://user-images.githubusercontent.com/84653623/228815522-c422051c-da2d-494a-99ed-06a3d5c72129.png)

위 그림은 peptide의 prefix만 표시해 놓은 것이다. Prefix를 쭉 따라 읽으면 forward, suffix를 쭉 따라 읽으면 reversed라고 부른다. 이러한 경우는 이상적인 case로 누가 누군지 유추가 가능하다. 그러나 누가 prefix일지, suffix일지 모르기 때문에, 가정을 통해 유추하게 된다.

>Protein complex → **Enzyme** → Peptides → **Tandem Mass spectrometry (MS/MS) →** MS2 spectra

![Untitled 7](https://user-images.githubusercontent.com/84653623/228815526-7d49f308-ac26-4a48-978c-9d1d2abb7f50.png)

Tandem Mass Spectrometry에서는 결국 질량차를 통해 구성 아미노산을 유추가능하다. 그렇다면 이렇게 유추한 MS2 spectra를 어떠한 방법을 통해 분석하고, identification하게 될까? 

# Peptide identification

Peptide idenfication에는 크게 두 가지 방법이 존재한다.

- Database search (Sequest)
- de Novo interpretation (Sherenga)

DB search가 대체적으로 유용하지만, 조금더 심도 있는 경우 de Novo로 진행되게 된다. 두 방법의 차이는 DB의 유무이다. DB는 reference에 불과하며, 항체와 같이 다른 어느 누군가의 고유의 단백질을 분석하는 경우에는 DB search는 그 효용성을 발휘하지 못한다. 즉, `DB가 없는 경우, de Novo interpretation이 더 효과적이다.`

- Database search (SEQUEST)
- de Novo interpretation (SHERENGA)

DB search가 대체로 유용하게 사용되지만 조금 더 심도있는 경우, de Novo로 진행된다. 즉 DB가 주어진다면 DB search로 진행되지만, DB가 주어지지 않는다면 de Novo interpretation이 사용되는 것이다. DB는 reference에 불과하며, DB가 없을 때, 항체와 같이 다른 어느 누군가의 고유의 단백질을 분석하는 경우에는 de Novo가 사용된다.

![Untitled 8](https://user-images.githubusercontent.com/84653623/228815529-8484ae84-a1bb-45a5-9498-1a4261fc8083.png)

## Peptide identification

Peptide identification의 목표는 `Find a peptide with maximal match between an experimental and theoretical spectrum.` 즉, 이론적인(아주 기본적인) 스펙트럼과 실험적인 스펙트럼 사이의 최대 일치하는 펩타이드를 찾는 것이다. 

**Input**으로는 4가지가 들어간다.

- *S* : experimental spectrum
- *△* : set of possible ion type
- *m* : precursor m/z
- *c* : charge

△(델타)는 이온이 어디서 깨지는가를 고려하여 input으로 들어가며, c(charge)의 경우 주어지지 않으면 모든 경우의 수를 고려하게 된다. 그러나 보통 MS1에서 c에 대한 값을 제시해준다.

Precursor m/z는 Precursor의 neutral mass와 charge*proton mass의 합을 charge로 나눔으로서 계산하게 된다.


\begin{aligned}Precursor\;m/z\;={\frac{Precursor\;neutral\;mass\;+\;charge\;*\;proton\;mass}/{charge}\end{aligned}

위 식에서 precursor m/z는 관찰값이며, charge * proton mass 부분에서 charge로 1~3가의 이온이 들어갈 수 있다. 또한 여기서 계산된 percursor의 neutral mass와 비슷한 값의 peptide를 찾는 것을 목표로 한다.

이에 따라 **Output**은 `A peptide with mass M = ((m - m(H^{+}))*c), whose theoretical spectrum matches the experimental spectrum S best.`즉 이론적 스펙트럼이 실험적 스펙트럼 S에 최고로 일치하는 질량 M을 갖는 펩타이드가 나온다.

DB search와 De Novo의 차이를 DB의 유무라고 했는데, 다음 그림을 보면 조금 더 자세히 이해할 수 있다. 

![Untitled 9](https://user-images.githubusercontent.com/84653623/228815531-2bdf920f-b691-434d-9959-384f68a6be31.png)

즉, DB search는 주어진 DB를 고려하기 때문에 시간복잡도가 10^{8}로 고정되어 있지만, de Novo의 경우 모든 경우의 수를 고려하여 최적의 경로를 찾는 D.P.문제와 같기에 20^{n}의 시간복잡도를 갖게 된다. 이때 질량분석기가 인식할 수 있는 펩타이드의 길이는 아미노산 6개부터 50개가 연결된 경우까지이다.

## Peptide identification by database search

DB search를 이용한 peptide identification의 목표는 `Find a peptide from the database with maximal match between an experimental and a theoretical spectrum.`즉, 일반적인 peptide identification과 동일하지만 database로부터 펩타이드를 찾는다는 것에서 차이가 존재한다. 

이에 따라 **input**에도 하나가 더 추가된 5가지가 들어간다.

- *S* : experimental spectrum
- ***P* : database of peptides**
- *△* : set of possible ion type
- *m* : precursor m/z
- *c* : charge

이때 △(델타)는 이온 타입에 따라 다 다르며, (b, y)가 major하게 출력된다.

이에 따라 **output** 또한 `A peptide of mass M from the database whose theoretical spectrum matches the experimental spectrum S best.` 즉, DB로 부터 구해지게 된다.

![Untitled 10](https://user-images.githubusercontent.com/84653623/228815532-dfbf454b-d69e-4591-9029-df99c5621b94.png)

# Database

그렇다면 DB search에서 사용되는 database는 무엇일까? 보통 **UniProtKB**를 많이 사용한다. 

![Untitled 11](https://user-images.githubusercontent.com/84653623/228815534-993adb06-381f-4921-a3b5-380f96a66a41.png)

 UniProtKB는 Swiss-Prot과 TrEMBL구성 되어 있으며, 전문가가 수동적으로 annotation하고 review하였는가 아니면 자동화에 따른 (Automatic) annotation으로 review가 안되었느냐에 따라 구분이 된다. 또한 본 DB는 크게 Human, Bacteria, Virus 등 3가지 category로 분류된다.

## Database - protein

Protein DB는 `.fasta`포맷으로 파일이 저장되며, 단백질 시퀀스와 그들의 헤더 정보가 리스트화 되어 저장되어 있다.

![Untitled 12](https://user-images.githubusercontent.com/84653623/228815536-da587d99-31d8-4a61-8741-e124be5071f9.png)

## Database - peptide (In silico digestion)

위와 같은 단백질 시퀀스가 들어오면, 특정 조건에 맞춰서 digestion과정을 반영하여 peptide sequence가  구해진다. 이 과정은 코드로도 구현할 수 있는데 추후 업데이트 할 포스팅에서 코드와 관련한 부분을 다룰 예정이다. 

내용만 이야기해보자면, input으로 protein sequence가 들어올 때,  parameter로 **절단 효소와 절단 위치를 이야기하는 Enzyme rule**과 **Number of missed cleavage**, **Enzymic site information(fully, semi, none)**이 주어지게 되며, output으로 peptide sequence와 각 파라미터에 대한 정보가 출력된다. 이러한 과정은 아래의 그림을 통해서 확인이 가능하다.

![Untitled 13](https://user-images.githubusercontent.com/84653623/228815538-c5904a09-dcf7-47b1-b667-8547002138d2.png)

# Basics for theoretical spectrum generation

시퀀싱한 펩타이드 DB를 바탕으로 이론적인 spectrum을 만드는 과정에 대해 알아보자.

Glycine을 예시로 들어 살펴보면 아래의 그림과 같다.

![Untitled 14](https://user-images.githubusercontent.com/84653623/228815540-de5fd2eb-1756-4876-8d0a-b6843b4ca1db.png)

Glycine(G)의 경우, 기본적인 backbone인 C_{2}H_{2}NO에 R위치에 H가 붙은 화학 구조를 갖는다. Free amino acid는 G가 단독으로 존재하는 경우를 나타내며, Amino acid residue는 펩타이드에 G가 결합되어 있을 경우를 나타낸다. 이때 전하를 띄지 않는다면 Neutral 상태에 있다고 말할 수 있다. Monoisotopic mass는 단일 동위원소의 질량을 나타내며, 분자 내 각 원자의 가장 풍부한 자연 발생 안정 동위원소의 질량의 합을 취하여 계산이 된다. (이 부분에 대한 설명은 다음다음 사진에서 다시한번 더 다룬다.)

![Untitled 15](https://user-images.githubusercontent.com/84653623/228815542-9811d9ac-41f9-46e8-ad24-71766d02b213.png)

위의 사진을 보면, 각 아미노산의 residue를 나타내며, 동위원소를 고려한 Avg. mass와 residue mass인 Mono. mass도 같이 포함되어 있다.

이때 Cysteine(C)와 Methionine(M)에서는 질소(N) 대신에 황(S)이 포함되어 있음을 확인할 수 있으며, 그를 제외한 나머지 아미노산들은 탄소(C)와 수소(H), 질소(N)으로 화학식이 구성되어 있음 또한 확인할 수 있다.

다음 그림은 MS1 그래프를 나타낸 것이다. 동위원소의 존재로 인해 다음과 같은 peak들이 여러번 나타나게 되며, 첫 번째 peak이 제일 작은 질량임을 확인할 수 있다. 두 번째 peak은 +1Da, 세 번째 peak은 +2Da, 네 번째 peak은 +3Da일 경우를 나타내며, mono와 다음 peak의 mass 사이의 Da 차이를 통해 charge를 계산할 수 있다.

![Untitled 16](https://user-images.githubusercontent.com/84653623/228815546-bf407295-2438-4a08-89fd-9948690667bc.png)

- **Monoisotopic mass** is the mass determined using the masses of the most abundant isotopes.
- **Average mass** is the abundance weighted mass of all isotopic components.

Aver. mass는 탄소 갯수에 따라 질량차(0.x_ or 0._)가 증가하게 됨을 알아두자.

펩타이드가 fragmentation될 때 어디가 잘리느냐에 따라서 부르는 이온의 명칭이 달라진다. 

![Untitled 17](https://user-images.githubusercontent.com/84653623/228815550-a745c622-d1a3-4377-9251-08461b9afd52.png)

잘린 부분을 기준으로 좌측과 우측은 (a-ion, x-ion), (b-ion, y-ion), (c-ion, z-ion)과 같이 쌍을 이루는 이온의 형태로 존재한다. 이때 각 이온의 아래 첨자는 residue의 갯수를 의미하며, 본인은 C에 결합된 R의 갯수로 생각하면 좋겠다는 생각을 했다. 위에 제시된 그림에서 보이듯이, 빨간 점선의 박스가 아미노산 residue mass를 의미한다. 

Mass of a neutral peptide는 residue mass의 합과 terminating group의 mass의 합으로 표현되며, 이때, masses of the terminating groups는 N-terminus의 H와 C-terminus의 OH를 예로 들 수 있다.

아미노산의 resifue mass list는 [다음 링크]([http://www.matrixscience.com/help/aa_help.html](http://www.matrixscience.com/help/aa_help.html))를 통해 보다 자세히 확인할 수 있다. 

## E.g. PEP

PEP를 예시로 하여 mass를 계산하고, 각 이온의 mass, 각 이온의 화학 구조식들, 스펙트럼을 구해보면 다음과 같다.


$$
\begin{aligned}Neutral\;mass\;&=\;sum(residues)\;+\;H^{+}\;+\;OH^{-}\\&=\;sum(PEP)\;+\;H_{2}O\\&=\;(97.052+129.042+97.052)\;+H_{2}O\\&=\;341.159\end{aligned}
$$

$$
\begin{aligned}&a_{2}^{+}\;=\;199.108\;\;\;\;\;\;x_{2}^{+}\;=\;271.093\\&b_{2}^{+}\;=\;227.10268\;\;y_{2}^{+}\;=\;245.113\\&c_{2}^{+}\;=\;244.129\;\;\;\;\;\;z_{2}^{+}\;=\;228.088\end{aligned}
$$

![Untitled 18](https://user-images.githubusercontent.com/84653623/228815554-a1521677-60eb-4b57-a2da-77e6ef15679f.png)

스펙트럼을 살펴보면, `y-ion이 상대적으로 mass가 큼`을 확인할 수 있다. 특정 fragment ion의 이온화 효율은 화학적 특성, 전하 상태 및 이온화에 사용되는 실험 조건을 비롯한 다양한 요인에 따라 달라질 수 있다. 그 중, y-ion은 일반적으로 peptide fragmentation 중 형성되는 방식 때문에 b-ion보다 상대적으로 무겁게 된다. 이유를 파악하기 위해서는 먼저 y-ion과 b-ion의 형성과정을 이해해야 한다.

y-ion은 펩타이드 결합의 C-terminal을 아미노산의 잔기로 절단하여 형성이 되며, 그 결과 펩타이드의 N-terminal을 포함하는 fragment ion이 생성된다. 이와는 대조적으로, b-ion은 아미노산 잔기에 대한 펩타이드 결합 N-terminal을 절단함으로써 형성이 되며, 그 결과 펩타이드의 C-terminal을 포함하는 fragment ion을 생성한다. **C-terminal에서 N-terminal로 이동함에 따라 peptide backbone의 mass가 증가하기 때문에 peptide의 N-terminal을 포함하는 y-ion은 일반적으로 C-terminal을 포함하는 b-ion보다 무거운 것**이다.

스펙트럼에서 다양한 유형의 fragment ion의 상대적 존재비는 사용된 특정 fragmentation의 방법, peptide 서열 및 다양한 유형의 이온의 ionization 효율을 비록한 다양한 요인에 따라 달라질 수 있다. 일반적으로 collision-induced dissociation(CID) fragmentation에 의해 생성된 스펙트럼에서 y-ion이 b-ion보다 더 풍부한 경향이 있다.

많은 경우에서 Trypsin을 절단효소로 하여 시퀀스의 C-terminal를 절단하기 때문에 그 결과 y이온의 이온화 경우의 수가 많다고 생각할 수 있다.

![Untitled 19](https://user-images.githubusercontent.com/84653623/228815557-6ec97b34-6a49-43a8-a21a-bdfaaa281443.png)

각 펩타이드에 대한 스펙트럼을 미리 만들어두면 도움이 되지 않는가라는 생각을 할 수 있다. 그러나 매번 비교하는 DB가 바뀌기 때문에 미리 만들어둔다고 하더라도 쓸모가 없는 경우가 다반수이며, 적용되는 parameter에 따라 스펙트럼은 다르게 나타난다.

위의 첫 번째 그림과 같이 특정 단백질 시퀀스 DB에서 단백질을 불러오면, 절단효소에 따른 Fragment를 구하고, 그 이후 MS/MS Spectrum을 계산하게 되며 이를 통해 실험값에 의한 spectrum과 비교를 하게 된다.

두 번째 그림은 최근 딥러닝 기술의 발전으로 변화된 스펙트럼 예측의 방법을 보여준다. PROSIT의 경우 550,000개의 tryptice peptides와 2,100만개의 high-quality tandem mass specta를 학습시킨 딥러닝 모델로, 미리 데이터를 합성 후 비교를 통해 학습하였다고 알려져있다. 즉, 학습을 위해 dataset을 다시 새로 만들었으며, b-ion과 y-ion의 상대적인 양을 기반으로 위치를 예측한다. 

prosit 또한 추후 paper review에서 다룰 예정이다.

# Match between spectra

그렇다면 실험에 의한 spectrum과 DB에서 구한 spectrum의 비교는 어떻게 이루어질까?

아래의 그림을 보면 Query Spectrum, 즉 실험 spectrum이 주어지면 이를 Spectral Database의 결과와 비교를 통해 결과를 도출한다. 이때 비교하는 방법도 다양하게 존재한다.

![Untitled 20](https://user-images.githubusercontent.com/84653623/228815559-52640f4c-e95d-46e1-922e-7a4e3fa51a70.png)

## Match between spectra - SPC

첫번째로 **SPC, Shared Peak Count**이다. SPC는 두 스펙트럼 사이에서 공유된(동일한) peaks(=masses)의 갯수를 세는 방법이다. ‘# of 공통된 peak’이라고 볼 수 있다.

- The match between two spectra is the number of masses (peaks) they share **(Shared Peak Count of SPC)**
- In practice mass-spectrometrists use the weighted SPC that reflects intensities of the peaks
- Match between experimental and theoretical spectra is defined similarly

## Match between spectra - SEQUEST

다음으로 SEQUEST이다. SEQUEST는 paper로도 나왔으며, **Cross correlation**방법을 사용하였다는 특징을 갖는다. **Cross correlation**은 두 계열의 유사성을 다른 계열에 대한 한 쪽 변위의 함수로 나타내는 측도를 말하는데, 음 이 표현은 너무 번역한 느낌이 든다.

쉽게 말하자면, 유사한 특징을 같도록 두 스펙트럼에 푸리에 변환 등과 같은 방법으로 비슷하게 변환하는 것이다. 이 부분이 SEQUEST 논문에서의 핵심이었기 때문에 추후 paper review에서 자세히 다루어보도록 하겠다.

![Untitled 21](https://user-images.githubusercontent.com/84653623/228815563-2e86a4bd-3337-4671-913c-c072c52e4aca.png)

## Match between spectra - SEQUEST/Comet

SEQUEST가 상업화됨에 따라 유사한 방법을 이용하여 만든 tool이 바로 Comet이다. 여기서도 Cross correlation을 통해서 상대적 일치를 평가하고자 하였는데, Auto correlation 부분은 배경 부분이라 Cross correlation에 비해 직접적인 평가를 하지 않는다. Sequest와 Comet 둘다 XCorr 점수를 통해 상대적인 값으로 match(일치)를 평가하게 된다.

![Untitled 22](https://user-images.githubusercontent.com/84653623/228815565-38c06bf4-98e0-453d-b8d0-472caa715881.png)

## Match between spectra - X!Tandem score

또 다른 방법으로 X!Tandem score가 있다. 여기서 관여되는 점수로 **by-score**와 **Hyperscore**가 있다. `by-score`는 b- 혹은 y-ion의 일치 peaks의 intensities의 합으로 나타나게 되며, `Hyperscore`는  by-score에 y이온의 갯수!와 b이온의 갯수! 의 곱으로 나타난다. 아래의 그림을 통해 쉽게 이해할 수 있을 것이다. 이러한 점수를 공식화 하면 아래 오른쪽 그림과 같다. 

![Untitled 23](https://user-images.githubusercontent.com/84653623/228815568-14a074bc-2ec4-4490-8731-82b8e5fd25ab.png)

이러한 점수들을 통해 아래와 같이 ‘Hyperscore-axis’와 ‘# of Matches -axis’ 그래프를 얻을 수 있다. 첫 번째 그래프에서는 비선형적인 양상을 보여 best hot을 계산하기 어렵지만, 두 번째 그래프에서 볼 수 있듯이 ‘# of Matches -axis’에 log를 취하여 주므로써 선형성을 띄도록 만들 수 있다. 이후 Best hit에 해당하는 부분을 구할 수 있게 된다. 

![Untitled 24](https://user-images.githubusercontent.com/84653623/228815572-37925864-9c59-412c-8cc3-c48512f8db8f.png)


# 내용 요약 및 정리
이번 포스팅에서는 펩타이드의 서열을 밝히는 방법을 중심으로 하여 Tandem Mass Spectrometry[MS/MS]와 peptide sequencing, Database search 기법에 대해 알아보았다.
특히 SEQUEST의 경우 DB search의 가장 기본이, 기초가 되는 논문으로 추후 paper review로 업로드 할 예정이며, Sequest가 상업적인 툴이라면, X!Tandem은 public한 툴로서 그 방법에 대해 알아볼 수 있었다.

---
> 본 내용은 한양대학교 컴퓨터소프트웨어학과 및 인공지능학과 백은옥 교수님의 강의자료을 바탕으로하여 작성되었습니다!

> PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. :)