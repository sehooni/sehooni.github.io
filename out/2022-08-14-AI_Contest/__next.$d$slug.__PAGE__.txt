1:"$Sreact.fragment"
13:I[24170,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
14:I[55132,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
16:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/865c404e1d9a0c65.js"],"OutletBoundary"]
17:"$Sreact.suspense"
:HL["https://user-images.githubusercontent.com/84653623/184535307-4af26d2c-8715-423a-afcb-66e38c8c8ae0.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/184535476-c8813eea-d392-415e-80a3-79a30ff3f984.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/184535518-7fc2e293-309b-407f-8919-989c84997205.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/184535645-962b29f0-68a7-4611-8f3f-f6d5c0d26273.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/184580323-573f7078-a6c8-45ba-8d05-b8431b1f6a23.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/184580759-0ac9c5ce-5e5f-40da-95ae-d8c175a2902f.png","image"]
:HL["/_next/static/chunks/b9ef641e76e3a351.css","style"]
0:{"buildId":"8lJiHtAmlyU3nNFMbG8_k","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[2022인공지능경진대회] 2022년 인공지능 온라인 경진대회 후기"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"$D2022-10-02T00:00:00.000Z","children":"October 2, 2022"}],"$undefined"]}]]}],[["$","p","p-0",{"children":"인공지능 경진대회가 끝난 지, 어느 덧 4달 이라는 시간이 지났다."}],"\n",["$","p","p-1",{"children":"그 사이, 비록 탈락하긴 했지만, 카이스트 ai 대학원 진학에 도전하기도 했었고, 이런 저런 일들로 포스팅이 늦어졌지만, 그럼에도 불구하고 회고를 해보고자 한다."}],"\n",["$","p","p-2",{"children":"(본 포스팅에 사용된 자료는 지난 랩 세미나에서 사용한 본인의 ppt에서 발췌하였음을 명시한다.)"}],"\n",["$","h1","h1-0",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"대회 설명"}],"\n",["$","p","p-3",{"children":["과학기술정보통신부에서 주최한 2022년 인공지능 온라인 경진대회에서는 총 3개 분야 10개의 과제, 수치해석 2문제, 자연어처리 4문제, 이미지처리 4문제가 주어졌었다.\n본인의 팀은 이미지처리 분야의 ",["$","strong","strong-0",{"children":"준지도학습 기반의 항만 구조물 객체 분할 문제"}],"에 참가하였다."]}],"\n",["$","h1","h1-1",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"과제 설명"}],"\n",["$","p","p-4",{"children":"과제에서 원하는 것은 4가지 task, Container Truck, Forklift, Reach Stacker, Ship 을 각각 Segmentation하여 분할하는 것 이었다.\n또한 이를 준지도학습을 통해 학습을 시키는 것이었다."}],"\n",["$","p","p-5",{"children":"그렇다면 Segmentation은 무엇을 의미하며, 준지도학습이 무엇일까를 알아야 본 과제에 접근할 수 있다.\n과제 해결 방법을 설명하기에 앞서 간단한 개념들을 정리하고 넘어가도록 하겠다."}],"\n",["$","h2","h2-0",{"id":"s","className":"text-2xl font-bold mt-8 mb-4","children":"Segmentation 이란?"}],"\n",["$","p","p-6",{"children":"(본 자료는 스탠포드 대학교의 유명한 컴퓨터사이언스 강의인 CS231의 강의자료를 발췌하였다.)"}],"\n",["$","p","p-7",{"children":["딥러닝 이미지 처리 분야의 대표적인 task들은 다음과 같다.\n크게 ",["$","strong","strong-0",{"children":"Classification"}],", ",["$","strong","strong-1",{"children":"Object Detection"}],", ",["$","strong","strong-2",{"children":"Segmentation"}],"으로 나눌 수 있으며,각 기법은 사용 목적에 따라 선택하여 접근하게 된다."]}],"\n",["$","p","p-8",{"children":"본 과제를 설명하는데 있어 각각 어떠한 기법을 사용하는지 인지하는 것이 중요하다.\nClassification은 이미지에 대한 class를 예측하는 것이며, Object Detection은 이미지에 있는 모든 물체를 찾아내어 각각을 Classification 하고 각각의 Bounding Box의 좌표를 출력하는 task이다."}],"\n",["$","p","p-9",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/184535307-4af26d2c-8715-423a-afcb-66e38c8c8ae0.png","alt":"image"}]}],"\n",["$","p","p-10",{"children":"이때 Segmentation은 두 가지로 나눌 수 있다. Sementic Segmentation과 Instance Segmentation이다.\n전자는 Single class로 이미지 영역을 같은 class 별로 분할하는 방법이며, 후자는 Multi class로 이미지 영역을 각 객체(물체)별로 분할하는 방법이다."}],"\n",["$","p","p-11",{"children":"과제 해결을 위해 우리 팀은 single class segmentation을 선택하고 접근하였다."}],"\n",["$","p","p-12",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/184535476-c8813eea-d392-415e-80a3-79a30ff3f984.png","alt":"image"}]}],"\n",["$","h2","h2-1",{"id":"","className":"text-2xl font-bold mt-8 mb-4","children":"준지도 학습이란?"}],"\n",["$","p","p-13",{"children":"지도학습은 문제와 정답을 모두 알려주고 공부시키는 방법이며, 이를 통해 예측 및 분류 모델을 구축할 수 있습니다. 또한 비지도 학습은 답을 알려주지 않고 공부시키는 방법으로 연관 규칙을 구하는 모델과 군집화를 실행하는 모델을 만들 수 있습니다.\n비지도 학습은 지도학습과 비지도학습의 중간으로, 일부는 문제와 정답을 모두 알려주고 일부는 다블 가르쳐 주지 않고 학습시키는 것입니다."}],"\n",["$","p","p-14",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/184535518-7fc2e293-309b-407f-8919-989c84997205.png","alt":"image"}]}],"\n",["$","h1","h1-2",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"과제 수행 방법 및 결과"}],"\n",["$","h2","h2-2",{"id":"","className":"text-2xl font-bold mt-8 mb-4","children":"과제 수행 방법"}],"\n",["$","h3","h3-0",{"id":"d","className":"text-xl font-bold mt-6 mb-3","children":"Data 확인 및 Augmentation"}],"\n",["$","p","p-15",{"children":"준지도 학습의 과정을 실제 과제 내용을 바탕으로 다시 살펴보도록 하자."}],"\n",["$","p","p-16",{"children":"$L2"}],"\n","$L3","\n","$L4","\n","$L5","\n","$L6","\n","$L7","\n","$L8","\n","$L9","\n","$La","\n","$Lb","\n","$Lc","\n","$Ld"],"$Le"]}],"$Lf"]}],["$L10","$L11"],"$L12"]}],"loading":null,"isPartial":false}
2:["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/184535645-962b29f0-68a7-4611-8f3f-f6d5c0d26273.png","alt":"image"}]
3:["$","p","p-17",{"children":"초기 데이터는 총 4가지 task가 각각 32, 37, 13, 53개씩 존재하였다. 이 부분은 지도학습의 과정과 동일하다. 원본 사진과 정답인 mask 사진이 같이 주어진 것이다.\n마스크의 경우 0과 1사이의 값으로 설정되어 왼쪽 그림과 같이 검은 바탕으로 나오는 것으로, 255를 곱해주게 되면, 오른쪽 그림과 같이 task의 mask 형태가 나타나게 된다."}]
4:["$","p","p-18",{"children":"그러나 데이터의 갯수가 현저히 작아, 데이터 증강(Augmentation) 방식을 적용하였다."}]
5:["$","p","p-19",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/184580323-573f7078-a6c8-45ba-8d05-b8431b1f6a23.png","alt":"image"}]}]
6:["$","p","p-20",{"children":"특히 Reach Stacker의 경우 13개의 초기 데이터가 존재하였는데, 다른 class들에 비해 현저히 작았기 때문에 데이터 증강이 필요하였다."}]
7:["$","p","p-21",{"children":["위 사진에서 볼 수 있듯이, ",["$","strong","strong-0",{"children":"좌우 반전"}],", ",["$","strong","strong-1",{"children":"상하 반전"}],", ",["$","strong","strong-2",{"children":"좌우 이동"}],", ",["$","strong","strong-3",{"children":"상하 이동"}],", ",["$","strong","strong-4",{"children":"확대"}]," 등의 ",["$","strong","strong-5",{"children":"위치 변환"}],"과, ",["$","strong","strong-6",{"children":"BGR2RGB"}],", ",["$","strong","strong-7",{"children":"밝기"}]," 등의 ",["$","strong","strong-8",{"children":"색상 변환"}],", 그리고 ",["$","strong","strong-9",{"children":"각도 변환"}],"을 통해 한장 당 88장까지 데이터를 증가시킬 수 있었다."]}]
8:["$","h3","h3-1",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"알고리즘 구성도와 CNN을 통한 분류 결과 정확도 및 오차"}]
9:["$","p","p-22",{"children":[["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/184580759-0ac9c5ce-5e5f-40da-95ae-d8c175a2902f.png","alt":"image"}],"\n전체적인 시스템의 흐름은 위 알고리즘 구성도를 통해 확인할 수 있다. 다시 정리해보자면,"]}]
a:["$","ol","ol-0",{"children":["\n",["$","li","li-0",{"children":"라벨링이 된 사진을 데이터 증강을 통해 늘린 후, 1차 네트워크를 구성한다."}],"\n",["$","li","li-1",{"children":"이를 통해 라벨링이 되지 않은 사진들의 라벨 데이터를 생성하게 된다."}],"\n",["$","li","li-2",{"children":"1차 Output 사진을 포함하여 정확도가 높은 사진들을 바탕으로 2차 네트워크를 구성한다."}],"\n",["$","li","li-3",{"children":"이후 Test data를 input으로 주어, Test 라벨 data를 output으로 도출한다."}],"\n",["$","li","li-4",{"children":"마지막으로 CNN 네트워크를 이용한 모델을 만들어 주어, 해당 클래스별로 구분할 수 있도록 한다."}],"\n",["$","li","li-5",{"children":"이후 label data를 CSV로 정리되도록 구성한다."}],"\n"]}]
b:["$","p","p-23",{"children":"본 과정을 통해 결과를 살펴보면, 다른 class에 비해 reach_stacker의 경우 기본적으로 제공된 데이터가 현저하게 작았다.\n따라서 CNN을 통한 분류작업에서 오차가 높게 나타났음을 확인할 수 있다."}]
c:["$","h3","h3-2",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"결과 정리"}]
d:["$","p","p-24",{"children":"안타깝게도 입상에는 실패했다. 2주라는 대회기간 중 1주를 기말고사로 허비한 것도 있었고, 마지막 제출 시간에 파일을 잘못 업로드하는 크디큰 실수를 저질러 버린 것이다.\n그래서일까? 더더욱 아쉬움이 컸다. 마지막엔 결과값이 좋았는데, 이걸 확인하지 못했다는 사실이 특히 그랬다.\n그렇지만 이번 대회를 통해 이미지처리 분야의 능력을 조금 더 발전 시켰다는 부분에 있어 큰 배움이 된 것 같다."}]
e:["$","$L13",null,{}]
15:T1962,
 인공지능 경진대회가 끝난 지, 어느 덧 4달 이라는 시간이 지났다.

 그 사이, 비록 탈락하긴 했지만, 카이스트 ai 대학원 진학에 도전하기도 했었고, 이런 저런 일들로 포스팅이 늦어졌지만, 그럼에도 불구하고 회고를 해보고자 한다.

