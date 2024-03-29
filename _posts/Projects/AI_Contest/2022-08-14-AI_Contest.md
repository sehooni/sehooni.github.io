---
published: true
title:  "[2022인공지능경진대회] 2022년 인공지능 온라인 경진대회 후기"
excerpt: "2022년 인공지능 온라인 경진대회 후기"
toc: true
toc_sticky: true

categories:
  - Contest
  - projects
tags: [인공지능경진대회, projects]

date: 2022-10-02
last_modified_at: 2022-10-02T13:40:00-20:45:00
classes: wide
---

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
그렇지만 이번 대회를 통해 이미지처리 분야의 능력을 조금 더 발전 시켰다는 부분에 있어 큰 배움이 된 것 같다.