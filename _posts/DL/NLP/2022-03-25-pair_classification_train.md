---
published: true
title:  "[NLP] 문장 쌍 분류 모델 학습하기"
excerpt: "문장 분류 쌍 모델 학습하기."
toc: true
toc_sticky: true

categories:
  - NLP
tags: [NLP, DL]

date: 2022-03-25
last_modified_at: 2022-03-25T18:10:00-18:15:00
classes: wide
---

자연어처리의 예제를 학습하여 보자.
다음은 이전 글에서 설명하였던 문장 쌍 분류 모델을 구현한 것이다.

본 파일은 이기창님의 'Do it! 자연어 처리'에 기초하여 작성되었다. :)

# 문장 쌍 분류 모델 학습하기

전제와 가설을 검증하는 자연어 추론 모델 만들기

## 1. 각종 설정하기

### TPU 관련 패키지 설치

코랩 노트북 초기화 과정에서 하드웨어 가속기로 TPU를 선택했다면 다음 코드를 실행하고, GPU를 선택했다면 실행하지 않는다.

#### code 3-0


```python
!pip install cloud-tpu-client==0.10 https://storage.googleapis.com/tpu-pytorch/wheels/torch_xla-1.9-cp37-cp37m-linux_x86_64.whl
```

### 의존성 패키지 설치

code 3-1을 실행해 TPU 이외의 의존성 있는 패키지를 설치한다.

#### code 3-1


