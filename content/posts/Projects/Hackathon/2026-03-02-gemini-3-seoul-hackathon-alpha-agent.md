---
title:  "[AI Hackathon] 2026 Gemini 3 Seoul Hackathon (Top 6 Finalist) 회고: Alpha-Agent"
excerpt: "1인 개발팀(Alpha_BioAgent)으로 참여한 Gemini 3 서울 해커톤 회고 및 Google Antigravity 기반 자율 AI 연구원(Alpha-Agent) 개발기"
categories:
  - Projects
  - Hackathon
tags:
  - Projects
  - Hackathon
  - AI Agent
  - Bioinformatics
  - Gemini 3.1 Pro
  - Google Antigravity
  - 제미나이
toc: true
toc_sticky: true
use_math: true
date: 2026-03-02
last_modified_at: 2026-03-02
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

안녕하세요! 지난 2026년 2월 28일, Google DeepMind, AI Futures Fund, Attention X가 주관 및 주최한 **Gemini 3 서울 해커톤 (Gemini 3 Seoul Hackathon)에** 참여했습니다.

이번 대회는 차세대 초거대 멀티모달 모델인 **Gemini 3.1 Pro**와 구글의 신규 에이전트 오케스트레이션 프레임워크인 **Google Antigravity**를 직접 빌드해보고 실전 문제를 해결하는 오프라인 해커톤이었습니다. 

저는 대학원 및 최근 KBSI에서의 연구 경험(단백질 구조 예측 및 생물정보학)을 살려, **1인 개발팀(팀명: Alpha_BioAgent)으로** 참여하였고, 최종 본선 6개 팀에 선정되어 현장 데모 및 프로젝트 발표를 무사히 마쳤습니다.

![Gemini 3 Seoul Hackathon Poster](/assets/images/Alpha-Agent/gemini3_hackathon.jpeg)

