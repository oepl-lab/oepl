@AGENTS.md

## 프로젝트

울산대학교 유기전자물리 연구실(OEPL) 웹사이트. 공개 사이트(한국어/영어)와 `/admin` 관리자 CMS로 구성된다. Next.js 16 App Router + React 19, Tailwind v4, Supabase(Postgres + Auth + Storage)를 쓰고 Vercel에 배포한다 (푸시한 브랜치마다 미리보기 배포가 생긴다). 코드 주석과 커밋 메시지는 한국어로 쓴다.

## 명령어

```bash
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # eslint 전체 (기존 오류가 있음 — 아래 참고)
npx eslint <파일...>  # 수정한 파일만 린트
npx tsc --noEmit     # 타입 검사
npm run db:check     # DB 연결·데이터 점검 (읽기 전용)
```

- 린트: 저장소에 기존 린트 오류가 있으므로 전체 결과로 판단하지 말고, `npx eslint`로 **수정한 파일에 새 오류가 없는지만** 확인한다.

### DB 명령어 (⚠️ 운영 DB에 바로 실행될 수 있음)

`.env.local`의 `SUPABASE_DB_URL`/Supabase 키는 **운영 DB를 가리킬 수 있다.** 아래 명령은 사용자가 명시적으로 요청할 때만 실행한다.

```bash
npm run db:setup     # supabase/*.sql 전체를 의존성 순서대로 실행 (SUPABASE_DB_URL 필요)
node scripts/run-sql.mjs supabase/<file>.sql   # SQL 파일 하나만 실행
npm run db:seed      # ⚠️ 파괴적: DB 내용을 시드 데이터로 교체 (SUPABASE_SERVICE_ROLE_KEY 또는 관리자 이메일/비밀번호 필요)
```

## 환경변수 (`.env.local`)

`.env.example`을 복사해 쓴다. 각 변수의 설명은 그 파일에 있다.
- 앱: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. 없으면 앱은 시드 데이터 + `localStorage` 저장으로 동작한다.
- 스크립트 전용 (앱 코드에서 쓰지 않는다): `SUPABASE_DB_URL`/`DATABASE_URL` (`db:setup`, `run-sql`), `SUPABASE_SERVICE_ROLE_KEY` 또는 `SUPABASE_ADMIN_EMAIL`/`SUPABASE_ADMIN_PASSWORD` (`db:seed`).

## 검증

테스트 코드는 없다. UI 변경은 앱을 직접 띄워 확인한다 (Playwright 사용 가능).

- 공개 페이지: `npm run dev` 후 바로 확인 가능.
- `/admin/*`: 로그인하지 않으면 `/login`으로 리다이렉트된다. Supabase를 설정하지 않으면 로그인할 수 없으므로 관리자 화면도 열리지 않는다. 실제 Supabase 관리자 계정(`public.admin_users`에 등록된 사용자)이 필요하다.
  계정이 없으면 타입 검사·린트까지만 하고, 화면은 확인하지 못했다고 보고한다.

## Git

- `main`에 직접 푸시하지 않고 작업 브랜치를 만들어 푸시한다. 브랜치마다 Vercel 미리보기 배포가 생기므로 그 URL로 확인할 수 있다.
- 커밋은 사용자가 요청할 때만 한다.

## 아키텍처

### 데이터 흐름: 모든 것은 `ContentContext`를 거친다
- `src/components/Providers.tsx`가 앱을 `LangProvider` → `AuthProvider` → `ContentProvider`로 감싼다. 공개·관리자 페이지 대부분이 클라이언트 컴포넌트이며 `useContent().content`(`src/types/content.ts`의 `SiteContent`)를 읽는다.
- **조회**: `src/lib/data/repository.ts`의 `fetchSiteContent()`가 브라우저 Supabase 클라이언트로 모든 테이블을 읽는다(공개 읽기 RLS). Supabase 미설정, 조회 실패, DB가 비어 있으면 `seedContent`(`src/lib/data/seed.ts`)로 대체한다. 첫 렌더는 `emptyContent`를 써서 시드 데이터가 실제 내용처럼 잠깐 보이지 않게 한다.
- **저장 (Supabase 설정됨)**: `ContentContext`의 변경 함수 → `adminContentMutate(action, payload)`(`src/lib/admin/client-api.ts`) → `POST /api/admin/content` → `src/lib/data/repository-admin.ts`의 `runAdminContentAction`. 새 저장 동작을 추가할 때는 `AdminContentAction` 타입, `runAdminContentAction`의 switch, `src/app/api/admin/content/route.ts`의 `ACTIONS` 집합 세 곳을 **모두** 고쳐야 한다.
- **저장 (Supabase 미설정)**: 변경 함수가 대신 `localStorage`에 저장한다. 로컬 개발용 대체 경로일 뿐이다.
- 파일 업로드는 `/api/admin/upload`(사진)와 `/api/admin/news/media`(뉴스 사진·첨부파일)를 거친다. 스토리지 헬퍼는 `src/lib/supabase/content-media-server.ts`, 버킷 이름과 용량 제한은 `content-media-constants.ts`에 있다.
- DB 행 ↔ 도메인 타입 변환(snake_case ↔ camelCase)은 `src/lib/data/mappers.ts`에 있다. 새 레코드는 `id = 0`(`NEW_ID`, `src/lib/data/ids.ts`)으로 "새로 추가"를 뜻한다.

