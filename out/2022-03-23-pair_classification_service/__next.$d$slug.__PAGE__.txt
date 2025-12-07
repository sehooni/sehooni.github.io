1:"$Sreact.fragment"
49:I[24170,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
4a:I[55132,["/_next/static/chunks/6b8d09032578b975.js"],"default"]
4c:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/865c404e1d9a0c65.js"],"OutletBoundary"]
4d:"$Sreact.suspense"
:HL["https://user-images.githubusercontent.com/84653623/160080095-e1ad18ac-7b05-4b62-b7bb-42de6dfcd904.jpg","image"]
:HL["https://user-images.githubusercontent.com/84653623/160079951-83a22799-e4d8-4254-845b-61b55a1ec40d.png","image"]
:HL["/_next/static/chunks/b9ef641e76e3a351.css","style"]
2:T2695,Requirement already satisfied: ratsnlp in /usr/local/lib/python3.7/dist-packages (1.0.1)
Requirement already satisfied: transformers==4.10.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (4.10.0)
Requirement already satisfied: Korpora>=0.2.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (0.2.0)
Requirement already satisfied: flask>=1.1.4 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.1.4)
Requirement already satisfied: flask-cors>=3.0.10 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (3.0.10)
Requirement already satisfied: torch>=1.9.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.10.0+cu111)
Requirement already satisfied: flask-ngrok>=0.0.25 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (0.0.25)
Requirement already satisfied: pytorch-lightning==1.3.4 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.3.4)
Requirement already satisfied: future>=0.17.1 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.18.2)
Requirement already satisfied: tensorboard!=2.5.0,>=2.2.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (2.8.0)
Requirement already satisfied: fsspec[http]>=2021.4.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (2022.2.0)
Requirement already satisfied: packaging in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (21.3)
Requirement already satisfied: torchmetrics>=0.2.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.7.2)
Requirement already satisfied: numpy>=1.17.2 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (1.21.5)
Requirement already satisfied: pyDeprecate==0.3.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.3.0)
Requirement already satisfied: tqdm>=4.41.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (4.63.0)
Requirement already satisfied: PyYAML<=5.4.1,>=5.1 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (5.4.1)
Requirement already satisfied: huggingface-hub>=0.0.12 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.4.0)
Requirement already satisfied: filelock in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (3.6.0)
Requirement already satisfied: importlib-metadata in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (4.11.2)
Requirement already satisfied: tokenizers<0.11,>=0.10.1 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.10.3)
Requirement already satisfied: requests in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (2.23.0)
Requirement already satisfied: regex!=2019.12.17 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (2019.12.20)
Requirement already satisfied: sacremoses in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.0.47)
Requirement already satisfied: Jinja2<3.0,>=2.10.1 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (2.11.3)
Requirement already satisfied: Werkzeug<2.0,>=0.15 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (1.0.1)
Requirement already satisfied: itsdangerous<2.0,>=0.24 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (1.1.0)
Requirement already satisfied: click<8.0,>=5.1 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (7.1.2)
Requirement already satisfied: Six in /usr/local/lib/python3.7/dist-packages (from flask-cors>=3.0.10->ratsnlp) (1.15.0)
Requirement already satisfied: aiohttp in /usr/local/lib/python3.7/dist-packages (from fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (3.8.1)
Requirement already satisfied: typing-extensions>=3.7.4.3 in /usr/local/lib/python3.7/dist-packages (from huggingface-hub>=0.0.12->transformers==4.10.0->ratsnlp) (3.10.0.2)
Requirement already satisfied: MarkupSafe>=0.23 in /usr/local/lib/python3.7/dist-packages (from Jinja2<3.0,>=2.10.1->flask>=1.1.4->ratsnlp) (2.0.1)
Requirement already satisfied: dataclasses>=0.6 in /usr/local/lib/python3.7/dist-packages (from Korpora>=0.2.0->ratsnlp) (0.6)
Requirement already satisfied: xlrd>=1.2.0 in /usr/local/lib/python3.7/dist-packages (from Korpora>=0.2.0->ratsnlp) (2.0.1)
Requirement already satisfied: pyparsing!=3.0.5,>=2.0.2 in /usr/local/lib/python3.7/dist-packages (from packaging->pytorch-lightning==1.3.4->ratsnlp) (3.0.7)
Requirement already satisfied: idna<3,>=2.5 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (2.10)
Requirement already satisfied: urllib3!=1.25.0,!=1.25.1,<1.26,>=1.21.1 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (1.24.3)
Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (2021.10.8)
Requirement already satisfied: chardet<4,>=3.0.2 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (3.0.4)
Requirement already satisfied: google-auth-oauthlib<0.5,>=0.4.1 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.4.6)
Requirement already satisfied: tensorboard-data-server<0.7.0,>=0.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.6.1)
Requirement already satisfied: setuptools>=41.0.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (57.4.0)
Requirement already satisfied: grpcio>=1.24.3 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.44.0)
Requirement already satisfied: google-auth<3,>=1.6.3 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.35.0)
Requirement already satisfied: protobuf>=3.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.17.3)
Requirement already satisfied: absl-py>=0.4 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.0.0)
Requirement already satisfied: tensorboard-plugin-wit>=1.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.8.1)
Requirement already satisfied: markdown>=2.6.8 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.3.6)
Requirement already satisfied: wheel>=0.26 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.37.1)
Requirement already satisfied: rsa<5,>=3.1.4 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (4.8)
Requirement already satisfied: pyasn1-modules>=0.2.1 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.2.8)
Requirement already satisfied: cachetools<5.0,>=2.0.0 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (4.2.4)
Requirement already satisfied: requests-oauthlib>=0.7.0 in /usr/local/lib/python3.7/dist-packages (from google-auth-oauthlib<0.5,>=0.4.1->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.3.1)
Requirement already satisfied: zipp>=0.5 in /usr/local/lib/python3.7/dist-packages (from importlib-metadata->transformers==4.10.0->ratsnlp) (3.7.0)
Requirement already satisfied: pyasn1<0.5.0,>=0.4.6 in /usr/local/lib/python3.7/dist-packages (from pyasn1-modules>=0.2.1->google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.4.8)
Requirement already satisfied: oauthlib>=3.0.0 in /usr/local/lib/python3.7/dist-packages (from requests-oauthlib>=0.7.0->google-auth-oauthlib<0.5,>=0.4.1->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.2.0)
Requirement already satisfied: attrs>=17.3.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (21.4.0)
Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.3.0)
Requirement already satisfied: yarl<2.0,>=1.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.7.2)
Requirement already satisfied: charset-normalizer<3.0,>=2.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (2.0.12)
Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.2.0)
Requirement already satisfied: async-timeout<5.0,>=4.0.0a3 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (4.0.2)
Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (6.0.2)
Requirement already satisfied: asynctest==0.13.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (0.13.0)
Requirement already satisfied: joblib in /usr/local/lib/python3.7/dist-packages (from sacremoses->transformers==4.10.0->ratsnlp) (1.1.0)
0:{"buildId":"8lJiHtAmlyU3nNFMbG8_k","rsc":["$","$1","c",{"children":[["$","div",null,{"className":"flex gap-10","children":[["$","article",null,{"className":"flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none","children":[["$","header",null,{"className":"mb-8 not-prose border-b pb-8","children":[["$","h1",null,{"className":"text-4xl font-bold mb-4","children":"[NLP] 문장 쌍 분류 모델 실전 투입"}],["$","div",null,{"className":"flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400","children":[["$","time",null,{"dateTime":"$D2022-03-23T00:00:00.000Z","children":"March 23, 2022"}],"$undefined"]}]]}],[["$","p","p-0",{"children":"자, 그럼 학습을 마친 모델을 어떻게 사용할까?"}],"\n",["$","p","p-1",{"children":"본 파일은 이기창님의 'Do it! 자연어 처리'에 기초하여 작성되었음을 미리 알려드립니다! :)"}],"\n",["$","h1","h1-0",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"학습 마친 모델을 실전 투입하기"}],"\n",["$","p","p-2",{"children":"학습을 마친 문장 쌍 분류 모델을 인퍼런스하는 과정을 실습해본다. 이번 실습에서 만드는 웹 서비스의 개념도는 아래 그림 1과 같다."}],"\n",["$","p","p-3",{"children":[["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/160080095-e1ad18ac-7b05-4b62-b7bb-42de6dfcd904.jpg","alt":"pair_classification_map"}],"\n",["$","strong","strong-0",{"children":"그림 1."}]," 문장 쌍 분류 웹 서비스"]}],"\n",["$","p","p-4",{"children":"전제와 가설 문장을 받아 답변하는 웹 서비스이다. 전제와 가설 각각을 토큰화, 인덱싱한 뒤 모델 입력값으로 만들고 이를 모델에 넣어"}],"\n",["$","p","p-5",{"children":[["$","strong","strong-0",{"children":"[전제에 대해 가설이 참일 확률, 전제에 대해 가설이 거짓일 확률, 전제에 대해 가설이 중립일 확률]"}],"\n을 계산한다."]}],"\n",["$","p","p-6",{"children":"이후 약간의 후처리 과정을 거쳐 응답하는 방식이다."}],"\n",["$","h1","h1-1",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"전제와 가설을 검증하는 웹 서비스 만들기"}],"\n",["$","h2","h2-0",{"id":"1","className":"text-2xl font-bold mt-8 mb-4","children":"1. 환경 설정하기"}],"\n",["$","h3","h3-0",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"의존성 패키지 설치"}],"\n",["$","p","p-7",{"children":"pip 명령어를 통해 의존성있는 패키지를 설치한다."}],"\n",["$","h4","h4-0",{"children":"code 4-0"}],"\n",["$","pre","pre-0",{"children":["$","code","code-0",{"className":"hljs language-python","children":"!pip install ratsnlp\n"}]}],"\n",["$","pre","pre-1",{"children":["$","code","code-0",{"children":"$2"}]}],"\n","$L3","\n","$L4","\n","$L5","\n","$L6","\n","$L7","\n","$L8","\n","$L9","\n","$La","\n","$Lb","\n","$Lc","\n","$Ld","\n","$Le","\n","$Lf","\n","$L10","\n","$L11","\n","$L12","\n","$L13","\n","$L14","\n","$L15","\n","$L16","\n","$L17","\n","$L18","\n","$L19","\n","$L1a","\n","$L1b","\n","$L1c","\n","$L1d","\n","$L1e","\n","$L1f","\n","$L20","\n","$L21","\n","$L22","\n","$L23","\n","$L24","\n","$L25","\n","$L26","\n","$L27","\n","$L28","\n","$L29","\n","$L2a","\n","$L2b","\n","$L2c","\n","$L2d","\n","$L2e","\n","$L2f","\n","$L30","\n","$L31","\n","$L32","\n","$L33","\n","$L34","\n","$L35","\n","$L36","\n","$L37","\n","$L38","\n","$L39","\n","$L3a","\n","$L3b"],"$L3c"]}],"$L3d"]}],["$L3e","$L3f"],"$L40"]}],"loading":null,"isPartial":false}
3:["$","h3","h3-1",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"구글 드라이브 연동"}]
4:["$","p","p-8",{"children":"학습한 모델의 체크포인트는 구글 드라이브에 저장해 두었으므로, code 4-1을 실행하여 코랩 노트북과 자신의 구글 드라이브를 연동한다."}]
5:["$","h4","h4-1",{"children":"code 4-1"}]
6:["$","pre","pre-2",{"children":["$","code","code-0",{"className":"hljs language-python","children":[["$","span","span-0",{"className":"hljs-keyword","children":"from"}]," google.colab ",["$","span","span-1",{"className":"hljs-keyword","children":"import"}]," drive\ndrive.mount(",["$","span","span-2",{"className":"hljs-string","children":"'/gdrive'"}],", force_remount=",["$","span","span-3",{"className":"hljs-literal","children":"True"}],")\n"]}]}]
7:["$","pre","pre-3",{"children":["$","code","code-0",{"children":"Mounted at /gdrive\n"}]}]
8:["$","h3","h3-2",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"인퍼런스 설정"}]
9:["$","p","p-9",{"children":["각종 인퍼런스 설정을 수행한다. ",["$","code","code-0",{"children":"pretrained_model_name"}],"과 ",["$","code","code-1",{"children":"max_seq_length"}],", ",["$","code","code-2",{"children":"downstream_model_dir"}]," 모두 앞 트레인에서 적용한 그대로 입력하여야 한다."]}]
a:["$","h4","h4-2",{"children":"code 4-2"}]
b:["$","pre","pre-4",{"children":["$","code","code-0",{"className":"hljs language-python","children":[["$","span","span-0",{"className":"hljs-keyword","children":"from"}]," ratsnlp.nlpbook.classification ",["$","span","span-1",{"className":"hljs-keyword","children":"import"}]," ClassificationDeployArguments\nargs = ClassificationDeployArguments(\n    pretrained_model_name=",["$","span","span-2",{"className":"hljs-string","children":"\"beomi/kcbert-base\""}],",\n    downstream_model_dir=",["$","span","span-3",{"className":"hljs-string","children":"\"/gdrive/My Drive/nlpbook/checkpoint-paircls\""}],",\n    max_seq_length=",["$","span","span-4",{"className":"hljs-number","children":"64"}],",\n)\n"]}]}]
c:["$","pre","pre-5",{"children":["$","code","code-0",{"children":"downstream_model_checkpoint_fpath: /gdrive/My Drive/nlpbook/checkpoint-paircls/epoch=1-val_loss=0.82.ckpt\n"}]}]
d:["$","h2","h2-1",{"id":"2","className":"text-2xl font-bold mt-8 mb-4","children":"2. 토크나이저 및 모델 불러오기"}]
e:["$","h3","h3-3",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"토크나이저 로드"}]
f:["$","p","p-10",{"children":"code 4-3을 실행해 토크나이저를 초기화한다."}]
10:["$","h4","h4-3",{"children":"code 4-3"}]
11:["$","pre","pre-6",{"children":["$","code","code-0",{"className":"hljs language-python","children":[["$","span","span-0",{"className":"hljs-keyword","children":"from"}]," transformers ",["$","span","span-1",{"className":"hljs-keyword","children":"import"}]," BertTokenizer\ntokenizer = BertTokenizer.from_pretrained(\n    args.pretrained_model_name,\n    do_lower_case=",["$","span","span-2",{"className":"hljs-literal","children":"False"}],",\n)\n"]}]}]
12:["$","h3","h3-4",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"체크포인트 로드"}]
13:["$","p","p-11",{"children":["code 4-4는 ",["$","code","code-0",{"children":"pair_classification_train.ipynb"}],"에서 파인튜닝한 모델의 체크포인트를 읽어 들인다."]}]
14:["$","h4","h4-4",{"children":"code 4-4"}]
15:["$","pre","pre-7",{"children":["$","code","code-0",{"className":"hljs language-python","children":[["$","span","span-0",{"className":"hljs-keyword","children":"import"}]," torch\nfine_tuned_model_ckpt = torch.load(\n    args.downstream_model_checkpoint_fpath,\n    map_location=torch.device(",["$","span","span-1",{"className":"hljs-string","children":"\"cpu\""}],"),\n)\n"]}]}]
16:["$","h3","h3-5",{"id":"b","className":"text-xl font-bold mt-6 mb-3","children":"BERT 설정 로드 및 BERT 모델 초기화"}]
17:["$","p","p-12",{"children":["code 4-5는 ",["$","code","code-0",{"children":"pair_classification_train.ipynb"}],"의 파인튜닝 때 사용한 ",["$","code","code-1",{"children":"pretrained_model_name"}],"에 해당하는 모델의 설정값들을 읽어들이며, code 4-6을 실행하면 해당 값대로 BERT 모델을 초기화 한다."]}]
18:["$","h4","h4-5",{"children":"code 4-5"}]
19:["$","pre","pre-8",{"children":["$","code","code-0",{"className":"hljs language-python","children":[["$","span","span-0",{"className":"hljs-keyword","children":"from"}]," transformers ",["$","span","span-1",{"className":"hljs-keyword","children":"import"}]," BertConfig\npretrained_model_config = BertConfig.from_pretrained(\n    args.pretrained_model_name,\n    num_labels=fine_tuned_model_ckpt[",["$","span","span-2",{"className":"hljs-string","children":"'state_dict'"}],"][",["$","span","span-3",{"className":"hljs-string","children":"'model.classifier.bias'"}],"].shape.numel(),\n)\n"]}]}]
1a:["$","h4","h4-6",{"children":"code 4-6"}]
1b:["$","pre","pre-9",{"children":["$","code","code-0",{"className":"hljs language-python","children":[["$","span","span-0",{"className":"hljs-keyword","children":"from"}]," transformers ",["$","span","span-1",{"className":"hljs-keyword","children":"import"}]," BertForSequenceClassification\nmodel = BertForSequenceClassification(pretrained_model_config)\n"]}]}]
1c:["$","h3","h3-6",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"체크포인트 주입하기"}]
1d:["$","p","p-13",{"children":["code 4-7은 초기화한 ",["$","strong","strong-0",{"children":"BERT"}],"모델에 code 4-4의 체크포인트를 주입한다"]}]
1e:["$","h4","h4-7",{"children":"code 4-7"}]
1f:["$","pre","pre-10",{"children":["$","code","code-0",{"className":"hljs language-python","children":["model.load_state_dict({k.replace(",["$","span","span-0",{"className":"hljs-string","children":"\"model.\""}],",",["$","span","span-1",{"className":"hljs-string","children":"\"\""}],"): v ",["$","span","span-2",{"className":"hljs-keyword","children":"for"}]," k, v ",["$","span","span-3",{"className":"hljs-keyword","children":"in"}]," fine_tuned_model_ckpt[",["$","span","span-4",{"className":"hljs-string","children":"'state_dict'"}],"].items()})\n"]}]}]
20:["$","pre","pre-11",{"children":["$","code","code-0",{"children":"<All keys matched successfully>\n"}]}]
21:["$","h3","h3-7",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"평가 모드로 전환"}]
22:["$","p","p-14",{"children":["이어서 code 4-8을 실행하면 모델이 평가모드로 전환되게 된다. ",["$","strong","strong-0",{"children":"드롭아웃 등 학습 때만 사용하는 기법들을 무효화하는 역할"}],"을 한다."]}]
23:["$","h4","h4-8",{"children":"code 4-8"}]
24:["$","pre","pre-12",{"children":["$","code","code-0",{"className":"hljs language-python","children":["model.",["$","span","span-0",{"className":"hljs-built_in","children":"eval"}],"()\n"]}]}]
41:T348e,BertForSequenceClassification(
  (bert): BertModel(
    (embeddings): BertEmbeddings(
      (word_embeddings): Embedding(30000, 768, padding_idx=0)
      (position_embeddings): Embedding(300, 768)
      (token_type_embeddings): Embedding(2, 768)
      (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
      (dropout): Dropout(p=0.1, inplace=False)
    )
    (encoder): BertEncoder(
      (layer): ModuleList(
        (0): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
        (1): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
        (2): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
        (3): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
        (4): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
        (5): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
        (6): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
        (7): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
        (8): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
        (9): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
        (10): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
        (11): BertLayer(
          (attention): BertAttention(
            (self): BertSelfAttention(
              (query): Linear(in_features=768, out_features=768, bias=True)
              (key): Linear(in_features=768, out_features=768, bias=True)
              (value): Linear(in_features=768, out_features=768, bias=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
            (output): BertSelfOutput(
              (dense): Linear(in_features=768, out_features=768, bias=True)
              (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
              (dropout): Dropout(p=0.1, inplace=False)
            )
          )
          (intermediate): BertIntermediate(
            (dense): Linear(in_features=768, out_features=3072, bias=True)
          )
          (output): BertOutput(
            (dense): Linear(in_features=3072, out_features=768, bias=True)
            (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
            (dropout): Dropout(p=0.1, inplace=False)
          )
        )
      )
    )
    (pooler): BertPooler(
      (dense): Linear(in_features=768, out_features=768, bias=True)
      (activation): Tanh()
    )
  )
  (dropout): Dropout(p=0.1, inplace=False)
  (classifier): Linear(in_features=768, out_features=3, bias=True)
)
25:["$","pre","pre-13",{"children":["$","code","code-0",{"children":"$41"}]}]
26:["$","h2","h2-2",{"id":"3","className":"text-2xl font-bold mt-8 mb-4","children":"3. 모델 출력값 만들고 후처리 하기"}]
27:["$","p","p-15",{"children":["code 4-9는 ",["$","strong","strong-0",{"children":"인퍼런스 과정을 정의한 함수"}],"이다. 전제(premise)와 가설(hypothesis)을 입력받아 각각 토큰화, 인덱싱을 수행한 뒤 ",["$","code","code-0",{"children":"input_ids"}],", ",["$","code","code-1",{"children":"attention_mask"}],", ",["$","code","code-2",{"children":"token_type_ids"}],"를 만든다. 이들 압력값을 파이토치 텐서 자료형으로 변환한 뒤 모델에 입력한다."]}]
28:["$","h3","h3-8",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"인퍼런스 함수"}]
29:["$","h4","h4-9",{"children":"code 4-9"}]
2a:["$","pre","pre-14",{"children":["$","code","code-0",{"className":"hljs language-python","children":[["$","span","span-0",{"className":"hljs-keyword","children":"def"}]," ",["$","span","span-1",{"className":"hljs-title function_","children":"inference_fn"}],"(",["$","span","span-2",{"className":"hljs-params","children":"premise, hypothesis"}],"):\n  ",["$","span","span-3",{"className":"hljs-comment","children":"# 전제와 가설을 모델 입력값으로 만들기"}],"\n  inputs = tokenizer(\n      [(premise, hypothesis)],\n      max_length=args.max_seq_length,\n      padding=",["$","span","span-4",{"className":"hljs-string","children":"\"max_length\""}],",\n      truncation=",["$","span","span-5",{"className":"hljs-literal","children":"True"}],",\n  )\n  ",["$","span","span-6",{"className":"hljs-keyword","children":"with"}]," torch.no_grad():\n    ",["$","span","span-7",{"className":"hljs-comment","children":"# 모델 계산하기"}],"\n    outputs = model(**{k: torch.tensor(v) ",["$","span","span-8",{"className":"hljs-keyword","children":"for"}]," k, v ",["$","span","span-9",{"className":"hljs-keyword","children":"in"}]," inputs.items()})  ",["$","span","span-10",{"className":"hljs-comment","children":"# {}안 = inputs를 파이토치 텐서로 바꾸기"}],"\n\n    ",["$","span","span-11",{"className":"hljs-comment","children":"# 로짓에 소프트맥스 취하기"}],"\n    prob = outputs.logits.softmax(dim=",["$","span","span-12",{"className":"hljs-number","children":"1"}],")\n\n    ",["$","span","span-13",{"className":"hljs-comment","children":"# 확률을 소수점 두 자리에서 반올림"}],"\n    entailment_prob = ",["$","span","span-14",{"className":"hljs-built_in","children":"round"}],"(prob[",["$","span","span-15",{"className":"hljs-number","children":"0"}],"][",["$","span","span-16",{"className":"hljs-number","children":"0"}],"].item(), ",["$","span","span-17",{"className":"hljs-number","children":"2"}],")\n    contradiction_prob = ",["$","span","span-18",{"className":"hljs-built_in","children":"round"}],"(prob[",["$","span","span-19",{"className":"hljs-number","children":"0"}],"][",["$","span","span-20",{"className":"hljs-number","children":"1"}],"].item(), ",["$","span","span-21",{"className":"hljs-number","children":"2"}],")\n    neutral_prob = ",["$","span","span-22",{"className":"hljs-built_in","children":"round"}],"(prob[",["$","span","span-23",{"className":"hljs-number","children":"0"}],"][",["$","span","span-24",{"className":"hljs-number","children":"2"}],"].item(), ",["$","span","span-25",{"className":"hljs-number","children":"2"}],")\n\n    ",["$","span","span-26",{"className":"hljs-comment","children":"# 예측 확률의 최댓값 위치에 따라 pred 만들기"}],"\n    ",["$","span","span-27",{"className":"hljs-keyword","children":"if"}]," torch.argmax(prob) == ",["$","span","span-28",{"className":"hljs-number","children":"0"}],":\n      pred = ",["$","span","span-29",{"className":"hljs-string","children":"\"참 (entailment)\""}],"\n    ",["$","span","span-30",{"className":"hljs-keyword","children":"elif"}]," torch.argmax(prob) == ",["$","span","span-31",{"className":"hljs-number","children":"1"}],":\n      pred = ",["$","span","span-32",{"className":"hljs-string","children":"\"거짓 (contradiction)\""}],"\n    ",["$","span","span-33",{"className":"hljs-keyword","children":"else"}],":\n      pred = ",["$","span","span-34",{"className":"hljs-string","children":"\"중립 (neutral)\""}],"\n  \n  ",["$","span","span-35",{"className":"hljs-keyword","children":"return"}]," {\n      ",["$","span","span-36",{"className":"hljs-string","children":"'premise'"}],": premise,\n      ",["$","span","span-37",{"className":"hljs-string","children":"'hypothesis'"}],": hypothesis,\n      ",["$","span","span-38",{"className":"hljs-string","children":"'prediction'"}],": pred,\n      ",["$","span","span-39",{"className":"hljs-string","children":"'entailment_data'"}],": ",["$","span","span-40",{"className":"hljs-string","children":["f\"참 ",["$","span","span-0",{"className":"hljs-subst","children":"{entailment_prob}"}],"\""]}],",\n      ",["$","span","span-41",{"className":"hljs-string","children":"'contradiction_data'"}],": ",["$","span","span-42",{"className":"hljs-string","children":["f\"거짓 ",["$","span","span-0",{"className":"hljs-subst","children":"{contradiction_prob}"}],"\""]}],",\n      ",["$","span","span-43",{"className":"hljs-string","children":"'neutral_data'"}],": ","$L42",",\n      ","$L43",": ","$L44",",\n      ","$L45",": ","$L46",",\n      ","$L47",": ","$L48","\n  }\n"]}]}]
2b:["$","p","p-16",{"children":["**모델 출력값(",["$","code","code-0",{"children":"output.logits"}],")**은 소프트맥스 함수 적용 이전의 로짓 형태이다. 여기에 소프트맥스 함수를 써서 모델 출력을 확률 형태로 바꾼다. 그리고 약간 후처리하여 예측 확률의 최댓값이 참 위치(0)일 경우 해당 문장이 '",["$","strong","strong-0",{"children":"참 (entailment)"}],"', 거짓 위치(1)일 경우 '",["$","strong","strong-1",{"children":"거짓 (contradiction)"}],"', 중립 위치(2)일 경우 '",["$","strong","strong-2",{"children":"중립 (neutral)"}],"'이 되도록 pred 값을 만든다."]}]
2c:["$","p","p-17",{"children":["code 4-9에서 ",["$","code","code-0",{"children":"entailment_width"}],", ",["$","code","code-1",{"children":"contradiction_width"}],", ",["$","code","code-2",{"children":"neutral_width"}],"는 웹 페이지에서 참, 거짓, 중립 막대 길이를 조정하는 정보이므로 크게 신경 쓰지 않아도 된다."]}]
2d:["$","h2","h2-3",{"id":"4","className":"text-2xl font-bold mt-8 mb-4","children":"4. 웹 서비스 시작하기"}]
2e:["$","h3","h3-9",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"웹 서비스 만들기 준비"}]
2f:["$","p","p-18",{"children":[["$","code","code-0",{"children":"ngrok"}],"은 코랩 로컬에서 실행 중인 웹서비스를 안전하게 외부에서 접근 가능하도록 해주는 도구이다. ",["$","code","code-1",{"children":"ngrok"}],"을 실행하려면 ",["$","a","a-0",{"href":"https://dashboard.ngrok.com/get-started/setup","children":"회원가입"}]," 후 ",["$","a","a-1",{"href":"https://dashboard.ngrok.com/get-started/setup","children":"로그인"}],"을 한 뒤 ",["$","a","a-2",{"href":"https://dashboard.ngrok.com/get-started/your-authtoken","children":"이곳"}],"에 접속해 인증토큰(authtoken)을 확인해야 한다."]}]
30:["$","p","p-19",{"children":["예를 들어 확인된 ",["$","code","code-0",{"children":"authtoken"}],"이 ",["$","code","code-1",{"children":"test123"}],"이라면 다음과 같이 실행 된다."]}]
31:["$","p","p-20",{"children":"** !mkdir /root/.ngrok2 && echo \"authtoken: test123\" > /root/.ngrok2/ngrok.yml**"}]
32:["$","h4","h4-10",{"children":"code 4-10"}]
33:["$","pre","pre-15",{"children":["$","code","code-0",{"className":"hljs language-python","children":["!mkdir /root/.ngrok2 && echo ",["$","span","span-0",{"className":"hljs-string","children":"\"authtoken: (여기 채우세요)\""}]," > /root/.ngrok2/ngrok.yml\n"]}]}]
34:["$","pre","pre-16",{"children":["$","code","code-0",{"children":"mkdir: cannot create directory ‘/root/.ngrok2’: File exists\n"}]}]
35:["$","h3","h3-10",{"id":"","className":"text-xl font-bold mt-6 mb-3","children":"웹 서비스 시작하기"}]
36:["$","p","p-21",{"children":["code 4-9에서 정의한 인퍼런스 함수 ",["$","code","code-0",{"children":"inference_fn"}],"을 가지고 code 4-11을 실행하면 웹 서비스를 띄울 수 있다. 파이썬의 플라스크를 활용한 앱이다."]}]
37:["$","h4","h4-11",{"children":"code 4-11"}]
38:["$","pre","pre-17",{"children":["$","code","code-0",{"className":"hljs language-python","children":[["$","span","span-0",{"className":"hljs-keyword","children":"from"}]," ratsnlp.nlpbook.paircls ",["$","span","span-1",{"className":"hljs-keyword","children":"import"}]," get_web_service_app\napp = get_web_service_app(inference_fn)\napp.run()\n"]}]}]
39:["$","pre","pre-18",{"children":["$","code","code-0",{"children":" * Serving Flask app \"ratsnlp.nlpbook.paircls.deploy\" (lazy loading)\n * Environment: production\n\u001b[31m   WARNING: This is a development server. Do not use it in a production deployment.\u001b[0m\n\u001b[2m   Use a production WSGI server instead.\u001b[0m\n * Debug mode: off\n\n\n * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)\n\n\n * Running on http://0163-35-238-180-140.ngrok.io\n * Traffic stats available on http://127.0.0.1:4040\n\n\n127.0.0.1 - - [04/Mar/2022 09:14:48] \"\u001b[37mGET / HTTP/1.1\u001b[0m\" 200 -\n127.0.0.1 - - [04/Mar/2022 09:14:49] \"\u001b[33mGET /favicon.ico HTTP/1.1\u001b[0m\" 404 -\n127.0.0.1 - - [04/Mar/2022 09:14:49] \"\u001b[37mGET / HTTP/1.1\u001b[0m\" 200 -\n127.0.0.1 - - [04/Mar/2022 09:15:01] \"\u001b[37mPOST /api HTTP/1.1\u001b[0m\" 200 -\n"}]}]
3a:["$","h1","h1-2",{"id":"","className":"text-3xl font-bold mt-8 mb-4","children":"웹사이트 형태는 다음과 같다."}]
3b:["$","p","p-22",{"children":["$","img","img-0",{"src":"https://user-images.githubusercontent.com/84653623/160079951-83a22799-e4d8-4254-845b-61b55a1ec40d.png","alt":"pair_classification"}]}]
3c:["$","$L49",null,{}]
4b:T82c0,
자, 그럼 학습을 마친 모델을 어떻게 사용할까?

본 파일은 이기창님의 'Do it! 자연어 처리'에 기초하여 작성되었음을 미리 알려드립니다! :)

# 학습 마친 모델을 실전 투입하기

학습을 마친 문장 쌍 분류 모델을 인퍼런스하는 과정을 실습해본다. 이번 실습에서 만드는 웹 서비스의 개념도는 아래 그림 1과 같다.

![pair_classification_map](https://user-images.githubusercontent.com/84653623/160080095-e1ad18ac-7b05-4b62-b7bb-42de6dfcd904.jpg)
**그림 1.** 문장 쌍 분류 웹 서비스

전제와 가설 문장을 받아 답변하는 웹 서비스이다. 전제와 가설 각각을 토큰화, 인덱싱한 뒤 모델 입력값으로 만들고 이를 모델에 넣어 

**[전제에 대해 가설이 참일 확률, 전제에 대해 가설이 거짓일 확률, 전제에 대해 가설이 중립일 확률]**
을 계산한다.

이후 약간의 후처리 과정을 거쳐 응답하는 방식이다.

# 전제와 가설을 검증하는 웹 서비스 만들기

## 1. 환경 설정하기

### 의존성 패키지 설치

pip 명령어를 통해 의존성있는 패키지를 설치한다.

#### code 4-0


```python
!pip install ratsnlp
```

    Requirement already satisfied: ratsnlp in /usr/local/lib/python3.7/dist-packages (1.0.1)
    Requirement already satisfied: transformers==4.10.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (4.10.0)
    Requirement already satisfied: Korpora>=0.2.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (0.2.0)
    Requirement already satisfied: flask>=1.1.4 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.1.4)
    Requirement already satisfied: flask-cors>=3.0.10 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (3.0.10)
    Requirement already satisfied: torch>=1.9.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.10.0+cu111)
    Requirement already satisfied: flask-ngrok>=0.0.25 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (0.0.25)
    Requirement already satisfied: pytorch-lightning==1.3.4 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.3.4)
    Requirement already satisfied: future>=0.17.1 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.18.2)
    Requirement already satisfied: tensorboard!=2.5.0,>=2.2.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (2.8.0)
    Requirement already satisfied: fsspec[http]>=2021.4.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (2022.2.0)
    Requirement already satisfied: packaging in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (21.3)
    Requirement already satisfied: torchmetrics>=0.2.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.7.2)
    Requirement already satisfied: numpy>=1.17.2 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (1.21.5)
    Requirement already satisfied: pyDeprecate==0.3.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.3.0)
    Requirement already satisfied: tqdm>=4.41.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (4.63.0)
    Requirement already satisfied: PyYAML<=5.4.1,>=5.1 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (5.4.1)
    Requirement already satisfied: huggingface-hub>=0.0.12 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.4.0)
    Requirement already satisfied: filelock in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (3.6.0)
    Requirement already satisfied: importlib-metadata in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (4.11.2)
    Requirement already satisfied: tokenizers<0.11,>=0.10.1 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.10.3)
    Requirement already satisfied: requests in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (2.23.0)
    Requirement already satisfied: regex!=2019.12.17 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (2019.12.20)
    Requirement already satisfied: sacremoses in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.0.47)
    Requirement already satisfied: Jinja2<3.0,>=2.10.1 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (2.11.3)
    Requirement already satisfied: Werkzeug<2.0,>=0.15 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (1.0.1)
    Requirement already satisfied: itsdangerous<2.0,>=0.24 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (1.1.0)
    Requirement already satisfied: click<8.0,>=5.1 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (7.1.2)
    Requirement already satisfied: Six in /usr/local/lib/python3.7/dist-packages (from flask-cors>=3.0.10->ratsnlp) (1.15.0)
    Requirement already satisfied: aiohttp in /usr/local/lib/python3.7/dist-packages (from fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (3.8.1)
    Requirement already satisfied: typing-extensions>=3.7.4.3 in /usr/local/lib/python3.7/dist-packages (from huggingface-hub>=0.0.12->transformers==4.10.0->ratsnlp) (3.10.0.2)
    Requirement already satisfied: MarkupSafe>=0.23 in /usr/local/lib/python3.7/dist-packages (from Jinja2<3.0,>=2.10.1->flask>=1.1.4->ratsnlp) (2.0.1)
    Requirement already satisfied: dataclasses>=0.6 in /usr/local/lib/python3.7/dist-packages (from Korpora>=0.2.0->ratsnlp) (0.6)
    Requirement already satisfied: xlrd>=1.2.0 in /usr/local/lib/python3.7/dist-packages (from Korpora>=0.2.0->ratsnlp) (2.0.1)
    Requirement already satisfied: pyparsing!=3.0.5,>=2.0.2 in /usr/local/lib/python3.7/dist-packages (from packaging->pytorch-lightning==1.3.4->ratsnlp) (3.0.7)
    Requirement already satisfied: idna<3,>=2.5 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (2.10)
    Requirement already satisfied: urllib3!=1.25.0,!=1.25.1,<1.26,>=1.21.1 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (1.24.3)
    Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (2021.10.8)
    Requirement already satisfied: chardet<4,>=3.0.2 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (3.0.4)
    Requirement already satisfied: google-auth-oauthlib<0.5,>=0.4.1 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.4.6)
    Requirement already satisfied: tensorboard-data-server<0.7.0,>=0.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.6.1)
    Requirement already satisfied: setuptools>=41.0.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (57.4.0)
    Requirement already satisfied: grpcio>=1.24.3 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.44.0)
    Requirement already satisfied: google-auth<3,>=1.6.3 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.35.0)
    Requirement already satisfied: protobuf>=3.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.17.3)
    Requirement already satisfied: absl-py>=0.4 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.0.0)
    Requirement already satisfied: tensorboard-plugin-wit>=1.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.8.1)
    Requirement already satisfied: markdown>=2.6.8 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.3.6)
    Requirement already satisfied: wheel>=0.26 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.37.1)
    Requirement already satisfied: rsa<5,>=3.1.4 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (4.8)
    Requirement already satisfied: pyasn1-modules>=0.2.1 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.2.8)
    Requirement already satisfied: cachetools<5.0,>=2.0.0 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (4.2.4)
    Requirement already satisfied: requests-oauthlib>=0.7.0 in /usr/local/lib/python3.7/dist-packages (from google-auth-oauthlib<0.5,>=0.4.1->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.3.1)
    Requirement already satisfied: zipp>=0.5 in /usr/local/lib/python3.7/dist-packages (from importlib-metadata->transformers==4.10.0->ratsnlp) (3.7.0)
    Requirement already satisfied: pyasn1<0.5.0,>=0.4.6 in /usr/local/lib/python3.7/dist-packages (from pyasn1-modules>=0.2.1->google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.4.8)
    Requirement already satisfied: oauthlib>=3.0.0 in /usr/local/lib/python3.7/dist-packages (from requests-oauthlib>=0.7.0->google-auth-oauthlib<0.5,>=0.4.1->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.2.0)
    Requirement already satisfied: attrs>=17.3.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (21.4.0)
    Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.3.0)
    Requirement already satisfied: yarl<2.0,>=1.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.7.2)
    Requirement already satisfied: charset-normalizer<3.0,>=2.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (2.0.12)
    Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.2.0)
    Requirement already satisfied: async-timeout<5.0,>=4.0.0a3 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (4.0.2)
    Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (6.0.2)
    Requirement already satisfied: asynctest==0.13.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (0.13.0)
    Requirement already satisfied: joblib in /usr/local/lib/python3.7/dist-packages (from sacremoses->transformers==4.10.0->ratsnlp) (1.1.0)
    