```python
!pip install ratsnlp
```

    Requirement already satisfied: ratsnlp in /usr/local/lib/python3.7/dist-packages (1.0.1)
    Requirement already satisfied: pytorch-lightning==1.3.4 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.3.4)
    Requirement already satisfied: torch>=1.9.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.10.0+cu111)
    Requirement already satisfied: Korpora>=0.2.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (0.2.0)
    Requirement already satisfied: flask>=1.1.4 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.1.4)
    Requirement already satisfied: flask-cors>=3.0.10 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (3.0.10)
    Requirement already satisfied: transformers==4.10.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (4.10.0)
    Requirement already satisfied: flask-ngrok>=0.0.25 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (0.0.25)
    Requirement already satisfied: numpy>=1.17.2 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (1.21.5)
    Requirement already satisfied: fsspec[http]>=2021.4.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (2022.2.0)
    Requirement already satisfied: tqdm>=4.41.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (4.62.3)
    Requirement already satisfied: pyDeprecate==0.3.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.3.0)
    Requirement already satisfied: torchmetrics>=0.2.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.7.2)
    Requirement already satisfied: future>=0.17.1 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.18.2)
    Requirement already satisfied: packaging in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (21.3)
    Requirement already satisfied: tensorboard!=2.5.0,>=2.2.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (2.8.0)
    Requirement already satisfied: PyYAML<=5.4.1,>=5.1 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (5.4.1)
    Requirement already satisfied: tokenizers<0.11,>=0.10.1 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.10.3)
    Requirement already satisfied: huggingface-hub>=0.0.12 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.4.0)
    Requirement already satisfied: sacremoses in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.0.47)
    Requirement already satisfied: importlib-metadata in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (4.11.1)
    Requirement already satisfied: regex!=2019.12.17 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (2019.12.20)
    Requirement already satisfied: filelock in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (3.6.0)
    Requirement already satisfied: requests in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (2.23.0)
    Requirement already satisfied: click<8.0,>=5.1 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (7.1.2)
    Requirement already satisfied: itsdangerous<2.0,>=0.24 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (1.1.0)
    Requirement already satisfied: Werkzeug<2.0,>=0.15 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (1.0.1)
    Requirement already satisfied: Jinja2<3.0,>=2.10.1 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (2.11.3)
    Requirement already satisfied: Six in /usr/local/lib/python3.7/dist-packages (from flask-cors>=3.0.10->ratsnlp) (1.15.0)
    Requirement already satisfied: aiohttp in /usr/local/lib/python3.7/dist-packages (from fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (3.8.1)
    Requirement already satisfied: typing-extensions>=3.7.4.3 in /usr/local/lib/python3.7/dist-packages (from huggingface-hub>=0.0.12->transformers==4.10.0->ratsnlp) (3.10.0.2)
    Requirement already satisfied: MarkupSafe>=0.23 in /usr/local/lib/python3.7/dist-packages (from Jinja2<3.0,>=2.10.1->flask>=1.1.4->ratsnlp) (2.0.1)
    Requirement already satisfied: xlrd>=1.2.0 in /usr/local/lib/python3.7/dist-packages (from Korpora>=0.2.0->ratsnlp) (2.0.1)
    Requirement already satisfied: dataclasses>=0.6 in /usr/local/lib/python3.7/dist-packages (from Korpora>=0.2.0->ratsnlp) (0.6)
    Requirement already satisfied: pyparsing!=3.0.5,>=2.0.2 in /usr/local/lib/python3.7/dist-packages (from packaging->pytorch-lightning==1.3.4->ratsnlp) (3.0.7)
    Requirement already satisfied: urllib3!=1.25.0,!=1.25.1,<1.26,>=1.21.1 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (1.24.3)
    Requirement already satisfied: idna<3,>=2.5 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (2.10)
    Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (2021.10.8)
    Requirement already satisfied: chardet<4,>=3.0.2 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (3.0.4)
    Requirement already satisfied: google-auth<3,>=1.6.3 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.35.0)
    Requirement already satisfied: protobuf>=3.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.17.3)
    Requirement already satisfied: setuptools>=41.0.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (57.4.0)
    Requirement already satisfied: google-auth-oauthlib<0.5,>=0.4.1 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.4.6)
    Requirement already satisfied: absl-py>=0.4 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.0.0)
    Requirement already satisfied: tensorboard-plugin-wit>=1.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.8.1)
    Requirement already satisfied: wheel>=0.26 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.37.1)
    Requirement already satisfied: grpcio>=1.24.3 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.44.0)
    Requirement already satisfied: markdown>=2.6.8 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.3.6)
    Requirement already satisfied: tensorboard-data-server<0.7.0,>=0.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.6.1)
    Requirement already satisfied: cachetools<5.0,>=2.0.0 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (4.2.4)
    Requirement already satisfied: pyasn1-modules>=0.2.1 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.2.8)
    Requirement already satisfied: rsa<5,>=3.1.4 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (4.8)
    Requirement already satisfied: requests-oauthlib>=0.7.0 in /usr/local/lib/python3.7/dist-packages (from google-auth-oauthlib<0.5,>=0.4.1->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.3.1)
    Requirement already satisfied: zipp>=0.5 in /usr/local/lib/python3.7/dist-packages (from importlib-metadata->transformers==4.10.0->ratsnlp) (3.7.0)
    Requirement already satisfied: pyasn1<0.5.0,>=0.4.6 in /usr/local/lib/python3.7/dist-packages (from pyasn1-modules>=0.2.1->google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.4.8)
    Requirement already satisfied: oauthlib>=3.0.0 in /usr/local/lib/python3.7/dist-packages (from requests-oauthlib>=0.7.0->google-auth-oauthlib<0.5,>=0.4.1->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.2.0)
    Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (6.0.2)
    Requirement already satisfied: asynctest==0.13.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (0.13.0)
    Requirement already satisfied: charset-normalizer<3.0,>=2.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (2.0.12)
    Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.2.0)
    Requirement already satisfied: attrs>=17.3.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (21.4.0)
    Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.3.0)
    Requirement already satisfied: yarl<2.0,>=1.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.7.2)
    Requirement already satisfied: async-timeout<5.0,>=4.0.0a3 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (4.0.2)
    Requirement already satisfied: joblib in /usr/local/lib/python3.7/dist-packages (from sacremoses->transformers==4.10.0->ratsnlp) (1.1.0)
    

### 구글 드라이브와 연결

