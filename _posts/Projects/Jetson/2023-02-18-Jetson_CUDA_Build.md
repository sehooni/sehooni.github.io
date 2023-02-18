---
layout: single
title:  "[Jetson] Jetson Nano를 이용한 Yolov5 활용기 (2) - CUDA BUILD"
excerpt: "Jetson Nano 내에 CUDA Build 진행"
toc: true
toc_sticky: true

categories:
  - Jetson
  - projects
tags: [Jetson, projects]
use_math: true

last_modified_at: 2023-02-18T19:05:08-19:10:00
classes: wide
---
이전 포스팅에 이어 진행하도록 하겠습니다.
이 부분은 NVIDIA의 JETSON NANO에서도 동일하게 작동하게 됩니다!

# 2.  Jetson Nano 내에 CUDA Build 진행

이때는 참고 사이트 3번, 4번을 보면서 설치해주면 된다.

참고로, yahboom은 nvidia와 달리, jetpack 버전이 4.4.1로 고정되어 있기 때문에(23.01.09 기준) 그대로 따라하다가는 제대로 작동하지 않는 경우의 수가 발생할 수도 있다…!!

opencv를 build해 줄 때 맞는 버전을 찾아서 해주는게 중요.

### (23.01.09 오류 발견) - jetpack unknown 관련

