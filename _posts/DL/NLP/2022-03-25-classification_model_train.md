---
published: true
title:  "[NLP] 문서 분류 모델 training"
excerpt: "문서분류 모델 학습하기."

categories:
  - NLP
tags: [NLP, DL]

date: 2022-03-25
last_modified_at: 2022-03-25T16:00:00-17:00:00
classes: wide
---

자연어처리의 예제를 학습하여 보자.
다음은 이전 글에서 설명하였던 문서 분류 모델을 구현한 것이다.

본 파일은 이기창님의 'Do it! 자연어 처리'에 기초하여 작성되었다! :)

# 문서분류 모델 학습하기

## 1. 각종 설정하기

### TPU 관련 패키지 설치

코랩 노트북 초기화 과정에서 하드웨어 가속기로 TPU를 선택했다면 다음 코드를 실행하면 된다.
그러면 TPU 관련 라이브러리 들을 설치한다.

(참고로 TPU 학습은 라이브러리 지원 등이 GPU보다 불안정한 편이므로 될 수 있으면 GPU를 사용하기를 권함)

#### code 1-0


```python
!pip install cloud-tpu-client==0.10 https://storage.googleapis.com/tpu-pytorch/wheels/torch_xla-1.9-cp37-cp37m-linux_x86_64.whl
```

    Collecting torch-xla==1.9
      Using cached https://storage.googleapis.com/tpu-pytorch/wheels/torch_xla-1.9-cp37-cp37m-linux_x86_64.whl (149.9 MB)
    Requirement already satisfied: cloud-tpu-client==0.10 in /usr/local/lib/python3.7/dist-packages (0.10)
    Requirement already satisfied: google-api-python-client==1.8.0 in /usr/local/lib/python3.7/dist-packages (from cloud-tpu-client==0.10) (1.8.0)
    Requirement already satisfied: oauth2client in /usr/local/lib/python3.7/dist-packages (from cloud-tpu-client==0.10) (4.1.3)
    Requirement already satisfied: google-api-core<2dev,>=1.13.0 in /usr/local/lib/python3.7/dist-packages (from google-api-python-client==1.8.0->cloud-tpu-client==0.10) (1.26.3)
    Requirement already satisfied: google-auth>=1.4.1 in /usr/local/lib/python3.7/dist-packages (from google-api-python-client==1.8.0->cloud-tpu-client==0.10) (1.35.0)
    Requirement already satisfied: uritemplate<4dev,>=3.0.0 in /usr/local/lib/python3.7/dist-packages (from google-api-python-client==1.8.0->cloud-tpu-client==0.10) (3.0.1)
    Requirement already satisfied: six<2dev,>=1.6.1 in /usr/local/lib/python3.7/dist-packages (from google-api-python-client==1.8.0->cloud-tpu-client==0.10) (1.15.0)
    Requirement already satisfied: google-auth-httplib2>=0.0.3 in /usr/local/lib/python3.7/dist-packages (from google-api-python-client==1.8.0->cloud-tpu-client==0.10) (0.0.4)
    Requirement already satisfied: httplib2<1dev,>=0.9.2 in /usr/local/lib/python3.7/dist-packages (from google-api-python-client==1.8.0->cloud-tpu-client==0.10) (0.17.4)
    Requirement already satisfied: googleapis-common-protos<2.0dev,>=1.6.0 in /usr/local/lib/python3.7/dist-packages (from google-api-core<2dev,>=1.13.0->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (1.55.0)
    Requirement already satisfied: pytz in /usr/local/lib/python3.7/dist-packages (from google-api-core<2dev,>=1.13.0->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (2018.9)
    Requirement already satisfied: setuptools>=40.3.0 in /usr/local/lib/python3.7/dist-packages (from google-api-core<2dev,>=1.13.0->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (57.4.0)
    Requirement already satisfied: protobuf>=3.12.0 in /usr/local/lib/python3.7/dist-packages (from google-api-core<2dev,>=1.13.0->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (3.17.3)
    Requirement already satisfied: packaging>=14.3 in /usr/local/lib/python3.7/dist-packages (from google-api-core<2dev,>=1.13.0->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (21.3)
    Requirement already satisfied: requests<3.0.0dev,>=2.18.0 in /usr/local/lib/python3.7/dist-packages (from google-api-core<2dev,>=1.13.0->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (2.23.0)
    Requirement already satisfied: pyasn1-modules>=0.2.1 in /usr/local/lib/python3.7/dist-packages (from google-auth>=1.4.1->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (0.2.8)
    Requirement already satisfied: rsa<5,>=3.1.4 in /usr/local/lib/python3.7/dist-packages (from google-auth>=1.4.1->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (4.8)
    Requirement already satisfied: cachetools<5.0,>=2.0.0 in /usr/local/lib/python3.7/dist-packages (from google-auth>=1.4.1->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (4.2.4)
    Requirement already satisfied: pyparsing!=3.0.5,>=2.0.2 in /usr/local/lib/python3.7/dist-packages (from packaging>=14.3->google-api-core<2dev,>=1.13.0->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (3.0.7)
    Requirement already satisfied: pyasn1<0.5.0,>=0.4.6 in /usr/local/lib/python3.7/dist-packages (from pyasn1-modules>=0.2.1->google-auth>=1.4.1->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (0.4.8)
    Requirement already satisfied: chardet<4,>=3.0.2 in /usr/local/lib/python3.7/dist-packages (from requests<3.0.0dev,>=2.18.0->google-api-core<2dev,>=1.13.0->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (3.0.4)
    Requirement already satisfied: urllib3!=1.25.0,!=1.25.1,<1.26,>=1.21.1 in /usr/local/lib/python3.7/dist-packages (from requests<3.0.0dev,>=2.18.0->google-api-core<2dev,>=1.13.0->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (1.24.3)
    Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.7/dist-packages (from requests<3.0.0dev,>=2.18.0->google-api-core<2dev,>=1.13.0->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (2021.10.8)
    Requirement already satisfied: idna<3,>=2.5 in /usr/local/lib/python3.7/dist-packages (from requests<3.0.0dev,>=2.18.0->google-api-core<2dev,>=1.13.0->google-api-python-client==1.8.0->cloud-tpu-client==0.10) (2.10)
    

### 의존성 패키지 설치

다음 코드는 TPU이외에 의존성 있는 패키지를 설치한다. 

명령어 맨 앞에 붙은 느낌표(!)는 코랩 환경에서 파이썬이 아닌, 셸(shell)명령을 수행한다는 의미이다.

#### code 1-1


```python
!pip install ratsnlp
```

    Requirement already satisfied: ratsnlp in /usr/local/lib/python3.7/dist-packages (1.0.1)
    Requirement already satisfied: torch>=1.9.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.10.0+cu111)
    Requirement already satisfied: transformers==4.10.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (4.10.0)
    Requirement already satisfied: flask-ngrok>=0.0.25 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (0.0.25)
    Requirement already satisfied: Korpora>=0.2.0 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (0.2.0)
    Requirement already satisfied: flask-cors>=3.0.10 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (3.0.10)
    Requirement already satisfied: pytorch-lightning==1.3.4 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.3.4)
    Requirement already satisfied: flask>=1.1.4 in /usr/local/lib/python3.7/dist-packages (from ratsnlp) (1.1.4)
    Requirement already satisfied: fsspec[http]>=2021.4.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (2022.2.0)
    Requirement already satisfied: torchmetrics>=0.2.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.7.2)
    Requirement already satisfied: PyYAML<=5.4.1,>=5.1 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (5.4.1)
    Requirement already satisfied: tqdm>=4.41.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (4.62.3)
    Requirement already satisfied: pyDeprecate==0.3.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.3.0)
    Requirement already satisfied: packaging in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (21.3)
    Requirement already satisfied: future>=0.17.1 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (0.18.2)
    Requirement already satisfied: numpy>=1.17.2 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (1.21.5)
    Requirement already satisfied: tensorboard!=2.5.0,>=2.2.0 in /usr/local/lib/python3.7/dist-packages (from pytorch-lightning==1.3.4->ratsnlp) (2.8.0)
    Requirement already satisfied: sacremoses in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.0.47)
    Requirement already satisfied: huggingface-hub>=0.0.12 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.4.0)
    Requirement already satisfied: regex!=2019.12.17 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (2019.12.20)
    Requirement already satisfied: importlib-metadata in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (4.11.1)
    Requirement already satisfied: filelock in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (3.6.0)
    Requirement already satisfied: tokenizers<0.11,>=0.10.1 in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (0.10.3)
    Requirement already satisfied: requests in /usr/local/lib/python3.7/dist-packages (from transformers==4.10.0->ratsnlp) (2.23.0)
    Requirement already satisfied: Jinja2<3.0,>=2.10.1 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (2.11.3)
    Requirement already satisfied: Werkzeug<2.0,>=0.15 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (1.0.1)
    Requirement already satisfied: click<8.0,>=5.1 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (7.1.2)
    Requirement already satisfied: itsdangerous<2.0,>=0.24 in /usr/local/lib/python3.7/dist-packages (from flask>=1.1.4->ratsnlp) (1.1.0)
    Requirement already satisfied: Six in /usr/local/lib/python3.7/dist-packages (from flask-cors>=3.0.10->ratsnlp) (1.15.0)
    Requirement already satisfied: aiohttp in /usr/local/lib/python3.7/dist-packages (from fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (3.8.1)
    Requirement already satisfied: typing-extensions>=3.7.4.3 in /usr/local/lib/python3.7/dist-packages (from huggingface-hub>=0.0.12->transformers==4.10.0->ratsnlp) (3.10.0.2)
    Requirement already satisfied: MarkupSafe>=0.23 in /usr/local/lib/python3.7/dist-packages (from Jinja2<3.0,>=2.10.1->flask>=1.1.4->ratsnlp) (2.0.1)
    Requirement already satisfied: xlrd>=1.2.0 in /usr/local/lib/python3.7/dist-packages (from Korpora>=0.2.0->ratsnlp) (2.0.1)
    Requirement already satisfied: dataclasses>=0.6 in /usr/local/lib/python3.7/dist-packages (from Korpora>=0.2.0->ratsnlp) (0.6)
    Requirement already satisfied: pyparsing!=3.0.5,>=2.0.2 in /usr/local/lib/python3.7/dist-packages (from packaging->pytorch-lightning==1.3.4->ratsnlp) (3.0.7)
    Requirement already satisfied: certifi>=2017.4.17 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (2021.10.8)
    Requirement already satisfied: idna<3,>=2.5 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (2.10)
    Requirement already satisfied: chardet<4,>=3.0.2 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (3.0.4)
    Requirement already satisfied: urllib3!=1.25.0,!=1.25.1,<1.26,>=1.21.1 in /usr/local/lib/python3.7/dist-packages (from requests->transformers==4.10.0->ratsnlp) (1.24.3)
    Requirement already satisfied: google-auth-oauthlib<0.5,>=0.4.1 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.4.6)
    Requirement already satisfied: absl-py>=0.4 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.0.0)
    Requirement already satisfied: setuptools>=41.0.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (57.4.0)
    Requirement already satisfied: wheel>=0.26 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.37.1)
    Requirement already satisfied: markdown>=2.6.8 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.3.6)
    Requirement already satisfied: tensorboard-plugin-wit>=1.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.8.1)
    Requirement already satisfied: tensorboard-data-server<0.7.0,>=0.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.6.1)
    Requirement already satisfied: protobuf>=3.6.0 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.17.3)
    Requirement already satisfied: google-auth<3,>=1.6.3 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.35.0)
    Requirement already satisfied: grpcio>=1.24.3 in /usr/local/lib/python3.7/dist-packages (from tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.44.0)
    Requirement already satisfied: pyasn1-modules>=0.2.1 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.2.8)
    Requirement already satisfied: rsa<5,>=3.1.4 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (4.8)
    Requirement already satisfied: cachetools<5.0,>=2.0.0 in /usr/local/lib/python3.7/dist-packages (from google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (4.2.4)
    Requirement already satisfied: requests-oauthlib>=0.7.0 in /usr/local/lib/python3.7/dist-packages (from google-auth-oauthlib<0.5,>=0.4.1->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (1.3.1)
    Requirement already satisfied: zipp>=0.5 in /usr/local/lib/python3.7/dist-packages (from importlib-metadata->transformers==4.10.0->ratsnlp) (3.7.0)
    Requirement already satisfied: pyasn1<0.5.0,>=0.4.6 in /usr/local/lib/python3.7/dist-packages (from pyasn1-modules>=0.2.1->google-auth<3,>=1.6.3->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (0.4.8)
    Requirement already satisfied: oauthlib>=3.0.0 in /usr/local/lib/python3.7/dist-packages (from requests-oauthlib>=0.7.0->google-auth-oauthlib<0.5,>=0.4.1->tensorboard!=2.5.0,>=2.2.0->pytorch-lightning==1.3.4->ratsnlp) (3.2.0)
    Requirement already satisfied: frozenlist>=1.1.1 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.3.0)
    Requirement already satisfied: aiosignal>=1.1.2 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.2.0)
    Requirement already satisfied: asynctest==0.13.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (0.13.0)
    Requirement already satisfied: multidict<7.0,>=4.5 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (6.0.2)
    Requirement already satisfied: async-timeout<5.0,>=4.0.0a3 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (4.0.2)
    Requirement already satisfied: yarl<2.0,>=1.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (1.7.2)
    Requirement already satisfied: attrs>=17.3.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (21.4.0)
    Requirement already satisfied: charset-normalizer<3.0,>=2.0 in /usr/local/lib/python3.7/dist-packages (from aiohttp->fsspec[http]>=2021.4.0->pytorch-lightning==1.3.4->ratsnlp) (2.0.12)
    Requirement already satisfied: joblib in /usr/local/lib/python3.7/dist-packages (from sacremoses->transformers==4.10.0->ratsnlp) (1.1.0)
    

### 구글 드라이브와 연결

코랩 노트북은 일정시간 사용하지 않으면 당시까지의 모든 결과물이 날아갈 수 있다. 모델 체크포인트 등을 저장해 두기 위해 자신의 구글 드라이브를 코랩 노트북과 연결한다.

#### code 1-2


```python
from google.colab import drive
drive.mount('/gdrive', force_remount=True)
```

    Mounted at /gdrive
    

### 모델 환경 설정
kcbert-base 모델을 NSMC데이터로 파인튜닝

#### code 1-3


```python
import torch
from ratsnlp.nlpbook.classification import ClassificationTrainArguments
args = ClassificationTrainArguments(
    pretrained_model_name="beomi/kcbert-base",
    downstream_corpus_name="nsmc",
    downstream_model_dir="/gdrive/My Drive/nlpbook/checkpoint-doccls",
    batch_size=32 if torch.cuda.is_available() else 4,
    learning_rate=5e-5,
    max_seq_length=128,
    epochs=3,
    tpu_cores=0 if torch.cuda.is_available() else 8,
    seed=7,
)
```

참고로 TrainArguments의 각 인자가 하는 역할과 의미는 다음과 같다.



*    **`pretrained_model_name`**
> 프리트레인 마친 언어 모델의 이름 (단, 해당 모델은 허깅페이스 모델 허브에 등록되어 있어야 한다.)

*    **`downstream_corpus_name`**
> 다운스트림 데이터의 이름

*    **`downstream_corpus_root_dir`**
> 다운스트림 데이터를 내려받을 위치. 입력하지 않으면 /root/Korpora에 저장된다.

*    **`downstream_model_dir`**
> 파인튜닝된 모델의 체크포인트가 저장될 위치. gdrive/My Drive/nlpbook/checkpoint-doccs로 지정하면 자신의 구글 드라이브 [내 폴더] 아래 npbook/checkpoint-doccls디렉터리에 저장된다.

*    **`batch_size`**
> 배치 크기. 하드웨어 가속기로 GPU를 선택(`torch.cuda.is_available() == True`)했다면 32, TPU라면(`torch.cuda.is_available() == False`) 4. 코랩 환경에서 TPU는 보통 8개의 코어가 할당되는데 batch_size는 코어별로 적용되는 배치 크기이므로 이렇게 설정해 둔다.

*    **`learning_rate`**
> 러닝 레이트(보폭). 1회 스텝에서 모델을 얼마나 업데이트할지에 관한 크기를 가리킨다. 

*   **`max_seq_length`**
> 토큰 기준 입력 문장 최대 길이. 이보다 긴 문장은 `max_seq_length`로 자르고, 짧은 문장은 `max_seq_length`가 되도록 스페셜 토큰([PAD])를 붙여준다.

*    **`epochs`**
> 학습 에포크 수. 3이라면 학습 데이터 전체를 3회 반복 학습합니다.

*    **`tpu_cores`**
> TPU 코어 수. 하드웨어 가속기로 GPU를 선택했다면 0, TPU라면 8.

*    **`seed`**
> 랜덤 시드(정수). `None`을 입력하면 랜덤 시드를 고정하지 않는다.



### 랜덤 시드 고정

랜덤 시드를 설정.

code 1-4는 `args`에 지정된 시드로 고정하는 역할을 한다.

#### code 1-4


```python
from ratsnlp import nlpbook
nlpbook.set_seed(args)
```

    set seed: 7
    

### 로거 설정

각종 로그를 출력하는 로거를 설정.

#### code 1-5


```python
nlpbook.set_logger(args)
```

    INFO:ratsnlp:Training/evaluation parameters ClassificationTrainArguments(pretrained_model_name='beomi/kcbert-base', downstream_task_name='document-classification', downstream_corpus_name='nsmc', downstream_corpus_root_dir='/content/Korpora', downstream_model_dir='/gdrive/My Drive/nlpbook/checkpoint-doccls', max_seq_length=128, save_top_k=1, monitor='min val_loss', seed=7, overwrite_cache=False, force_download=False, test_mode=False, learning_rate=5e-05, epochs=3, batch_size=32, cpu_workers=2, fp16=False, tpu_cores=0)
    

## 2. 말뭉치 내려받기

### 말뭉치 내려 받기

NSMC 데이터를 내려받는다. 데이터를 내려받는 도구로 **코포라**(Korpora*)라는 파이썬 오픈소스 패키지를 사용해, corpus_name(nsmc)에 해당하는 말뭉치를 root_dir(/root/Korpora) 아래에 저장해 둔다.

* Korpora*: github.com/ko-nlp/korpora

#### code 1-6


```python
from Korpora import Korpora
Korpora.fetch(
    corpus_name=args.downstream_corpus_name,
    root_dir=args.downstream_corpus_root_dir,
    force_download=True,
) 
```

    [nsmc] download ratings_train.txt: 14.6MB [00:00, 75.6MB/s]                           
    [nsmc] download ratings_test.txt: 4.90MB [00:00, 33.9MB/s]                           
    

## 3. 토크나이저 준비하기

### 토크나이저 준비

  본 프로젝트에서 다루는 데이터의 기본 단위는 텍스트 형태의 문장이다. 토큰화란 문장을 토큰 시퀀스로 분절하는 과정을 가리킨다. 본 실습에서 사용하는 모델은 자연어 문장을 분절한 토큰 시퀀스를 입력 받는다. 

code 1-7를 실행해 kcbert-base 모델이 사용하는 토크나이저를 선언한다.

토크나이저는 토큰화를 수행하는 프로그램이라는 뜻이다.

#### code 1-7


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

딥러닝 모델을 학습하려면 학습 데이터를 배치 단위로 계속 모델에 공급해 주어야 한다. 파이토치에서는 이 역할을 **데이터 로더**(dataloader)가 수행한다.

데이터 로더는 **데이터셋**(dataset)이 보유하고 있는 인스턴스를 배치 크기만큼 뽑아서 자료형, 데이터 길이 등 정해진 형식에 맞춰 배치를 만들어 준다.

### 학습 데이터셋 구축

code 1-8을 통해 **ClassificationDataset**을 만들 수 있다.
**ClassificationDataset**의 가장 큰 역할은 모든 인스턴스를 가지고 있다가 데이터 로더가 배치를 만들 때 인스턴스를 제공하는 일이다.

#### code 1-8


```python
from ratsnlp.nlpbook.classification import NsmcCorpus, ClassificationDataset
corpus = NsmcCorpus()
train_dataset = ClassificationDataset(
    args=args,
    corpus=corpus,
    tokenizer=tokenizer,
    mode="train",
)
```

    INFO:ratsnlp:Creating features from dataset file at /content/Korpora/nsmc
    INFO:ratsnlp:loading train data... LOOKING AT /content/Korpora/nsmc/ratings_train.txt
    INFO:ratsnlp:tokenize sentences, it could take a lot of time...
    INFO:ratsnlp:tokenize sentences [took 42.255 s]
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence: 아 더빙.. 진짜 짜증나네요 목소리
    INFO:ratsnlp:tokens: [CLS] 아 더 ##빙 . . 진짜 짜증나네 ##요 목소리 [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: 0
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 2170, 832, 5045, 17, 17, 7992, 29734, 4040, 10720, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=0)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence: 흠...포스터보고 초딩영화줄....오버연기조차 가볍지 않구나
    INFO:ratsnlp:tokens: [CLS] 흠 . . . 포 ##스터 ##보고 초딩 ##영화 ##줄 . . . . 오버 ##연기 ##조차 가볍 ##지 않 ##구나 [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: 1
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 3521, 17, 17, 17, 3294, 13069, 8190, 10635, 13796, 4006, 17, 17, 17, 17, 17613, 19625, 9790, 17775, 4102, 2175, 8030, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=1)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence: 너무재밓었다그래서보는것을추천한다
    INFO:ratsnlp:tokens: [CLS] 너무 ##재 ##밓 ##었다 ##그래 ##서 ##보는 ##것을 ##추 ##천 ##한다 [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: 0
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 8069, 4089, 7847, 8217, 9791, 4072, 9136, 8750, 4142, 4244, 8008, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=0)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence: 교도소 이야기구먼 ..솔직히 재미는 없다..평점 조정
    INFO:ratsnlp:tokens: [CLS] 교도소 이야기 ##구먼 . . 솔직히 재미 ##는 없다 . . 평 ##점 조정 [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: 0
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 12164, 9089, 9828, 17, 17, 8876, 10827, 4008, 8131, 17, 17, 3288, 4213, 16612, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=0)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence: 사이몬페그의 익살스런 연기가 돋보였던 영화!스파이더맨에서 늙어보이기만 했던 커스틴 던스트가 너무나도 이뻐보였다
    INFO:ratsnlp:tokens: [CLS] 사이 ##몬 ##페 ##그 ##의 익 ##살 ##스런 연기 ##가 돋 ##보 ##였던 영화 ! 스파이 ##더 ##맨 ##에서 늙어 ##보이 ##기만 했던 커 ##스 ##틴 던 ##스트 ##가 너무나도 이뻐 ##보 ##였다 [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: 1
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 8538, 4880, 4335, 4313, 4042, 2452, 4471, 10670, 11219, 4009, 870, 4010, 13043, 9376, 5, 24034, 4356, 4617, 7971, 22878, 11980, 9235, 10129, 3010, 4103, 4713, 834, 8795, 4009, 22110, 23997, 4010, 9827, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=1)
    INFO:ratsnlp:Saving features into cached file, it could take a lot of time...
    INFO:ratsnlp:Saving features into cached file /content/Korpora/nsmc/cached_train_BertTokenizer_128_nsmc_document-classification [took 23.322 s]
    