(본 포스팅에 사용된 자료는 지난 랩 세미나에서 사용한 본인의 ppt에서 발췌하였음을 명시한다.)

# 대회 설명

과학기술정보통신부에서 주최한 2022년 인공지능 온라인 경진대회에서는 총 3개 분야 10개의 과제, 수치해석 2문제, 자연어처리 4문제, 이미지처리 4문제가 주어졌었다.
본인의 팀은 이미지처리 분야의 **준지도학습 기반의 항만 구조물 객체 분할 문제**에 참가하였다.

# 과제 설명

과제에서 원하는 것은 4가지 task, Container Truck, Forklift, Reach Stacker, Ship 을 각각 Segmentation하여 분할하는 것 이었다.
또한 이를 준지도학습을 통해 학습을 시키는 것이었다.

그렇다면 Segmentation은 무엇을 의미하며, 준지도학습이 무엇일까를 알아야 본 과제에 접근할 수 있다.
과제 해결 방법을 설명하기에 앞서 간단한 개념들을 정리하고 넘어가도록 하겠다.

## Segmentation 이란?

(본 자료는 스탠포드 대학교의 유명한 컴퓨터사이언스 강의인 CS231의 강의자료를 발췌하였다.)

딥러닝 이미지 처리 분야의 대표적인 task들은 다음과 같다.
크게 **Classification**, **Object Detection**, **Segmentation**으로 나눌 수 있으며,각 기법은 사용 목적에 따라 선택하여 접근하게 된다.

