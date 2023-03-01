---
layout: single
title:  "[PaperReview] Mask R-CNN & U-Net"
excerpt: "Mask R-CNN & U-Net Paper 리뷰"
toc: true
toc_sticky: true

categories:
  - PaperReview
tags: [PaperReview, CV, Mask_RCNN, UNet]
use_math: true

last_modified_at: 2023-03-01T14:18:08-18:04:00
classes: wide
---

2021년 머신러닝 스터디에서 진행하였던 ['Mask R-CNN & U-Net' 논문 리뷰](https://docs.google.com/presentation/d/1i2dFQ0dgBJxTL2Kc0MMFizsYLUd5IOXj/edit?usp=sharing&ouid=103416735755875236001&rtpof=true&sd=true)를 재구성한 포스팅임을 미리 알려드립니다.

# introduction

컴퓨터 비전(Computer Vision, CV) 분야의 주요 과제를 살펴보면 다음과 같은 3가지로 나뉘어집니다.
1. Classification
2. Object Detection
3. Image Segmentation

 이전 포스팅까지 다루었던 Faster R-CNN까지는 이중 2-stage에 기초한 Classification의 다음 단계인, **(특히)** 2번째 단계인 ``Object Detection을 위해 고안된 모델들``이었습니다.
**``Mask R-CNN은 3번째 단계인 Image Segmentation을 수행하기 위해 고안된 모델``** 입니다.

 여기서 Segmentation이 무얼 의미할까 개인적으로 궁금해서 우선적으로 사전적 의미를 찾아봤습니다. 사전적 의미로 '분할', '분할된 부분'이라는 뜻이었습니다. 저는 말 그대로 이미지를 분할해서 사용하겠다고 미리 예상을 해보고 내용으로 들어가 보았습니다.
![3](https://user-images.githubusercontent.com/84653623/208845578-651a967d-b388-4736-8db0-777bab88fb64.PNG)

# Mask R-CNN
## 기존 R-CNN 모델들과의 차이점
Mask R-CNN은 Faster R-CNN과 크게 다르지 않은 구조로, 그 차이점은 다음과 같습니다.
기존 Faster R-CNN은 이전 포스팅에서 설명했듯이 **Fast R-CNN에 RPN(Region Proposal Network)** 를 추가한 구조로 첫 번째 식과 같다고 볼 수 있습니다.
또한 `Mask R-CNN이 Faster R-CNN으로부터 달라진 점을 두 번째 식과 같이 도식화 할 수 있습니다.`
![4](https://user-images.githubusercontent.com/84653623/208845579-61180009-dcf8-40ef-8337-d387ec886202.PNG)

1) Fast R-CNN의 Classification, localization(Bounding Box Regression) Branch에 새롭게 mask branch가 추가되었습니다.
2) RPN전에 FPN(Feature Pyramid Network)가 추가되었습니다.
3) Image Segmentation의 masking을 위해 RoI align이 RoI Pooling을 대신하게 되었습니다.

