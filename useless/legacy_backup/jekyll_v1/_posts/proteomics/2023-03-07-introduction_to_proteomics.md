---
layout: single
title:  "[Proteomics] Introduction of Proteomics"
excerpt: "Proteomics 수업 내용 정리 - Introduction of Proteomics"
toc: true
toc_sticky: true

categories:
  - proteomics
tags: [proteomics]
use_math: true

last_modified_at: 2023-03-07T00:00:00
classes: wide
---

# Central dogma of molecular biology

일반적으로 ‘dogma’의 사전적 의미는 ‘신조, 믿음’이다. 즉 분자 생물학에 있어, 기존의 물리학의 법칙과 같이 확실하게 증명된 것은 없으나, 밑의 그림이 메인 원리와 같이 통용된다.

![Untitled](https://user-images.githubusercontent.com/84653623/223109508-7514fc7a-19a7-40dd-88be-bfb02d8bd922.png)

위 그림에서 주목해야할 점은 크게 2가지이다. `transcription`과 `translation`이다. DNA는 염기서열(A, C, G, T), 4가지 뉴클레오타이드(nuclartide)가 나란히 붙어 이중 나선모양으로 꼬여있는 형태로 존재한다. 이러한 DNA가 염기가 1대1 대응(`transcribe`)하면서 풀려 mRNA가 된다.  mRNA는 messenger RNA를 뜻하는 용어로, 4개의 염기로 되어있는 것은 동일하나 쌍이 아닌 한 줄짜리로 존재한다. 이후 mRNA의 3개의 코돈이 리보솜 안에서 tRNA의 3개의 코돈과 결합함에 따라 1개의 아미노산을 output으로 배출하게 된다. 이때의 3대1 대응을 **translation**이라고 말한다. Protein은 앞서 말한 RNA의 염기서열을 3글짜씩 읽어서, 그것에 대응하는 아미노산으로 만들어진 서열을 말한다. 이 모든 과정에서도 단백질이 상당 부분 기여를 한다.

이러한 과정을 정리하면 다음과 같다.

![Untitled 1](https://user-images.githubusercontent.com/84653623/223109510-07215129-2153-4fd0-b266-bdb732f65130.png)

## 참고하면 좋은 지식

- -ome : ~의 전부 (통칭의 표현)
- polymer : 분자 같은게 여러 개 있다.
- -ase : 효소(단백체) → 어떤 일을 촉진 시킴

즉, **단어의 이름에 기능(뜻)이 내재되어** 있기 때문에 이를 이용해 이해하면 도움이 된다!

---

# Transcription

그럼 transcribe에 대해 알아보자. 아래 위치한 그림을 보면 조금 더 이해하기 편하다. 초기 DNA는 **실제로 유전 정보를 갖고 있는 부분(coding region)인 Exon**과 **유전 정보를 갖고 있지 않은 부분(noncoding region)인 Intron**으로 구성되어 있다. 이 중 **Exon은 단백질 서열을 구성하는데 참여**하게 된다.

![Untitled 2](https://user-images.githubusercontent.com/84653623/223109512-987fb7b1-a7bd-4646-bbf9-4ba48c7fdef6.png)

DNA는 string(문자열) data로 존재하며, 사실 DNA 서열에는 앞과 뒤가 존재하지 않는다. 편의상 순서를 줄 뿐이다. Transcription을 통해 시작과 끝을 표시한 채로 그대로 복제가 된다. 이때 **5’는 앞 쪽**을, **3’는 뒤 쪽**을 의미하게 되며, 이를 **5’cap** 과 **3’ poly-A-tail**로 표현하게 된다. 정리하자면, `transcibe된 DNA를 Primary RNA transcipt라고 부르며, 이 transcript의 앞 부분을 5’, 뒷 부분을 3’이라 명명`한다. `RNA는 5' cap + DNA의 특정부분(Exon + Intron) + 3' poly-A-tail의 형태로 존재`한다. 이후 splicing 과정을 통해, 유전 정보가 없는 Intron은 버리고, coding 정보가 있는 Exon만 연결하게 된다. 이를 **Mature mRNA transcript**이라 부른다. mRNA는 coding과 관련한 모든 정보를 가지고 리보솜에 DNA의 모든 정보를 전달하게 된다.

이 과정을 다시 정리하면 다음과 같다.

![Untitled 3](https://user-images.githubusercontent.com/84653623/223109516-c6064f27-350c-43d1-b8f9-c5d5e6fcdccf.png)

---
# Protein Synthesis

다음으로 mRNA가 Protein을 만드는 과정을 살펴보자. 순서는 다음과 같다.

1. Ribosome에 mRNA가 들어오면
2. 알맞은 염기서열(=각 코돈에 해당하는)을 tRNA가 와서 달라붙고,
3. tRNA가 갖고 있던 아미노산끼리 붙어서 연결
4. 이후 연결된 아미노산에 주목 → 이 아미노산이 folding되면서 단백질이 됨

마지막 4번 과정은 다음 슬라이드에서 확인해 볼 수 있다. 그럼 1번부터 아래의 그림을 참고하면서 살펴보자.

![Untitled 4](https://user-images.githubusercontent.com/84653623/223109520-70312995-a012-4f88-b2a2-550fd1dcb26b.png)

Ribosome에 mRNA가 들어온다는 표현은 어찌보면 잘못 되었다. 그림에서 보이듯, mRNA의 앞부분인 5’부터 진행하여 끝부분인 3’로 끝나게 되는데, 화살표의 방향으로 보면 충분히 혼란을 야기한다. 따라서 쉽게 ribosome이 움직인다고 생각하자. Ribosome 안에서 mRNA의 코돈은 tRNA의 코돈과 결합함과 동시에 tRNA 끝단에 위치한 아미노산이 떨어져 나가게 된다. 이 과정에서 인접한 아미노산과 이어져 하나의 아미노산 띠를 형성하게 된다.  

그림 밑에 존재하는 글을 살펴보면, 코돈 테이블에는 총 64개의 쌍이 존재하지만, tRNA의 아미노산은 20개가 존재하고 있다. 이를 통해 여러 코돈으로 같은 아미노산을 합성할 수 있음을 확인할 수 있다. 

---
# Protein folding

다음 그림은 mRNA가 Ribosome에 들어가 아미노산을 연결하여 protein을 만드는 연속적인 모습을 나타낸다. 이때 아미노산 띠가 folding되지 않도록 Chaperone이라는 단백질이 아미노산 띠를 붙잡고 있다가 마지막에서야 folding을 진행하게 된다. `3차원 구조를 가져야 비로소 어떠한 기능을 할 수 있다`는 점에 유의하자.

![Untitled 5](https://user-images.githubusercontent.com/84653623/223109522-ae0138ce-648d-44d0-a2f4-3a7e77a0a1a7.png)

2017년 openAI는 AlphaFold 모델을 발표했다. ML을 이용하여 protein folding을 예측한 이 모델은 지표가 상당히 높았다. 밑의 그림이 이를 나타낸다. 그렇다면 folding이 일어나는 이유는 무엇일까? 물리, 화학적으로는 아미노산의 서열이 에너지적으로 안정된 구조를 찾는 방향으로 모양이 바뀌기 때문이다. 세포 안의 단백질들은 물과 같은 용액 상태 안에 둥둥 떠다니는 형태이다. 따라서 protein folding을 예측하는데 어려움이 존재했다. 이전의 protein folding을 예측할 때는 계산 및 시뮬레이션과 같은 툴을 이용하여 하나하나 예측을 하였다면, 최근의 protein folding은 ML을 이용하여 예측을 진행하고 있다. 마치 AlphaFold와 같이 말이다.

![Untitled 6](https://user-images.githubusercontent.com/84653623/223109525-12c21da2-ec95-4999-a5cb-25b715c1867e.png)

본 슬라이드에서도 다시 한번 이야기한다. `단백질의 구조는 기능과 연관되어` 있으며, 이러한 구조는 **일부 서열만 비슷하면 추론이 가능하다**.

---
# Protein folding & disulfide bond

3차원 구조를 표시하는 여러가지 방법이 존재한다. 아래 그림을 살펴보면 **H부분**은 힌덱스 구조에 해당하는 부분을, **B는** ɑ sheet과 ß sheet 구조를, **Lys15**는 15번 아미노산의 위치를 표시하고 있다.

또한 [5-55], [14-38], [30-51] 부분은 노란색으로 표시되어 있는데, 이러한 부분을 **disulfide bond**라고 한다. `disulfide bond는 아미노산 사이의 결합을 의미`한다.  

![Untitled 7](https://user-images.githubusercontent.com/84653623/223109530-5e562e2f-94fe-4957-925e-289944e6ea07.png)

---
# Native disulfide & Reversible denaturation

구조와 관련해 살펴보면 아래의 그림과 같다. 

![Untitled 8](https://user-images.githubusercontent.com/84653623/223109534-87019470-f3e1-4eb0-8360-ed91ac2b1870.png)

본 슬라이드에서도 **disulfide bond**에 관해 추가적으로 설명을 하고 있다. 그림을 살펴보면 **S-S 결합의 형태를 띠고 있는데, 이는  SH기를 가진 아미노산인 Cys의 결합**을 나타낸다. Cys의 SH끼리 가까이 가면 H 2개가 산소와 결합하여 H2O가 되어 빠져나가고, S 2개가 공유결합을 하게 된다(산화 과정). 이러한 결합은 비교적 단단한 결합이며, `단백질 분석 시 disulfide 결합은 해석에 있어 방해요소로 작용`한다. 따라서 화학 처리를 통해 끊어내게 된다. 끊어내고 나면 다시 SH로 환원되게 된다.  

---
# Post-translational modifications

PTM은 translation이후의 modification을 의미한다. 다음 그림을 살펴보자. PTM 글자 밑에 위치한 빨간 줄들은 protein을, 그 줄 주변에 위치한 도형들은 modification들을 나타낸다. 

![Untitled 9](https://user-images.githubusercontent.com/84653623/223109539-2541aee1-91c3-4c29-8f37-b6983e5a1f98.png)

Protein은 어떤 상황에 있냐에 따라서, 약간 modify되는 것이 다르다. modification은 별개 아니고, chemical group을 의미한다. 이러한 chemical group이 아미노산 서열에 와서 붙을 수 있다. 여기서 주목해야할 점은 `원래의 단백질에 어떤 chemical group이 붙느냐에 따라서 3차원 구조가 달라진다. 즉 하는 일(기능)이 달라진다.` 

같은 protein에서도 PTM의 종류는 다 다르며, 이에 따라 하는 일이 다 달라지게 된다. 예를 들자면, **기능 혹은 세포 안에서의 위치 등이 다 달라지게 되는 것**이다.

---
# Various modes of alternative splicing

다시 앞부분의 내용을 상기시키며 본 내용을 살펴보자. Primary RNA가 splicing을 통해 mature mRNA로 바뀌는 과정으로 여러가지 가능성이 존재한다.

![Untitled 10](https://user-images.githubusercontent.com/84653623/223109543-1ed725b1-0039-42c0-8206-001327d80360.png)

그림에서 ㅁ상자는 Exon을, ㅡ줄은 Intron을 나타낸다.  이러한 여러가지 가능성은 아래에 나타난 바와 같이 5가지 정도를 대표적으로 제시할 수 있다.

- Exon skipping
- Mutally exclusive exons
- Alternative 5’ donor sites
- Alternative 3’ acceptor sites
- Intron retention

---
# Sources of errors in protein synthesis

아래 그림을 살펴보면, protein이 만들어지는 과정에서 다양한 error들이 존재함을 확인할 수 있다.

다양한 error들이 많기 때문에 DNA 정보만을 가지고 세포 안에서 어떠한 형태로 있을 것인가를 예측하는 일은 그렇게 간단하지 않다. 또한 error지만 생존에 유리하다면 유전 정보의 일부가 될 수도 있다.

![Untitled 11](https://user-images.githubusercontent.com/84653623/223109545-d31054c0-1409-467c-96f5-66301df1f150.png)

---
# Mechanism to increase proteome diversity

DNA로 부터 RNA, Protein으로 가는 과정에서 **다양성**이 계속 증가하게 된다. 그만큼 기능도 다양해진다. 그렇다면 고등 생물일수록 더 많은 종류의 단백질을 필요로 하지 않을까? 이와 관련한 내용은 다음 장에서 이야기하자. 결론적으로 더 고등한 생물일수록, 유전자의 크기를 키우지 않더라도, 이 과정에서 들어가는 `variation(ex. splicing, PTM, etc)의 가능성을 더 많이 활용하면`, **충분히 더 많은 수의 단백질 종류를 확보할 수 있다.** 

![Untitled 12](https://user-images.githubusercontent.com/84653623/223109550-061518b7-9bc2-4441-b7e1-608106bc5ef0.png)

---
# Genome size comparison

유전자의 크기 자체는 단백질의 종류와는 상관이 없다. 클수록 고등 생물인 것도 아니며, 오히려 PTM의 활용 정도가 영향을 준다고 보는 것이 더 정확하다. 

![Untitled 13](https://user-images.githubusercontent.com/84653623/223109552-c61550dc-eea2-4acb-b412-da127fb0985b.png)

---
# Genomics vs. Proteomics

DNA를 설계도라고 비유를 한다면, Protein은 기계에 비유할 수 있다. 크게 5가지를 아래와 같이 비교할 수 있다. 

![Untitled 14](https://user-images.githubusercontent.com/84653623/223109556-2154872c-77af-4daa-8c13-f383fbbb7235.png)

그 조건들은 **amplification(증폭), sensitivity(민감도), type(종류), difference of amount(양의 차이), complex(결합)** 등이 있으며, protein이 훨씬 까다롭고 다루기 어려움을 확인 할 수 있다.

---
# Proteomics: study of proteins

proteomics는 다뤄야하는 data의 크기가 크다는 점과 알고리즘, 분산처리, cloud computing, ML의 발전과 같이 발전했다는 특징을 갖고 있다. 

![Untitled 15](https://user-images.githubusercontent.com/84653623/223109491-a47145d6-5aaa-486a-8cf6-a03963de21d2.png)

Proteomics는 protein에 대한 연구로 어떤 단백질들이 발현되는가, protein의 양이 어떻게 되는가, 서열 밝히기, 단백질의 구조, 단백질과 단백질 사이의 상호작용(붙는가 안붙는가) 등의 연구 분야들이 있다.  

![Untitled 16](https://user-images.githubusercontent.com/84653623/223109497-b2b032fb-4c7a-4718-802e-20af4ccf3724.png)

다음 포스팅 및 수업에서는 이러한 연구들의 방법들에 대해 배워볼 예정이다.

---
# 내용 요약 및 정리

이번에 공부한 내용을 요약하고 정리하면 다음과 같다.

![Untitled 17](https://user-images.githubusercontent.com/84653623/223109502-ffe6d56c-cb6f-4942-9d00-5232685284cb.png)

또한 단백질은 `3차원 구조를 가져야 비로소 어떠한 기능을 할 수 있으며, 이에 따라 구조는 기능과 연관이 있다.`

---
본 내용은 한양대학교 컴퓨터소프트웨어학과 백은옥 교수님의 강의자료에 근거하여 작성되었음을 알려드립니다!

PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요.:)