### 인증과 권한 (이중 확인)
- 관리자는 `public.admin_users`에 등록된 Supabase Auth 사용자다. `supabase/admins.sql`에 정의된 `public.is_admin()`이 모든 테이블의 쓰기 RLS 정책을 뒷받침한다.
- 서버: `requireAdmin()`(`src/lib/auth/require-admin-api.ts`)이 관리자 라우트 핸들러를 막고, **호출한 사용자 신원으로 묶인** Supabase 클라이언트를 돌려준다. 쓰기에는 항상 `guard.session.client`를 써서 RLS가 다시 검사하게 한다. 앱 안에서 service role 클라이언트를 만들지 않는다. service role 키는 `scripts/` 전용이다.
- 서버에서 접근을 판단할 때는 `getSession()`이 아니라 `getUser()`를 쓴다 (`src/lib/auth/dal.ts`).
- `src/proxy.ts`는 Next 16에서 `middleware.ts`를 대체하는 파일로, Supabase 세션 쿠키를 갱신한다.
- 클라이언트에서는 `src/app/admin/layout.tsx`가 로그인하지 않은 사용자를 `/login`으로 보낸다 (화면 편의용일 뿐, 실제 확인은 API 가드 + RLS).

### 데이터베이스 (`supabase/*.sql`)
- 테이블마다 다시 실행해도 안전한 SQL 파일이 하나씩 있다. 실행 순서는 `scripts/run-sql.mjs`의 `ORDERED_FILES`에 정의되어 있다 (`admins.sql`이 맨 먼저). 테이블을 추가하면 여기에도 파일을 추가한다.
- 테이블 패턴: 공개 읽기 select 정책 + `public.is_admin()`을 쓰는 `*_admin_write` 정책 (`patents.sql` 참고).
- 여러 행을 한 번에(원자적으로) 써야 하면 `security invoker` plpgsql 함수를 만들어 `rpc`로 호출한다 (예: `professor.sql`의 `save_professor`). 교수 프로필은 단일 행(`id = 'default'`)과 순서가 있는 `professor_career` 행들로 구성된다.

### 스타일
- 공개 페이지: 페이지·섹션별 일반 CSS 파일(`src/styles/*.css`)을 `src/app/globals.css`에서 `@import "tailwindcss"` **위에** 불러온다 (아래에 두면 조용히 무시된다). 브랜드 토큰(`--color-brand: #E88800` 등)은 `globals.css`에 있다.
- 관리자 페이지: Tailwind 유틸리티 클래스. 공용 클래스 문자열은 `src/components/admin/form-styles.ts`, 공용 관리자 UI는 `src/components/admin/AdminUi.tsx`에 있다. `AdminShell`이 관리자 본문·헤더 너비를 1200px로 제한한다.
- 공개 페이지 CSS 클래스 이름은 `src/styles/NAMING.md` 규칙을 따른다. 클래스를 추가하거나 이름을 바꾸기 전에 읽는다.
- 아이콘: `lucide-react`. 폰트: Pretendard.

### 다국어
- 한국어/영어 문구는 `src/i18n/translations.ts`에 있다 (`Translations` 타입 + 한국어 객체 + 영어 객체 — 새 키는 세 곳 모두 추가). `useLang().t`로 읽고, `lang`은 `"KR" | "EN"`이다. 콘텐츠 레코드는 두 언어를 별도 필드로 가진다 (예: `nameKo`/`nameEn`, `textKr`/`textEn`).

## 기타

- `claude/component-contracts-figma/`는 앱과 무관한 별도 Figma 스킬 도구 모음이다.
- 이 파일과 `AGENTS.md`에 같은 규칙을 중복해서 적지 않는다 (한쪽만 고쳐져 어긋나는 것을 막기 위해).