### **ClassificationDataset** 클래스가 하는 역할

이 클래스는 **NsmcCorpus**와 위에서 선언해 둔 **토크나이저(tokenizer)**를 품고 있다.

**NsmcCorpus**는 CSV 파일 형식의 NSMC 데이터를 문장과 레이블*(예를 들면 영화 리뷰와 긍정 및 부정)*으로 읽는다.

**NsmcCorpus**는 **ClassificationDataset**이 요구하면 이 문장과 레이블을 **ClassificationDataset**에 제공한다.

 **ClassificationDataset**은 제공받은 문장과 레이블 각각을 tokenizer를 활용해 모델이 학습할 수 있는 형태(**ClassificationFeature**)로 가공한다.

 **ClassificationFeature**라는 자료형에는 총 4가지의 정보가 있다.
* 첫번째는 **`input_id`**이다. 인덱스로 변환된 토큰 시퀀스이다. 

* 두번째는 **`attention_mask`**로 해당 토큰이 패딩 토큰인지(0) 아닌지(1)를 나타낸다. 

* **`token_type_ids`** 세그먼트 정보, **`label`**은 정수로 바뀐 레이블 정보 이다.

**`ClassificationFeatures`** 각 구성 요소의 자료형은 다음과 같다.

*   **`input_ids`** : `List[int]`
*   **`attention_mask`** : `List[int]`
*   **`token_type_ids`** : `Listh[int]`
*   **`label`** : `int`







