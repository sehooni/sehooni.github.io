1:"$Sreact.fragment"
b:I[24170,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
c:I[55132,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
e:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/865c404e1d9a0c65.js"],"OutletBoundary"]
f:"$Sreact.suspense"
:HL["https://user-images.githubusercontent.com/84653623/165943832-b93feebd-beb6-4965-970b-360836194f44.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/165943884-6d3c0559-dec9-4d59-8ec0-184fef17b99b.png","image"]
:HL["https://user-images.githubusercontent.com/84653623/165943965-d9363c97-f501-458f-b52e-7aeeb7b2c7d4.png","image"]
:HL["/_next/static/chunks/b9ef641e76e3a351.css","style"]
0:{"buildId":"8lJiHtAmlyU3nNFMbG8_k","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[Neural Style Transfer] Neural Style Transfer 프로젝트 설명"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"$D2022-05-01T00:00:00.000Z","children":"May 1, 2022"}],"$undefined"]}]]}],[["$","p","p-0",{"children":["이전 포스트에 이어 본 프로젝트 구성 및 내용을 설명하고자 한다.\n자세한 내용은 ",["$","a","a-0",{"href":"https://github.com/sehooni/Neural-Style-Transfer_tf","children":"본인의 깃허브 repository"}],"\n에 업로드 해 두었다."]}],"\n",["$","h1","h1-0",{"id":"n","className":"text-3xl font-bold mt-8 mb-4","children":"Neural Style Transfer-tf"}],"\n",["$","p","p-1",{"children":"opencv 및 tf.keras를 활용한 Neural Style Transfer 프로젝트 및 개념, 예제를 정리해 두었다."}],"\n",["$","h2","h2-0",{"id":"p","className":"text-2xl font-bold mt-8 mb-4","children":"Project"}],"\n",["$","p","p-2",{"children":"프로젝트에 대한 구성 환경과 내용을 설명하자면 다음과 같다."}],"\n",["$","h3","h3-0",{"id":"e","className":"text-xl font-bold mt-6 mb-3","children":"Environment Setting"}],"\n",["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":"python 3.6.5"}],"\n",["$","li","li-1",{"children":"Cuda 11.1 / tensorflow-gpu 2.4.0"}],"\n"]}],"\n",["$","h3","h3-1",{"id":"d","className":"text-xl font-bold mt-6 mb-3","children":"Detail of Project"}],"\n",["$","p","p-3",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/165943832-b93feebd-beb6-4965-970b-360836194f44.png","alt":"프로젝트 설명 슬라이드 1"}]}],"\n",["$","p","p-4",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/165943884-6d3c0559-dec9-4d59-8ec0-184fef17b99b.png","alt":"프로젝트 설명 슬라이드 2"}]}],"\n",["$","h3","h3-2",{"id":"p","className":"text-xl font-bold mt-6 mb-3","children":"Purpose of Project"}],"\n",["$","ol","ol-0",{"children":["\n",["$","li","li-0",{"children":["논문 구현을 하면서 제작한 ",["$","a","a-0",{"href":"https://github.com/sehooni/Neural-Style-Transfer_tf/blob/master/project/Neural_Style_Transfer_code.ipynb","children":"Jupyter Notebook file"}],"\n을 ",["$","a","a-1",{"href":"https://github.com/sehooni/Neural-Style-Transfer_tf/blob/master/project/Neural_Style_Transfer.py","children":"python file"}]," 형식으로 바꾸면서 코드를 조금더 간결화 한다."]}],"\n",["$","li","li-1",{"children":"이후 실시간 영상에 적용할 수 있는 코드 작성한다. 다양한 예제들이 존재하지만 구성 코드와 환경, 목적에 따라 다르게 작동하므로 나만의 코드를 작성한다."}],"\n",["$","li","li-2",{"children":"현재 논문에서 적용된 딥러닝 모델은 VGG19이다. 이후 다양한 모델들이 등장했는데, 시간적 여유가 존재한다면, 또 다른 딥러닝 모델을 적용하여 그 차이점 및 장단점을 확인한다."}],"\n"]}],"\n",["$","p","p-5",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/165943965-d9363c97-f501-458f-b52e-7aeeb7b2c7d4.png","alt":"프로젝트 설명 슬라이드 3"}]}],"\n",["$","h2","h2-1",{"id":"o","className":"text-2xl font-bold mt-8 mb-4","children":"opencv 예제"}],"\n",["$","p","p-6",{"children":[["$","a","a-0",{"href":"https://github.com/sehooni/Neural-Style-Transfer_tf/blob/master/opencv%20%EC%98%88%EC%A0%9C/README.md","children":"OpenCV 4로 배우는 컴퓨터 비전과 머신 러닝(황선규)"}],"\n에 포함된 python을 이용한 opencv예제이다."]}],"\n",["$","h2","h2-2",{"id":"r","className":"text-2xl font-bold mt-8 mb-4","children":"Reference"}],"\n",["$","p","p-7",{"children":"본 repository는 Opencv 기법 및 tf.keras가 적용된 'Neural-Style-Transfer' project이다."}],"\n",["$","h3","h3-3",{"id":"p","className":"text-xl font-bold mt-6 mb-3","children":"PAPER"}],"\n",["$","ul","ul-1",{"children":["\n",["$","li","li-0",{"children":[["$","a","a-0",{"href":"https://arxiv.org/abs/1508.06576","children":"A Neural Algorithm of Artistic Style.2015"}]," 에서 제시된 Mechanism을 이용하여 본 프로젝트를 진행한다."]}],"\n"]}],"\n",["$","h3","h3-4",{"id":"o","className":"text-xl font-bold mt-6 mb-3","children":"OPENCV 참고교재"}],"\n",["$","ul","ul-2",{"children":["\n",["$","li","li-0",{"children":["OpenCV 4로 배우는 컴퓨터 비전과 머신 러닝(황선규)\n",["$","ul","ul-0",{"children":["\n","$L2","\n"]}],"\n"]}],"\n","$L3","\n"]}],"\n","$L4","\n","$L5"],"$L6"]}],"$L7"]}],["$L8","$L9"],"$La"]}],"loading":null,"isPartial":false}
2:["$","li","li-0",{"children":["$","a","a-0",{"href":"https://github.com/sunkyoo/opencv4cvml","children":"깃허브링크"}]}]
3:["$","li","li-1",{"children":"OpenCV-Python으로 배우는 영상처리 및 응용"}]
4:["$","h1","h1-1",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"글을 마무리하며"}]
5:["$","p","p-8",{"children":"다음 포스팅에서는 본 프로젝트 코드에 대한 설명을 이어갈 예정이다."}]
6:["$","$Lb",null,{}]
d:Ta6c,
이전 포스트에 이어 본 프로젝트 구성 및 내용을 설명하고자 한다.
자세한 내용은 [본인의 깃허브 repository](https://github.com/sehooni/Neural-Style-Transfer_tf)
에 업로드 해 두었다.

# Neural Style Transfer-tf
opencv 및 tf.keras를 활용한 Neural Style Transfer 프로젝트 및 개념, 예제를 정리해 두었다.

## Project
프로젝트에 대한 구성 환경과 내용을 설명하자면 다음과 같다.

### Environment Setting
- python 3.6.5  
- Cuda 11.1 / tensorflow-gpu 2.4.0

### Detail of Project
![프로젝트 설명 슬라이드 1](https://user-images.githubusercontent.com/84653623/165943832-b93feebd-beb6-4965-970b-360836194f44.png)

![프로젝트 설명 슬라이드 2](https://user-images.githubusercontent.com/84653623/165943884-6d3c0559-dec9-4d59-8ec0-184fef17b99b.png)

### Purpose of Project
1. 논문 구현을 하면서 제작한 [Jupyter Notebook file](https://github.com/sehooni/Neural-Style-Transfer_tf/blob/master/project/Neural_Style_Transfer_code.ipynb)
을 [python file](https://github.com/sehooni/Neural-Style-Transfer_tf/blob/master/project/Neural_Style_Transfer.py) 형식으로 바꾸면서 코드를 조금더 간결화 한다.
2. 이후 실시간 영상에 적용할 수 있는 코드 작성한다. 다양한 예제들이 존재하지만 구성 코드와 환경, 목적에 따라 다르게 작동하므로 나만의 코드를 작성한다.
3. 현재 논문에서 적용된 딥러닝 모델은 VGG19이다. 이후 다양한 모델들이 등장했는데, 시간적 여유가 존재한다면, 또 다른 딥러닝 모델을 적용하여 그 차이점 및 장단점을 확인한다.

![프로젝트 설명 슬라이드 3](https://user-images.githubusercontent.com/84653623/165943965-d9363c97-f501-458f-b52e-7aeeb7b2c7d4.png)


## opencv 예제
[OpenCV 4로 배우는 컴퓨터 비전과 머신 러닝(황선규)](https://github.com/sehooni/Neural-Style-Transfer_tf/blob/master/opencv%20%EC%98%88%EC%A0%9C/README.md)
에 포함된 python을 이용한 opencv예제이다.


## Reference
본 repository는 Opencv 기법 및 tf.keras가 적용된 'Neural-Style-Transfer' project이다.

### PAPER
- [A Neural Algorithm of Artistic Style.2015](https://arxiv.org/abs/1508.06576) 에서 제시된 Mechanism을 이용하여 본 프로젝트를 진행한다.

### OPENCV 참고교재
- OpenCV 4로 배우는 컴퓨터 비전과 머신 러닝(황선규)
  - [깃허브링크](https://github.com/sunkyoo/opencv4cvml)
- OpenCV-Python으로 배우는 영상처리 및 응용

# 글을 마무리하며
다음 포스팅에서는 본 프로젝트 코드에 대한 설명을 이어갈 예정이다.
7:["$","$Lc",null,{"content":"$d"}]
8:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/b9ef641e76e3a351.css","precedence":"next"}]
9:["$","script","script-0",{"src":"/_next/static/chunks/6b8d09032578b975.js","async":true}]
a:["$","$Le",null,{"children":["$","$f",null,{"name":"Next.MetadataOutlet","children":"$@10"}]}]
10:null
