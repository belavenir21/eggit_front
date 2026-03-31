# 🥚 Eggit (에깃) - Frontend

<img width="500" alt="스크린샷 2026-03-28 204119" src="https://github.com/user-attachments/assets/b77e275d-6b36-4f0e-a541-35b88c040d14" />


> GitHub 활동 기반 성장형 개발자 블로그 플랫폼의 프론트엔드입니다.

> 개발자의 커밋, 포스팅, 퀘스트 활동을 게이미피케이션 요소로 시각화하여 기록 습관을 만들어가는 서비스입니다.
> 
>  주요 기능은
>  1. 사용자의 깃허브와 연동하여 손쉽게 블로그를 생성하고, 깃허브 사용 내역을 활용해 블로그 글을 포스팅하도록 도와주는 것입니다.
>  2. 내 깃허브 사용 정보와 블로그 사용 정보를 대시보드로 시각화하고, 나만의 아바타를 성장시켜 즐거운 기록 습관을 만듭니다.
 
> 서비스의 보다 원활한 이용을 위해 튜토리얼과 서비스 설명창을 제공하고 있습니다.


<br>

## ✨ 주요 기능

**🥚 아바타 성장 시스템**
- 개발자 성향 테스트(12문항) 기반 9가지 맞춤형 아바타 지급
- Egg → Child → Adult → Master 4단계 성장
- 레벨업 시 애니메이션 오버레이 및 알림 표시

**🛖 블로그 생성 및 작성**
- Github API 연동하여 사용자 깃허브 계정에 블로그용 레포지토리를 자동 생성
- 블로그 용도에 따라 Docs/기술로 나누어 생성 가능
- 커밋 내역을 불러와 해당 내용에 어울리는 글감으로 AI 추천 (다음 항목에서 상세)

**✍️ 마크다운 에디터**
- 실시간 프리뷰 지원 (작성/미리보기 즉시 전환)
- Ctrl+B, Ctrl+I, Ctrl+E 등 단축키 지원
- AI 글감 추천 및 자동 완성 (백엔드 연동)

**🎯 데일리 퀴즈 및 글감 추천 **
- 매일 오후 12시 전 날까지의 커밋내역을 분석해 사용자 기반 CS 퀴즈 생성
- 동일하게 사용자 기반 블로그 글감 AI 추천 

**💬 실시간 채팅**
- WebSocket 기반 1:1 메시징
- 읽지 않은 메시지 배지 및 알림 스택
- 친구 온라인 상태 실시간 표시

**🎯 퀘스트 시스템**
- 일일/주간 퀘스트 완료 시 경험치 획득
- 완료된 퀘스트 초록색 하이라이트 및 파티클 효과
- 보상 수령 시 토스트 알림

**🏠 메인 대시보드 (3단 레이아웃)**
- 좌측 패널: 사용자 프로필, 아바타 상태, 블로그 관리 버튼, 실시간 채팅
- 중앙 패널: 성장형 아바타 캐릭터, 경험치 바, 상태 메시지
- 우측 패널: 일일 퀘스트 보드, GitHub 활동 통계, 잔디 히트맵

**🦄 튜토리얼**
- 최초 로그인 시 메인 화면에 표시
- 이후 설명창 모달에서 재확인 가능
- 서비스 흐름(시나리오) 전반에 대한 자세한 설명

<br>

## 서비스 화면

**회원가입(로그인)**


**개발자성향조사페이지**



<img width="400" alt="스크린샷 2026-02-04 170600" src="https://github.com/user-attachments/assets/390d67b5-06d6-4ec8-b0d7-2a49251078f7" />

**메인화면(홈)**

<img width="500" alt="스크린샷 2026-02-02 094027" src="https://github.com/user-attachments/assets/7a8a36cb-c522-4f4b-be4e-6603cf1c0e8e" />

**튜토리얼**

<img width="500" alt="튜토리얼" src="https://github.com/user-attachments/assets/6fc8b4e4-9661-4756-82db-95017d1d45d5" />