코랩 노트북은 일정시간 사용하지 않으면 당시까지의 모든 결과물이 날아갈 수 있다. 모델 체크포인트 등을 저장해 주기 위해 자신의 구글 드라이브를 코랩 노트북과 연결한다.

#### code 3-2


```python
from google.colab import drive
drive.mount('/gdrive', force_remount=True)
```

    Mounted at /gdrive
    

### 모델 환경 설정

kcbert-base모델을 인공지능 기업 업스테이지가 공개한 KLUE-NLI데이터* 로 파인튜닝


> **klue-benchmark.com/tasks/68/data/description*



#### code 3-3


```python
import torch
from ratsnlp.nlpbook.classification import ClassificationTrainArguments
args = ClassificationTrainArguments(
    pretrained_model_name="beomi/kcbert-base",
    downstream_task_name="pair-classification",
    downstream_corpus_name="klue-nli",
    downstream_model_dir="/gdrive/My Drive/nlpbook/checkpoint-paircls",
    batch_size=32 if torch.cuda.is_available() else 4,
    learning_rate=5e-5,
    max_seq_length=64,
    epochs=5,
    tpu_cores=0 if torch.cuda.is_available() else 8,
    seed=7,
)
```

### 랜덤 시드 고정

랜덤 시드를 설정

code 3-4는 `args`에 지정된 시드로 고정하는 역할을 한다.

#### code 3-4


```python
from ratsnlp import nlpbook
nlpbook.set_seed(args)
```

    set seed: 7
    

### 로거 설정

각종 로그를 출력하는 로거를 설정

#### code 3-5


```python
nlpbook.set_logger(args)
```

    INFO:ratsnlp:Training/evaluation parameters ClassificationTrainArguments(pretrained_model_name='beomi/kcbert-base', downstream_task_name='pair-classification', downstream_corpus_name='klue-nli', downstream_corpus_root_dir='/content/Korpora', downstream_model_dir='/gdrive/My Drive/nlpbook/checkpoint-paircls', max_seq_length=64, save_top_k=1, monitor='min val_loss', seed=7, overwrite_cache=False, force_download=False, test_mode=False, learning_rate=5e-05, epochs=5, batch_size=32, cpu_workers=2, fp16=False, tpu_cores=0)
    

## 2. 말뭉치 내려받기

### 말뭉치 내려받기

KLUE-NLI 데이터를 내려받는다. `corpus_name`에 해당하는 말뭉치(`klue_nli`)를 `downstream_corpus_root_dir`아래(`/root/Korpora`)에 저장해둔다.

#### code 3-6


```python
nlpbook.download_downstream_dataset(args)
```

    Downloading: 100%|██████████| 12.3M/12.3M [00:00<00:00, 42.3MB/s]
    Downloading: 100%|██████████| 1.47M/1.47M [00:00<00:00, 35.6MB/s]
    

## 3. 토크나이저 준비하기

### 토크나이저 준비

code 3-7을 실행해 `pretrained_model_name`에 해당하는 모델(**kcbert-base**)이 사용하는 토크나이저를 선언한다.

#### code 3-7


```python
from transformers import BertTokenizer
tokenizer = BertTokenizer.from_pretrained(
    args.pretrained_model_name,
    do_lower_case=False,
)
```


    Downloading:   0%|          | 0.00/250k [00:00<?, ?B/s]



    Downloading:   0%|          | 0.00/49.0 [00:00<?, ?B/s]



    Downloading:   0%|          | 0.00/619 [00:00<?, ?B/s]


## 4. 데이터 전처리하기

### 학습 데이터셋 구축

code 3-8을 수행하면 학습 데이터셋 을 만들 수 있다. **KlueNLICorpus** 클래스는 JSON 파일 형식의 KLUE-NLI 데이터를 문장(전제 + 가설)과 레이블(참, 거짓, 중립)로 읽어들인다. `KlueNLICorpus`는 `ClassificationDataset`이 요구하면 이 문장과 레이블을 `ClassificationDataset`에 제공한다.



