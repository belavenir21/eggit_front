# 🥚 Eggit (에깃) - Frontend

> GitHub 활동 기반 성장형 개발자 블로그 플랫폼의 프론트엔드입니다.
> 개발자의 커밋, 포스팅, 퀘스트 활동을 게이미피케이션 요소로 시각화하여 기록 습관을 만들어가는 서비스입니다.

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

## 🚀 실행 방법

```bash
cd frontend
npm install
npm run dev
```


<br>

## 👩‍💻 담당

**손서영** · Frontend
