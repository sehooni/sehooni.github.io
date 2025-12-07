1:"$Sreact.fragment"
2c:I[24170,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
2d:I[55132,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
2f:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/865c404e1d9a0c65.js"],"OutletBoundary"]
30:"$Sreact.suspense"
:HL["https://user-images.githubusercontent.com/84653623/219853912-cb2d14e0-52c9-4fa0-989e-167c4c78892b.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853914-cd1979b4-0081-4d63-8ade-63f7d0d30495.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853917-b3e7f1bb-9cf2-4a8c-b165-09bead7be84f.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853911-7d1deaea-6981-4e9b-a5db-fa4dc41ab246.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853908-c80e1390-05ba-4d72-95b2-ffc3600bfed8.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853922-77ffe7f2-c925-4121-9b00-c6c1e4c8e711.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853909-db319267-facc-4aa3-b975-7cbd9db94fd5.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853910-c37f7594-3f46-4e17-9c9b-03f05791498b.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853918-7b82df32-ada5-40be-958c-c9896080d73c.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853919-d9f34231-74dc-4b4e-8322-0ebc0aedbc03.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853921-47f60827-a140-4fbf-9bd9-ca73fcf18eb7.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853925-74e9bd3f-191d-4f1c-bada-7879b5a29b11.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853900-b1381c25-a442-4aef-a859-ccec211246a0.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853903-9d619c65-ad8f-4216-a91a-20922b5320b5.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853904-7b9f50a6-d440-4eec-b37e-d2ce10d2fc42.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853906-ddd50dcb-6c40-41b0-8572-bbdee429d5dc.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/219853924-b24752a4-6d23-4c70-9fba-dd3824d141f4.png","image"]
:HL["/_next/static/chunks/b9ef641e76e3a351.css","style"]
0:{"buildId":"8lJiHtAmlyU3nNFMbG8_k","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[Jetson] Jetson Nano를 이용한 Yolov5 활용기 (1) - linux os 설정"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"2023-02-16","children":"February 16, 2023"}],"$undefined"]}]]}],[["$","h1","h1-0",{"id":"1","className":"text-3xl font-bold mt-8 mb-4","children":"1. Yahboom Jetson Nano Linux OS 설정"}],"\n",["$","p","p-0",{"children":"중국산 젯슨나노, 즉 야붐 제품을 사용할 경우, 기존과 달리 USB내에 os를 설치하고 이어서 기기 내 EMMC에도 OS를 설치해줘야 한다."}],"\n",["$","p","p-1",{"children":"이때 usb내의 OS와 emmc에 flash하는 os의 jetpack의 version을 동일하게 설정해줘야한다."}],"\n",["$","p","p-2",{"children":"(참고 사이트 1번과 2번을 보면서 설치하면 된다.)"}],"\n",["$","p","p-3",{"children":["$","strong","strong-0",{"children":"그리고 리눅스로 sudo apt-get update를 진행하거나 (블라블라~)"}]}],"\n",["$","p","p-4",{"children":["$","strong","strong-0",{"children":"아무튼 명령어(install, update, upgrade, etc) 입력해줄 때, 네트워크 설정과 날짜와 시간이 올바르게 설정되어 있는지 확인해줘야 한다!!! 이거 안되어 있으면 아무리 명령해도 진행 안됩니다."}]}],"\n",["$","h2","h2-0",{"id":"1","className":"text-2xl font-bold mt-8 mb-4","children":"1. emmc에 os 설치하기"}],"\n",["$","p","p-5",{"children":"본 과정에서는 VM Ware 를 이용하여 Jetson Nano 내에 OS를 입력해줘야한다."}],"\n",["$","p","p-6",{"children":"아래의 순서대로 진행하여 본다."}],"\n",["$","h3","h3-0",{"id":"v","className":"text-xl font-bold mt-6 mb-3","children":"vm ware안에서 NVIDIA SDK를 다운받아 준다."}],"\n",["$","p","p-7",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853912-cb2d14e0-52c9-4fa0-989e-167c4c78892b.png","alt":"10"}]}],"\n",["$","h3","h3-1",{"id":"d","className":"text-xl font-bold mt-6 mb-3","children":"Download로 이동하여 다운받은 파일 확인 및 설치 실행."}],"\n",["$","p","p-8",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853914-cd1979b4-0081-4d63-8ade-63f7d0d30495.png","alt":"11"}]}],"\n",["$","p","p-9",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853917-b3e7f1bb-9cf2-4a8c-b165-09bead7be84f.png","alt":"12"}]}],"\n",["$","p","p-10",{"children":"다운 받는 과정에서 오류가 날 경우 다음과 같은 명령어를 입력하여 설치를 진행하여 준다."}],"\n",["$","p","p-11",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853911-7d1deaea-6981-4e9b-a5db-fa4dc41ab246.png","alt":"9"}]}],"\n",["$","h3","h3-2",{"id":"s","className":"text-xl font-bold mt-6 mb-3","children":"SDK manager를 검색하여 실행. 이후 nvidia 계정으로 로그인 후 버전을 설정해주면 되는데, yahboom 공홈에 업로드 되어 있는 이미지의 jetpack 버전은 4.4.1이므로 이와 동일한 버전으로 flash해줘야한다."}],"\n",["$","p","p-12",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853908-c80e1390-05ba-4d72-95b2-ffc3600bfed8.png","alt":"5"}]}],"\n",["$","p","p-13",{"children":"범퍼를 꽂아서 젯슨나노에 입력이 가능하도록 한다. 이후 vm ware가 있는 컴퓨터와 젯슨나노를 연결하여 준다."}],"\n",["$","p","p-14",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853922-77ffe7f2-c925-4121-9b00-c6c1e4c8e711.png","alt":"19"}]}],"\n",["$","p","p-15",{"children":"컴퓨터와 연결하는 선은 흰 선 부분과 같다."}],"\n",["$","p","p-16",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853909-db319267-facc-4aa3-b975-7cbd9db94fd5.png","alt":"7"}]}],"\n",["$","p","p-17",{"children":"연결하면 다음과 같은 화면이 뜨는데 vm으로 연결을 진행한다."}],"\n",["$","p","p-18",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853910-c37f7594-3f46-4e17-9c9b-03f05791498b.png","alt":"8"}]}],"\n",["$","p","p-19",{"children":"Nvidia 공홈에서 회원가입 후 로그인 진행"}],"\n",["$","p","p-20",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853918-7b82df32-ada5-40be-958c-c9896080d73c.png","alt":"13"}]}],"\n",["$","p","p-21",{"children":"이때 리눅스 젯팩 버전을 4.4.1로 설정해줘야 한다."}],"\n","$L2","\n","$L3","\n","$L4","\n","$L5","\n","$L6","\n","$L7","\n","$L8","\n","$L9","\n","$La","\n","$Lb","\n","$Lc","\n","$Ld","\n","$Le","\n","$Lf","\n","$L10","\n","$L11","\n","$L12","\n","$L13","\n","$L14","\n","$L15","\n","$L16","\n","$L17","\n","$L18","\n","$L19","\n","$L1a","\n","$L1b","\n","$L1c","\n","$L1d","\n","$L1e","\n","$L1f","\n","$L20","\n","$L21","\n","$L22","\n","$L23","\n","$L24","\n","$L25","\n","$L26"],"$L27"]}],"$L28"]}],["$L29","$L2a"],"$L2b"]}],"loading":null,"isPartial":false}
2:["$","p","p-22",{"children":["Jetpack version이 안 뜰 경우, 터미널에서 ",["$","strong","strong-0",{"children":"sdkmanager --archivedversions"}],"로 검색을 해주면 해당하는 버전을 선택할 수 있고 이를 통해 바로 접속이 가능하다."]}]
3:["$","p","p-23",{"children":"이후 젯슨나노는 아래와 같이 선택하여 주고, 위와 같이 3가지만 선택하여 준다."}]
4:["$","p","p-24",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853919-d9f34231-74dc-4b4e-8322-0ebc0aedbc03.png","alt":"14"}]}]
5:["$","p","p-25",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853921-47f60827-a140-4fbf-9bd9-ca73fcf18eb7.png","alt":"18"}]}]
6:["$","p","p-26",{"children":"이후 다음과 같은 화면이 뜨는데 메뉴얼로 셋업을 변경하고 진행하면 된다."}]
7:["$","p","p-27",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853925-74e9bd3f-191d-4f1c-bada-7879b5a29b11.png","alt":"MicrosoftTeams-image"}]}]
8:["$","p","p-28",{"children":"설치가 다 되면 다음과 같은 화면이 뜬다!"}]
9:["$","p","p-29",{"children":"설치가 완료되면 범퍼를 다시 빼주고, emmc로 부팅을 하여준다."}]
a:["$","h2","h2-1",{"id":"2","className":"text-2xl font-bold mt-8 mb-4","children":"2. usb에 flash하기"}]
b:["$","h3","h3-3",{"id":"y","className":"text-xl font-bold mt-6 mb-3","children":"yahboom 공식 홈페이지 왼쪽 하단에서 다음의 파일 다운로드."}]
c:["$","p","p-30",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853900-b1381c25-a442-4aef-a859-ccec211246a0.png","alt":"1"}]}]
d:["$","p","p-31",{"children":"usb 부팅을 위한 파일"}]
e:["$","h3","h3-4",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"구글 드라이브에서 다음의 파일 다운로드."}]
f:["$","p","p-32",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853903-9d619c65-ad8f-4216-a91a-20922b5320b5.png","alt":"2"}]}]
10:["$","h3","h3-5",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"부팅 usb 내부 초기화."}]
11:["$","p","p-33",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853904-7b9f50a6-d440-4eec-b37e-d2ce10d2fc42.png","alt":"3"}]}]
12:["$","h3","h3-6",{"id":"e","className":"text-xl font-bold mt-6 mb-3","children":"etcher 프로그램을 이용하여 os 파일 입력하기."}]
13:["$","p","p-34",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853906-ddd50dcb-6c40-41b0-8572-bbdee429d5dc.png","alt":"4"}]}]
14:["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":"flash가 완료되면 수 많은 페이지가 뜨는데 무시하고 usb 제거해주면 된다."}],"\n"]}]
15:["$","h2","h2-2",{"id":"3","className":"text-2xl font-bold mt-8 mb-4","children":"3. emmc에서 usb로 부팅 바꿔주기"}]
16:["$","p","p-35",{"children":"다음의 유튜브 영상을 참고하여 그대로 진행한다."}]
17:["$","p","p-36",{"children":["$","a","a-0",{"href":"https://www.youtube.com/watch?v=xwH2qfsvGio","children":"https://www.youtube.com/watch?v=xwH2qfsvGio"}]}]
18:["$","h3","h3-7",{"id":"j","className":"text-xl font-bold mt-6 mb-3","children":"jetson nano 내에서 입력하여 진행하면 된다."}]
19:["$","p","p-37",{"children":"yahboom jetson nano는 emmc에 올라간 부트로더 extlinux가 /dev/emmc블라블라 .."}]
1a:["$","p","p-38",{"children":"그러니까 emmc를 루트파일시스템으로 잡고 있었는데"}]
1b:["$","p","p-39",{"children":"이걸 usb에서 부팅할수 있도록 /boot/extlinux/extlinux.conf에서 루트파일시스템을 emmc가 아닌 /dev/sda1(위 영상의 경우)로 바꿔주면 된다고 한다."}]
1c:["$","p","p-40",{"children":"문제는 2가지가 있었는데"}]
1d:["$","ol","ol-0",{"children":["\n",["$","li","li-0",{"children":"emmc에 깔린 jetpack 버전과 usb에 담긴 jetpack 버전이 같아야 한다."}],"\n",["$","li","li-1",{"children":"꽂은 usb가 /dev/sda1로 읽히는지 확인"}],"\n"]}]
1e:["$","p","p-41",{"children":["$","strong","strong-0",{"children":"2번의 경우, df를 입력하여주면 확인할 수 있다."}]}]
1f:["$","h3","h3-8",{"className":"text-xl font-bold mt-6 mb-3","children":["$","strong","strong-0",{"children":"입력 순서"}]}]
20:["$","pre","pre-0",{"children":["$","code","code-0",{"className":"hljs language-jsx","children":["sudo apt-get update\nsudo apt-cache show nvidia-jetpack\n# 위에 코드로 버전 확인\ncd /boot/extlinux/\n\nsudo cp extlinux.",["$","span","span-0",{"className":"hljs-property","children":"conf"}]," extlinux.",["$","span","span-1",{"className":"hljs-property","children":"conf"}],".",["$","span","span-2",{"className":"hljs-property","children":"boot_emmc_backup"}],"\n\nls\nsudo vim extlinux.",["$","span","span-3",{"className":"hljs-property","children":"conf"}],"\n\n"]}]}]
21:["$","p","p-42",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/219853924-b24752a4-6d23-4c70-9fba-dd3824d141f4.png","alt":"20"}]}]
22:["$","p","p-43",{"children":"이후 sudo reboot 하면 os가 완벽하게 설치된다!"}]
23:["$","p","p-44",{"children":"이후 id는 nano, pw는 yahboom으로 설정된다."}]
24:["$","h1","h1-1",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"글을 마무리하며,,"}]
25:["$","p","p-45",{"children":"여기까지 따라오면 우선 yahboom내 linux os를 설치할 수 있게 됩니다.\n얼른 포스팅 했어야 했는데, 현생이 바쁘다보니....\n오늘 프로젝트 포스팅 마무리하고 다른 공부들도 올려야겠습니다."}]
26:["$","p","p-46",{"children":"다음 포스팅에서는 yolov5를 진행하기 위한 Jetson Nano 내 CUDA BUILD와 관련한 이야기를 해보도록 하겠습니다.\nPS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. 긴 글 읽어주셔서 감사합니다."}]
27:["$","$L2c",null,{}]
2e:T190b,
# 1. Yahboom Jetson Nano Linux OS 설정

중국산 젯슨나노, 즉 야붐 제품을 사용할 경우, 기존과 달리 USB내에 os를 설치하고 이어서 기기 내 EMMC에도 OS를 설치해줘야 한다.

이때 usb내의 OS와 emmc에 flash하는 os의 jetpack의 version을 동일하게 설정해줘야한다.

 (참고 사이트 1번과 2번을 보면서 설치하면 된다.)

**그리고 리눅스로 sudo apt-get update를 진행하거나 (블라블라~)** 

**아무튼 명령어(install, update, upgrade, etc) 입력해줄 때, 네트워크 설정과 날짜와 시간이 올바르게 설정되어 있는지 확인해줘야 한다!!! 이거 안되어 있으면 아무리 명령해도 진행 안됩니다.** 

## 1. emmc에 os 설치하기

본 과정에서는 VM Ware 를 이용하여 Jetson Nano 내에 OS를 입력해줘야한다. 

아래의 순서대로 진행하여 본다.

### vm ware안에서 NVIDIA SDK를 다운받아 준다.

![10](https://user-images.githubusercontent.com/84653623/219853912-cb2d14e0-52c9-4fa0-989e-167c4c78892b.png)

### Download로 이동하여 다운받은 파일 확인 및 설치 실행.

![11](https://user-images.githubusercontent.com/84653623/219853914-cd1979b4-0081-4d63-8ade-63f7d0d30495.png)

![12](https://user-images.githubusercontent.com/84653623/219853917-b3e7f1bb-9cf2-4a8c-b165-09bead7be84f.png)

다운 받는 과정에서 오류가 날 경우 다음과 같은 명령어를 입력하여 설치를 진행하여 준다.

![9](https://user-images.githubusercontent.com/84653623/219853911-7d1deaea-6981-4e9b-a5db-fa4dc41ab246.png)

### SDK manager를 검색하여 실행. 이후 nvidia 계정으로 로그인 후 버전을 설정해주면 되는데, yahboom 공홈에 업로드 되어 있는 이미지의 jetpack 버전은 4.4.1이므로 이와 동일한 버전으로 flash해줘야한다.

![5](https://user-images.githubusercontent.com/84653623/219853908-c80e1390-05ba-4d72-95b2-ffc3600bfed8.png)

범퍼를 꽂아서 젯슨나노에 입력이 가능하도록 한다. 이후 vm ware가 있는 컴퓨터와 젯슨나노를 연결하여 준다.

![19](https://user-images.githubusercontent.com/84653623/219853922-77ffe7f2-c925-4121-9b00-c6c1e4c8e711.png)

컴퓨터와 연결하는 선은 흰 선 부분과 같다.

![7](https://user-images.githubusercontent.com/84653623/219853909-db319267-facc-4aa3-b975-7cbd9db94fd5.png)

연결하면 다음과 같은 화면이 뜨는데 vm으로 연결을 진행한다.

![8](https://user-images.githubusercontent.com/84653623/219853910-c37f7594-3f46-4e17-9c9b-03f05791498b.png)

Nvidia 공홈에서 회원가입 후 로그인 진행

![13](https://user-images.githubusercontent.com/84653623/219853918-7b82df32-ada5-40be-958c-c9896080d73c.png)

이때 리눅스 젯팩 버전을 4.4.1로 설정해줘야 한다.

Jetpack version이 안 뜰 경우, 터미널에서 **sdkmanager --archivedversions**로 검색을 해주면 해당하는 버전을 선택할 수 있고 이를 통해 바로 접속이 가능하다.

이후 젯슨나노는 아래와 같이 선택하여 주고, 위와 같이 3가지만 선택하여 준다.

![14](https://user-images.githubusercontent.com/84653623/219853919-d9f34231-74dc-4b4e-8322-0ebc0aedbc03.png)

![18](https://user-images.githubusercontent.com/84653623/219853921-47f60827-a140-4fbf-9bd9-ca73fcf18eb7.png)

이후 다음과 같은 화면이 뜨는데 메뉴얼로 셋업을 변경하고 진행하면 된다.

![MicrosoftTeams-image](https://user-images.githubusercontent.com/84653623/219853925-74e9bd3f-191d-4f1c-bada-7879b5a29b11.png)

설치가 다 되면 다음과 같은 화면이 뜬다!

설치가 완료되면 범퍼를 다시 빼주고, emmc로 부팅을 하여준다.

## 2. usb에 flash하기

### yahboom 공식 홈페이지 왼쪽 하단에서 다음의 파일 다운로드.

![1](https://user-images.githubusercontent.com/84653623/219853900-b1381c25-a442-4aef-a859-ccec211246a0.png)

usb 부팅을 위한 파일

### 구글 드라이브에서 다음의 파일 다운로드.

![2](https://user-images.githubusercontent.com/84653623/219853903-9d619c65-ad8f-4216-a91a-20922b5320b5.png)

### 부팅 usb 내부 초기화.

![3](https://user-images.githubusercontent.com/84653623/219853904-7b9f50a6-d440-4eec-b37e-d2ce10d2fc42.png)

### etcher 프로그램을 이용하여 os 파일 입력하기.

![4](https://user-images.githubusercontent.com/84653623/219853906-ddd50dcb-6c40-41b0-8572-bbdee429d5dc.png)

- flash가 완료되면 수 많은 페이지가 뜨는데 무시하고 usb 제거해주면 된다.

## 3. emmc에서 usb로 부팅 바꿔주기

다음의 유튜브 영상을 참고하여 그대로 진행한다.

[https://www.youtube.com/watch?v=xwH2qfsvGio](https://www.youtube.com/watch?v=xwH2qfsvGio)

### jetson nano 내에서 입력하여 진행하면 된다.

yahboom jetson nano는 emmc에 올라간 부트로더 extlinux가 /dev/emmc블라블라 ..

그러니까 emmc를 루트파일시스템으로 잡고 있었는데

이걸 usb에서 부팅할수 있도록 /boot/extlinux/extlinux.conf에서 루트파일시스템을 emmc가 아닌 /dev/sda1(위 영상의 경우)로 바꿔주면 된다고 한다.

문제는 2가지가 있었는데

1. emmc에 깔린 jetpack 버전과 usb에 담긴 jetpack 버전이 같아야 한다.
2. 꽂은 usb가 /dev/sda1로 읽히는지 확인

**2번의 경우, df를 입력하여주면 확인할 수 있다.**

### **입력 순서**

```jsx
sudo apt-get update
sudo apt-cache show nvidia-jetpack
# 위에 코드로 버전 확인
cd /boot/extlinux/

sudo cp extlinux.conf extlinux.conf.boot_emmc_backup

ls
sudo vim extlinux.conf

```

![20](https://user-images.githubusercontent.com/84653623/219853924-b24752a4-6d23-4c70-9fba-dd3824d141f4.png)

이후 sudo reboot 하면 os가 완벽하게 설치된다!

이후 id는 nano, pw는 yahboom으로 설정된다.

# 글을 마무리하며,,
여기까지 따라오면 우선 yahboom내 linux os를 설치할 수 있게 됩니다.
얼른 포스팅 했어야 했는데, 현생이 바쁘다보니.... 
오늘 프로젝트 포스팅 마무리하고 다른 공부들도 올려야겠습니다.

다음 포스팅에서는 yolov5를 진행하기 위한 Jetson Nano 내 CUDA BUILD와 관련한 이야기를 해보도록 하겠습니다.
PS. 추가 문의사항 및 질문은 환영합니다. 그를 통해 저도 더 성장할 수 있을테니까요. 긴 글 읽어주셔서 감사합니다. 
28:["$","$L2d",null,{"content":"$2e"}]
29:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/b9ef641e76e3a351.css","precedence":"next"}]
2a:["$","script","script-0",{"src":"/_next/static/chunks/6b8d09032578b975.js","async":true}]
2b:["$","$L2f",null,{"children":["$","$30",null,{"name":"Next.MetadataOutlet","children":"$@31"}]}]
31:null
