---
title:  "[AI Hackathon] 2024 SmileGate FutureLab AI service weeklython 회고"
excerpt: ""
categories:
  - Projects, Hackathon
tags:
  - Hackathon
toc: true
toc_sticky: true
use_math: true
date: 2024-07-31
last_modified_at: 2024-07-31
---
<!--
⚠️ Math Rendering Rules ⚠️
1. Do NOT wrap math expressions in backticks (` `).
   - INCORRECT: `$x + y$`
   - CORRECT: $x + y$
2. Do NOT wrap math delimiters (`$`) in bold (`**`) or italics (`*`).
   - INCORRECT: **$x$**
   - CORRECT: $x$ or $\mathbf{x}$
3. Format exponents using math mode (e.g., for 2 to the power of n).
   - INCORRECT: 2^n
   - CORRECT: $2^n$
4. Use $ for inline math and $$ for block math.
-->

## Introduction

본 포스트는 2024년 SmileGate FutureLab에서 주최한 제1회 AI service weeklython에서 대상을 수상한 AI-driven Game Scenario Generator에 대한 포스트입니다. 

AI 위클리톤의 경우, 2024년 7월 21일에 열린 "온보딩 워크숍"을 바탕으로 개발자와 기획자들이 모여 팀구성 및 아이디어를 선정하였으며, 주중 5일동안 아이디어를 구체화하고 개발이 진행되었습니다. 이후 7월 26일, 27일에 개최된 "집중개발데이"에서 모든 팀들이 모여 프로토타입을 개발하여 서비스를 제시함으로서 모든 팀들의 서비스를 직접적으로 체험할 수 있었습니다. 