### 구글 드라이브 연동

학습한 모델의 체크포인트는 구글 드라이브에 저장해 두었으므로, code 4-1을 실행하여 코랩 노트북과 자신의 구글 드라이브를 연동한다.

#### code 4-1


```python
from google.colab import drive
drive.mount('/gdrive', force_remount=True)
```

    Mounted at /gdrive
    

### 인퍼런스 설정

각종 인퍼런스 설정을 수행한다. `pretrained_model_name`과 `max_seq_length`, `downstream_model_dir` 모두 앞 트레인에서 적용한 그대로 입력하여야 한다.

#### code 4-2


```python
from ratsnlp.nlpbook.classification import ClassificationDeployArguments
args = ClassificationDeployArguments(
    pretrained_model_name="beomi/kcbert-base",
    downstream_model_dir="/gdrive/My Drive/nlpbook/checkpoint-paircls",
    max_seq_length=64,
)
```

    downstream_model_checkpoint_fpath: /gdrive/My Drive/nlpbook/checkpoint-paircls/epoch=1-val_loss=0.82.ckpt
    

## 2. 토크나이저 및 모델 불러오기

### 토크나이저 로드

code 4-3을 실행해 토크나이저를 초기화한다.

#### code 4-3


```python
from transformers import BertTokenizer
tokenizer = BertTokenizer.from_pretrained(
    args.pretrained_model_name,
    do_lower_case=False,
)
```