### 학습 데이터 로더 구축

code 1-9를 통해 학습할 때 쓰이는 데이터 로더를 만들 수 있다. 데이터 로더는 ClassificationDataset클래스가 들고 있는 전체 인스턴스 가운데 배치 크기(*code 1-3에서 정의한* `args`*의* `batch_size`)만큼을 뽑아 배치 형태로 가공(`nlpbook.data_collator`)하는 역할을 수행한다.

#### code 1-9


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

코드를 자세히 보면 `sampler`와 `collate_fn`이 눈에 띈다.
전자는 샘플링 방식을 정의한다.

 여기서 만든 데이터 로더는 배치를 만들 때 `ClassificationDataset`이 들고 있는 전체 인스턴스 가운데 `batch_size` 개수만큼 비복원(**`replacement=False`**) 랜덤 추출(RandomSampler)한다.

`collate_fn`은 이렇게 뽑은 인스턴스들을 배치로 만드는 역할을 하는 함수이다. `nlpbook.data_collator`는 같은 배치에서 인스턴스가 여럿일 때 이를 `input_ids`, `attention_mask` 등 종류별로 모으고 파이토치가 요구하는 자료형인 텐서(`tensor`)형태로 바꾸는 역할을 수행한다.

### 평가용 데이터 로더 구축

