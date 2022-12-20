---
published: true
title:  "[Neural Style Transfer] Neural Style Transfer 프로젝트 Results"
excerpt: "tf를 활용한 Neural Style Transfer 구현 및 응용"
toc: true
toc_sticky: true

categories:
  - Neural_Style_Transfer
tags: [DL, ML, Project, Neural Style Transfer]

date: 2022-06-29
last_modified_at: 2022-06-29T14:00:00-16:00:00
classes: wide
---

학기가 모두 끝이 났습니다!! 그동안 프로젝트를 진행하고 시험,과제 처리하느라 업로드를 못했지만....
이제 시간적 여유가 생겼으니, 다시 정리해보도록 할게요.

본 포스팅에서는 최종 결과 및 발표 ppt와 관련한 내용을 정리할 예정입니다.
자세한 내용은 [본인의 깃허브 repository](https://github.com/sehooni/Neural-Style-Transfer_tf)
에 업로드 해 두었습니다.


# Neural Style Transfer-tf
opencv 및 tf.keras를 활용한 Neural Style Transfer 프로젝트.

## Processing in Project
- 프로젝트의 코드를 기존 코드와 비교.
- 최종 결과물 확인.

### Code 비교 (`Neural_Style_Transfer.py`)
기존의 `.ipymd`파일을 `.py`로 바꾸는 과정을 통해 변화를 준 부분이 존재 합니다.
우선 환경의 특성에 따라 main함수를 지정하여 주고 필요한 내용들은 미리 위에서 사전 정의해주게 됩니다.
타인이 본 코드를 사용할 때, 이미지들을 INPUT해주는 경로는 모두 상이할 수 있습니다.
따라서 정의해놓은 함수에 원하는 경로를 삽입하여주면 바로 작동하도록 새롭게 정의해놓았습니다.

![소스코드와 비교1](https://user-images.githubusercontent.com/84653623/176131250-99e46527-ee45-433d-a4e7-7f4a4cf0a3da.png)

![소스코드와 비교2](https://user-images.githubusercontent.com/84653623/176365710-8e31e48c-a3e7-427f-a5b1-ca8fe1112ddc.png)

![소스코드와 비교3](https://user-images.githubusercontent.com/84653623/176131466-e203a847-708e-4c1b-b027-3ec6f0371cb0.png)

### 동영상 파일에 적용하기 (`Neural_Style_Video.py`)
더 나아가 동영상 파일을 대상으로 하는 코드 또한 작성하였습니다.
이전 이미지처리 코드와의 큰 차이점은 역시 동영상을 대상으로 진행된다는 점입니다.
이때 OPENCV의 코드를 사용하게 됩니다.

동영상은 결국 이미지 사진의 연속으로 만들어지게 됩니다. 
본 코드의 실행과정 중 나오는 이미지 사진들을 살펴보면 frame별로 사진이 저장되어 있음을 확인할 수 있습니다.

기존 이미지 처리 코드와 동일하게 `if __name__ == __main__:`을 통해 정의해놓은 함수를 불러오고, 사전 정의해놓은 함수들의 input에 맞게 경로를 입력하여 주시면 되겠습니다.
![동영상 파일에 적용](https://user-images.githubusercontent.com/84653623/176131541-797e4638-e06b-436a-97df-ef6c1ba35aed.png)

본 프로젝트를 진행하면서 직면한 대표적인 문제는 다음과 같습니다.
예를 들자면, 198, 199 다음 2, 200, 201과 같이 프레임의 순서가 순차적으로 들어가지 않아 동영상을 생성했을 때 매끄럽지 못하고 튀는 듯한 양상을 보인 것입니다.
원인을 살펴보자면, 프레임은 제대로 추출하였으나, 이를 인간이 아는 숫자 순번이 아닌, 컴퓨터의 순차적인 순번으로(위에서 든 예시와 같이) 불러왔기 때문이었습니다.

이러한 문제는 아래 사진의 네모 코드와 같이 순서를 재 정렬하므로서 해결할 수 있었습니다.
프레임을 추출한 뒤 이 코드를 한번 실행하여 줌으로서, 스타일 변환된 사진들을 일차적으로 재정렬시킵니다.
이후 이 프레임들을 합쳐 영상을 제작하는 과정에서도 한번 더 삽입하여 줌으로서 영상이 튀지 않고 순차적으로 재생하도록 재정렬하였습니다.
![동영상 파일에 적용2](https://user-images.githubusercontent.com/84653623/176131642-01022619-70c4-4107-a74d-5f2a614a5397.png)

### Results
마지막 결과물을 확인하여 보면 다음과 같습니다.
이미지 처리의 경우, 총 두 번, 다른 사진을 이용하여  진행하였습니다. 저작권을 지키며 공개된 사진 및 본인이 직접 촬영한 이미지와 영상을 사용하였음을 알려드립니다! :)

![Results1](https://user-images.githubusercontent.com/84653623/176131743-829acc9d-b096-4b68-ae53-22d5ad56676a.png)
왼쪽이 원본사진으로 여러분들께서 흔히 아시는 에펠탑 사진이며, 오른쪽이 이미지 스타일 사진으로 창조의 기둥으로 명명된 성운 사진입니다.

![Results2](https://user-images.githubusercontent.com/84653623/176131840-18433d00-6d2a-438f-b2a2-0b68700df164.png)
두 번째로 사용한 사진으로 왼쪽이 원본인 남산타워 사진이고, 오른쪽이 이미지 스타일 사진으로 반고흐 작가의 '별이 빛나는 밤에' 입니다.

![Results3](https://user-images.githubusercontent.com/84653623/176131892-cf631a81-eb9e-4fe6-ad51-8771e94812d2.png)
본 프로젝트를 통해 위와 같은 결과들을 얻을 수 있었습니다.
어쩌면 화가의 역할을 이제는 컴퓨터가, 인공지능 모델이 대체할 수도 있겠다는 생각이 들었습니다.
원하는 원본 사진과 함께 원하는 그림 스타일만 넣으면 이와 같이 출력되기 때문입니다.

![Results4](https://user-images.githubusercontent.com/84653623/176131944-0b3efa54-32cc-4799-86b0-9b6f1f27bbff.png)
동영상의 경우, 왼쪽이 원본(제가 직접 촬영한), 오른쪽이 변환된 영상입니다.
블로그 특성상 repo에 업로드된 ppt를 통해 확인할 수 있을 것으로 예상됩니다.

이와 비슷하게 DALL-E라는 인공지능 모델은 아예 획기적으로 문장, 즉 글을 제시하면 새로운 이미지를 생성한다고 합니다.
논문 리뷰를 통해 본인 또한 공부해볼 예정입니다.

이처럼 영상처리, 이미지 처리 분야는 인공지능의 발전과 더불어 대표적인 기법으로서 수많은 연구와 적용이 진행되고 있습니다.
본 프로젝트는 그러한 발전의 기반이 되는 논문을 바탕으로 진행되었고, 코드를 구현하고 재구성하는 과정을 통해서 저 또한 많은 것을 배운 것 같습니다.


## Reference
본 repository는 Opencv 기법 및 tf.keras가 적용된 'Neural-Style-Transfer' project입니다.
원본 코드 또한 본 repo에 같이 업로드 해 놓았음을 알려드립니다.

### In this file, I use these photos.
- Effel Tower smogy january evening-By Siren.Com [CC BY-SA 3.0(https://creativecommons.org/licenses/by-sa/3.0/)], from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Effel_Tower_smogy_january_evening.jpg)  
- Image of Pillars of Creation by NASA, ESA, and the Hubble Heritage Team, [Public Domain](https://en.wikipedia.org/wiki/File:Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg)
- Arbre en fleur, Gustave Caillebotte,1882-By lbex73 [CC BY-SA 4.0(https://creativecommons.org/licenses/by-sa/4.0/)], from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Arbre_en_fleur,_Gustave_Caillebotte,_1882.jpg)
- Image of Starry Night by Vincent van Gogh [Public domain](https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1024px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg)
- The Tower of Namsan (photo by myself)

### PAPER
- [A Neural Algorithm of Artistic Style.2015](https://arxiv.org/abs/1508.06576) 에서 제시된 Mechanism을 이용하여 본 프로젝트를 진행한다.


# 글을 마무리하며
PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. 긴 글 읽어주셔서 감사합니다. 
