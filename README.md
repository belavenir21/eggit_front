<img width="1962" height="1028" alt="image" src="https://github.com/user-attachments/assets/8e480aa4-0128-4742-a3ce-48b2586b429d" /># 🥚 Eggit (에깃) - Frontend

> GitHub 활동 기반 성장형 개발자 블로그 플랫폼의 프론트엔드입니다.
> 개발자의 커밋, 포스팅, 퀘스트 활동을 게이미피케이션 요소로 시각화하여 기록 습관을 만들어가는 서비스입니다.

<br>

## 서비스 화면

**회원가입(로그인)**
<img width="1961" height="1027" alt="스크린샷 2026-03-28 204119" src="https://github.com/user-attachments/assets/b77e275d-6b36-4f0e-a541-35b88c040d14" />

**개발자성향조사페이지(결과)**
<img width="1694" height="1379" alt="스크린샷 2026-02-04 170600" src="https://github.com/user-attachments/assets/390d67b5-06d6-4ec8-b0d7-2a49251078f7" />

**메인화면(홈)**
<img width="2879" height="1459" alt="스크린샷 2026-02-02 094027" src="https://github.com/user-attachments/assets/7a8a36cb-c522-4f4b-be4e-6603cf1c0e8e" />

**방명록(내 페이지)**
<img width="2101" height="1463" alt="스크린샷 2026-02-06 155926" src="https://github.com/user-attachments/assets/fc8528e4-e2e7-45d3-b8b9-0289593cab5b" />

**방명록(친구 페이지)**
<img width="1467" height="1454" alt="스크린샷 2026-02-06 161406" src="https://github.com/user-attachments/assets/97e606ae-f88b-48fc-9e7f-07573e207286" />

<br>

## ✨ 주요 기능

**🏠 메인 대시보드 (3단 레이아웃)**
- 좌측 패널: 사용자 프로필, 아바타 상태, 블로그 관리 버튼, 실시간 채팅
- 중앙 패널: 성장형 아바타 캐릭터, 경험치 바, 상태 메시지
- 우측 패널: 일일 퀘스트 보드, GitHub 활동 통계, 잔디 히트맵

**🥚 아바타 성장 시스템**
- 개발자 성향 테스트(12문항) 기반 9가지 맞춤형 아바타 지급
- Egg → Child → Adult → Master 4단계 성장
- 레벨업 시 애니메이션 오버레이 및 알림 표시

**✍️ 마크다운 에디터**
- 실시간 프리뷰 지원 (작성/미리보기 즉시 전환)
- Ctrl+B, Ctrl+I, Ctrl+E 등 단축키 지원
- AI 글감 추천 및 자동 완성 (백엔드 연동)

**💬 실시간 채팅**
- WebSocket 기반 1:1 메시징
- 읽지 않은 메시지 배지 및 알림 스택
- 친구 온라인 상태 실시간 표시

**🎯 퀘스트 시스템**
- 일일/주간 퀘스트 완료 시 경험치 획득
- 완료된 퀘스트 초록색 하이라이트 및 파티클 효과
- 보상 수령 시 토스트 알림

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
<img width="1024" height="565" alt="TitleLogo" src="https://github.com/user-attachments/assets/6f3e34b4-8995-427c-b798-b557aefea45b" />

**캐릭터 디자인**
<img width="1024" height="919" alt="tutorial_cursor" src="https://github.com/user-attachments/assets/d2584394-75b0-42e9-a4e7-20d3579c9340" />
<img width="440" height="465" alt="master" src="https://github.com/user-attachments/assets/5cc702cc-717b-4010-8811-4002b3b52de0" />
<img width="366" height="388" alt="egg" src="https://github.com/user-attachments/assets/1c404857-c7aa-4fe6-8c02-23df2f19cd31" />
<img width="192" height="192" alt="VBS" src="https://github.com/user-attachments/assets/d86e4219-7782-4b5d-9c3b-59d0b49d46cb" />
<img width="192" height="192" alt="VBG" src="https://github.com/user-attachments/assets/0c5e80b5-24fe-4430-954f-62d8e92530b0" />
<img width="192" height="192" alt="VAS" src="https://github.com/user-attachments/assets/a78bdeb6-7a24-47b5-9a51-65edd7d33b2d" />
<img width="192" height="192" alt="VAG" src="https://github.com/user-attachments/assets/82ca8e59-52cf-45fa-b314-8a2bf2bca02e" />
<img width="192" height="192" alt="LBS" src="https://github.com/user-attachments/assets/917be276-e89c-431a-8714-4001d7cf980b" />
<img width="192" height="192" alt="LBG" src="https://github.com/user-attachments/assets/ba4b6cf1-16ca-41f8-a1f7-b4f5838cbef1" />
<img width="192" height="192" alt="LAS" src="https://github.com/user-attachments/assets/df569dba-0bae-41a0-bb81-29a5187d1855" />
<img width="192" height="192" alt="LAG" src="https://github.com/user-attachments/assets/3fc6d0aa-f5d0-4e7a-9911-3bd95440e7bc" />


**로그인페이지 배경 이미지**
![LoginBg](https://github.com/user-attachments/assets/f33b27fb-32c1-436b-aaba-384a8fd273c1)

**메인화면(내 페이지) 사용 이미지**
<img width="200" height="200" alt="Tile" src="https://github.com/user-attachments/assets/ec4209fe-4c91-45ba-b624-cd5166b51a1e" />
<img width="768" height="512" alt="stripe_bg" src="https://github.com/user-attachments/assets/bdb3ef0b-aac3-4321-b3bb-64599e588ac1" />

**유저 캐릭터 둥지 배경 이미지**
<img width="512" height="512" alt="outside" src="https://github.com/user-attachments/assets/08a00fab-2e27-4658-a408-e4bc3151a37a" />
<img width="512" height="512" alt="inside" src="https://github.com/user-attachments/assets/88d38dbb-cc92-4abe-942f-94e1ce0c6dbe" />

**친구 홈(친구 페이지) 사용 이미지**
<img width="200" height="200" alt="friends_Tile" src="https://github.com/user-attachments/assets/ee86d7f5-47c5-4ba3-9739-93721b7e209f" />
<img width="768" height="512" alt="friends_bg" src="https://github.com/user-attachments/assets/e9afead7-9bb7-4b8e-bdb9-fd0d06e52dba" />

**컴포넌트용 타일 이미지**
<img width="256" height="256" alt="Tile2" src="https://github.com/user-attachments/assets/213c57f9-d899-4979-a3d0-b8dc6b3951d3" />
<img width="128" height="128" alt="Tile3" src="https://github.com/user-attachments/assets/aff1e656-a2a9-496b-80ae-368e5e4dd378" />



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