평가용 데이터 로더는 학습용 데이터 로더와 달리 **`SequentialSampler`**를 사용한다. `SequentialSampler`는 인스턴스를 `batch_size`만큼 순서대로 추출하는 역할을 한다. 학습 때 배치 구성은 랜덤으로 하는 것이 좋은데, 평가할 때는 평가용 데이터 전체를 사용하므로 굳이 랜덤으로 구성할 이유가 없어 `SequentialSampler`를 사용한다.

code 1-10을 통해 평가용 데이터 로더를 구축한다.

#### code 1-10


```python
from torch.utils.data import SequentialSampler
val_dataset = ClassificationDataset(
    args=args,
    corpus=corpus,
    tokenizer=tokenizer,
    mode="test",
)
val_dataloader= DataLoader(
    val_dataset,
    batch_size=args.batch_size,
    sampler=SequentialSampler(val_dataset),
    collate_fn=nlpbook.data_collator,
    drop_last=False,
    num_workers=args.cpu_workers,
)
```

    INFO:ratsnlp:Creating features from dataset file at /content/Korpora/nsmc
    INFO:ratsnlp:loading test data... LOOKING AT /content/Korpora/nsmc/ratings_test.txt
    INFO:ratsnlp:tokenize sentences, it could take a lot of time...
    INFO:ratsnlp:tokenize sentences [took 14.198 s]
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence: 굳 ㅋ
    INFO:ratsnlp:tokens: [CLS] 굳 ㅋ [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: 1
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 352, 192, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=1)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence: GDNTOPCLASSINTHECLUB
    INFO:ratsnlp:tokens: [CLS] G ##D ##N ##TO ##P ##C ##L ##A ##S ##S ##I ##N ##T ##H ##E ##C ##L ##U ##B [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: 0
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 40, 4452, 4581, 25144, 4579, 4881, 4450, 4580, 4985, 4985, 4506, 4581, 4850, 5121, 4451, 4881, 4450, 5167, 4756, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=0)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence: 뭐야 이 평점들은.... 나쁘진 않지만 10점 짜리는 더더욱 아니잖아
    INFO:ratsnlp:tokens: [CLS] 뭐야 이 평 ##점 ##들은 . . . . 나쁘 ##진 않지만 10 ##점 짜리 ##는 더더욱 아니잖아 [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: 0
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 10691, 2451, 3288, 4213, 7977, 17, 17, 17, 17, 10476, 4153, 15426, 8240, 4213, 21394, 4008, 15616, 13439, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=0)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence: 지루하지는 않은데 완전 막장임... 돈주고 보기에는....
    INFO:ratsnlp:tokens: [CLS] 지 ##루 ##하지는 않은데 완전 막장 ##임 . . . 돈주고 보기에 ##는 . . . . [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: 0
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 2688, 4532, 16036, 20879, 8357, 15971, 4252, 17, 17, 17, 13900, 25253, 4008, 17, 17, 17, 17, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=0)
    INFO:ratsnlp:*** Example ***
    INFO:ratsnlp:sentence: 3D만 아니었어도 별 다섯 개 줬을텐데.. 왜 3D로 나와서 제 심기를 불편하게 하죠??
    INFO:ratsnlp:tokens: [CLS] 3 ##D ##만 아니었 ##어도 별 다섯 개 줬 ##을텐데 . . 왜 3 ##D ##로 나와서 제 심 ##기를 불편 ##하게 하죠 ? ? [SEP] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD] [PAD]
    INFO:ratsnlp:label: 0
    INFO:ratsnlp:features: ClassificationFeatures(input_ids=[2, 22, 4452, 4049, 18851, 8194, 1558, 23887, 220, 2648, 9243, 17, 17, 2332, 22, 4452, 4091, 10045, 2545, 2015, 8313, 10588, 8007, 18566, 32, 32, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], attention_mask=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], token_type_ids=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label=0)
    INFO:ratsnlp:Saving features into cached file, it could take a lot of time...
    INFO:ratsnlp:Saving features into cached file /content/Korpora/nsmc/cached_test_BertTokenizer_128_nsmc_document-classification [took 7.800 s]
    

