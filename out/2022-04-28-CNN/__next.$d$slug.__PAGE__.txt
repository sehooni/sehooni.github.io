1:"$Sreact.fragment"
11:I[24170,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
12:I[55132,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
14:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/865c404e1d9a0c65.js"],"OutletBoundary"]
15:"$Sreact.suspense"
:HL["https://user-images.githubusercontent.com/84653623/163127806-018be86d-286a-4fdf-b773-4d85b1b75214.png","image"]
:HL["/_next/static/chunks/b9ef641e76e3a351.css","style"]
0:{"buildId":"8lJiHtAmlyU3nNFMbG8_k","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[ML] CNN 정리(Conv2d, MaxPool2d)"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"2022-04-28","children":"April 28, 2022"}],"$undefined"]}]]}],[["$","p","p-0",{"children":["봄이 어느덧 지나가고, 중간고사 기간이 빠르게 찾아왔다.\nlinear regression 이후 CNN에 대해 살펴보자.\n본 포스팅에서는 ",["$","strong","strong-0",{"children":"Pytorch"}]," 를 이용하여 실행하게 된다."]}],"\n",["$","h1","h1-0",{"id":"c","className":"text-3xl font-bold mt-8 mb-4","children":"CNN Implementation"}],"\n",["$","p","p-1",{"children":"다음 그림과 같은 모양으로 CNN 학습을 진행한다."}],"\n",["$","p","p-2",{"children":["##그림 1. CNN Implementation\n",["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/163127806-018be86d-286a-4fdf-b773-4d85b1b75214.png","alt":"cnn implementation"}]]}],"\n",["$","p","p-3",{"children":"이때의 코드는 다음과 같다.\nimport torch\nimport torch.nn as nn"}],"\n",["$","pre","pre-0",{"children":["$","code","code-0",{"children":"input = torch.Tensor(1, 1, 28, 28)\nconv1 = nn.Conv2d(1, 5, 5)\npool - nn.MaxPool2d(2)\n\nout = conv1(input)\nout2 = pool(out)\n\nout.size()\nout2.size()\n"}]}],"\n",["$","p","p-4",{"children":["이와 관련된 코드는 ",["$","a","a-0",{"href":"https://github.com/sehooni/ML-Pytorch/blob/master/CNN/CNN%20Implementation/example.py","children":"example.py"}],"에서 확인할 수 있다."]}],"\n",["$","p","p-5",{"children":["그렇다면 위에 명시된 코드 ",["$","code","code-0",{"children":"nn.Conv2d"}],"와 ",["$","code","code-1",{"children":"nn.MaxPool2d"}],"는 무엇이며 어떠한 방식으로 진행이 될까?"]}],"\n",["$","h1","h1-1",{"id":"c","className":"text-3xl font-bold mt-8 mb-4","children":"CNN pytorch 관련 내용"}],"\n",["$","h2","h2-0",{"id":"p","className":"text-2xl font-bold mt-8 mb-4","children":"Pytorch nn.Conv2d"}],"\n",["$","pre","pre-1",{"children":["$","code","code-0",{"children":"conv = torch.nn.Conv2d(in_channels=, out_channels=, kernel_size=,\n             stride = 1, padding=0, dilation=1, groups=1,bias=True)\n"}]}],"\n",["$","p","p-6",{"children":["이때 ",["$","code","code-0",{"children":"stride, padding, dilation, groups"}]," 는 default value이다."]}],"\n",["$","p","p-7",{"children":"ex) 입력채널 1 / 출력채널 1 / 커널크기 3*3\nconv = nn.Conv2d(1, 1, 3)"}],"\n",["$","p","p-8",{"children":"input type : torch.Tensor\ninput shape : (N * C * H * W)\n(batch_size, channel, height, width)"}],"\n",["$","h3","h3-0",{"id":"o","className":"text-xl font-bold mt-6 mb-3","children":"Output Volume Caculations"}],"\n",["$","pre","pre-2",{"children":["$","code","code-0",{"children":"Output size = (input size - filter size + (2 * padding))/stride + 1\n"}]}],"\n",["$","p","p-9",{"children":"다음 예제들을 수기로 풀면 다음과 같다."}],"\n",["$","h4","h4-0",{"children":"예제 1)"}],"\n",["$","pre","pre-3",{"children":["$","code","code-0",{"children":"input image size : 227 * 227\nfilter size : 11 * 11\nstride = 4\npadding = 0\noutput image size = ?\n공식에 따라 계산하면 (227-11+2*0)/4 + 1 = 55\n                    55 * 55\n"}]}],"\n",["$","h4","h4-1",{"children":"예제 2)"}],"\n",["$","pre","pre-4",{"children":["$","code","code-0",{"children":"input image size : 64 * 64\nfilter size : 7 * 7\nstride = 2\npadding = 0\noutput image size = ?\n공식에 따라 계산하면 (64-7+2*0)/2 + 1 = 29.5 = 29\n                    29 * 29\n"}]}],"\n",["$","h4","h4-2",{"children":"예제 3)"}],"\n",["$","pre","pre-5",{"children":["$","code","code-0",{"children":"input image size : 32 * 32\nfilter size : 5 * 5\nstride = 1\npadding = 2\noutput image size = ?\n공식에 따라 계산하면 (32-5+2*2)/1 + 1 = 32\n                    32 * 32\n"}]}],"\n",["$","h4","h4-3",{"children":"예제 4)"}],"\n",["$","pre","pre-6",{"children":["$","code","code-0",{"children":"input image size : 32 * 64\nfilter size : 5 * 5\nstride = 1\npadding = 0\noutput image size = ?\n공식에 따라 계산하면 (32-5+2*0)/1 + 1 = 28, (64-5+2*0)/1 + 1 = 60\n                    28 * 60\n"}]}],"\n","$L2","\n","$L3","\n","$L4","\n","$L5","\n","$L6","\n","$L7","\n","$L8","\n","$L9","\n","$La","\n","$Lb"],"$Lc"]}],"$Ld"]}],["$Le","$Lf"],"$L10"]}],"loading":null,"isPartial":false}
2:["$","h4","h4-4",{"children":"예제 5)"}]
3:["$","pre","pre-7",{"children":["$","code","code-0",{"children":"input image size : 64 * 32\nfilter size : 3 * 3\nstride = 1\npadding = 1\noutput image size = ?\n공식에 따라 계산하면 (64-3+2*1)/1 + 1 = 64, (32-3+2*1)/1 + 1 = 32\n                    64 * 32\n"}]}]
4:["$","p","p-10",{"children":["위 예제들을 pytorch를 이용하여 계산할 수 있다.\n",["$","a","a-0",{"href":"https://github.com/sehooni/ML-Pytorch/blob/master/CNN/Conv/Pytorch_nn_Conv2d.py","children":"Pytorch_nn_Conv2d.py"}],"에서 확인 가능하다."]}]
5:["$","h2","h2-1",{"id":"p","className":"text-2xl font-bold mt-8 mb-4","children":"Pytorch nn.Conv2d"}]
6:["$","pre","pre-8",{"children":["$","code","code-0",{"children":"max_pool = torch.nn.MaxPool2d(kernel_size=,\n             stride = None, padding=0, dilation=1, return_indices = False,ceil_mode=False)\n"}]}]
7:["$","p","p-11",{"children":["이때 ",["$","code","code-0",{"children":"stride, padding, dilation, return_indices, ceil_mode"}]," 는 default value이다."]}]
8:["$","hr","hr-0",{}]
9:["$","h1","h1-2",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"글을 요약하자면.."}]
a:["$","h2","h2-2",{"id":"","className":"text-2xl font-bold mt-8 mb-4","children":"결국 CNN에서는 기존 Perceptron과 Multi-layer-Perceptron과 달리 Convolution layer와 Pooling layer가 추가되었다는 점에서 차이를 보인다.\n이를 통해 계산 시간은 단축이 되었으며, 매개변수를 구하는 과정이 단축됨에 따라 용량도 줄었다는 장점을 가진다."}]
b:["$","p","p-12",{"children":"이번 기회를 통해 수업내용도 정리하고 코드 적용도 학습해보았다.\n이후 관련 논문과 코드구현 내용도 업로드 예정이니 많은 관심 부탁드리며.. 글을 마무리해본다."}]
c:["$","$L11",null,{}]
13:Teb0,봄이 어느덧 지나가고, 중간고사 기간이 빠르게 찾아왔다.
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
이후 관련 논문과 코드구현 내용도 업로드 예정이니 많은 관심 부탁드리며.. 글을 마무리해본다.d:["$","$L12",null,{"content":"$13"}]
e:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/b9ef641e76e3a351.css","precedence":"next"}]
f:["$","script","script-0",{"src":"/_next/static/chunks/6b8d09032578b975.js","async":true}]
10:["$","$L14",null,{"children":["$","$15",null,{"name":"Next.MetadataOutlet","children":"$@16"}]}]
16:null
