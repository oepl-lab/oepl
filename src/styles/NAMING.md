# CSS 클래스 명명 규칙

공개 페이지(`src/styles/*.css`)에 적용한다. 관리자 페이지는 Tailwind 유틸리티 클래스를 쓰므로 이 규칙과 무관하다.

BEM(`__`, `--`)은 쓰지 않는다. 이름은 모두 소문자 kebab-case다.

## 한눈에 보기

```html
<section class="news-section section-y">        <!-- 블록: 시멘틱 태그 + 블록 이름 -->
  <div class="section-wrapper">                  <!-- 블록-wrapper: 폭 제한·정렬 -->
    <div class="news-grid-container">            <!-- 블록-역할-container: 영역 묶음 -->
      <article class="news-card">                <!-- 블록-card: 반복되는 카드 -->
        <div class="card-head">                  <!-- 세부 요소: 짧게, 접두사 없음 -->
          <span class="type">…</span>
          <span class="date">…</span>
        </div>
        <h3 class="card-title is-active">…</h3>  <!-- 상태: is- -->
```

```css
.news-card { … }
.news-card .card-title { … }        /* 세부 요소는 항상 블록 아래 자손 선택자로 */
.news-card .card-title.is-active { … }
```

## 1. 블록 (최상위)

블록 이름은 **CSS 파일 이름 또는 컴포넌트 이름**과 같게 한다 (`news.css` → `news-*`, `members.css` → `member-*`/`members-*`). 블록 루트와 그 바로 아래 구조 요소에는 반드시 블록 접두사를 붙인다.

| 접미사 | 용도 | 예 |
|---|---|---|
| (없음) | 화면 폭 전체 요소. 고정·배경·테두리 | `.header`, `.footer`, `.page-banner` |
| `-section` | 페이지 안의 `<section>` 루트 | `.hero-section`, `.research-section` |
| `-main` | 페이지의 `<main>` 루트 | `.home-main`, `.news-detail-main` |
| `-wrapper` | 안쪽을 감싸 `max-width`·`margin-inline: auto`·`padding-inline` 지정 | `.footer-wrapper`, `.news-wrapper` |
| `-{역할}-container` | 의미 있는 영역 묶음 (레이아웃 단위) | `.header-nav-container`, `.news-grid-container` |
| `-card` / `-row` | 반복되는 항목 하나 | `.news-card`, `.patent-card`, `.news-row` |
| `-empty` / `-loading` / `-missing` | 빈 목록·로딩·없는 항목 상태 화면 | `.publication-list-empty`, `.news-detail-loading` |

- 섹션은 공통 뼈대를 따른다: `XXX-section section-y` > `section-wrapper` > `section-head-container` + `XXX-*-container` (`section.css` 참고). 섹션마다 wrapper를 새로 만들지 말고 `section-wrapper`를 쓴다.
- `-container` 앞에는 역할을 쓴다 (`-nav-`, `-info-`, `-btn-`, `-list-`, `-grid-`, `-filter-` 등). `.news-container`처럼 역할 없이 쓰지 않는다.

## 2. 세부 요소 (블록 안쪽)

- **짧고 일반적인 이름**을 쓰고 접두사를 붙이지 않는다: `.title`, `.date`, `.desc`, `.name`, `.label`, `.text`, `.icon-box`.
- 범위는 **자손 선택자**로 나눈다: `.news-card .date`. 세부 요소 클래스를 단독(최상위) 선택자로 스타일링하지 않는다. 다른 블록과 충돌한다.
- 자주 쓰는 형태:
  - 부분: `-head` / `-body` / `-inner` (`.card-head`, `.member-body`)
  - 목록: `-list` / `-item` (`.info-list` > `.info-item`)
  - 감싸는 상자: `-box` (`.photo-box`, `.icon-box`)
  - 이미지: `-img`, 대체 이미지: `-placeholder` (`.cover-img`, `.cover-placeholder`)
  - 아이콘: `-icon` (`.info-icon`, `.link-icon`)
  - 링크: `-link` (`.info-link`, `.doi-link`)
  - 카드 안 부분은 `card-` 접두사 허용 (`.card-title`, `.card-desc`)

## 3. 버튼

- **여러 블록에서 쓰는 버튼**: `src/styles/button.css`에 `btn-{모양}`으로 둔다 (`.btn-outline`, `.btn-primary`, `.btn-line`, `.btn-more`). 새 공용 버튼도 여기에 추가하고 파일 상단 주석 목록을 갱신한다.
- **한 블록에서만 쓰는 버튼**: 세부 요소처럼 `{역할}-btn`으로 짓고 블록 아래에서 스타일링한다 (`.brand-tab-container .tab-btn`, `.filter-btn`, `.close-btn`).
- `btn-*`는 공용, `*-btn`은 지역. 순서를 바꿔 쓰지 않는다.

## 4. 상태·변형

- 항상 `is-` 접두사를 붙이고, 바뀌는 요소에 함께 단다: `.header.is-scrolled`, `.tab-btn.is-active`, `.logo-container.is-compact`.
- 상태(`is-active`, `is-open`, `is-shown`, `is-scrolled`)와 변형(`is-compact`, `is-wide`, `is-dark`)을 같은 규칙으로 쓴다. `active`, `open`처럼 접두사 없이 쓰지 않는다.
- `is-*`도 단독 선택자로 스타일링하지 않는다: `.is-active { … }` ✗ → `.tab-btn.is-active { … }` ✓

## 5. 접두사 예외

- **모바일 전용**: `mobile-` 접두사 (`.mobile-header`, `.mobile-header-nav-container`).
- **반응형으로 둘 중 하나만 보이는 요소**: `-mobile` / `-desktop` 접미사 (`.address-mobile`, `.address-desktop`).
- **여러 블록에서 함께 쓰는 조각**: 접두사 없이 짓고 별도 파일에 둔다 (`.logo-container`, `.lang`, `.badge` → `badge.css`, `.section-*` → `section.css`).

## 6. 새 파일·새 블록을 만들 때

1. `src/styles/{블록}.css`를 만들고, 맨 위에 `/* 설명 — 사용하는 컴포넌트 경로 */` 주석을 단다.
2. `src/app/globals.css`에서 `@import "tailwindcss"` **위에** import한다 (아래에 두면 조용히 무시된다).
3. 색·반경·글자 크기는 직접 값 대신 `globals.css`의 토큰을 쓴다 (`var(--color-brand)`, `var(--radius-lg)`, `var(--text-sm)`).
4. 다른 블록의 세부 요소 이름과 겹쳐도 괜찮다. 항상 블록 아래 자손 선택자로 쓰기 때문이다. 겹치면 안 되는 것은 **블록 이름**이다.