본 과제를 설명하는데 있어 각각 어떠한 기법을 사용하는지 인지하는 것이 중요하다.
Classification은 이미지에 대한 class를 예측하는 것이며, Object Detection은 이미지에 있는 모든 물체를 찾아내어 각각을 Classification 하고 각각의 Bounding Box의 좌표를 출력하는 task이다.

![image](https://user-images.githubusercontent.com/84653623/184535307-4af26d2c-8715-423a-afcb-66e38c8c8ae0.png)

이때 Segmentation은 두 가지로 나눌 수 있다. Sementic Segmentation과 Instance Segmentation이다.
전자는 Single class로 이미지 영역을 같은 class 별로 분할하는 방법이며, 후자는 Multi class로 이미지 영역을 각 객체(물체)별로 분할하는 방법이다.

과제 해결을 위해 우리 팀은 single class segmentation을 선택하고 접근하였다.

![image](https://user-images.githubusercontent.com/84653623/184535476-c8813eea-d392-415e-80a3-79a30ff3f984.png)

## 준지도 학습이란?
지도학습은 문제와 정답을 모두 알려주고 공부시키는 방법이며, 이를 통해 예측 및 분류 모델을 구축할 수 있습니다. 또한 비지도 학습은 답을 알려주지 않고 공부시키는 방법으로 연관 규칙을 구하는 모델과 군집화를 실행하는 모델을 만들 수 있습니다.
비지도 학습은 지도학습과 비지도학습의 중간으로, 일부는 문제와 정답을 모두 알려주고 일부는 다블 가르쳐 주지 않고 학습시키는 것입니다.

![image](https://user-images.githubusercontent.com/84653623/184535518-7fc2e293-309b-407f-8919-989c84997205.png)

# 과제 수행 방법 및 결과
## 과제 수행 방법
### Data 확인 및 Augmentation 
준지도 학습의 과정을 실제 과제 내용을 바탕으로 다시 살펴보도록 하자.

![image](https://user-images.githubusercontent.com/84653623/184535645-962b29f0-68a7-4611-8f3f-f6d5c0d26273.png)

초기 데이터는 총 4가지 task가 각각 32, 37, 13, 53개씩 존재하였다. 이 부분은 지도학습의 과정과 동일하다. 원본 사진과 정답인 mask 사진이 같이 주어진 것이다. 
마스크의 경우 0과 1사이의 값으로 설정되어 왼쪽 그림과 같이 검은 바탕으로 나오는 것으로, 255를 곱해주게 되면, 오른쪽 그림과 같이 task의 mask 형태가 나타나게 된다. 

그러나 데이터의 갯수가 현저히 작아, 데이터 증강(Augmentation) 방식을 적용하였다.

![image](https://user-images.githubusercontent.com/84653623/184580323-573f7078-a6c8-45ba-8d05-b8431b1f6a23.png)

특히 Reach Stacker의 경우 13개의 초기 데이터가 존재하였는데, 다른 class들에 비해 현저히 작았기 때문에 데이터 증강이 필요하였다. 

위 사진에서 볼 수 있듯이, **좌우 반전**, **상하 반전**, **좌우 이동**, **상하 이동**, **확대** 등의 **위치 변환**과, **BGR2RGB**, **밝기** 등의 **색상 변환**, 그리고 **각도 변환**을 통해 한장 당 88장까지 데이터를 증가시킬 수 있었다.

### 알고리즘 구성도와 CNN을 통한 분류 결과 정확도 및 오차

![image](https://user-images.githubusercontent.com/84653623/184580759-0ac9c5ce-5e5f-40da-95ae-d8c175a2902f.png)
전체적인 시스템의 흐름은 위 알고리즘 구성도를 통해 확인할 수 있다. 다시 정리해보자면,
1. 라벨링이 된 사진을 데이터 증강을 통해 늘린 후, 1차 네트워크를 구성한다.
2. 이를 통해 라벨링이 되지 않은 사진들의 라벨 데이터를 생성하게 된다.
3. 1차 Output 사진을 포함하여 정확도가 높은 사진들을 바탕으로 2차 네트워크를 구성한다.
4. 이후 Test data를 input으로 주어, Test 라벨 data를 output으로 도출한다.
5. 마지막으로 CNN 네트워크를 이용한 모델을 만들어 주어, 해당 클래스별로 구분할 수 있도록 한다.
6. 이후 label data를 CSV로 정리되도록 구성한다.

본 과정을 통해 결과를 살펴보면, 다른 class에 비해 reach_stacker의 경우 기본적으로 제공된 데이터가 현저하게 작았다.
따라서 CNN을 통한 분류작업에서 오차가 높게 나타났음을 확인할 수 있다.

### 결과 정리
안타깝게도 입상에는 실패했다. 2주라는 대회기간 중 1주를 기말고사로 허비한 것도 있었고, 마지막 제출 시간에 파일을 잘못 업로드하는 크디큰 실수를 저질러 버린 것이다.
그래서일까? 더더욱 아쉬움이 컸다. 마지막엔 결과값이 좋았는데, 이걸 확인하지 못했다는 사실이 특히 그랬다.
그렇지만 이번 대회를 통해 이미지처리 분야의 능력을 조금 더 발전 시켰다는 부분에 있어 큰 배움이 된 것 같다.f:["$","$L14",null,{"content":"$15"}]
10:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/b9ef641e76e3a351.css","precedence":"next"}]
11:["$","script","script-0",{"src":"/_next/static/chunks/6b8d09032578b975.js","async":true}]
12:["$","$L16",null,{"children":["$","$17",null,{"name":"Next.MetadataOutlet","children":"$@18"}]}]
18:null