### 체크포인트 로드

code 4-4는 `pair_classification_train.ipynb`에서 파인튜닝한 모델의 체크포인트를 읽어 들인다.

#### code 4-4


```python
import torch
fine_tuned_model_ckpt = torch.load(
    args.downstream_model_checkpoint_fpath,
    map_location=torch.device("cpu"),
)
```

### BERT 설정 로드 및 BERT 모델 초기화

code 4-5는 `pair_classification_train.ipynb`의 파인튜닝 때 사용한 `pretrained_model_name`에 해당하는 모델의 설정값들을 읽어들이며, code 4-6을 실행하면 해당 값대로 BERT 모델을 초기화 한다.

#### code 4-5


```python
from transformers import BertConfig
pretrained_model_config = BertConfig.from_pretrained(
    args.pretrained_model_name,
    num_labels=fine_tuned_model_ckpt['state_dict']['model.classifier.bias'].shape.numel(),
)
```

#### code 4-6


```python
from transformers import BertForSequenceClassification
model = BertForSequenceClassification(pretrained_model_config)
```

### 체크포인트 주입하기

code 4-7은 초기화한 **BERT**모델에 code 4-4의 체크포인트를 주입한다

#### code 4-7


```python
model.load_state_dict({k.replace("model.",""): v for k, v in fine_tuned_model_ckpt['state_dict'].items()})
```




    <All keys matched successfully>