#### code 3-8


```python
from ratsnlp.nlpbook.paircls import KlueNLICorpus
from ratsnlp.nlpbook.classification import ClassificationDataset
corpus = KlueNLICorpus()
train_dataset = ClassificationDataset(
    args=args,
    corpus=corpus,
    tokenizer=tokenizer,
    mode="train",
)
```

    INFO:ratsnlp:Creating features from dataset file at /content/Korpora/klue-nli
    INFO:ratsnlp:loading train data... LOOKING AT /content/Korpora/klue-nli/klue_nli_train.json
    INFO:ratsnlp:tokenize sentences, it could take a lot of time...
    INFO:ratsnlp:tokenize sentences [took 15.747 s]
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence A, B: 100분간 잘껄 그래도 소닉붐땜에 2점준다 + 100분간 잤다.
    INFO:ratsnlp:tokens: [CLS] 100 ##분간 잘 ##껄 그래도 소 ##닉 ##붐 ##땜에 2 ##점 ##준다 [SEP] 100 ##분간 잤 ##다 . [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: contradiction
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 8327, 15760, 2483, 4260, 8446, 1895, 5623, 5969, 10319, 21, 4213, 10172, 3, 8327, 15760, 2491, 4020, 17, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=1)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence A, B: 100분간 잘껄 그래도 소닉붐땜에 2점준다 + 소닉붐이 정말 멋있었다.
    INFO:ratsnlp:tokens: [CLS] 100 ##분간 잘 ##껄 그래도 소 ##닉 ##붐 ##땜에 2 ##점 ##준다 [SEP] 소 ##닉 ##붐 ##이 정말 멋 ##있 ##었다 . [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: neutral
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 8327, 15760, 2483, 4260, 8446, 1895, 5623, 5969, 10319, 21, 4213, 10172, 3, 1895, 5623, 5969, 4017, 8050, 1348, 4188, 8217, 17, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=2)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence A, B: 100분간 잘껄 그래도 소닉붐땜에 2점준다 + 100분간 자는게 더 나았을 것 같다.
    INFO:ratsnlp:tokens: [CLS] 100 ##분간 잘 ##껄 그래도 소 ##닉 ##붐 ##땜에 2 ##점 ##준다 [SEP] 100 ##분간 자는 ##게 더 나 ##았을 것 같다 . [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: neutral
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 8327, 15760, 2483, 4260, 8446, 1895, 5623, 5969, 10319, 21, 4213, 10172, 3, 8327, 15760, 15095, 4199, 832, 587, 25331, 258, 8604, 17, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=2)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence A, B: 101빌딩 근처에 나름 즐길거리가 많습니다. + 101빌딩 근처에서 즐길거리 찾기는 어렵습니다.
    INFO:ratsnlp:tokens: [CLS] 10 ##1 ##빌 ##딩 근처에 나름 즐 ##길 ##거리가 많습니다 . [SEP] 10 ##1 ##빌 ##딩 근처에 ##서 즐 ##길 ##거리 찾 ##기는 어렵 ##습니다 . [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: contradiction
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 8240, 4068, 4647, 4389, 29671, 13715, 2676, 4583, 14516, 14617, 17, 3, 8240, 4068, 4647, 4389, 29671, 4072, 2676, 4583, 8181, 2851, 8189, 9775, 8046, 17, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=1)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence A, B: 101빌딩 근처에 나름 즐길거리가 많습니다. + 101빌딩 주변에 젊은이들이 즐길거리가 많습니다.
    INFO:ratsnlp:tokens: [CLS] 10 ##1 ##빌 ##딩 근처에 나름 즐 ##길 ##거리가 많습니다 . [SEP] 10 ##1 ##빌 ##딩 주변에 젊은이들이 즐 ##길 ##거리가 많습니다 . [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: neutral
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 8240, 4068, 4647, 4389, 29671, 13715, 2676, 4583, 14516, 14617, 17, 3, 8240, 4068, 4647, 4389, 12298, 22790, 2676, 4583, 14516, 14617, 17, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=2)
    INFO:ratsnlp:Saving features into cached file, it could take a lot of time...
    INFO:ratsnlp:Saving features into cached file /content/Korpora/klue-nli/cached_train_BertTokenizer_64_klue-nli_pair-classification [took 1.934 s]
    

