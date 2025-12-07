1:"$Sreact.fragment"
23:I[24170,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
24:I[55132,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
26:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/865c404e1d9a0c65.js"],"OutletBoundary"]
27:"$Sreact.suspense"
:HL["https://user-images.githubusercontent.com/84653623/219853939-abbffaa9-00c9-4e77-8bfd-ddffcb0ba9f6.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853927-2814755c-3693-4902-9323-44280909ec0a.png","image"]
:HL["/_next/static/chunks/b9ef641e76e3a351.css","style"]
0:{"buildId":"8lJiHtAmlyU3nNFMbG8_k","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[Jetson] Jetson Nano를 이용한 Yolov5 활용기 (2) - CUDA BUILD"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"2023-02-17","children":"February 17, 2023"}],"$undefined"]}]]}],[["$","p","p-0",{"children":"이전 포스팅에 이어 진행하도록 하겠습니다.\n이 부분은 NVIDIA의 JETSON NANO에서도 동일하게 작동하게 됩니다!"}],"\n",["$","h1","h1-0",{"id":"2","className":"text-3xl font-bold mt-8 mb-4","children":"2.  Jetson Nano 내에 CUDA Build 진행"}],"\n",["$","p","p-1",{"children":"이때는 참고 사이트 3번, 4번을 보면서 설치해주면 된다."}],"\n",["$","p","p-2",{"children":"참고로, yahboom은 nvidia와 달리, jetpack 버전이 4.4.1로 고정되어 있기 때문에(23.01.09 기준) 그대로 따라하다가는 제대로 작동하지 않는 경우의 수가 발생할 수도 있다…!!"}],"\n",["$","p","p-3",{"children":"opencv를 build해 줄 때 맞는 버전을 찾아서 해주는게 중요."}],"\n",["$","h3","h3-0",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"(23.01.09 오류 발견) - jetpack unknown 관련"}],"\n",["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":["\n",["$","p","p-0",{"children":"opencv를 cuda와 연결해주기 위해 build를 하게 되는데, 이 과정에서 jetpack의 버전이 unknown으로 바뀌어버리는 문제 발생 (jtop을 명령어로 입력해주면 젯슨을 구성하는 gpu, memory 등등 확인 간능)"}],"\n"]}],"\n",["$","li","li-1",{"children":["\n",["$","p","p-0",{"children":"개인적인 판단에는 sudo apt-get upgrade 과정에서 다음과 같은 error가 발생했었는데.."}],"\n",["$","p","p-1",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853939-abbffaa9-00c9-4e77-8bfd-ddffcb0ba9f6.png","alt":"Untitled"}]}],"\n",["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":["\n",["$","p","p-0",{"children":"위의 에러를 해결하고자 다음 사이트를 참고하여 nvidia-l4t-bootloader, nvidia-l4t-xusb-firmware, nvidia-l4t-initrd를 삭제해주었었는데, 이러한 행동이 jetpack unknown의 결과를 초래한 것 같다."}],"\n"]}],"\n",["$","li","li-1",{"children":["\n",["$","p","p-0",{"children":"일단 opencv build를 그대로 진행하였고, 이후 yolov5의 requirements를 설치해준 뒤 작동여부를 확인할 예정!"}],"\n"]}],"\n",["$","li","li-2",{"children":["\n",["$","p","p-0",{"children":"참고 사이트"}],"\n",["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":"본 글의 해결 방법 3번 이용."}],"\n"]}],"\n",["$","p","p-1",{"children":["$","a","a-0",{"href":"https://ko.linux-console.net/?p=354#gsc.tab=0","children":"Ubuntu에서 \\하위 프로세스 / usr / bin / dpkg가 오류 코드 (1)를 반환 함\\을 해결하는 방법"}]}],"\n"]}],"\n",["$","li","li-3",{"children":["\n",["$","p","p-0",{"children":"결과론 적으로 일단 잘 설치되고 작동은 한다??! (2023.01.11)"}],"\n"]}],"\n",["$","li","li-4",{"children":["\n",["$","p","p-0",{"children":"FPS 문제가 있기는 한데 차차 해결하는걸로"}],"\n"]}],"\n",["$","li","li-5",{"children":["\n",["$","p","p-0",{"children":"여기서 명시해놓은 부분은 다음번 야붐 만들 때 적용해서 해 볼 예정!!"}],"\n"]}],"\n"]}],"\n"]}],"\n"]}],"\n",["$","p","p-4",{"children":"우선 필수 SW를 설치해줘야 한다."}],"\n",["$","h2","h2-0",{"id":"1","className":"text-2xl font-bold mt-8 mb-4","children":"1. Jetson-stats"}],"\n",["$","p","p-5",{"children":"jetson-stats는 Jetson Nano의 종합적인 Stat을 기존의 수많은 터미널 명령어로 확인해야 했으나, TUI(Text User Interface) 형태로 편리하게 이용 가능함."}],"\n",["$","pre","pre-0",{"children":["$","code","code-0",{"className":"hljs language-bash","children":["$$ ",["$","span","span-0",{"className":"hljs-built_in","children":"sudo"}]," apt-get update\n$ ",["$","span","span-1",{"className":"hljs-built_in","children":"sudo"}]," apt-get upgrade ",["$","span","span-2",{"className":"hljs-comment","children":"# 이 줄이 오류(23.01.09)를 야기했던 것으로 기억. 다음 시도때는 이 줄 없이 진행해볼 예정(22.01.10)"}],"\n$ ",["$","span","span-3",{"className":"hljs-built_in","children":"sudo"}]," apt-get install python-pip\n$ ",["$","span","span-4",{"className":"hljs-built_in","children":"sudo"}]," -H pip install -U jetson-stats\n$ ",["$","span","span-5",{"className":"hljs-built_in","children":"sudo"}]," reboot\n\n",["$","span","span-6",{"className":"hljs-comment","children":"# jetson-stats 실행"}],"\n$ jtop\n"]}]}],"\n",["$","p","p-6",{"children":["터미널에 jtop 명령어를 입력하는 것만으로 ",["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":"$L2"}]}],"이 가능하다."]}],"\n","$L3","\n","$L4","\n","$L5","\n","$L6","\n","$L7","\n","$L8","\n","$L9","\n","$La","\n","$Lb","\n","$Lc","\n","$Ld","\n","$Le","\n","$Lf","\n","$L10","\n","$L11","\n","$L12","\n","$L13","\n","$L14","\n","$L15","\n","$L16","\n","$L17","\n","$L18","\n","$L19","\n","$L1a","\n","$L1b","\n","$L1c","\n","$L1d"],"$L1e"]}],"$L1f"]}],["$L20","$L21"],"$L22"]}],"loading":null,"isPartial":false}
2:["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":"CPU, GPU, RAM, Swap, Fan 등의 H/W정보와 CUDA, TensorRT, Jetpack 버전 확인 및 Fan Speed, Swap 공간 설정"}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]
3:["$","h2","h2-1",{"id":"2","className":"text-2xl font-bold mt-8 mb-4","children":"2. gdm3 제거 및 lightdm 설치"}]
4:["$","p","p-7",{"children":"Jetson Nano는 lightdm 환경에서 YOLOv5를 실행시키면 램 사용량이 3.9 / 4.1GB까지 치솟는다."}]
5:["$","p","p-8",{"children":["또한 Swap도 200MB정도 차지. 또한 이후 ",["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":"OpenCV 빌드를 위해 Swap 공간까지 총 8.5GB+의 공간이 필요!"}]}]]}]
6:["$","p","p-9",{"children":"따라서 램 사용량을 최대한 줄여야하는데, desktop manager으로 lightdm을 사용함으로서 RAM 사용량을 손쉽게 줄일 수 있음."}]
7:["$","pre","pre-1",{"children":["$","code","code-0",{"className":"hljs language-bash","children":["$$ ",["$","span","span-0",{"className":"hljs-built_in","children":"sudo"}]," apt-get install lightdm\n$ ",["$","span","span-1",{"className":"hljs-built_in","children":"sudo"}]," apt-get purge gdm3\n"]}]}]
8:["$","h2","h2-2",{"id":"3","className":"text-2xl font-bold mt-8 mb-4","children":"3. Swap 공간 설정하기"}]
9:["$","p","p-10",{"children":"다음과 같은 내용으로 스왑 파일 내의 값을 업데이트."}]
a:["$","p","p-11",{"children":"모든 것이 완료되어 재부팅된 후, 터미널에서 free -m 명령어를 입력했을 때, swap 공간이 6074정도로 나오면 성공!"}]
b:["$","pre","pre-2",{"children":["$","code","code-0",{"className":"hljs language-bash","children":["\n",["$","span","span-0",{"className":"hljs-comment","children":"# 업데이트 확인, 이전 단계에서 했다면 굳이 할 필요 없음"}],"\n$ ",["$","span","span-1",{"className":"hljs-built_in","children":"sudo"}]," apt-get update\n$ ",["$","span","span-2",{"className":"hljs-built_in","children":"sudo"}]," apt-get upgrade\n\n",["$","span","span-3",{"className":"hljs-comment","children":"# nano 에디터를 설치"}],"\n$ ",["$","span","span-4",{"className":"hljs-built_in","children":"sudo"}]," apt-get install nano\n\n",["$","span","span-5",{"className":"hljs-comment","children":"# dphys-swapfile을 설치"}],"\n$ ",["$","span","span-6",{"className":"hljs-built_in","children":"sudo"}]," apt-get install dphys-swapfile\n\n",["$","span","span-7",{"className":"hljs-comment","children":"## 두 Swap 파일의 값이 다음과 같도록 값을 추가하거나, 파일 내 주석 해제"}],"\n",["$","span","span-8",{"className":"hljs-comment","children":"# CONF_SWAPSIZE=4096"}],"\n",["$","span","span-9",{"className":"hljs-comment","children":"# CONF_SWAPFACTOR=2"}],"\n",["$","span","span-10",{"className":"hljs-comment","children":"# CONF_MAXSWAP=4096"}],"\n\n",["$","span","span-11",{"className":"hljs-comment","children":"# /sbin/dphys-swapfile를 엽니다."}],"\n$ ",["$","span","span-12",{"className":"hljs-built_in","children":"sudo"}]," nano /sbin/dphys-swapfile\n \n",["$","span","span-13",{"className":"hljs-comment","children":"# 값을 수정한 후 [Ctrl] + [X], [y], [Enter]를 눌러 저장하고 닫습니다"}],"\n \n \n",["$","span","span-14",{"className":"hljs-comment","children":"# /etc/dphys-swapfile를 편집합니다."}],"\n",["$","span","span-15",{"className":"hljs-built_in","children":"sudo"}]," nano /etc/dphys-swapfile\n \n",["$","span","span-16",{"className":"hljs-comment","children":"# 값을 수정한 후 [Ctrl] + [X], [y], [Enter]를 눌러 저장하고 닫습니다"}],"\n\n",["$","span","span-17",{"className":"hljs-comment","children":"# Jetson Nano 재부팅"}],"\n",["$","span","span-18",{"className":"hljs-built_in","children":"sudo"}]," reboot\n"]}]}]
c:["$","h2","h2-3",{"id":"4","className":"text-2xl font-bold mt-8 mb-4","children":"4. OpenCV 4.5.0 with Cuda"}]
d:["$","pre","pre-3",{"children":["$","code","code-0",{"className":"hljs language-bash","children":[["$","span","span-0",{"className":"hljs-comment","children":"# check your memory first"}],"\n$ free -m\n",["$","span","span-1",{"className":"hljs-comment","children":"# you need at least a total of 6.5 GB!"}],"\n",["$","span","span-2",{"className":"hljs-comment","children":"# if not, enlarge your swap space as explained in the guide"}],"\n$ wget https://github.com/Qengineering/Install-OpenCV-Jetson-Nano/raw/main/OpenCV-4-5-0.sh\n$ ",["$","span","span-3",{"className":"hljs-built_in","children":"sudo"}]," ",["$","span","span-4",{"className":"hljs-built_in","children":"chmod"}]," 755 ./OpenCV-4-5-0.sh\n$ ./OpenCV-4-5-0.sh\n"]}]}]
e:["$","p","p-12",{"children":"이때 편리성을 위해서 마지막 줄 명령어를 sudo로 입력하면, 이것저것 다시 깔아줘야하므로,…( 이래서 다시 밀었음)"}]
f:["$","p","p-13",{"children":"그냥 저 코드 써져 있는 그대로 진행해주세욤"}]
10:["$","p","p-14",{"children":"약 2시간 30분 정도 소요되는데 그것보다 더 오래 걸릴 수도 있음"}]
11:["$","p","p-15",{"children":"인내심을 갖고 기다리면서 다른거 하면서 보면 되는데, 꼭 잘 되고 있는지 확인해주기!"}]
12:["$","h2","h2-4",{"id":"5","className":"text-2xl font-bold mt-8 mb-4","children":["5. ",["$","strong","strong-0",{"children":["$","strong","strong-0",{"children":"PyTorch 1.8 + torchvision v0.9.0"}]}]]}]
13:["$","p","p-16",{"children":"큰 산들은 거의 다 넘어왔다. 여기까지 성공했으면 90프로 온거다."}]
14:["$","p","p-17",{"children":"이제 pytorch와 torchvision을 설치하고 YOLOv5에 필요한 equirements만 설치하면 모든 게 다 끝난다."}]
15:["$","pre","pre-4",{"children":["$","code","code-0",{"className":"hljs language-bash","children":[["$","span","span-0",{"className":"hljs-comment","children":"# PyTorch 1.8.0 다운로드 및 dependencies 설치"}],"\nwget https://nvidia.box.com/shared/static/p57jwntv436lfrd78inwl7iml6p13fzh.whl -O torch-1.8.0-cp36-cp36m-linux_aarch64.whl\n",["$","span","span-1",{"className":"hljs-built_in","children":"sudo"}]," apt-get install python3-pip libopenblas-base libopenmpi-dev \n \n",["$","span","span-2",{"className":"hljs-comment","children":"# Cython, numpy, pytorch 설치"}],"\npip3 install Cython\npip3 install numpy torch-1.8.0-cp36-cp36m-linux_aarch64.whl\n \n",["$","span","span-3",{"className":"hljs-comment","children":"# torchvision dependencies 설치"}],"\n",["$","span","span-4",{"className":"hljs-built_in","children":"sudo"}]," apt-get install libjpeg-dev zlib1g-dev libpython3-dev libavcodec-dev libavformat-dev libswscale-dev\ngit ",["$","span","span-5",{"className":"hljs-built_in","children":"clone"}]," --branch v0.9.0 https://github.com/pytorch/vision torchvision\n",["$","span","span-6",{"className":"hljs-built_in","children":"cd"}]," torchvision\n",["$","span","span-7",{"className":"hljs-built_in","children":"export"}]," BUILD_VERSION=0.9.0\npython3 setup.py install --user\n",["$","span","span-8",{"className":"hljs-built_in","children":"cd"}]," ../  ",["$","span","span-9",{"className":"hljs-comment","children":"# attempting to load torchvision from build dir will result in import error"}],"\n"]}]}]
16:["$","p","p-18",{"children":"설치가 끝나면"}]
17:["$","p","p-19",{"children":"jtop으로 구성 환경과 각 모듈이 잘 설치되었는지 확인해주면 된다."}]
18:["$","p","p-20",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853927-2814755c-3693-4902-9323-44280909ec0a.png","alt":"Untitled 1"}]}]
19:["$","p","p-21",{"children":"이런 느낌으로!"}]
1a:["$","h1","h1-1",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"글을 마무리하며,,"}]
1b:["$","p","p-22",{"children":"여기까지 따라오면 yolov5를 설치하기 위한 환경 설정이 완료됩니다."}]
1c:["$","p","p-23",{"children":"다음 포스팅에서는 본격적인 yolov5 설치와 프로젝트 중 발생했던 오류들에 대해 설명하고 해결 방법들을 제시하도록 하겠습니다."}]
1d:["$","p","p-24",{"children":"PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. 긴 글 읽어주셔서 감사합니다."}]
1e:["$","$L23",null,{}]
25:T1c12,이전 포스팅에 이어 진행하도록 하겠습니다.
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
1f:["$","$L24",null,{"content":"$25"}]
20:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/b9ef641e76e3a351.css","precedence":"next"}]
21:["$","script","script-0",{"src":"/_next/static/chunks/6b8d09032578b975.js","async":true}]
22:["$","$L26",null,{"children":["$","$27",null,{"name":"Next.MetadataOutlet","children":"$@28"}]}]
28:null