*   **프로젝트명**: Alpha-Agent: Autonomous AI Co-Scientist
*   **팀원**: Solo Developer (Team Alpha_BioAgent)
*   **사용 기술**: Gemini 3.1 Pro, Google’s Antigravity Platform, Python (Bio.PDB, PyMOL), Vision Multimodal Model
*   **GitHub Repository**: [https://github.com/sehooni/Alpha_Agent](https://github.com/sehooni/Alpha_Agent)
*   **대회 공식 링크**: [Gemini 3 Seoul Hackathon](https://cerebralvalley.ai/e/gemini-3-seoul-hackathon) / [프로젝트 갤러리](https://cerebralvalley.ai/e/gemini-3-seoul-hackathon/hackathon/gallery)

생명과학 실험실에서 흔히 발생하는 "Valley of Death(컴퓨터 예측과 실제 실험 결과 사이의 오차)"를 메우기 위해 빌드한 **자율 연구 에이전트(Autonomous Research Agent)** 개발 과정과 해커톤의 여정을 본 포스트를 통해 기록하고자 합니다.

---

## 1. 문제 정의 및 기획 의도
### Computational Prediction vs. Wet-Lab Reality
현대 구조생물학은 AlphaFold 등을 필두로 컴퓨터(in-silico)상에서 단백질 3차원 구조를 예측하고 설계하는 과정이 혁신적으로 빨라졌습니다. 하지만 컴퓨터가 "성공적"이라고 도출해 낸 단백질 후보군도, 실제 실험실(in-vitro / wet-lab)에서 직접 발현 및 검증을 해 보면 단백질이 뭉쳐서 덩어리가 되거나(Aggregation), 구조적으로 붕괴해 버려 실험이 실패하는 경우가 허다합니다. 이 오차를 해결하는 과정을 생물학 분야에서는 흔히 **"죽음의 계곡(Valley of Death)"이라** 부릅니다.

일반적인 대형언어모델(LLM)에 3D 단백질 파일(PDB/CIF) 내용을 텍스트로 주고 "거리 검증"이나 "구조적 안정성"을 평가하게 하면, 수많은 원자 좌표들 간의 거리를 텍스트 매칭만으로 계산하려 들기 때문에 엄청난 **수치적 환각(Numerical Hallucinations)이** 발생합니다.

이를 해결하기 위해, 저는 AI 모델이 단순히 텍스트에 갇혀 추론하는 것이 아니라 **도구(Python 스크립트 실행, 비전 분석 등)를 자율적으로 활용해 실제 3D 물리 환경을 검증하고, 스스로 피드백을 받아 설계를 수정하는 자율형 연구 에이전트 Alpha-Agent**를 기획했습니다.

---

## 2. 주요 기술적 시도 및 구현

Alpha-Agent의 핵심 아키텍처는 다음 3가지 모듈로 구성됩니다.

![Alpha-Agent Presentation Screen](/assets/images/Alpha-Agent/Alpha_agent_pt.jpeg)

### ① Google Antigravity 기반 그라운딩 & 환각 제거 (Grounding Tools)
LLM의 원자 좌표 연산 한계를 해결하기 위해, 에이전트가 단백질 3차원 좌표 데이터 분석 도구인 `Bio.PDB` Python 라이브러리를 자유자재로 다루도록 설계했습니다.
*   **자율 도구 생성 및 실행**: 에이전트가 특정 잔기(Residue) 간의 거리(Å)나 원자 간 결합(Disulfide Bond, Hydrophobic Interactions) 여부를 직접 계산하는 Python 코드를 백그라운드 샌드박스에서 즉석 생성 및 실행하도록 구현했습니다.
*   이를 통해 오차 거리를 물리 법칙 수준에서 $100\%$ 완벽히 계산 및 검증하여, LLM 특유의 수치적 난제를 완전히 극복했습니다.

### ② B-factor 기반 Thermal Wobble 멀티모달 분석
단백질 결정 구조 내 각 원자들의 열 진동 정도를 나타내는 **B-factor** 지표를 활용하여 동적 불안정성을 포착했습니다.
*   일반적인 텍스트 모델은 3D 구조의 동적 유연성을 분석할 수 없습니다. 따라서 저는 에이전트가 `PyMOL` 시뮬레이션을 돌려 단백질이 온도 변화에 따라 흔들리는 **Thermal Wobble 3D 애니메이션 비디오**를 렌더링하도록 했습니다.
*   이 비디오를 **Gemini 3.1 Pro의 비전 멀티모달 인터페이스**에 인풋으로 주어, "구조적 흔들림이 너무 강해 붕괴 가능성이 높은 dynamically unstable loops"를 시각적으로 감지 및 검출해 냈습니다.

### ③ Closed-Loop 자가 교정 피드백 루프 (Self-Correction System)
실제 Wet-Lab 피드백(예: 단백질 응집 현상 발생 등의 가상 실험 데이터)이 들어오면 에이전트가 이를 분석합니다.
*   "단백질 표면의 소수성 잔기가 노출되어 응집이 생김"이라는 진단이 나오면, 에이전트가 코드를 다시 수정하여 표면 전하 분포를 조정하거나 대체 아미노산 서열 후보를 제안하는 self-correcting 메커니즘을 구축했습니다.

---

## 3. 해커톤 진행 과정과 데모

해커톤 시작부터 끝까지 1인 개발로 백엔드 파이프라인(Antigravity Agent), 데이터 렌더러(PyMOL), 그리고 Gradio 기반의 인터랙티브 대시보드를 홀로 완성해 내야 했습니다. 

아래는 완성된 **Alpha-Agent Sandbox UI** 화면입니다.

![Alpha-Agent Sandbox Dashboard](/assets/images/Alpha-Agent/Alpha_Agent_UI.jpeg)

대시보드 상에서 사용자가 특정 PDB ID(예: `6EQE`)를 입력하거나 업로드하면:
1.  **Reasoning Trace** 창에 에이전트가 Antigravity 샌드박스 내부에서 어떤 추론과 Python 코드 실행을 진행 중인지 실시간으로 노출됩니다.
2.  `analyze_b_factors()` 등의 물리 검증 함수가 실행되어 `Resi 292` 지점이 불안정함을 밝혀냅니다.
3.  멀티모달 평가를 통해 루프 영역의 wobble(흔들림)을 비전 기반으로 재평가하고, 구조 안정성 확립을 위한 Mutation 가이드를 자율 제안합니다.

---

## 4. 최종 본선 진출 및 성과

치열한 예선 심사를 거쳐, 최종 **Top 6 본선 진출 팀**으로 호명되었습니다! 1인 개발팀이었기에 기쁨은 배가 되었습니다.

![Top 6 Teams Announcement](/assets/images/Alpha-Agent/Finalist.jpeg)

현장에는 구글의 수많은 기술 멘토님들과 AI 생태계 관계자분들이 계셨는데, 구글의 새로운 기술 스택인 **Antigravity**를 생물정보학(Bioinformatics)이라는 매우 명확한 실제 학술/도메인 도구와 결합하여 성공적으로 구현해 낸 점에서 높은 평가를 받을 수 있었습니다.

---

## 5. 마치며 (Retrospective)

이번 해커톤을 통해 단순히 생성형 AI가 그럴듯한 답변을 내놓는 것을 넘어, **"완전한 샌드박스 제어권과 물리적 그라운딩(Grounding) 도구를 쥐여주었을 때 에이전트가 얼마나 정교한 연구 파트너(Co-Scientist) 역할을 수행할 수 있는가"를** 직접 목격하고 증명했습니다.

1인 개발팀이라 체력적으로 정말 고된 해커톤이었지만, 프론트엔드 대시보드 구축부터 에이전트 시계열 추론 엔진, 물리 시뮬레이션 연동까지 혼자서 완수해낸 덕분에 시스템 아키텍처 전체를 깊게 파악하고 장악하는 좋은 계기가 되었습니다.

앞으로도 LLM 및 에이전트 기술을 바이오/생물학/의학 도메인 지식에 결합하여 세상에 가치 있는 도구들을 만들어 나가는 AI 연구 엔지니어로 성장하겠습니다.

좋은 대회를 경험하게 해주신 Google DeepMind 및 해커톤 스태프분들께 진심으로 감사드립니다!

![Gemini 3 Seoul Hackathon Memory](/assets/images/Alpha-Agent/Gemini_me.jpeg)

---
긴 글 읽어주셔서 감사합니다! 

**Contact & Inquiries**
- LinkedIn : [Sehoon Park](https://www.linkedin.com/in/sehoon-park)
- GitHub : [https://github.com/sehooni](https://github.com/sehooni)
- Email : 74sehoon@gmail.com
- 궁금한 점이나 의견은 댓글 혹은 메일을 통해 언제든 환영합니다! :)