### ClassificationDataset 클래스가 하는 역할

이 클래스는 **KlueNLICorpus**와 code 3-7에서 선언해 둔 **토크나이저**를 품고 있다.  

**ClassificationDataset**은 제공받은 문장과 레이블 각각을 tokenizer를 활용해 모델이 학습할 수 있는 형태(**ClassificationFeature**)로 가공한다.
다시 말해, 전제와 가설 2개 문장을 각각 토큰화하고 이를 인덱스로 변환하는 한편, 레이블 역시 정수로 바꿔주는 역할을 한다.

(**entailment: 0, contradiction: 1, neutral: 2**)


KlueNLICorpus와 classificationDataset의 역할과 자세한 구현 내용은 아래의 링크를 참고하자!
(현재는 교재링크를 올려두지만, 추후 본인의 깃허브에 구현 예정)

- ratsgo.github.io/nlpbook/docs/pair_cls/detail 

### 학습 데이터 로더 구축

code 3-9를 실행하면 학습할 때 쓰이는 데이터 로더를 만들 수 있다. 학습용 데이터 로더는 ClassificationDataset 클래스가 들고 있는 전체 인스턴스 가운데 배크 크기(*code 3-3 에서 정의한* `args`*의* `batch_size`)만큼의 인스턴스들을 비복원(`replacement=False`)랜덤 추출(`RandomSampler`)한 뒤 이를 배치 형태로 가공(`nlpbook.data_collator`)해 모델에 공급하는 역할을 수행한다. 

#### code 3-9


```python
from torch.utils.data import DataLoader, RandomSampler
train_dataloader = DataLoader(
    train_dataset,
    batch_size=args.batch_size,
    sampler=RandomSampler(train_dataset, replacement=False),
    collate_fn=nlpbook.data_collator,
    drop_last=False,
    num_workers=args.cpu_workers,
)
```

### 평가용 데이터 로더 구축

code 3-10을 실행하면 평가용 데이터 로더를 구축할 수 있다. 평가용 데이터 로더는 배치 크기(code 3-3에서 정의한 `args`의 `batch_size`)만큼의 인스턴스를 순서대로 추출(**Sequential Sampler**)한 후 이를 배치 형태로 가공(`nlpbook.data_collator`)해 모델에 공급한다.

#### code 3-10


```python
from torch.utils.data import SequentialSampler
val_dataset = ClassificationDataset(
    args=args,
    corpus=corpus,
    tokenizer=tokenizer,
    mode="test",
)
val_dataloader = DataLoader(
    val_dataset,
    batch_size=args.batch_size,
    sampler=SequentialSampler(val_dataset),
    collate_fn=nlpbook.data_collator,
    drop_last=False,
    num_workers=args.cpu_workers,
)
```

    INFO:ratsnlp:Loading features from cached file /content/Korpora/klue-nli/cached_test_BertTokenizer_64_klue-nli_pair-classification [took 0.116 s]
    

## 5. 모델 불러오기

### 모델 초기화

code 3-11을 수행해 모델을 초기화 한다. 프리트레인을 마친 BERT로 `kcbert-base`를 사용한다. code 3-3에서 `pretrained_model_name`을 `beomi/kcber-base`로 지정했기 때문이다. 물론 허깅페이스 모델 허브에 등록된 모델이라면 다른 모델 역시 사용할 수 있다.

`BertForSequenceClassification`은 프리트레인을 마친 BERT모델 위에 문서 분류용 태스크 모듈을 덧붙인 형태의 모델 클래스이다. 이 클래스는 **문서 분류 모델**에서 사용한 것과 동일하다.

