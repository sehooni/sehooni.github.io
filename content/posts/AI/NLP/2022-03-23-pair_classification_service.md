---
published: true
title:  "[NLP] 문장 쌍 분류 모델 실전 투입"
excerpt: "문장 쌍 분류 모델 실전 투입하기"
toc: true
toc_sticky: true

categories:
  - NLP
tags: [NLP, DL]

date: 2022-03-23
last_modified_at: 2022-03-23T18:20:00-18:35:00
classes: wide
---

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

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
