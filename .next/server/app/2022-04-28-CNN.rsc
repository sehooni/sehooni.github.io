1:"$Sreact.fragment"
2:I[9766,[],""]
3:I[8924,[],""]
5:I[4431,[],"OutletBoundary"]
7:I[5278,[],"AsyncMetadataOutlet"]
9:I[4431,[],"ViewportBoundary"]
b:I[4431,[],"MetadataBoundary"]
c:"$Sreact.suspense"
e:I[7150,[],""]
:HL["/_next/static/css/51e5ba5c7de07f80.css","style"]
:HL["/_next/static/css/5eacd01f773eed7f.css","style"]
0:{"P":null,"b":"xTAnN8PQ3b6-LdzNENhZ7","p":"","c":["","2022-04-28-CNN"],"i":false,"f":[[["",{"children":[["slug","2022-04-28-CNN","d"],{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/51e5ba5c7de07f80.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"min-h-screen flex flex-col font-sans","children":["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]]}],{"children":[["slug","2022-04-28-CNN","d"],["$","$1","c",{"children":[null,["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L4",[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/5eacd01f773eed7f.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","$L5",null,{"children":["$L6",["$","$L7",null,{"promise":"$@8"}]]}]]}],{},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,[["$","$L9",null,{"children":"$La"}],null],["$","$Lb",null,{"children":["$","div",null,{"hidden":true,"children":["$","$c",null,{"fallback":null,"children":"$Ld"}]}]}]]}],false]],"m":"$undefined","G":["$e",[]],"s":false,"S":true}
4:["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[ML] CNN 정리(Conv2d, MaxPool2d)"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"2022-04-28","children":"April 28, 2022"}],"$undefined"]}]]}],[["$","p","p-0",{"children":["봄이 어느덧 지나가고, 중간고사 기간이 빠르게 찾아왔다.\nlinear regression 이후 CNN에 대해 살펴보자.\n본 포스팅에서는 ",["$","strong","strong-0",{"children":"Pytorch"}]," 를 이용하여 실행하게 된다."]}],"\n",["$","h1","h1-0",{"id":"c","className":"text-3xl font-bold mt-8 mb-4","children":"CNN Implementation"}],"\n",["$","p","p-1",{"children":"다음 그림과 같은 모양으로 CNN 학습을 진행한다."}],"\n",["$","p","p-2",{"children":["##그림 1. CNN Implementation\n",["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/163127806-018be86d-286a-4fdf-b773-4d85b1b75214.png","alt":"cnn implementation"}]]}],"\n",["$","p","p-3",{"children":"이때의 코드는 다음과 같다.\nimport torch\nimport torch.nn as nn"}],"\n",["$","pre","pre-0",{"children":["$","code","code-0",{"children":"input = torch.Tensor(1, 1, 28, 28)\nconv1 = nn.Conv2d(1, 5, 5)\npool - nn.MaxPool2d(2)\n\nout = conv1(input)\nout2 = pool(out)\n\nout.size()\nout2.size()\n"}]}],"\n",["$","p","p-4",{"children":["이와 관련된 코드는 ",["$","a","a-0",{"href":"https://github.com/sehooni/ML-Pytorch/blob/master/CNN/CNN%20Implementation/example.py","children":"example.py"}],"에서 확인할 수 있다."]}],"\n",["$","p","p-5",{"children":["그렇다면 위에 명시된 코드 ",["$","code","code-0",{"children":"nn.Conv2d"}],"와 ",["$","code","code-1",{"children":"nn.MaxPool2d"}],"는 무엇이며 어떠한 방식으로 진행이 될까?"]}],"\n",["$","h1","h1-1",{"id":"c","className":"text-3xl font-bold mt-8 mb-4","children":"CNN pytorch 관련 내용"}],"\n",["$","h2","h2-0",{"id":"p","className":"text-2xl font-bold mt-8 mb-4","children":"Pytorch nn.Conv2d"}],"\n",["$","pre","pre-1",{"children":["$","code","code-0",{"children":"conv = torch.nn.Conv2d(in_channels=, out_channels=, kernel_size=,\n             stride = 1, padding=0, dilation=1, groups=1,bias=True)\n"}]}],"\n",["$","p","p-6",{"children":["이때 ",["$","code","code-0",{"children":"stride, padding, dilation, groups"}]," 는 default value이다."]}],"\n",["$","p","p-7",{"children":"ex) 입력채널 1 / 출력채널 1 / 커널크기 3*3\nconv = nn.Conv2d(1, 1, 3)"}],"\n",["$","p","p-8",{"children":"input type : torch.Tensor\ninput shape : (N * C * H * W)\n(batch_size, channel, height, width)"}],"\n",["$","h3","h3-0",{"id":"o","className":"text-xl font-bold mt-6 mb-3","children":"Output Volume Caculations"}],"\n",["$","pre","pre-2",{"children":["$","code","code-0",{"children":"Output size = (input size - filter size + (2 * padding))/stride + 1\n"}]}],"\n",["$","p","p-9",{"children":"다음 예제들을 수기로 풀면 다음과 같다."}],"\n",["$","h4","h4-0",{"children":"예제 1)"}],"\n",["$","pre","pre-3",{"children":["$","code","code-0",{"children":"input image size : 227 * 227\nfilter size : 11 * 11\nstride = 4\npadding = 0\noutput image size = ?\n공식에 따라 계산하면 (227-11+2*0)/4 + 1 = 55\n                    55 * 55\n"}]}],"\n",["$","h4","h4-1",{"children":"예제 2)"}],"\n",["$","pre","pre-4",{"children":["$","code","code-0",{"children":"input image size : 64 * 64\nfilter size : 7 * 7\nstride = 2\npadding = 0\noutput image size = ?\n공식에 따라 계산하면 (64-7+2*0)/2 + 1 = 29.5 = 29\n                    29 * 29\n"}]}],"\n",["$","h4","h4-2",{"children":"예제 3)"}],"\n",["$","pre","pre-5",{"children":["$","code","code-0",{"children":"input image size : 32 * 32\nfilter size : 5 * 5\nstride = 1\npadding = 2\noutput image size = ?\n공식에 따라 계산하면 (32-5+2*2)/1 + 1 = 32\n                    32 * 32\n"}]}],"\n",["$","h4","h4-3",{"children":"예제 4)"}],"\n",["$","pre","pre-6",{"children":["$","code","code-0",{"children":"input image size : 32 * 64\nfilter size : 5 * 5\nstride = 1\npadding = 0\noutput image size = ?\n공식에 따라 계산하면 (32-5+2*0)/1 + 1 = 28, (64-5+2*0)/1 + 1 = 60\n                    28 * 60\n"}]}],"\n","$Lf","\n","$L10","\n","$L11","\n","$L12","\n","$L13","\n","$L14","\n","$L15","\n","$L16","\n","$L17","\n","$L18"],"$L19"]}],"$L1a"]}]
1b:I[3089,["182","static/chunks/app/%5Bslug%5D/page-ad31c54747687caf.js"],"default"]
1c:I[4010,["182","static/chunks/app/%5Bslug%5D/page-ad31c54747687caf.js"],"default"]
f:["$","h4","h4-4",{"children":"예제 5)"}]
10:["$","pre","pre-7",{"children":["$","code","code-0",{"children":"input image size : 64 * 32\nfilter size : 3 * 3\nstride = 1\npadding = 1\noutput image size = ?\n공식에 따라 계산하면 (64-3+2*1)/1 + 1 = 64, (32-3+2*1)/1 + 1 = 32\n                    64 * 32\n"}]}]
11:["$","p","p-10",{"children":["위 예제들을 pytorch를 이용하여 계산할 수 있다.\n",["$","a","a-0",{"href":"https://github.com/sehooni/ML-Pytorch/blob/master/CNN/Conv/Pytorch_nn_Conv2d.py","children":"Pytorch_nn_Conv2d.py"}],"에서 확인 가능하다."]}]
12:["$","h2","h2-1",{"id":"p","className":"text-2xl font-bold mt-8 mb-4","children":"Pytorch nn.Conv2d"}]
13:["$","pre","pre-8",{"children":["$","code","code-0",{"children":"max_pool = torch.nn.MaxPool2d(kernel_size=,\n             stride = None, padding=0, dilation=1, return_indices = False,ceil_mode=False)\n"}]}]
14:["$","p","p-11",{"children":["이때 ",["$","code","code-0",{"children":"stride, padding, dilation, return_indices, ceil_mode"}]," 는 default value이다."]}]
15:["$","hr","hr-0",{}]
16:["$","h1","h1-2",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"글을 요약하자면.."}]
17:["$","h2","h2-2",{"id":"","className":"text-2xl font-bold mt-8 mb-4","children":"결국 CNN에서는 기존 Perceptron과 Multi-layer-Perceptron과 달리 Convolution layer와 Pooling layer가 추가되었다는 점에서 차이를 보인다.\n이를 통해 계산 시간은 단축이 되었으며, 매개변수를 구하는 과정이 단축됨에 따라 용량도 줄었다는 장점을 가진다."}]
18:["$","p","p-12",{"children":"이번 기회를 통해 수업내용도 정리하고 코드 적용도 학습해보았다.\n이후 관련 논문과 코드구현 내용도 업로드 예정이니 많은 관심 부탁드리며.. 글을 마무리해본다."}]
19:["$","$L1b",null,{}]
1d:Teb0,봄이 어느덧 지나가고, 중간고사 기간이 빠르게 찾아왔다.
linear regression 이후 CNN에 대해 살펴보자.
본 포스팅에서는 **Pytorch** 를 이용하여 실행하게 된다.

