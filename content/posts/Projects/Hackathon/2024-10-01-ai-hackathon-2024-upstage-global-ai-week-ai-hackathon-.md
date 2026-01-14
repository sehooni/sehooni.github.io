---
title:  "[AI Hackathon] 2024 Upstage Global AI week AI Hackathon 회고"
excerpt: ""
categories:
  - Projects, Hackathon
tags:
  - Projects, Hackathon
toc: true
toc_sticky: true
use_math: true
date: 2024-10-01
last_modified_at: 2024-10-01
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

해당 포스트는 Upstage에서 주최한 **2024 Global AI Week - AI Hackathon**에서 Finalist로 선정되기까지의 여정을 회고해보고, 대회 당시 사용한 기술들에 대한 내용을 담고 있습니다.

Global AI Week - AI Hackathon은 **+43개국에서 총 +610명의 참가자가 참여했었으며, Final 15팀의 경우 +13개국의 팀원들이 참가했습니다**.

본 대회는 **'AGI for Work': Utilize AI tech to address business challenges while enhancing efficiency and productivity** 라는 주제를 바탕으로 다음 5가지의 tracks로 구성되어 있습니다.
- Finance
- Healthcare & Wellness Tech
- Legal
- Travel and Tourism
- Innovation (Etc topic)

또한 Offline Hackathon으로 진출하기 까지 다음 3개의 Round가 존재했었습니다.
- Round 1 : Online Hackathon - Document Review
- Round 2 : Online Hackathon - Presentation (Top30)
- Round 3 : Offline Hackathon (Top15)

![upstage_ai_hackathon](/assets/images/2024-10-01-ai-hackathon-2024-upstage-global-ai-week-ai-hackathon-/image.png)