해당 대회와 관련하여, [링크](https://newsroom.smilegate.com/lab/2024AIweeklyton)를 통해 관련 내용을 확인할 수 있습니다.
본 포스팅을 통해 대회를 회고해보면서 AI-driven Game Scenario Generator 프로젝트를 진행하면서 사용된 기술들과 접근 방식에 대해 정리해보았습니다. 

해당 서비스는 다음 [Github Repository](https://github.com/sehooni/AIStoryWeaver)에서 확인할 수 있으며, 프로토타입의 사진은 본 포스트 하단에서 확인 가능합니다!

## 사용 기술 정리
1. OpenAI GPT 4o Fine-tuning
2. DALL-E3
3. Gradio

### 1. OpenAI GPT 3.5 turbo & 4o Fine-tuning

[OpenAI Platform - Authentication](https://platform.openai.com/docs/api-reference/authentication)과 [OpenAI Platform - Model optimization](https://platform.openai.com/docs/guides/model-optimization)에 GPT fine-tuning과 관련한 내용이 상세히 명시되어 있습니다. 

정리해보자면 우선 OpenAI GPT Fine-tuning을 진행하기 위해서는 OPENAI API KEY가 필요합니다.

결국 우리가 평상시 사용하는 ChatGPT와는 달리, 다음 [OpenAI Platform](https://platform.openai.com/docs/overview)에서 계정을 연결하고 billing을 진행해야 합니다.``ChatGPT 구독을 해놓았더라도 본 서비스는 별도의 결제가 필요합니다!!``

다음과 같이 API key를 설정할 수 있습니다.
```python
pip install openai
```

```python
from openai import OpenAI

api_key = "..."
client = OpenAI(api_key=api_key)
```

해당 API key를 통해 OpenAI에서 제공하는 GPT Model을 사용할 수 있으며, 더나아가 fine-tuning을 진행할 수 있습니다.
학습을 진행하기 위해서는 데이터 포맷을 설정해줘야 합니다. OpenAI의 Fine-tuning 공식 Document를 보면 아래 사진과 같이 설명이 되어 있습니다.

![preparing_training_data](/assets/images/2024-07-31-2024smilegate-futurelab-ai-service-weeklython-ai-driven-game-scenario-generator/openai_finetuning_data.png)

즉, Fine-tuning을 진행하기 위해서는 다음과 같이 데이터를 준비합니다.
- JSONL 형태의 데이터
- Prompt, completion 형태의 데이터
- Prompt에서는 원하는 프롬프트를 구성
- Completion에서는 원하는 결과를 구성 

저희는 다음과 같이 기존에 만들어놓은 데이터셋을 바탕으로 GPT 4o에 입력으로 들어갈 수 있도록 포맷을 수정하였습니다.
```python
import jsonlines

train_data = OrderedDict()
message_list = list()
with jsonlines.open("./data/minimal_cookie_data.jsonl") as f:
    for line in f.iter():
        message = []
        message.append({"role": "system", "content": "저는 입력받은 내용을 기반으로 game scenario를 생성해줍니다."})
        
        prompt_content, answer_content = line['prompt'], line['completion']
        message.append({"role": "user", "content": prompt_content})
        message.append({"role": "assistant", "content": answer_content})
        
        message_dict = {"messages": message}
        
        message_list.append(message_dict)
message_list
```

데이터가 준비되면 다음 사진과 같이 Platform을 통해 학습을 진행할 수 있습니다.
![model finetuning](/assets/images/2024-07-31-2024smilegate-futurelab-ai-service-weeklython-ai-driven-game-scenario-generator/image-1.png)



실제 서비스 프로토타입에서는 학습해놓은 모델과 더불어 다음 Prompt Engineering을 적용하였습니다.
```python
PROMPT_ENGINEERING = "이제부터 판타지 rpg 게임을 만들거야. 밑에 조건들 모두 따라야만해 \
1. 맵 레벨은 적어도 3개 필요하고 쉬운단계부터 어려운 단계에서 끝내야돼. \
2. 주요 퀘스트와 서브 퀘스트가 적절한 난이도로 설계하기. \
3. 보상은 다양할지만 다음 레벨로 올라가는 보상은 무조건 필요해. \
4. 게임 설명은 50-70자 적어줘 \
5. 배경은 최대한 자세하게 50-70자 적어주고 다양성이 중요해. \
6. 매번 검색은 전 세계적으로 인기를 얻었던 그리고 최신 rpg 게임을 reference로 잡고 퀘스트 만들어줘. \
7. 출력할때 적어도 50번은 전혀 일치하지 않는 내용으로 출력해줘 \
8. 이해하기 편하게 키워드도 따로 정리해줘."
```

이후 모델을 호출하여 유저의 input과 더불어 prompt engineering을 적용한 결과를 반환받고, 반환된 결과를 바탕으로 게임의 스토리, 퀘스트, 보상 등을 구성하였습니다. 아래 코드는 fine-tuning 모델이 아닌 일반 gpt-4o-mini를 적용한 예시입니다.
```python
def call_model(text, quest_item, event):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "넌 창의적인 판타지 RPG 게임 시나리오 작가야."},
            {"role": "user", "content": f"{PROMPT_ENGINEERING} 등장인물은 {text} 이고, 주요 이벤트는 {event}이야. 이 조건들로 3개 퀘스트 만들어줘"}
        ]
    )
    answer = completion.choices[0].message.content
```  


### 2. DALL-E3

위에서 말씀드린 바와 같이 GPT를 fine-tuning하기 위해서 API를 연결하고 billing을 진행하였습니다. 두 단계가 완료되고 platform을 살펴보다보니, Dall-E3 또한 사용이 가능한 것을 확인하였습니다.

이 과정에서는 따로 모델을 학습할 필요없이 연결된 Dall-E3 model을 불러와서 사용하면 되는 것입니다.

코드를 통해 살펴보면 다음과 같습니다.

```python
response = client.images.generate(
        model="dall-e-3",
        prompt=f'{quest_item}, 게임 에셋, 게임 아이템, 3d 모델 비디오 모델 에셋, 검은 배경, 화려한 색상, 판타지 게임, 고대의 스타일',
        size="1024x1024",
        quality="standard",
        n=1,
    )
image_url = response.data[0].url
res = request.urlopen(image_url).read()
quest_item = Image.open(io.BytesIO(res))
```

우리가 원하는 디자인을 prompt로 전달함으로서 이미지를 생성할 수 있습니다!

### 3. Gradio

모델을 학습했다면 유저로 하여금 사용할 수 있도록 UI를 구현하는 것이 필요합니다. 
본 과정은 같이 참여한 개발자 이준형씨가 제시해주었습니다!

Gradio 사용법은 파이썬 환경에서 pip install gradio로 설치 후, import gradio as gr로 임포트하여 gr.Interface 또는 gr.Blocks 클래스에 함수, 입력(inputs), 출력(outputs) 컴포넌트를 지정해 웹 UI를 만들고 .launch() 메서드로 실행하는 것입니다. 

핵심은 머신러닝 함수를 웹 앱으로 빠르게 변환하는 것으로, 텍스트, 이미지, 음성 등 다양한 입출력 컴포넌트를 활용해 모델 데모를 쉽게 만들 수 있습니다.

Gradio는 [Gradio 공식 문서](https://www.gradio.app/guides/quickstart)를 참고하여 만들었습니다.
이를 통해 다음과 같이 UI를 구현할 수 있습니다.

![service1](/assets/images/2024-07-31-2024smilegate-futurelab-ai-service-weeklython-ai-driven-game-scenario-generator/image.png)

![시연영상](/assets/images/2024-07-31-2024smilegate-futurelab-ai-service-weeklython-ai-driven-game-scenario-generator/시연영상.gif)


## [후기] 대회를 마무리하며..
프로토 타입을 개발하는 과정에서 데이터 수집, 데이터 전처리를 직접 진행하고, LLM-finetuning (GPT4o API)을 통해 모델을 학습을 진행하였습니다. LLM Fine-tuning은 데이터의 질과 구성이 중요하게 작용하였고, 유저가 원하는 결과를 모델이 제공할 수 있도록 하기 위해 Prompt Engineering을 추가로 적용하여 서비스의 질을 높일 수 있었습니다. 

또한 글로만 유저에게 제공된다면, 시각적인 요소가 부족할 뿐만 아니라 피로도가 높을 것이라 판단해, Dall-E3 API를 통해 이미지를 생성하여 서비스에 추가하는 방안을 제안하고 적용함으로써 평가에서 좋은 피드백을 받을 수 있었습니다. 

대회가 끝나고 다른 팀들과의 질의응답을 통해 대회 당시 LLM-finetuning의 방법론에서 우리가 부족했던 부분을 파악할 수 있었는데, 학습 시 처음부터 학습 데이터를 많이 사용하는 것이 아니라, **few-shot learning**을 적용하면 기존 GPT의 성능을 유지하면서 우리가 원하는 결과를 얻을 수 있다는 점을 배웠습니다.

기존 장르 시나리오 생성형 AI 서비스를 분석해보고 인디게임 개발자들을 대상으로 본 프로젝트의 필요성 및 수요를 조사해보았었는데, 기존 서비스들이 존재함에도 불구하고 아직 많은 개선이 필요함을 확인하고, 이를 통해 본 프로젝트 아이디어의 타당성을 확인할 수 있었습니다. 이러한 점은 유저 입장에서 그들이 원하는 서비스는 무엇인지, 어떠한 점들을 바탕으로 자료 및 수요 조사가 진행되어야 하는지 깊게 생각해 볼 수 있었습니다. 

더 나아가 기술적으로도 **ChatGPT, Dall-E3의 사용법 및 API를 통한 서비스를 직접 구현해봄으로서 AI Researcher/Engineer로서의 역량을 키울 수 있었으며 최종적으로 본 대회에서 대상을 수상할 수 있었습니다. :)**


긴 글 읽어주셔서 감사합니다! 

저에게 연락을 주고 싶으신 것이 있으시다면 
- LinkedIn : www.linkedin.com/in/sehoon-park-575b8b22a
- Github : https://github.com/sehooni
- 블로그 댓글
으로 연락 주시면 감사하겠습니다.

## 참고 자료
- [챗봇 제작 블로그](https://velog.io/@t_wave/gradiolangchainchatbot)
- [GPT finetuning 블로그](https://littlefoxdiary.tistory.com/118)
- [GPT finetuning 방법정리](https://lsjsj92.tistory.com/656)