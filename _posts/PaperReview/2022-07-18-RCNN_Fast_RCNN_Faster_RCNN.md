---
layout: single
title:  "[PaperReview] RCNN, Fast R-CNN, Faster R-CNN"
excerpt: "RCNN, Fast R-CNN, Faster R-CNN Paper 리뷰"
toc: true
toc_sticky: true

categories:
  - PaperReview
tags: [PaperReview]
use_math: true

last_modified_at: 2022-12-19T17:30:00-19:30:00
classes: wide
---

2021년 머신러닝 스터디에서 진행하였던 ['R-CNN, Fast R-CNN, Faster R-CNN' 논문 리뷰](https://docs.google.com/presentation/d/1VOyGj7IH4VlivV45MAWQFb-j1qn9RHmu/edit?usp=sharing&ouid=103416735755875236001&rtpof=true&sd=true)를 재구성한 포스팅임을 미리 알려드립니다.

# introduction
위 논문은 CV(Computer Vision), 즉 이미치 처리에 있어 기반이 되는 논문입니다.

오늘은 R-CNN, Fast R-CNN, Faster R-CNN에 대해 이야기해보고자 합니다.
우선 이 기법들이 무엇인가에 대해 알아볼 필요가 있습니다. 위 3가지 기술들은 Object Detection, 즉 사물을 인식하는 방법에 들어가는 하나의 기법입니다.
그렇다면 **Object Detection**은 무엇일까요?

# Object Detection (사물을 인식하는 방법)
이미지 내에서 사물을 인식하는 방법에는 다양한 유형이 존재합니다. 여러 물체에 대해 어떤 물체인지 분류하는 것을 **Classification**이라 합니다.
또한 그 물체가 어디 있는지 박스를 통해 위치 정보를 나타내는 것을 **Localization**이라 합니다.

**Object Detection**이란, 다수의 사물이 존재하는 상황에서 각 사물의 위치와 클래스를 찾는 작업을 말합니다.
![2](https://user-images.githubusercontent.com/84653623/179476396-5f98f40f-c2f6-4b27-95be-78af55c06752.PNG)

# 1-Stage Detector vs 2-Stage Detector
Deep Learning을 이용한 object detection은 크게 1-stage detector와 2-stage detector로 나눌 수 있습니다. 아래 그림을 통해 설명을 이어 진행하겠습니다.

가운데 수평 화살표를 기준으로 위 쪽에 위치한 논문들이 2-stage detector 논문들이고, 아래 쪽에 위치한 논문들이 1-stage detector 논문들 입니다. 이번 시간에는 위 쪽에 위치한 2-stage detector 논문들에 대해 공부해볼 예정입니다.
그렇다면 여기서 계속 나오는 말, stage detector란 무엇이고, 1, 2 stage detector의 차이는 무엇일까요??
![3](https://user-images.githubusercontent.com/84653623/179479840-0670f524-9d21-458d-ab52-bd8257a136ea.PNG)

Object Detection 문제는 앞에서 이야기하였듯이 물체의 위치를 찾는 localization 문제와, 물체를 식별하는 classification 문제를 합한 것입니다.
1-stage detector는 이 두 문제를 동시에 행하는 방법이고, 2-stage detector는 이 두 문제를 순차적으로 행하는 방법입니다.
따라서 1-stage detector가 비교적 빠르지만 정확도가 낮고, 반대로 2-stage detector가 비교적 느리지만 정확도가 높습니다.

오늘 우리가 중점적으로 다룰 R-CNN, Fast R-CNN, Faster R-CNN은 2-stage detector의 대표적인 기법입니다. (참고로 1-stage에는 YOLO 계열과 SSD 계열이 포함됩니다.)
![4](https://user-images.githubusercontent.com/84653623/179480874-347c4f7f-e29f-4e90-9f8d-ee996b56934f.PNG)

# R-CNN: Regions with CNN features
Object Detection 분야에서 최초로 딥러닝(CNN)을 적용시킨 것이 R-CNN입니다. 논문에서 소개하는 R-CNN의 구조는 다음과 같습니다.
1. Selective search를 이용해 2,000개의 **ROI(Region of Interest)를 추출**.
2. 각 ROI에 대하여 wraping을 수행하여 동일한 크기의 입력 이미지로 변경.
3. Warped image를 CNN에 넣어서(forward) 이미지 <u>feature를 추출</u>.
4. 해당 **feature**를 SVM에 넣어 클래스(class) 분류 결과를 얻음.
   - 이때 각 클래스에 독립적으로 훈련된 이진(binary) SVM을 사용. 
5. 해당 **feature**를 regressor에 넣어 위치(bounding box)를 예측.

R-CNN은 2-stage detector로서 전체 task를 두 가지 단계로 나누어 진행합니다.
첫번째 단계는 **Region Proposal**로 <u>물체의 위치를 찾는 일</u>이고, 두번째 단계는 **Region Classification**으로 <u>물체를 분류하는 일</u>입니다.

![5](https://user-images.githubusercontent.com/84653623/179483511-9fd51908-e38f-402d-8b7e-ceb1b5489851.PNG)
![6](https://user-images.githubusercontent.com/84653623/208387235-141c14f3-4a71-4ac5-aa8d-cf8b1e558c08.PNG)

이 논문에서는 위 두 task를 행하기 위해 구조를 아래의 3가지 모듈로 나누어 놓았습니다.
- 카테고리와 무관하게 물체의 영역을 찾는 모듈인 **Region Proposal**
- 각각의 영역으로부터 고정된 크기의 Feature Vector를 뽑아내는 **Large Convolutional Neural Network인 CNN**
- Classification을 위한 선형 지도학습 모델인 **Support Vector Machine**인 **SVM**

CNN의 경우, 이전 논문인 [ImageNet Classification with Deep Convolutional Neural Networks](https://sehooni.github.io/paperreview/ImageNet_Classification_with_Deep_Convolutional_Neural_Networks/)에서 이야기 했기에 생략하고, 
Region proposal과 SVM에 대해 알아보겠습니다.

## Region Proposal (영역 찾기)
R-CNN의 구조를 조금 더 자세히 살펴보면 다음과 같습니다. R-CNN은 **Region Proposal 단계**에서 **Selective Search**라는 알고리즘을 이용하였습니다.
Selective Search 알고리즘은 Segmentation 분야에 많이 쓰이는 알고리즘이며, 객체오 주변 간의 색감(Color), 질감(Texture) 차이, 다른 물체에 둘러 싸여 있는지(Enclosed) 여부 등을 파악해서 다양한 전략으로 물체의 위치를 파악할 수 있도록 하는 알고리즘 입니다.

![8](https://user-images.githubusercontent.com/84653623/208387319-05a0cf3c-c598-4053-903b-bf43757b6aa2.PNG)
오른쪽 그림과 같이 **Bounding box**들을 Random하게 많이 생성을 하고, 이들을 조금씩 Merge해 나가면서 물체를 인식해 나가는 방식으로 되어있습니다.
 이 알고리즘에 대해서는 **"물체의 위치를 파악하기 위한 알고리즘이구나"** 정도로 이해하면 될 것 같습니다. 이와 관련한 논문도 [Selective Search](http://www.huppelen.nl/publications/selectiveSearchDraft.pdf)논문이 있습니다.

R-CNN에서는 **Selective Search** 알고리즘을 통해 한 이미지에서 2,000개의 Region을 뽑아내고, 이들을 모두 CNN에 넣기 위해 같은 사이즈(224*224)로 압축하여 통일시키는 작업(Wraping)을 거칩니다.

## SVM (Support Vector Machine)
CNN 모델로부터 Feature가 추출이 되고 Training Label이 적용되고 나면, **Linear SVM**을 이용하여 classification을 진행합니다.(Category-Specific Linear SVMs) 
여기서 의문점이 드는 부분들이 있습니다. 분명 CNN에서 Classifier로 softmax를 사용한 것 같은데 R-CNN에서는 왜 SVM을 사용하였을까? 라는 의문점 말입니다.
![9](https://user-images.githubusercontent.com/84653623/208387322-810065ad-72fa-4385-8b93-1be6dfeec1c2.PNG)

이 논문에서는 CNN을 fine-tunning할 때, 이미지의 positive/negative examples와 SVM을 학습할 때의 이미지의 positive/negative examples를 따로 정의했습니다. 
CNN fine-tunning에서는 IoU가 0.5가 넘으면 positive로 두었고, 이외에는 "background"로 labeled해 두었습니다.
![10](https://user-images.githubusercontent.com/84653623/208387333-dbd08e1a-0059-477a-871d-3803171845a1.PNG)

    여기서 IoU란, Intersection ove Union의 줄임말로, 두 바운딩 박스가 겹치는 비율을 의미합니다. 
    성능 평가를 예시로 들자면, mAP@0.5는 정답과 예측의 IoU가 50% 이상일 때 정답으로 판정하겠다는 의미를 말하며, NMS 계산을 예시로 들자면, 같은 클래스(class)끼리 IoU가 50% 이상일 때 낮은 confidence의 box를 제거한다는 의미입니다. 
    이때, mAP는 mean Average Precision을 의미합니다. 이러한 정보는 Computer Vision 분야에서 성능평가 지표로 사용됩니다.
![11](https://user-images.githubusercontent.com/84653623/208387340-20af13f3-52e9-4d5f-a0aa-d76c5b856d60.PNG)

반면에 SVM을 학습할 때의 ground-truth boxes만 positive example로 두고, IoU가 0.3 미만은 모두 negative, 나머지는 전부 무시하게 됩니다.
SVM을 CNN fine-tunning과 같은 값을 두고 학습했을 때 훨씬 성능이 안 좋게 나왔다고 합니다.
시기상으로 fine-tunning 학습 데이터가 많지 않았기 때문에 IoU가 0.5~1 사이의 positive 영역들이 다소 정확하지 않았고, 때문에 바로 softmax classifier를 적용시켰을 때 성능이 좋지 않아서 위와 같이 SVM을 학습하는 과정이 필요했다고 보여집니다.

어찌됐는 SVM은 CNN으로부터 추출된 각각의 feature vector들의 점수를 class 별로 매기고, 객체인지 아닌지, 객체라면 어떤 객체인지 등을 판별하는 classifier입니다.
R-CNN 논문에서도 이에 대한 설명을 기재해 놓았습니다.
VOC2007 데이터셋 기준으로 Softmax를 사용하였을 때 mAP값이 54.2%에서 50.9%로 떨어졌다고 합니다.

## R-CNN: Bounding Box Regression
Selective Search로 만들어낸 Bounding Box는 아무래도 완전히 정확하지 않기 때문에 물체를 정확히 감싸도록 조정해주는 **선형회귀 모델(Bounding Box Regression)** 을 넣었습니다. 설명의 간편화를 위해 bounding box를 bBox로 명시하겠습니다.
**bBox**의 input 값은 N개의 Training Pairs로 이루어져 있습니다.  
![12](https://user-images.githubusercontent.com/84653623/208387347-5761eb95-821a-4477-8d18-7e3c58af01fc.PNG)

**x, y, w, h**는 각각 bBox의 **x, y좌표(위치), width(너비), height(높이)** 를 뜻 합니다.
**P**는 **선택된 bBox**이고 **G**는 **Ground Truth(실제 값) bBox**입니다.
**<u>선택된 P를 G에 맞추도록 transform 하는 것을 학습하는 것이 Bounding Box Regression의 목표**</u>입니다.
![13](https://user-images.githubusercontent.com/84653623/208387361-08aa2812-44be-4ee2-a7d9-61d999450baf.PNG)

## R-CNN의 한계점
R-CNN은 이전 Object Detection 방법들에 비해 굉장히 뛰어난 성능을 보였다는 것은 분명하지만 명확한 몇몇 단점들을 가지고 있습니다.
- 입력 이미지에 대하여 **CPU 기반의 Selective Search**를 진행해야 하므로 많은 시간이 소요됩니다.
- 모든 RoI를 CNN에 넣어야 하기 때문에 **2,000번의 CNN 연산이 필요**합니다.
  - 학습(training)과 평가(testing) 과정에서 많은 시간이 필요합니다.
- 전체 아키텍처에서 SVM, Regressor 모듈이 CNN과 분리되어 있습니다.
  - CNN은 고정되므로, SVM과 Bounding Box Regression 결과로 CNN을 업데이트할 수 없습니다.
  - 다시 말해 <u>end-to-end 방식으로 학습할 수 없습니다.</u>

마지막 줄을 정리하자면 **Back Propagation이 안된다** 고 볼 수 있습니다. R-CNN은 Multi-stage Trainig을 수행하며, **SVM, Bounding Box Regression**에서 학습한 결과가 **CNN**을 **업데이트 시키지 못하는 것**입니다.

이러한 한계가 존재하지만, R-CNN은 **최초로 Object Detection에 딥러닝 방법인 CNN을 적용시켰다는 점**과 **이후 2-Stage detector들의 구조에 막대한 영향을 미쳤다는 점**에서 의미가 큰 논문입니다.
    
![14](https://user-images.githubusercontent.com/84653623/208387377-92f7e2e0-7e8f-410d-b79e-181fd84f43f1.PNG)

다음으로 등장한 **Fast R-CNN**에 대해 알아보겠습니다.

# Fast R-CNN
**Fast R-CNN*도 **R-CNN**과 똑같이 처음에 **Selective Search**를 통해 Region Proposal을 뽑아내긴 합니다.
하지만 R-CNN과 다르게 **<u>뽑아낸 영역**을 Crop하지 않고 그대로 가지고 있고, **전체 이미지를 CNN Model에 집어 넣은 후** CNN으로부터 나온 **Feature Map**에 **RoI Projection**을 하는 방식을 택했습니다.</u>

즉, input image 1장으로부터 **CNN Model**에 들어가는 이미지는 **2,000장 → 1장**이 되었습니다.
![15](https://user-images.githubusercontent.com/84653623/208387388-30643d6c-9a69-496c-9373-414c454f876b.PNG)

이 Projection 한 bBox들을 **RoI Pooling** 하는 것이 **Fast R-CNN의 핵심**입니다.
Projection시킨 RoI를 **FCs(Fully Connected Layer)**에 넣기 위해서는 같은 Resolution의 Feature map이 필요합니다.
하지만 Selective Search를 통해 구해졌던 RoI 영역은 각각 다른 크기를 가지고 있습니다.
따라서 이 Resolution의 크키를 맞추기 위해 **RoI Pooling**을 수행합니다.

**RoI Pooling**은 간단히 말해서 **<u>크기가 다른 Feature Map**의 **Region**마다 **Stride를 다르게 Max Pooling을 진행**</u>하여 결과값을 맞추는 방법입니다.
![16](https://user-images.githubusercontent.com/84653623/208387395-c5fe9e4d-9fc5-4933-a403-78e7a653290f.PNG)

마지막으로 **Fixed Length Feature Vector를 FCs**에 집어넣은 후 두 자식 layer인 output layer로 뻗어 나가 **Classification**과 **bBOx Regression**을 진행합니다.
이는 R-CNN과 비슷하게 진행되지만 **Fast R-CNN**은 **Softmax**를 사용하여 Classification을 진행하였다는 점에서 차이를 보입니다.

이후 등장한 Faster R-CNN에 대해 알아보도록 하겠습니다.

# Faster R-CNN
Faster R-CNN의 논문에서는, Region Proposal 방법을 GPU를 통한 학습으로 진행하면 확실히 성능이 증가할 것이라고 말하고 있습니다.
따라서 Faster R-CNN은 Deep Network를 사용하여 Region Proposal를 진행하는 **RPN (Region Proposal Networks)**를 소개합니다.
![17](https://user-images.githubusercontent.com/84653623/208387402-98b2e298-e31c-426c-b926-717d949fdc2e.PNG)

## Faster R-CNN: Region Proposal Network(RPN)
**RPN**의 **input**은 image의 **Feature Map**이고, **output**은 Object proposal들의 **Sample**입니다. 
이 Sample들을 Fast R-CNN과 동일하게 **RoI Pooling**을 한 후, **Classification, bBox Regression**을 진행합니다.
Pretrained된 CNN을 거쳐서 나온 **Feature Map**은 ZFNet 기준으로 256-d, VGG-16 기준으로 512-d를 갖게됩니다.(여기서 d는 차원으로 이해하였습니다.)

    이때 ZFNet은 ILSVRC 2013에서 우승한 CNN구조이고, VGG-16은 옥스퍼드 대학의 연구팀 VGG에 의해 개발된 VGGNet의 모델 중 하나로 16개 층으로 구성된 모델이며, 2014년 이미지넷 인식대회에서 준우승한 모델을 의미합니다.
이 **Feature Map**을 k개의 Anchor box를 통해 영역을 정하고 **Classification Layer**와 **bBox Regression**을 거쳐서 물체가 위치한 곳을 학습하게 됩니다.
**<u>여기서 Classification Layer가 물체가 있는지 없는지만 확인하므로, Class의 수는 2입니다.**</u>
![18](https://user-images.githubusercontent.com/84653623/208387417-111f9431-a58d-4e34-b0fc-868a4494c29e.PNG)

# 요약하자면...
3가지 모델들을 정리해보자면 아래와 같습니다.
발전 방향의 순서대로 각 모델의 장단점에 대해 정리하였습니다. 확실히 faster R-CNN으로 갈수록 사진당 속도가 빠르게 증가하였음을 확인할 수 있으며, 동시에 정확도로 볼 수 있는 mAP의 값 또한 미비하지만 증가했음을 확인할 수 있습니다.
![19](https://user-images.githubusercontent.com/84653623/208604296-cb2fb558-8064-4358-8cd6-f797f6f389d5.PNG)
![20](https://user-images.githubusercontent.com/84653623/208387438-e7b201d4-2153-488c-b1a5-e4e862f3871d.PNG)

---
PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. 긴 글 읽어주셔서 감사합니다. 


# Reference
- 논문
  - [Rich feature hierarchies for accurate object detection and semantic segmentation](https://arxiv.org/abs/1311.2524)
  - [Fast R-CNN](https://openaccess.thecvf.com/content_iccv_2015/html/Girshick_Fast_R-CNN_ICCV_2015_paper.html)
  - [Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks](https://proceedings.neurips.cc/paper/2015/hash/14bfa6bb14875e45bba028a21ed38046-Abstract.html)