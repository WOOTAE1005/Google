# 마음담음 — AI 경조사 메시지 카피라이터

관계, 상황, 톤을 고르면 봉투 문구·문자·카톡 메시지 세 가지 안을 AI가 지어주는 경조사 멘트 생성 서비스입니다.

## 핵심 기능

- **관계 프로필 관리**: 관계 유형·친밀도·선호 톤을 저장해두고 재사용
- **조건부 상황 선택**: 경사/조사 대분류 → 세부 항목 → 상황 태그까지 단계적으로 좁혀가는 프롬프트 빌더
- **AI 문구 생성**: Gemini API로 정중형 / 감성형 / 간결형 3개 후보를 동시 생성, 조율 후 재생성 가능
- **전달용 카드**: 카드 구조 5종 × 색상 팔레트(무드 카테고리 4개로 정리) 조합으로 이미지 저장·클립보드 복사·카카오톡 공유
- **예법 가이드**: 관계·상황별 경조사 예법 및 금기 표현 안내
- **생성 기록 보관**: 과거 작성한 멘트를 저장해 재사용

## 기술 스택

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4
- Express (API 서버 겸 Vite 미들웨어 호스트)
- `@google/genai` (Gemini API)
- `motion` (애니메이션), `lucide-react` (아이콘), `html-to-image` (카드 이미지 내보내기)

## 시작하기

```bash
npm install
cp .env.example .env   # GEMINI_API_KEY 입력 (선택, 아래 참고)
npm run dev             # http://localhost:3000
```

### 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (Vite 미들웨어 + Express API) |
| `npm run build` | 프로덕션 빌드 (`dist/`) |
| `npm start` | 빌드된 프로덕션 서버 실행 |
| `npm run lint` | TypeScript 타입 체크 |

### 환경 변수 (`.env`)

| 변수 | 필수 여부 | 설명 |
| --- | --- | --- |
| `GEMINI_API_KEY` | 선택 | 비워두면 서버가 하드코딩된 3개 예시 문구로 자동 폴백합니다 (`server.ts`). 실제 Gemini 응답을 받으려면 [Google AI Studio](https://aistudio.google.com/)에서 발급한 키를 입력하세요. |

## 프로젝트 구조

```
server.ts                        # Express 서버 + /api/generate-message
src/
  App.tsx                        # 전체 화면 상태 관리
  types.ts                       # 도메인 타입 정의
  lib/
    keywords.ts                  # 경조사 카테고리·키워드 데이터
    relationships.ts             # 관계 프로필 저장/불러오기 (localStorage)
    promptBuilder.ts             # Gemini 프롬프트 조립
  components/
    occasion/                    # 상황 선택, 형식 선택, 후보 카드 등 입력 관련 컴포넌트
    shared/                      # 헤더, 관계 선택 모달, 전달용 카드 등 공통 컴포넌트
```

## 참고

- 관계 프로필과 생성 기록은 서버 DB 없이 **브라우저 `localStorage`에만** 저장됩니다.
- `GEMINI_API_KEY`가 비어 있어도 앱은 정상 동작하며, 이 경우 항상 동일한 3개 예시 문구를 반환합니다.