## 5. 모델 불러오기

### 모델 초기화

code 1-3**(1. 각종 설정하기-모델 환경 설정)**에서 `pretrained_model_name`을 `beomi/kebert-base`로 지정했으므로 프리트레인을 마친 BERT로 `kcbert-base`를 사용한다.

모델을 초기화하는 코드에서 `BertForSequenceClassification`은 프리트레인을 마친 BERT 모델 위에 문서 분류용 태스크 모듈이 덧붙여진 형태의 모델 클래스이다. 이 클래스는 허깅페이스에서 제공하는 `transformers` 라이브러리에 포함되어 있다.

#### code 1-11


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


    Some weights of the model checkpoint at beomi/kcbert-base were not used when initializing BertForSequenceClassification: ['cls.seq_relationship.bias', 'cls.predictions.transform.dense.bias', 'cls.predictions.decoder.bias', 'cls.predictions.transform.LayerNorm.weight', 'cls.seq_relationship.weight', 'cls.predictions.transform.dense.weight', 'cls.predictions.bias', 'cls.predictions.transform.LayerNorm.bias', 'cls.predictions.decoder.weight']
    - This IS expected if you are initializing BertForSequenceClassification from the checkpoint of a model trained on another task or with another architecture (e.g. initializing a BertForSequenceClassification model from a BertForPreTraining model).
    - This IS NOT expected if you are initializing BertForSequenceClassification from the checkpoint of a model that you expect to be exactly identical (initializing a BertForSequenceClassification model from a BertForSequenceClassification model).
    Some weights of BertForSequenceClassification were not initialized from the model checkpoint at beomi/kcbert-base and are newly initialized: ['classifier.weight', 'classifier.bias']
    You should probably TRAIN this model on a down-stream task to be able to use it for predictions and inference.
    