대회와 관련한 자세한 내용은 [Upstage Global AI Week AI Hackathon](https://www.upstage.ai/events/global-ai-week-ai-hackathon?utm_campaign=20240720_global_ai_week_ai_hackathon_email_univ&utm_medium=Email&utm_source=Brevo_Univ)를 통해 확인할 수 있습니다.


저는 저희 대학원 연구실 소속 석사과정 동료들과 함께 'BISAI'라는 팀으로 Healthcare & Wellness Tech track에 'AI 약사 챗봇'이라는 아이디어를 바탕으로 대회에 참여하였습니다. 일반 약품의 과다복용은 큰 위험요소로 존재하기에 이를 해결하는 서비스를 만들면 어떨까라는 생각에서 해당 아이디어를 구상하게 되었습니다. 

![Problem_definition_and_solution](/assets/images/2024-10-01-ai-hackathon-2024-upstage-global-ai-week-ai-hackathon-/image-3.png)

실제 데이터를 구성하는 단계에서 약품 데이터의 한계가 존재하였었고, 이를 해결하기 위해 약품 대신, 영양제 과다 복용 사고사례를 조사하고 신빙성을 바탕으로 영양제 과다복용 방지 서비스를 개발하고, 약사와 연결해줄 수 있는 약사 챗봇 서비스를 추가로 개발하여 같이 제시하였습니다. 그 결과 Finalist에 선정되는 결과를 얻을 수 있었습니다. 
해당 서비스의 경우 다음 [Github Repository](https://github.com/sehooni/NutriPharmAI)를 통해 확인할 수 있습니다.

![nutri_pharm_ai](/assets/images/2024-10-01-ai-hackathon-2024-upstage-global-ai-week-ai-hackathon-/image-2.png)

해당 서비스의 경우, 다음 4가지의 API Key를 필요로 합니다.
- Langchain API key
- OpenAI API key
- Upstage API key
- Predibase API key

본 대회에서 Project Impact와 Technical Implementation, Inovation & Creativity 뿐만 아니라, ``Upstage의 Solar LLM``과 ``Upstage API``를 어떻게 활용하였는가도 중요 평가지표로 사용되었습니다.

그럼 해당 서비스를 구성하는데 사용한 기술에 대해 이야기를 해보도록 하겠습니다. 

## 사용 기술 정리
1. Upstage API : Solar LLM Fine-tuning, Generation, Embedding, Chat, OCR, and Groundness Check
2. RAG & LangGraph
3. Gradio

### 1. Upstage API : Solar LLM Fine-tuning, Generation, Embedding, Chat, OCR, and Groundness Check
초기 온라인 해커톤 단계에서는 Upstage API를 사용하여 Solar LLM Fine-tuning과 Generation, Embedding, Chat, Groundness Check를 서비스를 구현하였습니다.

Upstage API는 다음 [Upstage Console](https://console.upstage.ai/docs/getting-started)에서 받을 수 있으며, 다양한 사용방법들을 잘 정리해두었는데요. 본 대회에서 사용한 방법들에 대해 살펴보도록 하겠습니다.

#### Solar LLM Fine-tuning

Solar LLM


오프라인 해커톤 단계에서 OCR기능을 추가하였습니다!

### 2. RAG & LangGraph

#### RAG(Retrieval Augmented Generation; 검색증강생성)
RAG(Retrieval Augmented Generation; 검색증강생성)는 LLM이 답을 생성하기 전에 벡터DB나 검색엔진에서 관련 문서를 검색해 Context로 주입한 뒤, 이를 바탕으로 답변을 생성하는 방식으로, 쉽게 비유하자면 ``LLM에 외부 지식을 붙여서 "잘 아는 도메인 비서"로 만든다``고 설명할 수 있습니다.

전통적인 파인튜닝과 달리, 모델 자체는 그대로 두고 외부 지식DB만 업데이트하면 되기 때문에 최신성 및 도메인 특화, 비용 측면에서 효율적이라고 알려져 있습니다.

전형적인 RAG의 파이프 라인은 
1. 문서 수집/정제 (Document Collection/Preprocessing) 
2. Chunking & Embedding
3. Vector indexing (Vector DB)
4. 질의 시 유사도 검색
5. 검색 결과를 Prompt에 붙여서 LLM 호출

순으로 구성됩니다.

#### LangGraph
LangGraph는 
오프라인 해커톤 단계에서 기존 RAG & LangGraph의 성능을 고도화하였습니다.


### 3. Gradio
바로 이전 [스마일게이트 해커톤](https://sehooni.github.io/Projects/Hackathon/2024smilegate-futurelab-ai-service-weeklython-ai-driven-game-scenario-generator)에서 사용한 Gradio를 사용하여 직접 프로토타입을 구현하였습니다. 당시에는 팀원이 주도적으로 진행을 하였다면, 당시 경험을 살려 직접 연결하고 서비스를 구현하였습니다.

Gradio의 경우, [Gradio 공식 문서](https://www.gradio.app/guides/quickstart)를 참고하면 보다 쉽게 구현할 수 있습니다. 

## 최종 프로토타입 형태
아래 영상을 통해 저희 프로젝트 프로토타입의 모습을 확인할 수 있습니다.

<video controls src="/assets/images/2024-10-01-ai-hackathon-2024-upstage-global-ai-week-ai-hackathon-/NutriPhamAI_prototype.mov" title="NutriPharmAI Prototype"></video>


## [후기] 대회를 마무리하며...

최종 목표였던 Top3에는 아쉽게도 선정되지 않았지만, Upstage의 Solar LLM을 finetuning하고 Upstage API, RAG, LangGraph, OCR을 활용한 기술을 직접 개발하는 것은 매우 의미있었습니다. 

이번 대회를 통해 
- 단순히 새로운 기술을 추가하여 서비스를 개발하는 것보다는 유저가 이용하기 좋은 서비스는 무엇인가?
- 서비스의 완성도는 어디서 오는가?
- 실제 산업 현장에서의 데이터를 바탕으로 유저의 니즈와 AI Engineer의 역할은 어떻게 되어야하는가
- 실제 학습을 위한 데이터는 어떻게 구성하고, 해당 데이터의 신뢰성은 어디서 오는가?

등과 같은 고민들에 대해 깊게 생각할 수 있었던 것 같습니다.

또한 실제 개발 환경에서 근무하는 다양한 멘토님과의 커뮤니케이션, 세션, 더 나아가 다양한 나라에서 참가한 팀원들과의 네트워킹도 본인에게 있어 큰 경험과 자산이 되었다고 생각합니다. 본 포스팅을 통해 다시한번 이러한 대회를 열어준 Upstage에 감사드립니다.

대회에 대한 회고는 이것으로 마무리하고, RAG에 대한 내용도 추가 공부 후 블로그에 업데이트할 예정입니다!
긴 글 읽어주셔서 감사합니다! 


저에게 연락을 주고 싶으신 것이 있으시다면 
- LinkedIn : www.linkedin.com/in/sehoon-park-575b8b22a
- Github : https://github.com/sehooni
- Email : 74sehoon@gmail.com
- 블로그 댓글
으로 연락 주시면 감사하겠습니다. :)