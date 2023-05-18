---
layout: single
title:  "[Jetson] Jetson Nano를 이용한 Yolov5 활용기 (3) - yolov5 설치 및 프로젝트 중 발생한 오류(시행착오) 정리"
excerpt: "Jetson Nano 내에 yolov5 설치"
toc: true
toc_sticky: true

categories:
  - Jetson
  - projects
tags: [Jetson, projects]
use_math: true

last_modified_at: 2023-02-18T19:11:08-19:20:00
classes: wide
---

이전 포스팅에 이어 진행하도록 하겠습니다.
드디어 마지막 yolov5를 설치할 차례입니다.

# 3. Yolov5 설치

## 1. github에서 기본 repository 받아오기

이제 95프로 왔다. 다온거다

아래의 코드를 통해 Yolov5의 repository를 받아준다.

```bash
git clone https://github.com/ultralytics/yolov5
cd yolov5
 
# yolov5s.pt weight 다운로드
wget https://github.com/ultralytics/yolov5/releases/download/v6.0/yolov5s.pt
```

## 2. 이후 폴더 내에 존재하는 requirements.txt에서 이미 설치한 항목들 지워주기

2-5과정에서 이미 설치한 항목들이 있으므로 requirements.txt에서 제거해준다.

```bash
# 다음 내용 requirements.txt에서 제거
 
numpy>=1.18.5
opencv-python>=4.1.2
torch>=1.7.0
torchvision>=0.8.1
```

## 3. pip 업그레이드 이후 requirements.txt 설치

```bash
python3 -m pip install --upgrade pip
 
python3 -m pip install -r requirements.txt
```

이렇게 하면 yolov5 설치가 완료된다!

# 4. 추가 참고 사항

## FPS 2로 출력되는 문제 (1)

다 설치하고 나면 FPS가 2로 출력되면서 웹캠으로 영상을 출력하는데 끊어지는 현상들이 발생한다.

본인의 판단으로는 아래의 사진에서 나타나는 경고 한 줄 때문이라 생각되는데..

![Untitled 2](https://user-images.githubusercontent.com/84653623/219853928-b88a83c2-f7ce-4269-a5db-85868c1915dd.png)

일단 더 찾아봐야할 듯 하다.(23.01.12-13)

## FPS 2로 출력되는 문제 (2) - [inf frames 2560x1472 at 2.00 FPS]

 inf frames 2560x1472 at 2.00 FPS 와 같이 출력되는 부분은 utils.dataloader.py에서 수정해 줄수 있는데 인위적으로 수정해서는 개선이 되지 않았다.

저 내용은 아래 사진들에서 볼 수 있듯이 환경의 종류가 다양한데, 이를 어떻게 적용하고 수정하는지 찾아봐야할 것 같다.(23.01.13)

![Untitled 3](https://user-images.githubusercontent.com/84653623/219853931-d4a42459-98e0-4f1d-b52a-43522469b8e1.png)

![Untitled 4](https://user-images.githubusercontent.com/84653623/219853933-e0f6d3ad-34c3-4e78-9a16-53df661296fd.png)

## 위 두 문제 해결 - (23.01.16)

![Untitled 5](https://user-images.githubusercontent.com/84653623/219853935-55418484-80fe-47e8-a8e6-f94fa31c6771.png)

yolov5/utils에 있는 dataloader.py에서 cap = cv2.VideoCapture(s)를 cv2.VideoCapture(s, cv2.CAP_V4L)로 입력하여 주면 (1)번 문제에서 나타나는 warning 오류 해결되며, 이와 동시에 FPS 30으로 증가.

동영상의 끊김이 전보다는 개선됨을 확인.

![Untitled 6](https://user-images.githubusercontent.com/84653623/219853936-685e32a0-7301-481c-8ad8-1042bdb35bb6.png)

(2)번 문제를 참고하여 inference 해상도를 증가시켰을 때 5FPS로 출력됨.

이에 따라 640*480이 가장 우수하다고 판단됨.


# 글을 마무리하며,,
이렇게 프로젝트가 마무리 됩니다.
본 프로젝트에서 dataset을 제작할 때에는 roboflow 사이트 내에서 데이터를 직접 제작하여 train하는데 사용을 했습니다.

기회가 된다면 데이터 제작기에 대해서도 정리를 해야겠네요.

아무튼 2022년의 6개월 이상 소요되었던 yolov5 with Jetson Nano 프로젝트는 다음과 같이 마무리 되었습니다.
사용한 제품이 4GB delveloper kit이다보니, 성능적 측면에서 훌륭한 기대효과를 볼 수는 없지만, 데이터의 특징이 뚜렷하다면 충분히 사용가능할 것으로 판단됩니다.

또한 yahboom의 경우 yolov4를 기본으로 지원하는데, 처음 프로젝트를 nvidia 제품으로 진행하였고, 그 과정에서 yolov5를 사용하였기 때문에 하는 수 없이 이런 여러 수고들이 있었습니다.
자료 또한 현저히 적었구요...
누군가 본 포스팅들을 통해 해결이 된다면 그걸로 정리하는 입장에서는 만족스러울 것 같습니다! 

PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. 긴 글 읽어주셔서 감사합니다. 
