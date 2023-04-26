---
layout: single
title:  "[Proteomics] Peptide Identification - De novo sequencing"
excerpt: "Proteomics 수업 내용 정리 - PeptID_Denovo"
toc: true
toc_sticky: true

categories:
  - proteomics
tags: [proteomics]
use_math: true

last_modified_at: 2023-04-27T03:04:00
classes: wide
---
저번 시간에는 Peptide identification의 DB Search에 대해 알아보았다. Peptide identification에는 두가지 방법이 있는데, 이번 시간에는 또 다른 방법인 **De novo sequencing**에 대해 이야기해보려 한다. 

짧게 정리해서 이야기 해보자면, De novo sequencing은 DB search와 달리 비교할 대상이 없이 실험 data만 가지고 펩타이드를 식별하는 방법이다. 비유하자면 맨땅에 헤딩하는 느낌이랄까?

# Tandem mass spectrum

앞서 서두와 [이전 포스팅](https://sehooni.github.io/proteomics/PeptID_DBSearch/)에서 이야기하였듯이, MS2 spectrum을 분석하는 방법은 크게 두 가지로 나뉜다. 

- Database search (SEQUEST)
- de Novo interpretation (SHERENGA)

MS2 spectrum을 분석하여 우리는 최종적으로 본 단백질이 어떤 단백질인지 밝히고, 그 시퀀스 정보를 구하는 것에 목적성을 두고 있다.

![Untitled](https://user-images.githubusercontent.com/84653623/234660607-91790c00-5932-4ac1-a20e-8142df7dc22a.png)

# De novo VS Database search

Database search는 모든 가능한 data와의 비교를 통해 어떤 단백질이 발현되었는가와 관련된 서열을 밝히는데 집중하였다면, **De novo**는 `Graph를 만들고 그와 관련한 알고리즘을 만들어 해결`한다. 결론적으로 non-guess path 찾기라고 이야기 할 수 있으며, 이 과정에서 **DP(Dynamic Programming)** 를 이용하게 된다.

![Untitled 1](https://user-images.githubusercontent.com/84653623/234660557-c7b68202-c3f0-492d-ab26-f7db0d361457.png)

# Basic principle of de novo sequencing

*De novo* sequencing의 main idea는 다음과 같다.

- Use the **mass difference between two fragment ions** to calculate the mass of an amino acid residue on the peptide backbone.
- E.g. mass difference between y6 and y7 = 129 ~> residue E.

즉, 두 fragment ion 사이의 mass 차이를 이용하여 peptide backbone에 위치한 아미노산 residue의 mass를 계산하는 것이다. 그러나 모든 이온을 고려하면, 나타나지 않는 것들도 대다수 존재한다.

![Untitled 2](https://user-images.githubusercontent.com/84653623/234660560-596ed9fe-89fa-4fa4-9c69-a88a3ad3225a.png)

# De novo sequencing workflow

*De novo* sequencing의 workflow는 다음과 같다. 먼저 spectrum graph를 만들고, 이후 최적의 경로를 찾아 sequence를 추정하게 된다.

![Untitled 3](https://user-images.githubusercontent.com/84653623/234660563-fd51bbe5-b19f-4991-9b56-c1bb4ecacdf0.png)

위 그림에서 볼 수 있듯이, 처음 출발 지점을 mass가 0일 때로, 마지막 지점을 peptide mass 일 때로 지정해 준다. 이후 DP를 활용하여 점수가 높은, 최적의 path를 찾아 sequence를 계산한다.

이러한 최적의 path를 찾는 부분에 있어 고려해야하는 사항은 Fragment peak 다루기이다. 다음과 같이 4개의 아미노산이 있는 스펙트럼이 주어졌다고 가정해보자

## De novo sequencing

![Untitled 4](https://user-images.githubusercontent.com/84653623/234660566-14303547-f209-4074-ac8c-8dc7fe13d994.png)

이때의 b-ions는 **neutral mass (=mass of Amino Acid) + proton**을 통해 계산이 가능하며, y-ions은 **neutral mass + 19**를 통해 계산된다. b-ion에서 88과 145는 각각 b1과 b2를, y-ions에서 147과 276은 각각 y1과 y2의 mass를 의미한다. b와 y 이온이 semetric하지 않기 때문에 위의 스펙트럼은 KEGS가 아닌 SGEK로 파악이 가능하다. 즉, 결국 **b이온과 y이온은 구별이 되는 것이다.**

여기서 y이온에 19가 더하여진 이유를 살펴보자면 원래의 아미노산이 NH-CH-CO에 R이 붙은 구조를 갖는데, y이온의 경우 -OH를 갖으며 H_{2}가 붙은 형태이기 때문에 총 H_{3}O^{+}의 mass 값을 더하여 주는 것이다. 이는 아미노산 S의 원래 mass는 87이지만 이온의 형태이기 때문에 1을 더해서 계산하는 것과 같은 이치이다.

사실 이와 같이 b이온과 y이온이 섞여서 검출되기 때문에 우리가 서열을 파악하는데 있어 어려움을 겪을 수 있고, 질량 차이로만 이를 판별하는 과정에서 또한 어려움을 겪을 수 있다. 그러나 b이온과 y이온이 결국은 구별되기 때문에 전체를 놓고 우리가 이 친구가 어느 방향의 서열이 맞는 것인지 결정 할 수 있다. 즉, 서열에서 나올 수 있는 모든 이온들이 관찰되지 않더라도, 서열을 완벽하게 복원할 수 있는 경우가 종종 있다.

이제껏 b이온과 y이온이 섞여서 나오기 때문에 해석에 있어 어려움이 존재할 수 있다는 이야기를 했다. 그렇다면 한 쪽의 이온만 나온다면 어떠할까?

![Untitled 5](https://user-images.githubusercontent.com/84653623/234660570-b847745e-66e7-4e20-b3ea-db489b7ed384.png)

여기서 prefix ions란? N-terminal 이온들로 a, b, c이온들을 통칭한다. [이전 포스팅](https://sehooni.github.io/proteomics/PeptID_DBSearch/#eg-pep)에서 이와 관련한 이야기를 다루었었다.

즉, 위 사진에서의 prefix ions은 b-ion들로 S, SG, SGE, SGEK를 예로 들 수 있다. 이와 같이 한 쪽으로 다 몰면 좋겠는데, 처음에는 모른다. b와 y 이온만 검출된다고 하더라도, 섞여 있을 가능성이 높기 때문에 스펙트럼 안의 이 친구들을 어떻게 구별하느냐가 중요하지만. 결론적으로 `구별 할 수 없다. 따라서 이 두 가지 가능성을 다 놓고 처리를 하는 일이 중요`하다.

## forbidden pairs

이때 **forbidden pairs**라는 개념에 주목해야 한다. 경로를 찾을 때, 한 경로에서, 즉 한 peak에 2개의 node 동시에 사용 불가하다는 점이다. 다음 사진과 동시에 보면서 이해해보자.

![Untitled 6](https://user-images.githubusercontent.com/84653623/234660574-aad24510-a9fe-4245-b767-7f3e05133378.png)

다음과 같은 스펙트럼에서 4개의 fragment ions peak이 관찰되었는데 그게 이렇게 전부 prefix ion만 나오면 sequencing이 굉장히 간단해진다. 뭔가 한 쪽으로 몰면 좋겠다! 이런 생각을 하는 것이다. 

이와 같이 한 쪽으로 몰고 싶은데 한 쪽으로 몰 수 있는 정보가 없기 때문에 각각의 fragment ion이 b ion일 경우, y ion일 경우 두 가지를 다 고력해서 스펙트럼 그래프에다가 노드를 만들어 그래프를 만들 때 스펙트럼 그래프의 노드는 결국 질량 스펙트럼에 있는 fragment ion peak에 해당하는 애가 node가 된다. 그러나 하나만 만드는 것이 아닌 노드를 b 이온일 경우의 노드, y 이온일 경우의 노드 이렇게 2개를 만드는 것이다. 

이때 한 peak을 가지고 두 개의 node를 만들었기 때문에 어떤 조건이 걸려야 하냐면, 이 두 개의 노드는 동시에 사용되면 안되는 것이다. 즉 b ion이면서 동시에 y ion이면 안되는 것이다. 다른 경우에는 괜찮다. 예를 들어 이쪽으로 보면 이 친구가 b ion처럼 보이고, 저쪽에서 보면 y ion처럼 보이는 건 괜찮은 것이다. 단, **이 친구를 해석함에 있어 동시에 b ion이고 y ion인 것처럼 생각해서 서열을 해석하는 것은 안된다**는 것이다. 이를 forbidden pairs라고 부른다.

이제 결과적으로 이게 그러면 둘 중에 어느 게 맞느냐 하는 거는 이제 문제를 다 풀고 나서 경로가 결정되면, 얘가 b ion이었네 혹은 얘가 y ion이었네 가 마지막에 결정되는 것이다. `문제를 풀고 나서야 비로소 결정이 되는 것이고, 푸는 과정에서는 계속 모른 채로 여러 가능성을 놓고 고려를 하는 것이고, 그 중에 가장 어떤 의미에서 좋다고 생각되는 애를 고르는 문제인 것이다.`

## Computing possible prefixes

다시 처음에 봤던 문제로 돌아가서 살펴보면, b ion은 prefix에 해당하는 서열의 질량, neutral mass(charge를 고려하지 않는, N-terminal과 C-terminal에 해당하지 않는 질량)에 1만큼 더해준다. (간단하게 설명하기 위해서 integer로, 정수로 바꿔서 이야기 하는 것이다. proton은 그냥 질량이 1이다 이렇게 생각하는 것이다.) 또한 y ion의 질량은 surffix에 해당하는 아미노산들의 neutral mass에다가 19만큼 더한 것이다. 따라서 우리가 **prefix와 surfix를 더하면 그게 전체 peptide의 neutral mass가 되는 것**이다. 결국 (아래 그림의 Ion Offsets) **Surffix는 전체 질량에서 Prefix 만큼의 질량을 빼준 값이다**라고 우리는 생각할 수 있는 것이다.

![Untitled 6](https://user-images.githubusercontent.com/84653623/234660574-aad24510-a9fe-4245-b767-7f3e05133378.png)

예를 들어서 88이라는 질량을 보았다면, 이 친구가 b일지 y일지 모른다. 그러나 우리는 지금 전체 peptide의 질량을 알고 있는 상태이다. 왜냐하면 MS1에서 골라서 왔기 때문에, 언제든지 precursor mass는 아는 것이다. 원래는 precursor의 m/z 값을 아는데, charge를 구할 수 있기 때문에 precursor의 mass 또한 구할 수 있는 것이다. 

그래서 전체 질량을 알고 88이라는 값을 보면, 이 친구가 b ion이라고 생각하면 이거에 해당하는 prefix의 residue mass는 87이다. 1만큼 원래 더해야 b ion이 되는 거니까 이것에 해당하는 prefix residue는 87인 것이다. 

이 친구가 반대로 y ion이라고 생각해보자. 우리는 surffix mass에 관심있는 것이 아닌 그거에 대응되는 prefix mass로 바꾸고 싶은 것이다. 즉 우리가 원하는 방향으로 다 한 쪽으로 바꿀 것이다. 스펙트럼 그래프에 들어가는 노드들은 다 한 타입의 ion들 인 것이다. prefix ion들의 질량들을 나타내는게 그래프의 노드로 들어갈 것이다. 

prefix하고 surffix가 섞여 있으면 처리하기 어렵기 때문에 **얘를 b ion으로 봤을 때의 prefix mass, y ion이라고 생각했을 때의 그거에 대응되는 저쪽 prefix mass를 측정하는 것**이다. 그렇게 해야 전체적으로 처리가 간단할 것이다. 그래서 예를 들어서 내가 관찰한 게 해당 peak인데, 얘가 surffix다 라고 생각하면 이거에 대응하는 나머지 prefix mass를 구해서 spectrum 그래프에 넣고 싶은 것이다. 그래야 전체적으로 서열을 구하는 게 쉬워진다.

이와 같이 가능한 모든 이온들의 prefix residue를 **Prefix Residue Masses(PRM)** 이라고 한다.

![Untitled 7](https://user-images.githubusercontent.com/84653623/234660578-5747bb9d-d5e7-4e07-be6f-a5b02b5f174e.png)

위의 그림을 통해 살펴보면, 우선 전체 peptide의 mass는 401이다. 또한 여기서 나타 날 수 있는, 관측된 4개의 peak이 y이온일 때와 b 이온일 때를 모두 구해보면, (8가지 중 겹치는 2가지를 제외) 총 6가지의 mass들이 나타나게 된다. 이 들이 아미노산의 질량에 해당하는가를 계산한다. 계산을 해서 그 아미노산의 질량하는 경우에만 그 노드들을 edge를 통해 연결하게 된다. prefix중 극히 일부만 이에 맞게 나타나며, 올바를 경우 아미노산 만큼의 질량 차이를 가지고 나타날 것이기 때문에 해당하는 노드가 그래프에 나타나게 된다. 87과 144의 차이는 57Da으로 이는 아미노산 중에 제일 작은 글라이신(G)에 해당하면서 여기에 edge가 들어가게 되는 것이다. 

## Spectral graph

실제 현실적으로 de novo sequencing 알고리즘을 만들 때는 아미노산 한개 한 개, 그 어디에선가 다 연결이 될 만큼의 정보가 스펙트럼 안에 다 있어야 한다. 하나라도 빠지면 edge 연결이 안되기 때문이다. 따라서 실제로 알고리즘을 구현할 때는 이 edge를 언제 추가하냐면, 아미노산 한 개의 질량이 아니라 두 개까지는 당연히 허용하고, 그래봐야 종류는 400개 정도이기 때문에 가끔은 3개 이런 것도 고려한다. `즉 얼마 만큼을 tolerance를 가질 것이냐, 중간에 빠지는 prefix의 residue mass를 한 개 허용할 것인가 두 개 허용할 것인가 이런 것들이 이제 알고리즘의 complexity를 높이는 하나의 요인으로 작용`한다.

![Untitled 8](https://user-images.githubusercontent.com/84653623/234660580-9ac17e73-f51f-418f-b0c2-c46de7128aaf.png)

이제껏 앞에서 이야기한 것 처럼 prefix의 residue mass를 다 구하면 아래의 그림과 같이 노드들이 이렇게 생성이 된다. 첫 노드는 0이고 마지막 노드는 precursor의 mass에 해당하는 값을 갖는다. 이 두 노드는 특별히 들어가는 것이며, 앞에서 보았던 표에서 선정된 6개의 값들이 파란색으로 표시된 노드들로 표시된다.

두 노드들 사이의 질량 차이를 통해 아미노산을 유추하게 되고, 이를 바탕으로 질량 차이에 해당하면 edge를 넣는 것이다. 이런 식으로 경로 0에서 시작해서 precursor mass에 해당하는 마지막 거에서 끝나는 경로를 찾는 것을 목표로 한다. `그 경로에 해당하는 이 아미노산들이 결국 서열이 되고 그게 이 스펙트럼에 대한 해석이 되는 것`이다. 이때 앞서 수 없이 이야기한 forbidden pair의 유무를 확인해야 하므로 까다로운 조건이면서 또 그래서 유리한 조건으로 작용하게 된다.

![Untitled 9](https://user-images.githubusercontent.com/84653623/234660582-41e3aa1c-9080-4acc-b738-3af79f888583.png)

# Re-defining *de novo* interpretation

문제를 다시 정의하자면, 시작 노드와 마지막 노드에 0과 M(precursor mass)가 들어가며 스펙트럼의 각각의 픽은 최대 하나의 노드에만 기여해야 한다. `즉, 맨 마지막 해석에는 각각의 픽이 만든 노드들 중에 하나만, 최대 하나만 들어갈 수 있다.` 인접한 노드들은 edge를 통해 연결되어 있어야 하며, 그 다음 이제 여러 개의 경로 중에 가장 좋은 것을 고를 수 있는 적절한 목적함수가 있어야한다. 이 목적함수가 무엇인지는 나중에 생각하고, 일단 알고리즘을 먼저 이해하고 그 다음에 목적함수를 어떻게 정해야 하는지 이야기 하도록 하자. 

![Untitled 10](https://user-images.githubusercontent.com/84653623/234660585-afe74fee-48f8-4e04-8005-98d7d4d9b470.png)

## Two problems

전체 스펙트럼 그래프에서 실제 b-ion, y-ion에 해당하는 애들은 극히 일부이고, 그 다음에 우리가 forbidden fair를 피하는 경로를 찾는 문제를 풀어야되는 건데 이를 **NP-hard**라고 부른다. NP-hard란, 우리가 P하고, NP는 알고, (NP 중에 제일 어려운 것 = NP conflict, NP conflict는 NP-hard 중에 제일 쉬운 문제들을 의미) 일반적으로 NP-conflict 보다 더 어렵다고 생각되는 문제(어렵다 =  복잡도가 높다)를 의미한다.

![Untitled 11](https://user-images.githubusercontent.com/84653623/234660587-27e9d8b8-7a2e-4d4f-9c4f-a7ab8a3dc4f4.png)

그런데 이제 한가지 재미있는 특징이 b-ion,  그러니까 prefix와 surffix, (이렇게 짝을 생각할 수 있다.) 과 b-ion과 그것에 대응되는 이쪽 surffix의 y-ion, 전체 peptide의 길이가 N이라고 이야기 하면, b_{i}가 있으면, y_{n-i}가 있다고 볼 수 있다.

`즉 쌍으로 존재를 한다는 것이다. 둘이 complementary하므로 둘이 합치면 전체가 되고, 서로 한 쪽을 알면 나머지를 알 수 있는 이런 관계인 것`이다. 

![Untitled 12](https://user-images.githubusercontent.com/84653623/234660588-218250ad-dca9-4aa9-92e1-8d98deb40a5f.png)

만약에 b_{i}가 y_{j}보다 작으면, y_{i}는 반드시 y_{j}보다 크다. 합해서 전체 M이 같은데, 한 쪽이 크면 반대쪽은 작아야 한다. 그림으로 보면 다음과 같다. 이 pair가 b-y pair라고 생각을 하고, 그 친구들이 이렇게 선을 통해 연결을 해놓고서는, 둘이 complementary pair다 이렇게 이야기 하는 것이다. (0과 precursor mass M도 complementary pair이다.)

아래 그림은 surffix mass를 prefix mass로 바꿔놓아 더하면 precursor mass가 되지는 않지만, surffix라면 더하면 M이 된다. 이와 같이 쌍으로 존재하는데 그림을 그려보면 아래와 같이 서로 교차하는 일은 발생하지 않는다. 따라서 forbidden node fair들을 생각해보면 이 친구들은 절대로 서로 intercept하지 않고 늘 이렇게 포함관계로 존재한다. 

![Untitled 13](https://user-images.githubusercontent.com/84653623/234660590-fcf99cc5-1572-46c0-9eb8-41a2574c1761.png)

이러한 조건을 우리가 DP(Dynamic Programing)를 해서 이 문제를 해결해 볼 수 있다는 게 다음부터 이야기할 내용이다. 

## The forbidden pairs method

결국 우리가 원하는 것은 forbidden pair를 피하는 path중에 어떤 값을 maximize하는 path를 구할 것 인데, 어떤 값을 maximize 할거냐 하는 것은 일단은 그냥 누군가가 줬다고 치고, 그 준 값을 델타라고 칭하자. 델타라는 함수가 있어서 그 델타는 node에 주어지는 값이다. (node = ion peak = PRM)

PRM이 주어지면 너는 몇 점짜리라고 주는 어떠한 함수가 있다고 치자. 그 함수가 나타내는 것은 그 PRM이 실제로 올바른 것이고 걔가 올바르다는 거는 해석에 포함되는 것이다. 서열을 설명하는 해석에 포함되는 것을 이야기하는 정보를 나타내는 어떠한 함수가 있고, 그 함수가 이미 우리에게 주어져 있는 것이다. 알고리즘만 먼저 살펴보자.

![Untitled 14](https://user-images.githubusercontent.com/84653623/234660593-479da357-9c3d-497a-bcf6-820d9dce106f.png)

일단 그래프 안에 있는 모든 PRM들을 다 sorting한다. 그러면 아래의 그림과 같이 순서대로 나열이 된다. 그 다음에 이제 로테이션 상으로 어떤 그래프에 있는 node u에 대해서 그거에 대응되는 저쪽 나머지 forbidden pair의, u에 대응하는 짝이 되는 친구를 f(u)라고 쓰는 것이다.(이와 같이 쌍을 만드는 것이다.)

그 다음, 이제 이 노드의 실제 mass가 얼마냐 라고 나타내는 것이 m(s)이다. 이것은 단지 notation에 불과하다. 각각의 노드는 어떤 prefix residue mass를 나타내고 있는지 당연히 적혀 있다. 

## D.P. for forbidden pairs

이 이후 우리가 할 거는, 모든 가능한 prefix residue mass에 해당하는 이 node pair들에 대해서 뭔가를 계산할 것이다. 그 node들에 대해서 내가 어떤 pair만 계산을 할 거냐면, 이 pair u와 v라고 하는 두개의 한 쌍의 node를 생각할 때, u는 전체 peptide 질량의 절반보다 작거나 같고, v는 절반보다 크거나 같은 경우만 내가 고려하겠다 이 말이다. 이건 이제 이 forbidden pair가 m/2를 중심으로 늘 양쪽으로 있다는 이 성질을 잘 활용하고 싶어서 이렇게 하는 것이다.

다이나믹 프로그래밍(DP, Dynamic Programing)은 결국 어떤 테이블을 채우는 것이다. 우리가 채울 테이블의 이름은 S이다. 그 S라고 하는 테이블을 채울 것이고, 그 테이블 안에서 우리가 어떤 가장 좋은 값을 갖는 것을 찾는 문제라고 생각하는 건데 그 S라고 하는 테이블이 나타내는 거는(여기서는 2-dimension한 상태), PRM node 2개(한 쪽은 u, 다른 한 쪽은 v)를 놓고 둘 사이에 어떤 경로를 생각하는 것이다. 이때 DP가 나타내는 path는 u하고 v를 포함하는, forbidden pair를 잘 피하는 path이다. 잘 피하는 path를 valid한 path로 볼 수 있으며, valid한 path 중에 가장 좋은 score를 이 테이블 s가 가지고 있으며, 이 테이블은 계속 업데이트 된다.

계속 업데이트 되는 이유는 지금까지 본 거보다 더 좋은 게 나오면 이제 업데이트가 되는 것이다. DP를 채우는 동안에는 path가 어떻게 될지 모른다. 0에서 u로, v에서 M으로 가면서 테이블을 다 채우고, 결국 u와 v를 통과해서 시작에서 끝까지 가는 이 forbidden pair를 잘 피하는 이런 경로의 여러 가능성 중에 가장 좋은 것을 얘가 기록하고 있다.(이때 u와 v는 앞서 이야기한 것 처럼, u는 m/2의 왼쪽, v는 m/2의 오른쪽에서 따지게 된다.)

이 계산이 제대로 이루어졌다면, 이런 조건을 만족하는 모든 u와 v에 대해서 얘를 다 계산할 수 있다면 실제로 계산할 수 있다면, 그걸로 우리가 답을 얻을 수 있는게 맞는가 생각해보자.

![Untitled 15](https://user-images.githubusercontent.com/84653623/234660596-849fff6d-baec-4c2d-949e-3d4754d75e43.png)

DP를 다하고 났더니, 실행을 마지막까지 하고 났더니 이 테이블에 이 위치에 적혀있다 그러면 원하는 답을 구한 것이다. 경로를 복원하는 것도 중요한데, 어떻게 나중에 경로를 복원하는가 그 방법을 논하기 위해서는 결국 밖에서 부터 채워들어가야 한다.

![Untitled 16](https://user-images.githubusercontent.com/84653623/234660599-a6645416-a978-4466-9c3c-fd4c40f2b04b.png)

## The complete algorithm

이를 알고리즘 적인 측면에서 살펴보면, case를 두 가지로 나눠서 접근하게 된다. 우선 모든 u에 대해서 0부터 시작해서 m/2까지 증가하면서 진행을 하고, 마찬가지로 반대쪽에서 v에 대해서 m부터 m/2까지 감소하면서 진행을 한다. 이러한 두 가지 케이스에 대해서 forbidden pair까지 고려하여 u와 f(v)를 비교하여 edge를 연결하고, 점점 좁혀나가서 최적의 path를 찾게된다. 

![Untitled 17](https://user-images.githubusercontent.com/84653623/234660603-69d2f04d-d413-486f-8458-292f25cde51c.png)

# *De novo* : second issue

node의 **score**를 어떻게 정할 것인가에 대해 이야기를 해보자. 앞서 본 DP는 b하고 y이온만 있다면 참 좋겠지만, 실제로는 그렇지 않다. spectrum에는 다른 type의 ion들도 많이 존재한다. (e.g, a-ion, neutral loss, isotopic, etc) 이러한 것들을 잘 활용해서 node의 score를 잘 정하고 싶다는 것이 본 문제의 희망사항이다. 

![Untitled 18](https://user-images.githubusercontent.com/84653623/234660495-f7552acf-7b88-4271-ae5d-dc302e308abf.png)

## weighting nodes in spectrum graph

따라서 우리가 조금 더 쉽게 DP를 이용하여 조금 더 좋은 값을 정할 수 있는 근거로 아래의 그림과 같이 예를 들 수 있다.

![Untitled 19](https://user-images.githubusercontent.com/84653623/234660504-727a5d87-4eb0-437e-ab68-7c654a2f63b4.png)

첫 번째로 **intensity**. 즉, 크기가 크면 무조건 다 좋은 것인가에 대해 생각해봐야 한다. 크기가 크다고 무조건 좋은 것은 아니다. 위의 그래프를 보면, x축이 intensity rank이다. 검은 점이 b-ion을, 흰 점이 y-ion을 나타내는데, 1등으로 나오는 것이 y-ion이 70%, b-ion이 한 10%, 이렇게 나온다. 즉, intensity rank에서 1~3등과 같이 rank가 높은 부분은 y-ion이, rank가 낮은 부분에서는 b-ion이 더 많은 %를 차지하고 있다. 오른쪽 그래프는 그래프는 같은데 장비가 다른 case이다. (장비가 다르다 = fragment 방법이 다르다.) 그러나, 비슷한 경향을 보인다는 것을 확인할 수 있다. 정리하자면, `intensity를 통해 이게 b-ion일지, y-ion일지 그 가능성을 우리가 조금 더 잘 알 수 있다`는 점을 이야기하는 것이다.

다음으로 support ions에 대해 이야기해보자. 앞서 언급했듯이, b나 y-ion이 H_{2}O나 NH_{3}를 추가적으로 잃어버려서 만들어진 이온을 **Neutral loss ion**이라고 부른다. 이러한 이온들이 관찰되는 경우 또한 많은데, 결국 fragmentation을 진행하려면 에너지를 주어야 하는데 (이때 에너지는 충돌에너지, 혹은 다른 에너지), 에너지를 통해 ion화가 된 다음, 또 남은 에너지가 영향을 미쳐, neutral loss ion이 발생하게 되는 것이다. 이러한 이온들이 해석이 잘 되었다면, 다음과 같은 spectrum을 보인다.

![Untitled 20](https://user-images.githubusercontent.com/84653623/234660507-560d8e1a-1528-4578-bafb-790d62d75ad9.png)

위의 spectrum을 보면, N-term, charge 1의 경우 H_{2}O 혹은 NH_{3}가 많이 빠진 모습을 보인다. 이처럼, 자기 자신과 연관된 다른 더 많은 neutral loss가 있는 peak들이 많이 관찰이 되는 것이다. 그 양상이 b냐 y냐에 따라 다르게 나타나며, 마찬가지로, fragment ion의 charge가 +1이냐 +2이냐에 따라서도 또 다르게 나타난다.

마지막으로 isotopic에 대해 이야기해보면, 마찬가지로 앞서 [이야기](https://sehooni.github.io/proteomics/PeptID_DBSearch/#basics-for-theoretical-spectrum-generation)했듯이, precursor의 charge를 결정할 수 있는 이유는 isotopic에 해당하는 peak들(+1, +2) 사이의 간격을 통해 결정할 수 있다. fragment ion에서는 isotopic이 늘 보이지 않는데, 그 이유는 관측되는 fragment ion의 질량이 매우 작기 때문에 1%의 isotopic이 존재할 확률이 그렇게 크지 않는 것이다(끽해야 2~3개 있는 정도).  근데 이제 fragment ion의 질량이 커지면 isotopic들도 잘 보이게 된다. 따라서 isotopic 또한 noise로 작용할 수 있는 것이다.

결국 `위 3개의 factor들이 이 ion이 b냐 y냐를 결정하는 델타함수를 정할 때 좋은 근거들이 되는 것`이다. 

# A simple example of a Bayesian scoring model

하나의 방법론을 살펴보자. Pep Novo에서 제시했던 방법이다. **Bayesian network**를 이용해서 scoring하는 모델을 만드는 것이다. 즉 학습을 통해서 scoring model을 만드는 것이다. 여기서 고려되는 intensity는 정밀한 값이 아닌, 그냥 **1. 크냐** **2. 작냐**, **3. 아예 관찰이 안되었는가** 정도로만 나눠져있다.  

![Untitled 21](https://user-images.githubusercontent.com/84653623/234660512-9851c146-4812-4474-bfde-97cf326ee20c.png)

어떤 질량 값을 넣고, 스펙트럼 그래프에서 prefix residue mass에 해당하는 노드의 성질을 가져야 델타를 결정할 수 있다. 그 성질을 아래와 같이 표현해볼 수 있다. 우리가 원하는 것은 supporting peak들, 앞서 이야기한 neutral loss나 isotopic이나 다른 여러가지 성질들, 을 이용해서 아래의 식에서의 m, prefix residue mass에 해당하는  얘가 실제로 의미 있는 fragment일 가능성 (=b 또는 y이온 일 가능성)이 얼마냐하는 것을 추정해보고 싶은 것이다. 이 확률을 구하기 위해서 이제 Bayesian theorem을 사용하면 구할 수 있다.

**Bayesian Network**는 보통 그 확률 변수들 사이에 인과관계가 있는 경우에 종종 사용한다. 인과관계이기 때문에 성립하는 어떤 conditional independent를 가정하고 있기 때문인데, 그렇기 때문에 bayesian network를 아무렇게나 갖다가 쓰면 약간 말이 안된다. `특별히 이제 확률 변수들 사이에 인과관계가 있을 때 사용하는 것이 의미있다.` 

![Untitled 22](https://user-images.githubusercontent.com/84653623/234660514-fcbbf7d1-d2d4-4de9-bd89-0dd5e79f8b6f.png)

예를 들어 위의 그림과 같이 a에서 b로 가는 edge가 있다 그러면은 a가 원인이 되고, b가 어떤 결과가 되는 이런 관계가 성립하는 경우를 이야기한다. 물론 위의 그림이 엉터리인 이유는, a-ion이 관찰되면 b-ion이 관찰된다는 이런 관계를 나타내는거라 실제로는 말이 안된다. 그러나 위 그림에 적어두었듯이, beyesian network에서 사용되는 상황은 각각의 그래프를 이용해서 어떤 확률 값을 출원하는 건데 각각의 node는 확률변수이고, node들 사이에 edge가 있다는 것은 인과관계를 보여준다. **edge의 시작은 원인이고 끝점에 해당하는 node는 결과가 되는 이런 관계가 어떤 graph의 topology가 된다. 그 다음에 그래프의 각각의 node는 조건부 확률이 붙어 있어야 한다.**

이 조건부 확률을 구해야하는데, 어떻게 구성이 되어 있냐면 위 그림의 y를 기준으로 보면 node에 들어오는 edge가 2개이다. 즉, y는 b와 y-H_{2}O의 확률 분포를 다 가지고 있어야 한다. 또한 각각의 가능성에 대해서 이익의 확률이 어떻게 되는지를 이 노드들에 적어놔야 한다. 그래서 Bayesian network에서 이 구성 자체는 pose and effect를 나타내는 어떤 네트워크에다가 각각의 node에 조건부 확률이 있어야 거기에 알맞은 추론을 할 수 있는 것이다.

또한 이러한 조건부 확률들은 chain rule을 성립하기 때문에 직접적인 원인이 있을 때는 독립적인 case는 날려버려도 된다. 즉 `인과관계이기 때문에 성립하는 독립의 조건들을 활용하여 이 조건부 확률을 간단화 할 수 있다.` 이 과정에서 indirect한 것들도 관찰될 수 있으나 그냥 무시해도 괜찮다는 것이 기본적인 계산이다.

# PepNovo : Weighting nodes

앞서 설명한 bayesian network를 이용해서 scoring을 진행한 것이 PepNovo의 기본 개념이다. 아래의 그림과 같이 node하나만 본 것이 아닌, 인접한 아미노산도 같이 본 것이다. 우리가 관심을 갖는 아미노산은 N-terminal과 C-terminal의 아미노산이 무엇이냐에 따라서도 영향을 받을 것이다. 또한 이 node가 b-ion인지, y-ion인지, b이면 intensity가 크냐 작냐 아예 관찰이 안되는가, b-ion의 intensity에 의해서 neutral loss의 intensity가 결정이 될꺼고 등등 이렇게 인과관계가 존재한다. 이러한 인관관계를 바탕으로 나름 그래프 모델을 만들고 이 그래프 모델에 각각의 노드에다가 앞서 말한 conditional 확률을 구해서 붙였는데 이미 존재하는 데이터를 기반으로 하여 일일히 진행한 것이고, 이러한 score는 아래의 그림에서 확인할 수 있듯이 log ratio를 기반으로 하여 구해졌다.

랜덤으로 그 정도가 나올 확률은 얼마냐를 구해서 랜덤 대비 관찰된 애가 이 정도 크기로 나올 확률이 얼마인지를 구하는 것이다. 이때 m은 prefix residue mass이고, S가 스펙트럼 그리고 그게 주어졌을 때 이 intensity가 작냐 크냐 없냐 이거를 나타내는 값인 것이다.

![Untitled 23](https://user-images.githubusercontent.com/84653623/234660520-369480c9-534b-4422-a9bd-2a26b0bafafe.png)

개념적으로는 크게 어려운 것은 아니며, 그냥 소개하는데 의미가 있다고 생각된다. 

## Ion types and probabilities

펩타이드 P는 특정한 스펙트럼이 아니고, 스펙트럼이 있는 한 peak이다. 대문자 S로 쓴게 스펙트럼이고, 소문자로 쓴 s가 peak을 의미한다. 하나의 fragment ion peak들인 것이다. 그러면 이 peptide가 측정한 peak을 생산할 확률이, s에 대한 확률이라고 하면, 결국은 이 전체 peptide가 이 스펙트럼을 만들었을 확률은 결국 그 스펙트럼 안에 있는 각각의 peak을 이 펩타이드가 생산했을 확률들의 합으로 나타낼 수 있다고 생각하는 것이다.

**이게 이제 각각의 픽이 나오는 이유가 다 independent할 때 이렇게 나타날 것이고, 굉장히 큰 가정이다.** 그렇지 않을 거라는 사실을 우리는 이미 알고 있다. `어느 한 쪽이 ion이 되면 나머지 한 쪽은 오히려 ion이 잘 안된다.` 서로 상관관계가 있는데 correlation이 전혀 없는 거로 생각하고 완전히 independent하다고 가정하고 지금 확률을 이야기하고 있는데, 실은 그렇지 않다는 것이다. 

앞서 이야기한 것처럼 neutral loss ion 같은 애들은 다른 b나 y ion이 나오지 않을 때는 거의 관찰이 안되는 이런 상관관계가 틀림없이 있는데 그런걸 다 무시하고 그냥 독립이다, 각각의 peak들이 이 peptide로 나올 확률은 그냥 그 픽 하나에만 관련이 있지 스펙트럼의 나머지 픽하고는 상관이 없다 라는 가정을 한 것이다. 이러한 가정들은 사실 현실과는 굉장이 먼 이야기이지만, 그럼에도 불구하고 그런 가정을 하지 않으면 계산을 할 수 없기 때문에 그래서 이렇게 이야기를 하는 것이다.. 그나마 이런 과정을 좀 풀어서, 이 친구들이 뭔가 상관관계가 있는데, 그걸 최대한 고려해보겠다고 하는게 앞에서 이야기한 PepNovo 모델이다.

![Untitled 24](https://user-images.githubusercontent.com/84653623/234660527-c1723ea6-3eaa-4dca-963c-bba9085e9cb4.png)

완전히 독립이 아니고 사실은 neutral loss랑 이런 supporting peak이랑 b나 y ion사이에는 상당히 상관 관계가 있으며, 원인과 결과가 되는 관계가 있다 이런 이야기를 하고 있는건데, 이거에 비해 사실 이 뒤에서 이야기하는 모델을 상당히 단순화 해놓은 모델인 것이다.

formulation을 하기 위해서 이렇게 모델링을 하는 건데 ion type은 델타로 표시할 수 있다. b ion은 neutral mass에 1을 더한 것이며, y ion은 neutral mass에 19를 더했다고 이야기 할 수 있다. `즉, 아예 ion type을 이런 숫자로 나타낼 수 있도록 한 것이다.`(델타 이온)

이제 델타 이온들이 나올 확률을 각각 예를 들어서 q라고 부른다고 가정하자. 델타 1이 나올 확률을 q_1, 델타 2가 나올 확률을 q_2, 이렇게 써버면, 이 델타 이온들이 나오는 이 ion type들도 독립이다 라고 가정하는 것이다. 

![Untitled 25](https://user-images.githubusercontent.com/84653623/234660530-16542e40-482e-4700-b19d-673abaebf7aa.png)

앞에서 한 거랑 같다. 그냥 각 이온이 나올 확룰을 독립이라고 생각을 하자. **peak이 있는 경우, 없는 경우로 나눠서 보는 것이다.** `그 위치에 peak이 실제 이 peptide로부터 만들어졌을 확률은 있으면 q, 없으면 1-q라고 하는 것이다.`

이 과정은 여전히 node scoring을 하고 있는 과정이다.

![Untitled 26](https://user-images.githubusercontent.com/84653623/234660533-456cdc6b-949c-42e4-9348-2545a498641c.png)

어떤 특정한 위치라고 하는거는 이제 node에 해당하는 mass를 이야기하는 것이며, 그 node와 관련된 ion type들이 여러개 있을 수 있으며, supporting peak을 이용해서 특정한 노드가 얼마나 믿을 만하냐를 계산하는게 목표이다. **node의 score를 구하는 게 목표이고, node의 score를 구할 때 다른 ion type들 node와 관련된 다른 ion type들의 크기가 뭐가 될지는 모르겠지만 그걸 이용해서 이 node가 실제로 peptide로 부터 생산되었을거냐를 알아보는 게 목표이다.**

어떤 위치라고 하는 것은 결국은 spectrum graph에 있는 특정한 node에 해당하는 mass의 위치를 이야기한다. 그 node에 대해서 해당하는 peak이 우리가 생각하는 peptide로부터 왔을 확률은 q라고 주어져 있다고 생각하는 것이다.

![Untitled 27](https://user-images.githubusercontent.com/84653623/234660535-39c10c74-fe7d-4a32-8221-37eb3514bdf8.png)

이때 나와야 할게 나오면, 안 나와야 할게 나오면 좋은 것이며, 반대로 나와야 하는데 안나오거나, 안나와야하는데 나오면 엄청 나쁜 것이다. 당연한 말이다. 나쁜 경우에는 penalty를 주는 거다. 앞서 이야기한 것처럼 likelihood ratio를 사용하여 random한 경우의 확률을 구해서 비교를 해서 쓰겠다는 것이며, random한 noise가 나올 확율도 위치와 무관하게 다 같다.

우리가 고려하고 있는 위치에 peak이 있으면 그 random 확률을 쓰고, 없으면 1-random 확률을 그냥 쓰겠다. 이것이다.

![Untitled 28](https://user-images.githubusercontent.com/84653623/234660541-fa3c828e-bd91-41e5-a90d-58cdf64b90b1.png)

## Ratio test scoring for partial peptides

그렇게 한 다음 `있어야 할게 있으면 점수를 더해주고, 없으면 패널티를 주겠다`는 것이 핵심이다.

예를 들어 설명을 해보자. ion type이 4종류이며 관찰된게 그 중 3개 인 것이다. 이러한 케이스에 대해 1, 2, 4번에 대해서는 우리가 알고 있는 확률을 쓰고, 3번은 1-q_3의 확률을 쓰겠다는 것이다. 그러면 똑같이 랜덤한 부분도 똑같이 계산해서 둘 사이의 ratio를 가지고 score를 쓰곘다는 것이 기본 적인 생각이다. 이런 모델도 가능하다라고 이야기하는 것이다.

![Untitled 29](https://user-images.githubusercontent.com/84653623/234660546-4b4b052f-1e27-47f4-bb02-d60aeceb575a.png)

## Finding optimal paths in the spectrum graph

그런데 이제 위 모델은 각각의 supporting ion들이 다 독립적으로 생산된다는 엄청난 가정을 하고 있기 때문에, 또 그 사이 모든 edge들에 대해서 이 계산을 다 할 것이고, 계산량이 증가하게 된다. 너무 복잡하기 때문에 매우 단순화해서 사용을 하는 것이다. Bayesian network도 학습하는 데 시간이 많이 걸리지만 일단 학습을 해놓고나면, 추론하는 거는 상대적으로 시간이 빨라서 그렇게 써도 된다고 생각을 하는 것 같다.

기본적으로 DP를 하면서 사용하는 node의 score는 비교적 단순한 것들을 쓴다. 실제로 그걸 아무리 복잡하게 해봐야 결과적으로 score에 크게 영향을 안 주기 때문에 그런 부분에서 상당히 단순한 것을 쓰는 편이다. 

![Untitled 30](https://user-images.githubusercontent.com/84653623/234660550-db0909d2-ee75-45ec-a56f-3877bd2eeb54.png)

# *De novo* interpretation summary

요약해보면, 사실 제일 어려웠던 것은, b ion과 y ion을 어떻게 잘 구분해내느냐 하는것이다. 그러기 위해서 사실 2가지를 한 것이다.

1. PRM node를 만들면서 이 친구들이 forbidden-pair다라는 것을 잘 기억하고 있는 것
2. supporting ion을 이용해서 supporting ion이 없는, 랜덤하게 나오는 친구들를 고려해서 node에 weighting을 했다(node의 score를 주었다).

![Untitled 31](https://user-images.githubusercontent.com/84653623/234660552-f66ff0fd-5da6-4f2a-ae43-a3a62292b031.png)

이론적으로는 이렇게 깔끔하게 되지만 실제 데이터에 가면 **noise도 많고, fragmentation이 되어야할 위치에 다 되는게 전혀 아니기 때문에 결과가 그렇게 만족스럽지 않다.** 실제로  DBSearch에서 DeNovo를 시행하면 2/3정도 밖에 못얻는다. 그러나 `새로운 무언가를 찾는데 있어서는 잘 활용해보는 것이 의미가 있다.`

또다른 단점은, protein modification에 있어 PRM이 기하급수적으로 증가하기 때문에, modification이 포함된 서열을 De Novo를 적용하기에 비적합하다. 그러나 여전히 특정영역에서는 유용하게 작동한다고 볼 수 있는 방법이 바로 De Novo 기법이다.

---
> 본 내용은 한양대학교 컴퓨터소프트웨어학과 및 인공지능학과 백은옥 교수님의 강의자료을 바탕으로하여 작성되었습니다!

> PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. :)