## 6. 모델 학습시키기

파이토치 라이트닝(pytorch lightning*)이 제공하는 `LightningModule` 클래스를 상속받아 태스크(task)를 정의한다. 태스크에는 모델과 옵티마이저, 학습 과정 등이 정의되어 있다.
* pytorch lightning*: github.com/PyTorchLightning/pytorch-lightning 

### Task 정의

code 1-3**(1. 각종 설정하기-모델 환경 설정)**에서 만든 학습 설정(`args`)과 code 1-11**(5. 모델 불러오기-모델초기화)**에서 준비한 모델(`model`)을 `ClassificationTask`에 주입한다. `ClassificationTask`에는 **옵티마이저**(optimizer), **러닝 레이트 스케줄러**(learnig rate scheduler)가 정의되어 있다. 옵티마이저로는 **아담**(Adam), 러닝 레이트 스케줄러로는 `ExponentialLR`을 사용한다.

code1-12를 통해 문서 분류용 태스크를 정의할 수 있다.

#### code 1-12


```python
from ratsnlp.nlpbook.classification import ClassificationTask
task = ClassificationTask(model, args)
```

'Do it! 자연어 처리'의 저자 이기창 님의 비유를 인용하자면,

---
   *모델 학습 과정은 눈을 가린 상태에서 산등성이를 한 걸음씩 내려가는 과정과 같다. 러닝 레이트는 한 번 내려갈 때 얼마나 이동할지 보폭에 해당한다.*