#### code 3-11


```python
from transformers import BertConfig, BertForSequenceClassification
pretrained_model_config = BertConfig.from_pretrained(
    args.pretrained_model_name,
    num_labels=corpus.num_labels,
)
model = BertForSequenceClassification.from_pretrained(
    args.pretrained_model_name,
    config=pretrained_model_config,
)
```


    Downloading:   0%|          | 0.00/438M [00:00<?, ?B/s]


    Some weights of the model checkpoint at beomi/kcbert-base were not used when initializing BertForSequenceClassification: ['cls.predictions.decoder.bias', 'cls.predictions.transform.LayerNorm.bias', 'cls.predictions.decoder.weight', 'cls.seq_relationship.weight', 'cls.predictions.transform.dense.bias', 'cls.predictions.bias', 'cls.seq_relationship.bias', 'cls.predictions.transform.LayerNorm.weight', 'cls.predictions.transform.dense.weight']
    - This IS expected if you are initializing BertForSequenceClassification from the checkpoint of a model trained on another task or with another architecture (e.g. initializing a BertForSequenceClassification model from a BertForPreTraining model).
    - This IS NOT expected if you are initializing BertForSequenceClassification from the checkpoint of a model that you expect to be exactly identical (initializing a BertForSequenceClassification model from a BertForSequenceClassification model).
    Some weights of BertForSequenceClassification were not initialized from the model checkpoint at beomi/kcbert-base and are newly initialized: ['classifier.bias', 'classifier.weight']
    You should probably TRAIN this model on a down-stream task to be able to use it for predictions and inference.
    

## 6. 모델 학습시키기

code 3-12를 실행하면 문장 쌍 분류용 태스크를 정의할 수 있다. 모델은 code 3-11에서 준비한 모델 클래스를 `ClassificationTask`에 포함한다. `ClassificationTask` 클래스에는 옵티마이저, 러닝 레이트 스케줄러가 정의 되 있는데, 옵티마이저로는 아담(`Adam`), 러닝 레이트 스케줄러로는 `ExponentialLR`을 사용한다.

### 태스크 정의

#### code 3-12


```python
from ratsnlp.nlpbook.classification import ClassificationTask
task = ClassificationTask(model, args)
```

### 트레이너 정의

code 3-13을 실행하면 트레이너를 정의할 수 있다. 이 트레이너는 **파이토치 라이트닝 라이브러리**의 도움을 받아 **GPU/TPU 설정**, **로그 및 체크포인트** 등 귀찮은 설정들을 알아서 해준다.

#### code 3-13


```python
trainer = nlpbook.get_trainer(args)
```

    GPU available: True, used: True
    TPU available: False, using: 0 TPU cores
    

### 학습 개시

code 3-14와 같이 트레이너의 `fit()`함수를 호출하면 학습을 시작한다.

#### code 3-14


```python
trainer.fit(
    task,
    train_dataloader=train_dataloader,
    val_dataloaders=val_dataloader,
)
```

    LOCAL_RANK: 0 - CUDA_VISIBLE_DEVICES: [0]
    
      | Name  | Type                          | Params
    --------------------------------------------------------
    0 | model | BertForSequenceClassification | 108 M 
    --------------------------------------------------------
    108 M     Trainable params
    0         Non-trainable params
    108 M     Total params
    435.683   Total estimated model params size (MB)
    


    Training: 0it [00:00, ?it/s]



    Validating: 0it [00:00, ?it/s]



    Validating: 0it [00:00, ?it/s]



    Validating: 0it [00:00, ?it/s]



    Validating: 0it [00:00, ?it/s]



    Validating: 0it [00:00, ?it/s]


# **문장 쌍 분류**는 문서 분류 과제와 태스크 모듈 구조 등에서 본질적으로 다르지 않다. 입력문서가 1개냐(문서분류), 2개냐(문장 쌍 분류)의 차이가 있을 뿐이다.