위 3가지를 설명하기에 앞서 Mask R-CNN의 구조를 살펴보도록 하겠습니다.
![5](https://user-images.githubusercontent.com/84653623/208845583-18dd59c6-9695-477d-8e91-0c95b37b98f1.PNG)

## Mask R-CNN의 구조
N*N 사이즈의 input image가 주어졌을 때, Mask R-CNN의 Process는 다음과 같습니다.
본 슬라이드를 통해 전체적인 맥락과 흐름, 과정을 파악하고 뒤쪽에서 step-by-step으로 세분화하여 설명하도록 하겠습니다.
![6](https://user-images.githubusercontent.com/84653623/208845586-664b2c62-da1c-4d9a-ba25-4bedb90fc84e.PNG)
![7](https://user-images.githubusercontent.com/84653623/208845588-cf7407a4-1544-4881-a133-8cf673374bdd.PNG)

### Mask R-CNN: Resize Input Image
Mask R-CNN에서는 backbone으로 ResNet-101을 사용하는데 ResNet 네트워크에서는 이미지 input size가 800 ~ 1,024일 때 성능이 좋다고 알려져 있습니다.
(VGG는 224 * 224로, 이때 VGG는 옥스퍼드 연구팀 VGG에서 만든 VGGNet을 의미합니다.)
따라서 이미지를 800 ~ 1,024정도의 size로 맞춰주는데, 이때 `bilinear interpolation을 사용하여 resize` 해주게 됩니다.

과정을 다시 설명하면 다음과 같습니다.
- 2x2의 이미지를 왼쪽 그림과 같이 4x4로 upsampling 한다면 2x2에 있던 pixel value가 각각 P1, P2, P3, P4로 대응하게 됩니다.
- 이때 총 16개 중 4개의 pixel만 값이 대응되고 나머지 12개는 값이 아직 채워지지 않게 됩니다.
- 이를 bilinear interpolation으로 값을 채워주게 됩니다.
- 이렇게 기존의 image를 800 ~ 1,024 사이로 resize해준 후 네트워크의 input size인 1,024x1,024로 맞추기 위해 나머지 값들은 zero padding으로 값을 채워 주게 됩니다.


**Bilinear interpolation**은 여러 interpolation 기법 중 하나로 동작 과정은 다음과 같습니다.
- 일반적으로 두 지점 p1, p2에서의 데이터 값이 각각 f(p1), f(p2)일 때, p1, p2 사이의 임의의 지점 p에서의 데이터 값 f(p)는 아래 그림과 같이 계산할 수 있습니다.

![8](https://user-images.githubusercontent.com/84653623/208845590-16df92d1-4e6f-4145-8cf3-08284146cd9e.PNG)

### Mask R-CNN: Backbone-ResNet101
Mask R-CNN을 공부하면서, 저에게 있어 가장 까다로운 부분은 이 ResNet 부분이었습니다.
Network 중 하나로 생각하고 넘기기에는 부족한 점이 많아서 최대한 찾아보고 조사한 내용을 바탕으로 설명해보도록 하겠습니다.

이전의 연구들로 **모델의 layer가 너무 깊어질수록** 오히려 성능이 떨어지는 현상이 발생함을 이야기했습니다. 이는 **Gradient vanishing/exploding** 문제 때문에 학습이 잘 이루어지지 않기 때문입니다.
이때 `Gradient vanishing`이란, `layer가 깊어질수록 미분을 점점 많이 하기 때문에 Back-Propagation을 해도 앞으로 layer 일수록 미분값이 작아져 그만큼 output에 영향을 끼치는 weight 정도가 작아지는 것을 의미`합니다.
이는 **Over-fitting**과는 다른 문제입니다. Over-fitting은 학습데이터에 완벽하게 fitting 시킨 탓에 테스트 성능에서는 안 좋은 결과를 보임을 뜻합니다. 그러나 위와 같은 문제는 **Degradation** 문제로 training data에도 학습이 되지 않음을 뜻합니다.

 이를 극복하기 위해 ResNet을 고안한 것입니다. ResNet는 `Skip connection을 이용한 Residual Learning을 통해 layer가 깊어짐에 따른 Gradient Vanishing 문제를 해결`하였습니다.
 ![9](https://user-images.githubusercontent.com/84653623/208845595-11b1ed78-0fa2-453e-ba2d-c519cc706a81.PNG)
 
기존의 Neural Net의 학습 목적은 input(x)을 타겟 값(y)으로 mapping하는 함수 H(x)를 찾는 것이었습니다.
따라서 `H(x) - y`를 최소화하는 방향으로 학습을 진행하게 됩니다.

    이때 이미지 classification과 같은 문제의 경우, x에 대한 타겟 값 y는 사실 x를 대변하는 것으로 y와 x의 의미가 같게 끔 mapping 해야한다. 즉, 강아지 사진의 pixel 값이 input(x)로 주어질 때, 이를 2개의 label중 강아지가 1에 해당한다면 타겟 값(y)를 1로 정해서 학습하는 것이 아닌, 강아지 사진의 pixel 값(x)로 y를 mapping 해야한다.

따라서 `네트워크의 출력값이 x가 되도록 H(x) - x를 최소화하는 방향으로 학습을 진행`합니다.
*F(x) = H(x) - x*를 잔차라고 하며, 이 잔차를 학습하는 것은 **Residual learning**이라 합니다.

결국 이 문제를 해결하기 위해서, 네트워크는 0이 되도록 학습시키고 마지막에 x를 더해서 H(x)가 x가 되로록 학습하면, 미분을 해도, x 자체는 미분 값 1을 갖기 때문에 각 layer마다 최소 gradient로 1은 갖도록 한 것 입니다.
![10](https://user-images.githubusercontent.com/84653623/221755707-4e2b9c17-7bda-4f05-b4d4-1826cbcac17c.PNG)

이렇게 shortcut connection으로 만든 block을 identity block이라고 하는데요.
그리고 ResNet은 identity block과 convolution block으로 구성되는데 각각은 아래 슬라이드 11과 같습니다.
단순히 `identity block은 이전까지 설명했듯이 네트워크의 output F(x)에 x를 그대로 더하는 것`이고, `Convolution block은 x 역시 1x1 convolution 연산을 거친 후 F(x)에 더해주는 것` 입니다.
그리고 ResNet은 이 두가지 block를 다음 슬라이드 12와 같이 쌓아서 구성합니다.
![11](https://user-images.githubusercontent.com/84653623/221755710-c7469784-f4ba-4976-8a05-215bffe77c43.PNG)
![12](https://user-images.githubusercontent.com/84653623/221755713-96ed41c4-af8d-44cd-b091-475a5efdecb2.PNG)

### Mask R-CNN: FPN(Feature Pyramid Network)
**이전의 Faster R-CNN에서의 한계**는 `backbone의 결과로 나온 1개의 feature map에서 RoI를 생성하고, classification 및 bbox regression을 진행한다는 점`이었습니다.
해당 feature map은 backbone 모델 최종 layer에서의 output인데, 이렇게 layer를 통과할수록 아주 중요한 feature만 남게 되고,중간중간의 feature들은 모두 잃어버리게 됩니다.
그리고 최종 layer에서 다양한 크기의 object를 검출해야 하므로, 여러 scale 값으로 anchor를 생성하게 되나 이는 매우 비효율적입니다.

이를 극복하기 위해 나온 방법이 바로 **FPN(축약설명)**입니다.

FPN의 작동과정은 다음과 같습니다.
마지막 layer의 feature map에서 점점 이전의 중간 feature map들을 더하면서 이전 정보까지 유지할 수 있도록 합니다.
이렇게 함으로써 더 이상 여러 scale 값으로 anchor를 생성할 필요가 없게 되었고, 모두 동일한 scale의 anchor를 생성하게 됩니다. 따라서 작은 feature map에서는 큰 anchor를 생성하여 큰 object를, 큰 feature map에서는 다소 작은 anchor를 생성하여 작은 object를 detect할 수 있도록 설계되었습니다.

마지막 layer에서의 feature map에서 이전 feature map를 더하는 것은 upsampling을 통하여 이루어지게 됩니다.
![14](https://user-images.githubusercontent.com/84653623/221755718-4ba44620-efc6-4339-8c12-22d9b99e92e3.PNG)

이 과정을 자세히 살펴보면,
먼저 2배로 upsampling을 한 후, 이전 layer의 feature map을 1x1 Fully convolution 연산을 통해 filter 갯수를 똑같이 맞춰준 후 더함으로써 새로운 feature map을 생성하게 됩니다. 
결과적으로 ResNest을 통해 C1, C2, C3, C4, C5 feature map을 생성하게 되는데, C1은 사용하지 않고 C5부터 P5, P4, P3, P2를 생성하고 P5에서 max pooling을 통해 P6를 추가로 생성하게 됩니다.

`최종적으로 P2, P3, P4, P5, P6 이렇게 5개의 feature map이 생성되는 것입니다.`

추가적으로 C1을 사용하지 않는 이유는 특별한 이유가 있어서라기보다는 C1은 raw image에서 conv을 한 단계만 거친 상태이기 때문에 성능에 큰 영향을 주지 않아서이지 않을까라는 생각이 듭니다. 
또한 파라미터 개수와 성능 간의 trade-off를 생각했을 때 C1은 빼고 나머지만 이용하는 것이 오히려 더 좋았기 때문일거라 생각합니다.

위에서 설명한 부분을 다시 정리하면 다음과 같습니다.
- P2 ~ P5의 경우 : 
 RPN에 보내기 전에 3x3 convolution 연산을 거치게 됩니다. P2~P5는 up-sampling과 이전 feature map을 더함으로써 feature data가 조금 망가졌을 수 있기에 3x3 연산을 한번 더 진행해주는 것 입니다.
- P6의 경우 : 
P5에서 max-pooling을 한 결과이므로 3x3 연산을 하지 않고 RPN에 그대로 전달하게 됩니다.

![15](https://user-images.githubusercontent.com/84653623/221755722-7c584d38-ed52-4072-b501-95dcdb122236.PNG)

### Mask R-CNN: RPN
RPN은 이전 포스팅 [R-CNN 논문 리뷰](https://sehooni.github.io/paperreview/RCNN_Fast_RCNN_Faster_RCNN/)에서 설명을 했었죠?!
아래 슬라이드 16은 Faster R-CNN의 작동과정을 나타낸 그림입니다.

**RPN**을 Faster R-CNN과 비교했을 때 `생성하는 anchor 개수의 차이만 존재합니다.`
**RPN 작동과정**은 FPN을 통해 생성된 P2, P3, P4, P5, P6을 각각 RPN 모델에 전달하게 되고, Faster R-CNN과 달리 이제 각 feature map에서 1개 scale의 anchor를 생성하므로, 결국 각 pyramid feature map마다 (scale) 1개 x (ratio) 3개 = 3개의 anchor를 생성하게 됩니다.
![16](https://user-images.githubusercontent.com/84653623/221755723-4f7f41e6-a5b4-46d4-b3eb-cd0d33caf5be.PNG)

RPN을 통해 output으로 classification 값, bbox regression 값이 나오는데, 이때 bbox regression 값은 delta 값 입니다.
아래 슬라이드 17에서의 t값들, 즉 delta값을 output으로 받게됩니다. 따라서 이 delta 값에 anchor 정보를 연산해서 **원래 이미지에 대응하는 anchor bounding bos 좌표값**으로 바꿔주게 되는 것 입니다.
![17](https://user-images.githubusercontent.com/84653623/221755726-4e7b81e9-d7fd-45b8-b97e-b75e5887b05c.PNG)

### Mask R-CNN: Non-max-supppression
원래 이미지에 anchor 좌표를 대응시킨 후에는 각각 normalized coordinate으로 대응시킵니다.
이는 fpn에서 이미 각기 다른 feature map 크기를 갖고 잊기에 모두 통일되게 정규 좌표계로 이동시키는 것입니다.
이렇게 수천 개의 anchor box가 생성되면 NMS 알고리즘을 통해 anchor의 개수를 줄이게 됩니다.

아래 있는 슬라이드 18을 보며 같이 봐주시면 감사하겠습니다.
각 object마다 대응되는 anchor가 수십 개 존재하는데 이때 가장 classification score가 높은 anchor를 제외하고 주위에 다른 anchor들은 모두 지우는 것입니다.

NMS 알고리즘은 anchor bbox들을 score 순으로 정렬시킨 후 score가 높은 bbox부터 다른 bbox와 IoU를 계산합니다.
이때 `IoU가 해당 bbox와 0.7이 넘어가면 두 bbox는 동일 object를 detect한 것이라 간주`하여 score가 더 낮은 bbox는 지우는 식으로 동작을 합니다.
최종적으로 각 객체마다 score가 가장 큰 box만 남게 되고, 나머지 box는 제거하게 됩니다.
![18](https://user-images.githubusercontent.com/84653623/221755728-2ea48665-1ad1-48e2-a33d-fd5b90a19b8f.PNG)

### Mask R-CNN: RoI align
기존의 Faster R-CNN에서 RoI pooling은 object detection을 위한 모델이었기에 정확한 위치 정보를 담는 것이 중요하지 않았습니다. 
따라서 슬라이드 20와 같이 인접 픽셀로 box를 이동시킨 후 pooling을 진행했습니다.
이렇게 RoI가 소수점 좌표를 가지면 좌표를 반올림하는 식으로 이동시킨 후 pooling을 했습니다.
이렇게 되면 `input image의 위치정보가 왜곡되기 때문에 segmentation에서는 문제로 작용하게 됩니다.`
![20](https://user-images.githubusercontent.com/84653623/221755734-ea642261-e8e0-410d-9e41-fbfe534be43f.PNG)

따라서 Bilinear interpolation을 이용해서 위치정보를 담는 RoI align을 이용합니다.
(Bilinear interpolation은 앞선 슬라이드 8에서 이야기하였습니다. :) )
![21](https://user-images.githubusercontent.com/84653623/221755736-0eed1d2f-9821-4edc-95d8-70a0e11de5a8.PNG)

### Mask R-CNN: Mask branch
Class, box branch는 공간 정보가 필요 없기 때문에 FC layer를 사용해서 (channels 1,1) vector로 변환됩니다.
하지만 **Mask branch는 공간 정보를 추출해야 합니다.** `따라서 convolution을 사용하여 pixel-to-pixel 정보를 추출합니다.`
여기서 pixel-to-pixel 정보란, class에 따라 분할된 이미지 조각이라 생각하면 좋을 듯 합니다.
`Mask branch는 FCN을 사용하여 각 RoI에 대해 m x m 크기의 K개 mask를 예측합니다.`(이때 K는 class 수를 의미합니다.)
FC layer를 사용하지 않는 이유는 공간 정보를 활용하기 위함입니다. 따라서 mask는 이미지 내 객체에 대한 공간 정보를 효과적으로 encode 하는 것이 가능합니다.
![22](https://user-images.githubusercontent.com/84653623/221755740-f51ad527-ced0-4ead-8bdd-6af29ddc68d2.PNG)
![23](https://user-images.githubusercontent.com/84653623/221755743-e9657783-c97b-48c2-9b1a-dc1fa5560b22.PNG)

## Mask R-CNN 요약
Mask R-CNN은 일반적으로 detection task보다는 instance segmentation task에서 주로 사용됩니다.
Faster R-CNN으로 찾은 RoI에서 FCN을 이용하여 Segmentation하자는 아이디어에서 시작되게 되었습니다.
이번 포스팅을 통해 동작 순서와 구조를 비롯해 이전 모델과의 차이점을 살펴보았습니다.


# U-Net
## U-Net이란?
다음 논문인 U-Net에 대해 이야기해보겠습니다.
U자 모양으로 생긴 U-Net은 의료 이미지 특성상 적은 수의 데이터로도 정확한 Segmentation(분할)이 가능합니다.
U-Net이 개선한 점은 다음과 같습니다.
1. 속도를 향상시켰습니다.
2. Context 인식과 localization 간의 trade-off 문제를 해결하였습니다.

여기서 **context**와 **trade-off**는 기존에 존재하던 과제의 **문제점**이었습니다.
**context**란, 서로 이웃한 이미지 픽셀 간의 관계를 의미합니다. 즉, 이미지의 일부를 보고 전반적인 이미지의 context를 파악하는 맥락으로 보시면 될 것 같습니다.
또한 **trade-off**란, 지도 학습 알고리즘이 트레이닝 셋의 범위를 넘어 지나치게 일반화하는 것을 예방하기 위해 두 종류의 오차를 최소화 할 때 겪는 문제를 말합니다. 
넓은 범위의 이미지를 한꺼번에 인식하면 전반적인 context를 파악하기에 용이합니다. 그러나 localization을 제대로 수행하지 못해 어떤 픽셀이 어떤 레이블인지 세밀하게 인식하지 못하게 됩니다.
반대로 범위를 좁히면 세밀한 localization이 가능하지만 context 인식률이 저하되는 문제점이 발생합니다.

이러한 문제점들을 개선한 모델이 바로 U-Net입니다.
![24](https://user-images.githubusercontent.com/84653623/221755746-d28e407b-97c0-4e02-b6a9-f12694ecf376.PNG)

이러한 두가지 문제점을 다음의 방법을 통해 해결하였습니다.
1. `속도 저하의 문제: 기존의 sliding window 방식이 아닌, patch 탐색 방식을 사용하였습니다.`
2. `trade-off 문제: Contracting path에서는 이미지의 context를 포착하고, Expanding path에서는 feature map을 upsampling한 뒤, 이를 contracting path에서 포착한 (feature map의)context와 결합하여 localization의 정확도를 높였습니다.`
![25](https://user-images.githubusercontent.com/84653623/221755749-fe5de78d-58f9-4862-8e9d-e122041b55d4.PNG)

## Structure of U-Net
U를 닮은 모델의 구조는 크게 3가지로 나눌 수 있습니다.
1. **수축 경로(Contracting Path)** : 점진적으로 넓은 범위의 이미지 픽셀을 보며 의미정보(context information)을 추출
2. **확장 경로(Expanding Path)** : 의미 정보를 픽셀 위치정보와 결합(localization)하여 각 픽셀마다 어떤 객체에 속하는지 구분
3. **전환 구간(Bottle Neck)** : 수축 경로에서 확장 경로로 전환

간략히 모델의 작동을 살펴보면 다음과 같습니다.
모델의 input은 이미지의 픽셀 별 RGB데이터이고, 모델의 output은 이미지의 각 픽셀별 객체 구분 정보(class)입니다.
Convolution 연산과정에서 패딩(padding)을 사용하지 않으므로 모델의 output size는 input size보다 작습니다.
예를 들어, 572x572(RGB)크기의 이미지를 input으로 사용하면 output으로 388x388(class) 이미지가 생성되게 됩니다.
![26](https://user-images.githubusercontent.com/84653623/221755750-3eb8fe03-efd7-4f45-a95d-60e59fdd4fbc.PNG)

다음으로 각 단계의 구조 및 구성을 살펴보겠습니다.

### U-Net: 수축 경로 (Contracting Path)
먼저 수축 경로입니다.

수축경로에서 아래 슬라이드 27과 같은 Down-sampling 과정을 반복하여 특징 맵(feature map)을 생성하게 됩니다.
수축 경로는 주변 픽셀들을 참조하는 범위를 넓혀가며 이미지로부터 Contextual 정보를 추출하는 역할을 수행합니다. 3x3 convolution을 수행할 때, 패딩을 하지 않으므로, 특징맵(feature map)의 크기가 감소하게 됩니다.
또한 Down-sampling 할 때마다 채널(Channel)의 수를 2배씩 증가시키면서 진행하는데, 처음 input channel(1)을 64개로 증가시키는 부분을 제외하면, 채널은 1 → 64 → 128 → 256 → 512 → 1024로 Down-sampling을 진행할 때마다 증가하게 됩니다.

논문에서는 batch-normalization이 언급되지 않았으나 구현체 및 다수의 리뷰에서 batch-normalization을 사용하는 것을 확인했다고 하는데요.
Batch-normalization은 배치 정교화로 각 레이어마다 정규화하는 레이어를 두어 변형된 분포가 나오지 않도록 조절하는 것이라는데요.. 음.. 이 점은 저도 조금 더 찾아서 공부해야할 것 같습니다.
![27](https://user-images.githubusercontent.com/84653623/221755752-7e372a18-6857-47c3-b802-ed0308904f61.PNG)

### U-Net: 전환 구간(Bottle Neck)
다음으로 전환 구간입니다.
수축 경로에서 확장 경로로 전환되는 구간으로 슬라이드 28에서 볼 수 있듯이 구성되어 있습니다.
마지막에 적용된 Dropout layer는 모델을 일반화하고 노이즈를 견고하게(robust) 만드는 장치입니다.
![28](https://user-images.githubusercontent.com/84653623/221755753-32726546-9622-4d2e-bf6b-1a4752361672.PNG)

### U-Net: 확장 경로(Expanding Path)
마지막으로 확장 경로입니다.
확장 경로는 슬라이드 29에서 볼 수 있듯이, (2)skip connection을 통해 수축 경로에서 생성된 Contextual 정보와 위치 정보를 결합하는 역할을 합니다.
동일한 level에서 수축 경로의 특징 맵과 확장 경로의 특징 맵의 크기가 다른 이유는 수축 경로 슬라이드에서 설명했듯이 여러 번의 패딩이 없는 3x3 convolution layer를 지나면서 특징 맵의 크기가 줄어들었기 때문입니다.
확장 경로의 마지막에 class의 갯수만큼 필터를 갖고 있는 **1x1 Convolution Layer**가 있습니다. **1x1 Convolution Layer**를 통과한 후 `각 픽셀이 어떤 class에 해당하는지`에 대한 정보를 나타내는 **3차원(Width x Height x Class)벡터**가 생성됩니다.
![29](https://user-images.githubusercontent.com/84653623/221755755-ec54c15d-eb88-45d9-8ee0-7d80465ed8a0.PNG)

## U-Net: 학습 방법
다음은 U-Net 모델의 학습 방법입니다.
본 논문에서는 다양한 <u>학습 장치</u>들을 통해 모델의 성능을 향상시켰습니다.
- **Overlap-tile strategy** : 큰 이미지를 <u>겹치는 부분</u>이 있도록 일정크기로 나누고 모델의 input으로 활용
- **Mirroring Extrapolate** : 이미지의 경계(Border) 부분을 거울이 반사된 것처럼 <u>확장</u>하여 input으로 활용
- **Weight Loss** : 모델이 <u>객체 간 경계</u>를 구분할 수 있도록 Weight Loss를 구성 및 학습
- **Data Augmentation** : <u>적은 데이터</u>로 모델을 잘 학습할 수 있도록 데이터 증강 방법 활용

각 학습 장치들에 대해 살펴보겠습니다.
![30](https://user-images.githubusercontent.com/84653623/221755759-e1c48f4f-a2c5-4c2e-b153-f7b978bca235.PNG)

### Overlap-tile strategy
이미지의 크기가 큰 경우, 이미지를 자른 후 각 이미지를 해당하는 Segmentation을 진행해야 합니다.
U-Net의 경우, input과 output의 이미지 크기가 다릅니다. 슬라이드 31 속 그림과 같이, 파란색 영역을 input으로 넣으면 노란색 영역이 output으로 추출됩니다.
동일하게 초록색 영역을 Segmentation하기 위해서는 빨간색 영역을 모델의 input으로 사용하여야 합니다.

즉, 겹치는 부분이 존재하도록 이미지를 자르고, Segmentation하기 때문에 논문에서는 `Overlap-tile strategy`라고 지칭하였습니다.
![31](https://user-images.githubusercontent.com/84653623/221755761-5f903316-932c-42c0-a414-66c09a04ae3c.PNG)

### Mirroring Extrapolate
이미지의 경계부분을 예측할 때, Padding을 넣어 활용하는 경우가 일반적입니다.
본 논문에서는 이미지 경계에 위치한 이미지를 복사하고, 좌우반전을 통해 Mirror 이미지를 생성한 후 원본 이미지를 붙이는 방법을 통해 input으로 사용하였습니다.

본 논문의 실험 분야인 biomedical에서는 세포가 주로 등장하고, 세포는 상하 좌우 대칭 구도를 이루는 경우가 많기 때문에 Mirroring 전략을 사용했을 것이라 추측됩니다.
![32](https://user-images.githubusercontent.com/84653623/221755764-471f0548-d632-422a-9f34-a922f818035e.PNG)

### Weight Loss
모델은 슬라이드 33 속 그림처럼 작은 경계를 분리할 수 있도록 학습되어야 합니다.
따라서 논문에서는 `각 픽셀이 경계와 얼마나 가까운지에 따른 Weight-Map에 비례하게 증가시킴으로써 경계를 잘 학습하도록 설계`하였습니다.
![33](https://user-images.githubusercontent.com/84653623/221755766-15427f4d-ad83-4373-a15a-8cae9695fff8.PNG)

w(x)는 픽셀 x와 경계의 거리가 가까우면 큰 값을 갖게 되므로 해당 픽셀의 Loss 비중이 커지게 됩니다.
즉, 학습 시 경계에 해당하는 픽셀을 잘 학습하게 되는 것입니다.
![34](https://user-images.githubusercontent.com/84653623/221755768-48b77601-5d4f-46b3-a71c-2b692b89e5fd.PNG)

슬라이드 35의 그림은 이미지의 픽셀 위치에 따른 Weight w(x)를 시각화한 것입니다.
w(x)는 객체의 경계 부분에서 큰 값을 갖는 것을 확인합니다.
객체 간 경계가 전체 픽셀에 차지하는 비중은 매우 작습니다. 따라서 Weight loss를 이용하지 않을 경우 경계가 잘 학습되지 않아 여러 개의 객체가 한 개의 객체로 표시될 가능성이 높아 보입니다.
![35](https://user-images.githubusercontent.com/84653623/221755772-d189ebf5-0956-44a3-81e4-fd75e8692561.PNG)

### Data Augmentation
데이터의 양이 적기 때문에 데이터의 증강을 통해 모델이 Noise에 강건하도록 학습시키게 됩니다.
**Data Augmentation**이란, 원래의 데이터를 부풀려서 더 좋은 성능을 만든다는 뜻으로써, 대표적인 케이스가 VGG Model에서 많이 사용되고 벤치마킹 하였습니다.

`Data Augmentation이 중요하는 이유`는 다음과 같습니다.
1. Preprocessing & Augmentation을 하면 대부분 성능이 좋아진다.
2. 원본에 추가되는 개념임에 따라, 성능 저하가 발생하지 않는다.
3. 쉽고 패턴이 정해져 있다.

기본적인 예
- 좌우 반전
- 이미지 자르기
- 밝기 조절

Data Augmentation에서 **중요하게 사용된 것**은 크게 2가지로 파악됩니다.
1. Elastic Deformation
   - 적은 수의 이미지를 가지고 효과적으로 학습하기 위해 이 방식을 사용
   - 티슈 조직 등의 실질적인 변형과 유사
2. Weighted Cross Entropy + Data Augmentation
   - 많은 cell(세포)을 Segmentation 해야하는 문제에서의 도전 과제는 같은 클래스가 서로 인접해 있는 케이스

슬라이드 38의 a처럼 cell이 인접해 있으면, 각 cell과 배경을 구분하는 것은 쉽지만, cell 각각을 서로 구분 하는 것(논문에서는 instance segmentation이라 표현)은 어렵게 됩니다.
그래서 본 논문에서는 각 instance의 테두리와 테두리 사이가 반드시 배경이 되도록 처리하였다고 서술되어 있습니다.
즉, 2개의 ceel이 붙어있는 경우라고 하더라도, 그 둘 사이에는 반드시 배경으로 인식되어야 할 틈을 만들겠다는 의미입니다.
![38](https://user-images.githubusercontent.com/84653623/221755783-bb4d688d-da5f-438d-b6f4-4b9c73288a1a.PNG)

## U-Net 정리
U-Net을 정리하면 다음과 같습니다.
U-Net은 FCNs보다 확장된 개념의 **Upsamling**과 **Skip Atchitecture**를 적용한 모델을 제안합니다.
결과적으로 **U-Net의 구조**는 `아주 적은 양의 학습 데이터만으로 Data Augmentation을 활용하여 여러 Biomedical Image Segmentation 문제에서 우수한 성능을 보여주었습니다.`
![39](https://user-images.githubusercontent.com/84653623/221755786-bb7ded86-dffd-48b6-beb5-067ea97e01c3.PNG)


---
PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. 긴 글 읽어주셔서 감사합니다. 


# Reference
- 논문
  - [Mask R-CNN](https://arxiv.org/abs/1703.06870)
  - [U-Net: Convolutional Networks for Biomedical Image Segmentation](https://arxiv.org/abs/1505.04597)