- opencv를 cuda와 연결해주기 위해 build를 하게 되는데, 이 과정에서 jetpack의 버전이 unknown으로 바뀌어버리는 문제 발생 (jtop을 명령어로 입력해주면 젯슨을 구성하는 gpu, memory 등등 확인 간능)
- 개인적인 판단에는 sudo apt-get upgrade 과정에서 다음과 같은 error가 발생했었는데..
    
    ![Untitled](https://user-images.githubusercontent.com/84653623/219853939-abbffaa9-00c9-4e77-8bfd-ddffcb0ba9f6.png)
    
    - 위의 에러를 해결하고자 다음 사이트를 참고하여 nvidia-l4t-bootloader, nvidia-l4t-xusb-firmware, nvidia-l4t-initrd를 삭제해주었었는데, 이러한 행동이 jetpack unknown의 결과를 초래한 것 같다.
    - 일단 opencv build를 그대로 진행하였고, 이후 yolov5의 requirements를 설치해준 뒤 작동여부를 확인할 예정!
    - 참고 사이트
        - 본 글의 해결 방법 3번 이용.
        
        [Ubuntu에서 \하위 프로세스 / usr / bin / dpkg가 오류 코드 (1)를 반환 함\을 해결하는 방법](https://ko.linux-console.net/?p=354#gsc.tab=0)
        
    - 결과론 적으로 일단 잘 설치되고 작동은 한다??! (2023.01.11)
    - FPS 문제가 있기는 한데 차차 해결하는걸로
    - 여기서 명시해놓은 부분은 다음번 야붐 만들 때 적용해서 해 볼 예정!!

우선 필수 SW를 설치해줘야 한다.

## 1. Jetson-stats

jetson-stats는 Jetson Nano의 종합적인 Stat을 기존의 수많은 터미널 명령어로 확인해야 했으나, TUI(Text User Interface) 형태로 편리하게 이용 가능함.

```bash
$ sudo apt-get update
$ sudo apt-get upgrade # 이 줄이 오류(23.01.09)를 야기했던 것으로 기억. 다음 시도때는 이 줄 없이 진행해볼 예정(22.01.10)
$ sudo apt-get install python-pip
$ sudo -H pip install -U jetson-stats
$ sudo reboot

# jetson-stats 실행
$ jtop
```

터미널에 jtop 명령어를 입력하는 것만으로 ********************************************************************************************************************************************************************************************************************************************CPU, GPU, RAM, Swap, Fan 등의 H/W정보와 CUDA, TensorRT, Jetpack 버전 확인 및 Fan Speed, Swap 공간 설정********************************************************************************************************************************************************************************************************************************************이 가능하다.

## 2. gdm3 제거 및 lightdm 설치

Jetson Nano는 lightdm 환경에서 YOLOv5를 실행시키면 램 사용량이 3.9 / 4.1GB까지 치솟는다.

또한 Swap도 200MB정도 차지. 또한 이후 ****OpenCV 빌드를 위해 Swap 공간까지 총 8.5GB+의 공간이 필요!****

따라서 램 사용량을 최대한 줄여야하는데, desktop manager으로 lightdm을 사용함으로서 RAM 사용량을 손쉽게 줄일 수 있음.

```bash
$ sudo apt-get install lightdm
$ sudo apt-get purge gdm3
```

## 3. Swap 공간 설정하기

다음과 같은 내용으로 스왑 파일 내의 값을 업데이트.

모든 것이 완료되어 재부팅된 후, 터미널에서 free -m 명령어를 입력했을 때, swap 공간이 6074정도로 나오면 성공!

```bash

# 업데이트 확인, 이전 단계에서 했다면 굳이 할 필요 없음
$ sudo apt-get update
$ sudo apt-get upgrade

# nano 에디터를 설치
$ sudo apt-get install nano

# dphys-swapfile을 설치
$ sudo apt-get install dphys-swapfile

## 두 Swap 파일의 값이 다음과 같도록 값을 추가하거나, 파일 내 주석 해제
# CONF_SWAPSIZE=4096
# CONF_SWAPFACTOR=2
# CONF_MAXSWAP=4096

# /sbin/dphys-swapfile를 엽니다.
$ sudo nano /sbin/dphys-swapfile
 
# 값을 수정한 후 [Ctrl] + [X], [y], [Enter]를 눌러 저장하고 닫습니다
 
 
# /etc/dphys-swapfile를 편집합니다.
sudo nano /etc/dphys-swapfile
 
# 값을 수정한 후 [Ctrl] + [X], [y], [Enter]를 눌러 저장하고 닫습니다

# Jetson Nano 재부팅
sudo reboot
```

## 4. OpenCV 4.5.0 with Cuda

```bash
# check your memory first
$ free -m
# you need at least a total of 6.5 GB!
# if not, enlarge your swap space as explained in the guide
$ wget https://github.com/Qengineering/Install-OpenCV-Jetson-Nano/raw/main/OpenCV-4-5-0.sh
$ sudo chmod 755 ./OpenCV-4-5-0.sh
$ ./OpenCV-4-5-0.sh
```

이때 편리성을 위해서 마지막 줄 명령어를 sudo로 입력하면, 이것저것 다시 깔아줘야하므로,…( 이래서 다시 밀었음)

그냥 저 코드 써져 있는 그대로 진행해주세욤

약 2시간 30분 정도 소요되는데 그것보다 더 오래 걸릴 수도 있음

인내심을 갖고 기다리면서 다른거 하면서 보면 되는데, 꼭 잘 되고 있는지 확인해주기!

## 5. ****PyTorch 1.8 + torchvision v0.9.0****

큰 산들은 거의 다 넘어왔다. 여기까지 성공했으면 90프로 온거다.

이제 pytorch와 torchvision을 설치하고 YOLOv5에 필요한 equirements만 설치하면 모든 게 다 끝난다.

```bash
# PyTorch 1.8.0 다운로드 및 dependencies 설치
wget https://nvidia.box.com/shared/static/p57jwntv436lfrd78inwl7iml6p13fzh.whl -O torch-1.8.0-cp36-cp36m-linux_aarch64.whl
sudo apt-get install python3-pip libopenblas-base libopenmpi-dev 
 
# Cython, numpy, pytorch 설치
pip3 install Cython
pip3 install numpy torch-1.8.0-cp36-cp36m-linux_aarch64.whl
 
# torchvision dependencies 설치
sudo apt-get install libjpeg-dev zlib1g-dev libpython3-dev libavcodec-dev libavformat-dev libswscale-dev
git clone --branch v0.9.0 https://github.com/pytorch/vision torchvision
cd torchvision
export BUILD_VERSION=0.9.0
python3 setup.py install --user
cd ../  # attempting to load torchvision from build dir will result in import error
```

설치가 끝나면

jtop으로 구성 환경과 각 모듈이 잘 설치되었는지 확인해주면 된다.

![Untitled 1](https://user-images.githubusercontent.com/84653623/219853927-2814755c-3693-4902-9323-44280909ec0a.png)

이런 느낌으로!

# 글을 마무리하며,,
여기까지 따라오면 yolov5를 설치하기 위한 환경 설정이 완료됩니다. 

다음 포스팅에서는 본격적인 yolov5 설치와 프로젝트 중 발생했던 오류들에 대해 설명하고 해결 방법들을 제시하도록 하겠습니다.

PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. 긴 글 읽어주셔서 감사합니다. 