### 평가 모드로 전환

이어서 code 4-8을 실행하면 모델이 평가모드로 전환되게 된다. **드롭아웃 등 학습 때만 사용하는 기법들을 무효화하는 역할**을 한다.

#### code 4-8


```python
model.eval()
```




    BertForSequenceClassification(
      (bert): BertModel(
        (embeddings): BertEmbeddings(
          (word_embeddings): Embedding(30000, 768, padding_idx=0)
          (position_embeddings): Embedding(300, 768)
          (token_type_embeddings): Embedding(2, 768)
          (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
          (dropout): Dropout(p=0.1, inplace=False)
        )
        (encoder): BertEncoder(
          (layer): ModuleList(
            (0): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
            (1): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
            (2): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
            (3): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
            (4): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
            (5): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
            (6): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
            (7): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
            (8): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
            (9): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
            (10): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
            (11): BertLayer(
              (attention): BertAttention(
                (self): BertSelfAttention(
                  (query): Linear(in_features=768, out_features=768, bias=True)
                  (key): Linear(in_features=768, out_features=768, bias=True)
                  (value): Linear(in_features=768, out_features=768, bias=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
                (output): BertSelfOutput(
                  (dense): Linear(in_features=768, out_features=768, bias=True)
                  (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                  (dropout): Dropout(p=0.1, inplace=False)
                )
              )
              (intermediate): BertIntermediate(
                (dense): Linear(in_features=768, out_features=3072, bias=True)
              )
              (output): BertOutput(
                (dense): Linear(in_features=3072, out_features=768, bias=True)
                (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True)
                (dropout): Dropout(p=0.1, inplace=False)
              )
            )
          )
        )
        (pooler): BertPooler(
          (dense): Linear(in_features=768, out_features=768, bias=True)
          (activation): Tanh()
        )
      )
      (dropout): Dropout(p=0.1, inplace=False)
      (classifier): Linear(in_features=768, out_features=3, bias=True)
    )



## 3. 모델 출력값 만들고 후처리 하기

code 4-9는 **인퍼런스 과정을 정의한 함수**이다. 전제(premise)와 가설(hypothesis)을 입력받아 각각 토큰화, 인덱싱을 수행한 뒤 `input_ids`, `attention_mask`, `token_type_ids`를 만든다. 이들 압력값을 파이토치 텐서 자료형으로 변환한 뒤 모델에 입력한다.

### 인퍼런스 함수

#### code 4-9


```python
def inference_fn(premise, hypothesis):
  # 전제와 가설을 모델 입력값으로 만들기
  inputs = tokenizer(
      [(premise, hypothesis)],
      max_length=args.max_seq_length,
      padding="max_length",
      truncation=True,
  )
  with torch.no_grad():
    # 모델 계산하기
    outputs = model(**{k: torch.tensor(v) for k, v in inputs.items()})  # {}안 = inputs를 파이토치 텐서로 바꾸기

    # 로짓에 소프트맥스 취하기
    prob = outputs.logits.softmax(dim=1)

    # 확률을 소수점 두 자리에서 반올림
    entailment_prob = round(prob[0][0].item(), 2)
    contradiction_prob = round(prob[0][1].item(), 2)
    neutral_prob = round(prob[0][2].item(), 2)

    # 예측 확률의 최댓값 위치에 따라 pred 만들기
    if torch.argmax(prob) == 0:
      pred = "참 (entailment)"
    elif torch.argmax(prob) == 1:
      pred = "거짓 (contradiction)"
    else:
      pred = "중립 (neutral)"
  
  return {
      'premise': premise,
      'hypothesis': hypothesis,
      'prediction': pred,
      'entailment_data': f"참 {entailment_prob}",
      'contradiction_data': f"거짓 {contradiction_prob}",
      'neutral_data': f"중립 {neutral_prob}",
      'entailment_width': f"{entailment_prob * 100}%",
      'contradiction_width': f"{contradiction_prob * 100}%",
      'neutral_width': f"{neutral_prob * 100}%"
  }
```

**모델 출력값(`output.logits`)**은 소프트맥스 함수 적용 이전의 로짓 형태이다. 여기에 소프트맥스 함수를 써서 모델 출력을 확률 형태로 바꾼다. 그리고 약간 후처리하여 예측 확률의 최댓값이 참 위치(0)일 경우 해당 문장이 '**참 (entailment)**', 거짓 위치(1)일 경우 '**거짓 (contradiction)**', 중립 위치(2)일 경우 '**중립 (neutral)**'이 되도록 pred 값을 만든다.

code 4-9에서 `entailment_width`, `contradiction_width`, `neutral_width`는 웹 페이지에서 참, 거짓, 중립 막대 길이를 조정하는 정보이므로 크게 신경 쓰지 않아도 된다.

## 4. 웹 서비스 시작하기

### 웹 서비스 만들기 준비

`ngrok`은 코랩 로컬에서 실행 중인 웹서비스를 안전하게 외부에서 접근 가능하도록 해주는 도구이다. `ngrok`을 실행하려면 [회원가입](https://dashboard.ngrok.com/get-started/setup) 후 [로그인](https://dashboard.ngrok.com/get-started/setup)을 한 뒤 [이곳](https://dashboard.ngrok.com/get-started/your-authtoken)에 접속해 인증토큰(authtoken)을 확인해야 한다. 

예를 들어 확인된 `authtoken`이 `test123`이라면 다음과 같이 실행 된다.

** !mkdir /root/.ngrok2 && echo "authtoken: test123" > /root/.ngrok2/ngrok.yml**

#### code 4-10


```python
!mkdir /root/.ngrok2 && echo "authtoken: (여기 채우세요)" > /root/.ngrok2/ngrok.yml
```

    mkdir: cannot create directory ‘/root/.ngrok2’: File exists
    

### 웹 서비스 시작하기

code 4-9에서 정의한 인퍼런스 함수 `inference_fn`을 가지고 code 4-11을 실행하면 웹 서비스를 띄울 수 있다. 파이썬의 플라스크를 활용한 앱이다.

#### code 4-11


```python
from ratsnlp.nlpbook.paircls import get_web_service_app
app = get_web_service_app(inference_fn)
app.run()
```

     * Serving Flask app "ratsnlp.nlpbook.paircls.deploy" (lazy loading)
     * Environment: production
    [31m   WARNING: This is a development server. Do not use it in a production deployment.[0m
    [2m   Use a production WSGI server instead.[0m
     * Debug mode: off
    

     * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
    

     * Running on http://0163-35-238-180-140.ngrok.io
     * Traffic stats available on http://127.0.0.1:4040
    

    127.0.0.1 - - [04/Mar/2022 09:14:48] "[37mGET / HTTP/1.1[0m" 200 -
    127.0.0.1 - - [04/Mar/2022 09:14:49] "[33mGET /favicon.ico HTTP/1.1[0m" 404 -
    127.0.0.1 - - [04/Mar/2022 09:14:49] "[37mGET / HTTP/1.1[0m" 200 -
    127.0.0.1 - - [04/Mar/2022 09:15:01] "[37mPOST /api HTTP/1.1[0m" 200 -
    

# 웹사이트 형태는 다음과 같다.
![pair_classification](https://user-images.githubusercontent.com/84653623/160079951-83a22799-e4d8-4254-845b-61b55a1ec40d.png)
3d:["$","$L4a",null,{"content":"$4b"}]
3e:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/b9ef641e76e3a351.css","precedence":"next"}]
3f:["$","script","script-0",{"src":"/_next/static/chunks/6b8d09032578b975.js","async":true}]
40:["$","$L4c",null,{"children":["$","$4d",null,{"name":"Next.MetadataOutlet","children":"$@4e"}]}]
42:["$","span","span-44",{"className":"hljs-string","children":["f\"중립 ",["$","span","span-0",{"className":"hljs-subst","children":"{neutral_prob}"}],"\""]}]
43:["$","span","span-45",{"className":"hljs-string","children":"'entailment_width'"}]
44:["$","span","span-46",{"className":"hljs-string","children":["f\"",["$","span","span-0",{"className":"hljs-subst","children":["{entailment_prob * ",["$","span","span-0",{"className":"hljs-number","children":"100"}],"}"]}],"%\""]}]
45:["$","span","span-47",{"className":"hljs-string","children":"'contradiction_width'"}]
46:["$","span","span-48",{"className":"hljs-string","children":["f\"",["$","span","span-0",{"className":"hljs-subst","children":["{contradiction_prob * ",["$","span","span-0",{"className":"hljs-number","children":"100"}],"}"]}],"%\""]}]
47:["$","span","span-49",{"className":"hljs-string","children":"'neutral_width'"}]
48:["$","span","span-50",{"className":"hljs-string","children":["f\"",["$","span","span-0",{"className":"hljs-subst","children":["{neutral_prob * ",["$","span","span-0",{"className":"hljs-number","children":"100"}],"}"]}],"%\""]}]
4e:null
