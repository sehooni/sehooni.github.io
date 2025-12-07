1:"$Sreact.fragment"
1e:I[24170,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
1f:I[55132,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
21:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/865c404e1d9a0c65.js"],"OutletBoundary"]
22:"$Sreact.suspense"
:HL["/_next/static/chunks/b9ef641e76e3a351.css","style"]
0:{"buildId":"8lJiHtAmlyU3nNFMbG8_k","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[ML] Linear Regression 정리"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"2022-03-21","children":"March 21, 2022"}],"$undefined"]}]]}],[["$","p","p-0",{"children":"학교 수업으로 타학과 전공인 '인공지능과 딥러닝'을 수강하게 되었다.\n오일석 교수님의 [Machine Learning 기계학습] 을 기반으로 진행되는 강의이다."}],"\n",["$","p","p-1",{"children":"Perceptron을 설명하면서 Linear regression을 직접 코딩을 통해 실습하는 시간을 가졌는데, 아래의 내용은 그 실습 내용을 정리한 것이다."}],"\n",["$","h1","h1-0",{"id":"l","className":"text-3xl font-bold mt-8 mb-4","children":"Linear regression"}],"\n",["$","p","p-2",{"children":"Author: Seungjae Lee(이승재)"}],"\n",["$","p","p-3",{"children":"모두를 위한 딥러닝을 참고하였습니다."}],"\n",["$","h2","h2-0",{"id":"t","className":"text-2xl font-bold mt-8 mb-4","children":"Theoretical Overview"}],"\n",["$","p","p-4",{"children":"$$ H(x) = Wx + b $"}],"\n",["$","p","p-5",{"children":"$$ cost(W, b) = \\frac{1}{m} \\sum^m_{i=1} \\left( H(x^{(i)}) - y^{(i)} \\right)^2 $"}],"\n",["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":"$$H(x)$: 주어진 $x$ 값에 대해 예측을 어떻게 할 것인가"}],"\n",["$","li","li-1",{"children":"$$cost(W, b)$: $H(x)$ 가 $y$ 를 얼마나 잘 예측했는가"}],"\n"]}],"\n",["$","h2","h2-1",{"id":"i","className":"text-2xl font-bold mt-8 mb-4","children":"Import"}],"\n",["$","pre","pre-0",{"children":["$","code","code-0",{"children":"import torch\nimport torch.nn as nn\nimport torch.nn.functional as F\nimport torch.optim as optim\n"}]}],"\n",["$","h2","h2-2",{"id":"f","className":"text-2xl font-bold mt-8 mb-4","children":"For reproducibility"}],"\n",["$","pre","pre-1",{"children":["$","code","code-0",{"children":"torch.manual_seed(1)\n"}]}],"\n",["$","h2","h2-3",{"id":"d","className":"text-2xl font-bold mt-8 mb-4","children":"Data"}],"\n",["$","p","p-6",{"children":"다음 예제를 위해 예시 데이터를 사용하여보자.\n(We will use fake data for this example.)"}],"\n",["$","pre","pre-2",{"children":["$","code","code-0",{"children":"x_train = torch.FloatTensor([[1], [2], [3]])\ny_train = torch.FloatTensor([[1], [2], [3]])\nprint(x_train)\nprint(x_train.shape)\nprint(y_train)\nprint(y_train.shape)\n"}]}],"\n",["$","p","p-7",{"children":"기본적으로 Pytorch는 NCHW 형태이다."}],"\n",["$","h2","h2-4",{"id":"w","className":"text-2xl font-bold mt-8 mb-4","children":"Weight Initialization"}],"\n",["$","pre","pre-3",{"children":["$","code","code-0",{"children":"W = torch.zeros(1, requires_grad=True)\nprint(W)\nb = torch.zeros(1, requires_grad=True)\nprint(b)\n"}]}],"\n",["$","h2","h2-5",{"id":"h","className":"text-2xl font-bold mt-8 mb-4","children":"Hypothesis"}],"\n",["$","p","p-8",{"children":"$$ H(x) = Wx + b $"}],"\n",["$","pre","pre-4",{"children":["$","code","code-0",{"children":"hypothesis = x_train * W + b\nprint(hypothesis)\n"}]}],"\n",["$","h2","h2-6",{"id":"c","className":"text-2xl font-bold mt-8 mb-4","children":"Cost"}],"\n",["$","p","p-9",{"children":"$$ cost(W, b) = \\frac{1}{m} \\sum^m_{i=1} \\left( H(x^{(i)}) - y^{(i)} \\right)^2 $"}],"\n",["$","pre","pre-5",{"children":["$","code","code-0",{"children":"print(hypothesis)\nprint(y_train)\nprint(hypothesis - y_train)\nprint((hypothesis - y_train) ** 2)\ncost = torch.mean((hypothesis - y_train) ** 2)\nprint(cost)\n"}]}],"\n",["$","h2","h2-7",{"id":"g","className":"text-2xl font-bold mt-8 mb-4","children":"Gradient Descent"}],"\n",["$","pre","pre-6",{"children":["$","code","code-0",{"children":"optimizer = optim.SGD([W, b], lr = 0.01)\noptimizer.zero_grad()\ncost.backward()\noptimizer.step()\nprint(W)\nprint(b)\n"}]}],"\n",["$","p","p-10",{"children":"가설이 잘 작동하는지 확인하여 보자.\n(Let's check if the hypothesis is now better.)"}],"\n",["$","pre","pre-7",{"children":["$","code","code-0",{"children":"hypothesis = x_train * W + b\nprint(hypothesis)\ncost = torch.mean((hypothesis - y_train) ** 2)\nprint(cost)\n"}]}],"\n","$L2","\n","$L3","\n","$L4","\n","$L5","\n","$L6","\n","$L7","\n","$L8","\n","$L9","\n","$La","\n","$Lb","\n","$Lc","\n","$Ld","\n","$Le","\n","$Lf","\n","$L10","\n","$L11","\n","$L12","\n","$L13","\n","$L14","\n","$L15","\n","$L16","\n","$L17","\n","$L18"],"$L19"]}],"$L1a"]}],["$L1b","$L1c"],"$L1d"]}],"loading":null,"isPartial":false}
2:["$","h2","h2-8",{"id":"t","className":"text-2xl font-bold mt-8 mb-4","children":"Training with Full Code"}]
3:["$","p","p-11",{"children":"In reality, we will be training on the dataset for multiple epochs. This can be done simply with loops."}]
4:["$","pre","pre-8",{"children":["$","code","code-0",{"children":"# 데이터\nx_train = torch.FloatTensor([[1], [2], [3]])\ny_train = torch.FloatTensor([[1], [2], [3]])\n\n# 모델 초기화\nW = torch.zeros(1, requires_grad=True)\nb = torch.zeros(1, requires_grad=True)\n\n# optimizer 설정\noptimizer = optim.SGD([W, b], lr = 0.01)\n\nnb_epochs = 1000\nfor epoch in range(nb_epochs + 1):\n        \n    # H(x) 계산\n    hypothesis = x_train * W + b\n        \n    # cost 계산\n    cost = torch.mean((hypothesis - y_train) ** 2)\n        \n    # cost로 H(x) 개선\n    optimizer.zero_grad()\n    cost.backward()\n    optimizer.step()\n        \n    # 100번마다 로그 출력\n    if epoch % 100 == 0:\n        print('Epoch {:4d}/{} W: {:.3f}, b: {:.3f} Cost: {:.6f}'.format(\n                epoch, nb_epochs, W.item(), b.item(), cost.item()\n        ))\n"}]}]
5:["$","h2","h2-9",{"id":"high-level-implementaion-with","className":"text-2xl font-bold mt-8 mb-4","children":["High-level implementaion with ",["$","code","code-0",{"children":"nn.Module"}]]}]
6:["$","p","p-12",{"children":"Remember that we had this fake data."}]
7:["$","pre","pre-9",{"children":["$","code","code-0",{"children":"x_train = torch.FloatTensor([[1], [2], [3]])\ny_train = torch.FloatTensor([[1], [2], [3]])\n"}]}]
8:["$","h3","h3-0",{"id":"linear-regression-pytorch","className":"text-xl font-bold mt-6 mb-3","children":["이제 linear regression 모델을 만들면 되는데, 기본적으로 Pytorch의 모든 모델은 제공되는 ",["$","code","code-0",{"children":"nn.Module"}],"을 inherit 해서 만들게 된다."]}]
9:["$","pre","pre-10",{"children":["$","code","code-0",{"children":"class LinearRegressionModel(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.linear = nn.Linear(1, 1)\n        \n    def forward(self, x):\n        return self.linear(x)\n"}]}]
a:["$","h3","h3-1",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":["모델의 ",["$","code","code-0",{"children":"__init__"}],"에서는 사용할 레이어들을 정의하게 된다. 여기서 우리는 linear regression 모델을 만들기 때문에, ",["$","code","code-1",{"children":"nn.Linear"}],"를 이용할 것이다. 그리고 ",["$","code","code-2",{"children":"forward"}],"에서는 이 모델이 어떻게 입력값에서 출력값을 계산하는지 알려준다."]}]
b:["$","pre","pre-11",{"children":["$","code","code-0",{"children":"model = LinearRegressionModel()\n"}]}]
c:["$","h2","h2-10",{"id":"h","className":"text-2xl font-bold mt-8 mb-4","children":"Hypothesis"}]
d:["$","p","p-13",{"children":["이제 모델을 생성해서 예측값 ",["$","em","em-0",{"children":"H(x)"}]," 를 구해보자"]}]
e:["$","pre","pre-12",{"children":["$","code","code-0",{"children":"hypothesis = model(x_train)\nprint(hypothesis)\n"}]}]
f:["$","h2","h2-11",{"id":"c","className":"text-2xl font-bold mt-8 mb-4","children":"Cost"}]
10:["$","p","p-14",{"children":"이제 mean squared error (MSE)로 cost를 구해보자. MSE 역시 PyTorch에서 기본적으로 제공한다."}]
11:["$","pre","pre-13",{"children":["$","code","code-0",{"children":"print(hypothesis)\nprint(y_train)\ncost = F.mse_loss(hypothesis, y_train)\nprint(cost)\n"}]}]
12:["$","h2","h2-12",{"id":"g","className":"text-2xl font-bold mt-8 mb-4","children":"Gradient Descent"}]
13:["$","p","p-15",{"children":["마지막 주어진 cost를 이용해 ",["$","em","em-0",{"children":"H(x)"}]," 의 ",["$","em","em-1",{"children":"W"}]," , ",["$","em","em-2",{"children":"b"}]," 를 바꾸어서 cost를 줄여봅시다. 이때 PyTorch의 ",["$","code","code-0",{"children":"torch.optim"}],"에 있는 ",["$","code","code-1",{"children":"optimizer"}],"들 중 하나를 사용할 수 있다."]}]
14:["$","pre","pre-14",{"children":["$","code","code-0",{"children":"optimizer = optim.SGD(model.parameters(), lr=0.01)\noptimizer.zero_grad()\ncost.backward()\noptimizer.step()\n"}]}]
15:["$","h2","h2-13",{"id":"t","className":"text-2xl font-bold mt-8 mb-4","children":"Training with Full Code"}]
16:["$","p","p-16",{"children":"이제 Linear Regression 코드를 이해했으니, 실제로 코드를 돌려 피팅하여보자."}]
17:["$","pre","pre-15",{"children":["$","code","code-0",{"children":"# 데이터\nx_train = torch.FloatTensor([[1], [2], [3]])\ny_train = torch.FloatTensor([[1], [2], [3]])\n\n# 모델 초기화\nmodel = LinearRegressionModel()\n\n# optimizer 설정\noptimizer = optim.SGD(model.parameters(), lr=0.01)\n\nnb_epochs = 1000\nfor epoch in range(nb_epochs + 1):\n    \n    # H(x) 계산\n    prediction = model(x_train)\n        \n    # cost 계산\n    cost = F.mse_loss(prediction, y_train)\n        \n    # cost로 H(x) 개선\n    optimizer.zero_grad()\n    cost.backward()\n    optimizer.step()\n        \n    # 100번 마다 로그 출력\n    if epoch % 100 == 0:\n        params = list(model.parameters())\n        W = params[0].item()\n        b = params[1].item()\n        print('Epoch {:4d}/{} W: {:.3f}, b: {:.3f} Cost: {:.6f}'.format(\n            epoch, nb_epochs, W, b, cost.item()\n        ))\n    \n"}]}]
18:["$","p","p-17",{"children":["점점 ",["$","em","em-0",{"children":"H(x)"}]," 의 ",["$","em","em-1",{"children":"W"}]," 와 ",["$","em","em-2",{"children":"b"}]," 를 조정해서 cost가 줄어드는 것을 볼 수 있다."]}]
19:["$","$L1e",null,{}]
20:T170f,
학교 수업으로 타학과 전공인 '인공지능과 딥러닝'을 수강하게 되었다.
오일석 교수님의 [Machine Learning 기계학습] 을 기반으로 진행되는 강의이다.

Perceptron을 설명하면서 Linear regression을 직접 코딩을 통해 실습하는 시간을 가졌는데, 아래의 내용은 그 실습 내용을 정리한 것이다.


# Linear regression
Author: Seungjae Lee(이승재)

모두를 위한 딥러닝을 참고하였습니다.

## Theoretical Overview
$ H(x) = Wx + b $

$ cost(W, b) = \\frac{1}{m} \\sum^m_{i=1} \\left( H(x^{(i)}) - y^{(i)} \\right)^2 $

- $H(x)$: 주어진 $x$ 값에 대해 예측을 어떻게 할 것인가
- $cost(W, b)$: $H(x)$ 가 $y$ 를 얼마나 잘 예측했는가

## Import
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    import torch.optim as optim

## For reproducibility
    torch.manual_seed(1)

## Data
다음 예제를 위해 예시 데이터를 사용하여보자.
(We will use fake data for this example.) 

    x_train = torch.FloatTensor([[1], [2], [3]])
    y_train = torch.FloatTensor([[1], [2], [3]])
    print(x_train)
    print(x_train.shape)
    print(y_train)
    print(y_train.shape)
기본적으로 Pytorch는 NCHW 형태이다.

## Weight Initialization
    W = torch.zeros(1, requires_grad=True)
    print(W)
    b = torch.zeros(1, requires_grad=True)
    print(b)

## Hypothesis
$ H(x) = Wx + b $

    hypothesis = x_train * W + b
    print(hypothesis)

## Cost
$ cost(W, b) = \frac{1}{m} \sum^m_{i=1} \left( H(x^{(i)}) - y^{(i)} \right)^2 $

    print(hypothesis)
    print(y_train)
    print(hypothesis - y_train)
    print((hypothesis - y_train) ** 2)
    cost = torch.mean((hypothesis - y_train) ** 2)
    print(cost)

## Gradient Descent
    optimizer = optim.SGD([W, b], lr = 0.01)
    optimizer.zero_grad()
    cost.backward()
    optimizer.step()
    print(W)
    print(b)

가설이 잘 작동하는지 확인하여 보자.
(Let's check if the hypothesis is now better.)

    hypothesis = x_train * W + b
    print(hypothesis)
    cost = torch.mean((hypothesis - y_train) ** 2)
    print(cost)

## Training with Full Code
In reality, we will be training on the dataset for multiple epochs. This can be done simply with loops.

    # 데이터
    x_train = torch.FloatTensor([[1], [2], [3]])
    y_train = torch.FloatTensor([[1], [2], [3]])

    # 모델 초기화
    W = torch.zeros(1, requires_grad=True)
    b = torch.zeros(1, requires_grad=True)

    # optimizer 설정
    optimizer = optim.SGD([W, b], lr = 0.01)

    nb_epochs = 1000
    for epoch in range(nb_epochs + 1):
            
        # H(x) 계산
        hypothesis = x_train * W + b
            
        # cost 계산
        cost = torch.mean((hypothesis - y_train) ** 2)
            
        # cost로 H(x) 개선
        optimizer.zero_grad()
        cost.backward()
        optimizer.step()
            
        # 100번마다 로그 출력
        if epoch % 100 == 0:
            print('Epoch {:4d}/{} W: {:.3f}, b: {:.3f} Cost: {:.6f}'.format(
                    epoch, nb_epochs, W.item(), b.item(), cost.item()
            ))

## High-level implementaion with `nn.Module`
Remember that we had this fake data.

    x_train = torch.FloatTensor([[1], [2], [3]])
    y_train = torch.FloatTensor([[1], [2], [3]])

### 이제 linear regression 모델을 만들면 되는데, 기본적으로 Pytorch의 모든 모델은 제공되는 `nn.Module`을 inherit 해서 만들게 된다.

    class LinearRegressionModel(nn.Module):
        def __init__(self):
            super().__init__()
            self.linear = nn.Linear(1, 1)
            
        def forward(self, x):
            return self.linear(x)

### 모델의 `__init__`에서는 사용할 레이어들을 정의하게 된다. 여기서 우리는 linear regression 모델을 만들기 때문에, `nn.Linear`를 이용할 것이다. 그리고 `forward`에서는 이 모델이 어떻게 입력값에서 출력값을 계산하는지 알려준다.

    model = LinearRegressionModel()

## Hypothesis
이제 모델을 생성해서 예측값 *H(x)* 를 구해보자

    hypothesis = model(x_train)
    print(hypothesis)

## Cost
이제 mean squared error (MSE)로 cost를 구해보자. MSE 역시 PyTorch에서 기본적으로 제공한다.

    print(hypothesis)
    print(y_train)
    cost = F.mse_loss(hypothesis, y_train)
    print(cost)

## Gradient Descent
마지막 주어진 cost를 이용해 *H(x)* 의 *W* , *b* 를 바꾸어서 cost를 줄여봅시다. 이때 PyTorch의 `torch.optim`에 있는 `optimizer`들 중 하나를 사용할 수 있다.

    optimizer = optim.SGD(model.parameters(), lr=0.01)
    optimizer.zero_grad()
    cost.backward()
    optimizer.step()

## Training with Full Code
이제 Linear Regression 코드를 이해했으니, 실제로 코드를 돌려 피팅하여보자.

    # 데이터
    x_train = torch.FloatTensor([[1], [2], [3]])
    y_train = torch.FloatTensor([[1], [2], [3]])

    # 모델 초기화
    model = LinearRegressionModel()

    # optimizer 설정
    optimizer = optim.SGD(model.parameters(), lr=0.01)

    nb_epochs = 1000
    for epoch in range(nb_epochs + 1):
        
        # H(x) 계산
        prediction = model(x_train)
            
        # cost 계산
        cost = F.mse_loss(prediction, y_train)
            
        # cost로 H(x) 개선
        optimizer.zero_grad()
        cost.backward()
        optimizer.step()
            
        # 100번 마다 로그 출력
        if epoch % 100 == 0:
            params = list(model.parameters())
            W = params[0].item()
            b = params[1].item()
            print('Epoch {:4d}/{} W: {:.3f}, b: {:.3f} Cost: {:.6f}'.format(
                epoch, nb_epochs, W, b, cost.item()
            ))
        
점점 *H(x)* 의 *W* 와 *b* 를 조정해서 cost가 줄어드는 것을 볼 수 있다.
1a:["$","$L1f",null,{"content":"$20"}]
1b:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/b9ef641e76e3a351.css","precedence":"next"}]
1c:["$","script","script-0",{"src":"/_next/static/chunks/6b8d09032578b975.js","async":true}]
1d:["$","$L21",null,{"children":["$","$22",null,{"name":"Next.MetadataOutlet","children":"$@23"}]}]
23:null