---

학습이 진행되는 동안 점차 러닝 레이트를 줄여 세밀하게 탐색하면 좀 더 좋은 모델을 만들 수 있다. 이 역할을 하는 게 바로 러닝 레이트 스케줄러이다. `ExponentialLR`은 현재 에포크(epoch*)의 러닝 메이트를 '이전 에포크의 러닝 레이트 x gamma'로 스케줄링 한다. 본 예제에서는 gamma를 0.9로 설정하였다.
* 에포크: 데이터 전체를 학습하는 횟수. 만일 에포크가 3이라면 데이터를 3번 반복 학습한다는 뜻이다.


### 트레이너 정의

code 1-13을 통해 트레이너를 정의할 수 있다. 이 트레이너는 파이토치 라이트닝 라이브러리의 도움을 받아 GPU/TPU 설정, 로그 및 체크포인트 등 귀찮은 설정을 알아서 해 준다.

#### code 1-13


```python
trainer = nlpbook.get_trainer(args)
```

    /usr/local/lib/python3.7/dist-packages/pytorch_lightning/utilities/distributed.py:69: UserWarning: Checkpoint directory /gdrive/My Drive/nlpbook/checkpoint-doccls exists and is not empty.
      warnings.warn(*args, **kwargs)
    GPU available: True, used: True
    TPU available: False, using: 0 TPU cores
    

### 학습 개시

code 1-14처럼 트레이너의 `fit()`함수를 호출하면 학습을 시작한다. 학습 시간은 자신의 코랩 환경에 따라 다를 수 있으나 꽤 오래 걸릴 수 있다. 학습이 진행되는 도중 브라우저를 끄면 모델 학습을 비롯한 코랩 실행이 중단되니 주의해야한다.

#### code 1-14


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
    435.680   Total estimated model params size (MB)
    


    Training: 114it [00:00, ?it/s]



    Validating: 0it [00:00, ?it/s]



    Validating: 0it [00:00, ?it/s]




---


# **문서 분류 모델 학습**을 요약하자면

# 각종 설정을 마친 뒤 말뭉치를 내려받아 전처리한다. 프리트레인을 마친 모델을 이 데이터에 맞게 파인 튜닝한다.