# CNN Implementation

다음 그림과 같은 모양으로 CNN 학습을 진행한다.

##그림 1. CNN Implementation
![cnn implementation](https://user-images.githubusercontent.com/84653623/163127806-018be86d-286a-4fdf-b773-4d85b1b75214.png)

이때의 코드는 다음과 같다.
    import torch
    import torch.nn as nn

    input = torch.Tensor(1, 1, 28, 28)
    conv1 = nn.Conv2d(1, 5, 5)
    pool - nn.MaxPool2d(2)

    out = conv1(input)
    out2 = pool(out)

    out.size()
    out2.size()

이와 관련된 코드는 [example.py](https://github.com/sehooni/ML-Pytorch/blob/master/CNN/CNN%20Implementation/example.py)에서 확인할 수 있다.

그렇다면 위에 명시된 코드 `nn.Conv2d`와 `nn.MaxPool2d`는 무엇이며 어떠한 방식으로 진행이 될까?

# CNN pytorch 관련 내용

## Pytorch nn.Conv2d
    conv = torch.nn.Conv2d(in_channels=, out_channels=, kernel_size=,
                 stride = 1, padding=0, dilation=1, groups=1,bias=True)
이때 `stride, padding, dilation, groups` 는 default value이다.
 
ex) 입력채널 1 / 출력채널 1 / 커널크기 3*3
    conv = nn.Conv2d(1, 1, 3)

input type : torch.Tensor
input shape : (N * C * H * W)
              (batch_size, channel, height, width)

### Output Volume Caculations
    Output size = (input size - filter size + (2 * padding))/stride + 1

다음 예제들을 수기로 풀면 다음과 같다.
#### 예제 1)
    input image size : 227 * 227
    filter size : 11 * 11
    stride = 4
    padding = 0
    output image size = ?
    공식에 따라 계산하면 (227-11+2*0)/4 + 1 = 55
                        55 * 55

#### 예제 2)
    input image size : 64 * 64
    filter size : 7 * 7
    stride = 2
    padding = 0
    output image size = ?
    공식에 따라 계산하면 (64-7+2*0)/2 + 1 = 29.5 = 29
                        29 * 29

#### 예제 3)
    input image size : 32 * 32
    filter size : 5 * 5
    stride = 1
    padding = 2
    output image size = ?
    공식에 따라 계산하면 (32-5+2*2)/1 + 1 = 32
                        32 * 32

#### 예제 4)
    input image size : 32 * 64
    filter size : 5 * 5
    stride = 1
    padding = 0
    output image size = ?
    공식에 따라 계산하면 (32-5+2*0)/1 + 1 = 28, (64-5+2*0)/1 + 1 = 60
                        28 * 60

#### 예제 5)
    input image size : 64 * 32
    filter size : 3 * 3
    stride = 1
    padding = 1
    output image size = ?
    공식에 따라 계산하면 (64-3+2*1)/1 + 1 = 64, (32-3+2*1)/1 + 1 = 32
                        64 * 32

위 예제들을 pytorch를 이용하여 계산할 수 있다.
[Pytorch_nn_Conv2d.py](https://github.com/sehooni/ML-Pytorch/blob/master/CNN/Conv/Pytorch_nn_Conv2d.py)에서 확인 가능하다.

## Pytorch nn.Conv2d
    max_pool = torch.nn.MaxPool2d(kernel_size=,
                 stride = None, padding=0, dilation=1, return_indices = False,ceil_mode=False)
이때 `stride, padding, dilation, return_indices, ceil_mode` 는 default value이다.

---
# 글을 요약하자면..

결국 CNN에서는 기존 Perceptron과 Multi-layer-Perceptron과 달리 Convolution layer와 Pooling layer가 추가되었다는 점에서 차이를 보인다.
이를 통해 계산 시간은 단축이 되었으며, 매개변수를 구하는 과정이 단축됨에 따라 용량도 줄었다는 장점을 가진다.
---

이번 기회를 통해 수업내용도 정리하고 코드 적용도 학습해보았다.
이후 관련 논문과 코드구현 내용도 업로드 예정이니 많은 관심 부탁드리며.. 글을 마무리해본다.1a:["$","$L1c",null,{"content":"$1d"}]
a:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
6:null
8:{"metadata":[["$","title","0",{"children":"Sehoon's Workspace"}],["$","meta","1",{"name":"description","content":"Welcome to my page!"}]],"error":null,"digest":"$undefined"}
d:"$8:metadata"