**[튜토리얼 진행 과정 영상 링크](https://drive.google.com/file/d/14HyZTxzpe4mnbOmuAeFoOBuJ0rao5SF1/view?usp=sharing)**

**설명창 모달**

![설명창모달 (1) (1)](https://github.com/user-attachments/assets/9c9fff70-4269-4d64-9aa5-e223ddc31497)


**프로필 및 블로그 생성/작성**

![프로필컴포넌트상호작용](https://github.com/user-attachments/assets/2f9b316b-6707-48ef-8949-15d2c90b5b54)

<img width="700" alt="블로그포스팅" src="https://github.com/user-attachments/assets/116258f5-dd08-4a07-8146-3f0e7f21287e" />

> 왼쪽 상단 프로필 컴포넌트에서는 사용자와 블로그 정보를 확인할 수 있습니다.
> 기본 상태는 사용자의 아이디와 아바타의 레벨, 성장 상태를 보여주고
> 컴포넌트를 뒤집으면 사용자가 보유한 블로그의 목록을 확인할 수 있습니다.

<img height="500" alt="캘린더컴포넌트" src="https://github.com/user-attachments/assets/8896c13b-1cd1-4f2e-91ad-0779db6bf297" />

> 왼쪽 하단 캘린터 컴포넌트에서는 블로그 작성 정보를 확인할 수 있습니다.
> 블로그를 작성한 일자에 맞게 캘린터에 점으로 표시되며
> 해당 일자를 클릭하면 해당일에 작성한 블로그 글 목록이 표시됩니다.

**대시보드 시스템**

<img width="480" height="309" alt="image" src="https://github.com/user-attachments/assets/fd2105cd-f454-4126-8b14-62bf9aecb8a1" />


> 오른쪽 상단 대시보드 컴포넌트에는 사용자의 깃허브 정보를 바탕으로 주 사용 기술스택이 표기됩니다.
> 생성된 모든 블로그에서 작성한 게시글의 개수와 Eggit 홈페이지 내 나의 페이지에 방문한 전체 방문자 수가 표기됩니다.

**퀘스트 시스템**

<img width="700" alt="퀘스트시스템" src="https://github.com/user-attachments/assets/6bb01840-897a-4575-ae85-fe6f2bc2866b" />

> 오른쪽 하단 퀘스트 컴포넌트에는 일일 퀘스트와 주간 퀘스트를 확인할 수 있습니다.
> 기본 상태에서는 일일 퀘스트를 확인할 수 있고 토글 버튼으로 주간 퀘스트로 전환할 수 있습니다.
> 완료한 퀘스트는 토글 내부에서 빠져나와 최상단에 배치되며 어떤 상태에서도 확인할 수 있습니다.

**사이드바**

![사이드바구성 (2) (1)](https://github.com/user-attachments/assets/13d6e5f2-8a5a-402f-b325-007bc8ebf135)

![사이드바-친구탭구성 (1)](https://github.com/user-attachments/assets/11d3bc8e-8b08-4571-abf1-b04ec38ad190)


**블로그 포스팅 페이지**

<img width="700" alt="image" src="https://github.com/user-attachments/assets/eaca6d19-ebaf-49a9-898b-6aa3016688c6" />
<img width="700" alt="image" src="https://github.com/user-attachments/assets/4224ddfc-c315-44d8-a52f-80bc9937b3b0" />
<img width="700" alt="image" src="https://github.com/user-attachments/assets/cd7c1a30-92b2-45f2-a887-e149ea87939d" />

> 레포지토리와 커밋 내역을 불러와 AI가 어울리는 내용으로 초안을 작성합니다.
> 블로그 용 마크다운 에디터를 제공해 Eggit 내에서 내용을 자유롭게 작성하고 편집할 수 있습니다.

**방명록(내 페이지)**

<img width="500" alt="스크린샷 2026-02-06 155926" src="https://github.com/user-attachments/assets/fc8528e4-e2e7-45d3-b8b9-0289593cab5b" />

**방명록(친구 페이지)**

<img width="400" alt="스크린샷 2026-02-06 161406" src="https://github.com/user-attachments/assets/97e606ae-f88b-48fc-9e7f-07573e207286" />

> 다른 유저와 상호작용하는 주요 기능으로, 다른 사용자의 홈페이지에서 쉽게 방명록을 작성할 수 있도록 메인 중앙 컴포넌트에 배치했습니다. <br>
> 내 홈페이지에서 확인할 때에는 '블로그' 라는 주요 기능보다 우선도가 낮아 방명록 '버튼'을 통해 접근할 수 있도록 위계를 나누었습니다.

**아바타 진화 시스템**

![아바타진화 (1)](https://github.com/user-attachments/assets/4861dbf4-01a4-4655-9b14-d5f2cbb9652b)


> 1 / 10 / 30 레벨 단위로 총 4단계 캐릭터 진화가 이루어집니다.
> 경험치를 획득하여 아바타 레벨을 높이고 진화까지 할 수 있습니다.


<br>

## 🛠 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.2.0 | UI 컴포넌트 |
| Vite | 7.2.4 | 빌드 도구 |
| TailwindCSS | 4.1.18 | 스타일링 |
| Zustand | 5.0.10 | 전역 상태 관리 |
| React Router | 7.12.0 | 클라이언트 라우팅 |
| Axios | 1.13.2 | HTTP 클라이언트 |
| React Markdown | 10.1.0 | 마크다운 렌더링 |
| Lucide React | 0.562.0 | 아이콘 |

<br>

## 📁 프로젝트 구조

```
frontend/src/
├── components/
│   ├── LeftSidePanel.jsx       # 프로필, 채팅, 네비게이션
│   ├── MainCenterPanel.jsx     # 아바타, 경험치 바
│   ├── RightSidePanel.jsx      # 퀘스트, 통계
│   ├── ChatSidebar.jsx         # 실시간 채팅
│   ├── BlogCalendar.jsx        # 활동 캘린더
│   ├── EvolutionOverlay.jsx    # 레벨업 애니메이션
│   ├── GiftBoxModal.jsx        # 데일리 선물
│   ├── GuestbookModal.jsx      # 방명록
│   └── CommonUI.jsx            # 공통 UI 컴포넌트
├── pages/
│   ├── MainPage.jsx            # 메인 대시보드
│   ├── BlogCreationPage.jsx    # 블로그 생성
│   ├── BlogPostingPage.jsx     # 글쓰기 에디터
│   ├── AuthCallback.jsx        # GitHub OAuth 콜백
│   └── DeveloperTest/          # 성향 테스트
├── store/                      # Zustand 상태 관리
│   ├── useUserStore.js
│   ├── useAuthStore.js
│   ├── useAvatarStore.js
│   └── useChatStore.js
└── utils/
    └── apiClient.js            # Axios 인터셉터 (HttpOnly 쿠키 기반 인증)
```

<br>

## 디자인

**로고 디자인**

<img width="400" alt="TitleLogo" src="https://github.com/user-attachments/assets/6f3e34b4-8995-427c-b798-b557aefea45b" />

**캐릭터 디자인**

<img width="100" alt="tutorial_cursor" src="https://github.com/user-attachments/assets/d2584394-75b0-42e9-a4e7-20d3579c9340" />
<img width="100" alt="master" src="https://github.com/user-attachments/assets/5cc702cc-717b-4010-8811-4002b3b52de0" />
<img width="100" alt="egg" src="https://github.com/user-attachments/assets/1c404857-c7aa-4fe6-8c02-23df2f19cd31" />
<img width="100" alt="VBS" src="https://github.com/user-attachments/assets/d86e4219-7782-4b5d-9c3b-59d0b49d46cb" />
<img width="100" alt="VBG" src="https://github.com/user-attachments/assets/0c5e80b5-24fe-4430-954f-62d8e92530b0" />
<img width="100" alt="VAS" src="https://github.com/user-attachments/assets/a78bdeb6-7a24-47b5-9a51-65edd7d33b2d" />
<img width="100" alt="VAG" src="https://github.com/user-attachments/assets/82ca8e59-52cf-45fa-b314-8a2bf2bca02e" />
<img width="100" alt="LBS" src="https://github.com/user-attachments/assets/917be276-e89c-431a-8714-4001d7cf980b" />
<img width="100" alt="LBG" src="https://github.com/user-attachments/assets/ba4b6cf1-16ca-41f8-a1f7-b4f5838cbef1" />
<img width="100" alt="LAS" src="https://github.com/user-attachments/assets/df569dba-0bae-41a0-bb81-29a5187d1855" />
<img width="100" alt="LAG" src="https://github.com/user-attachments/assets/3fc6d0aa-f5d0-4e7a-9911-3bd95440e7bc" />


**로그인페이지 배경 이미지**

<img width="500" alt="Tile" src="https://github.com/user-attachments/assets/f33b27fb-32c1-436b-aaba-384a8fd273c1" />

**메인화면(내 페이지) 사용 이미지**

<img width="200" alt="Tile" src="https://github.com/user-attachments/assets/ec4209fe-4c91-45ba-b624-cd5166b51a1e" />
<img width="300" alt="stripe_bg" src="https://github.com/user-attachments/assets/bdb3ef0b-aac3-4321-b3bb-64599e588ac1" />

**유저 캐릭터 둥지 배경 이미지**

<img width="250" alt="outside" src="https://github.com/user-attachments/assets/08a00fab-2e27-4658-a408-e4bc3151a37a" />
<img width="250" alt="inside" src="https://github.com/user-attachments/assets/88d38dbb-cc92-4abe-942f-94e1ce0c6dbe" />

**친구 홈(친구 페이지) 사용 이미지**

<img width="200" alt="friends_Tile" src="https://github.com/user-attachments/assets/ee86d7f5-47c5-4ba3-9739-93721b7e209f" />
<img width="300" alt="friends_bg" src="https://github.com/user-attachments/assets/e9afead7-9bb7-4b8e-bdb9-fd0d06e52dba" />

**컴포넌트용 타일 이미지**

<img width="200" alt="Tile2" src="https://github.com/user-attachments/assets/213c57f9-d899-4979-a3d0-b8dc6b3951d3" />
<img width="200" alt="Tile3" src="https://github.com/user-attachments/assets/aff1e656-a2a9-496b-80ae-368e5e4dd378" />



<br>

## 🚀 실행 방법

```bash
cd frontend
npm install
npm run dev
```


<br>

## 👩‍💻 담당

**손서영** · Frontend, 디자인
