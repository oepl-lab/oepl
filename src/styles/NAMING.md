# CSS 클래스 명명 규칙 (BEM)

공개 페이지(`src/styles/*.css`와 이 파일들을 쓰는 컴포넌트)에 적용한다. 관리자 페이지는 Tailwind 유틸리티 클래스를 쓰므로 이 규칙과 무관하다.

```
.block                  컴포넌트 하나
.block__element         블록 안의 부분
.block--modifier        블록의 고정 변형
.block__element--mod    요소의 고정 변형
.is-state               JS가 켜고 끄는 상태 (항상 블록·요소 클래스와 함께)
```

모든 이름은 소문자 kebab-case다. 구분자는 `__`(요소)와 `--`(변형)만 쓴다.

---

## 1. 블록

- 블록은 **독립적으로 의미가 있는 컴포넌트 하나**다. 다른 곳에 옮겨도 그대로 동작해야 한다.
- 이름은 컴포넌트 이름을 kebab-case로 쓴다: `NewsCard` → `.news-card`, `Header` → `.header`, `PasswordInput` → `.password-input`.
- CSS 파일 하나에는 블록 하나가 원칙이다. 한 컴포넌트 파일이 작은 블록을 여러 개 갖는 경우(예: `news.css`의 `.news-section`, `.news-card`, `.news-table`)에는 같은 파일에 둬도 되지만, 파일 이름과 블록 이름 접두사를 맞춘다.
- 블록 이름에 `-container`, `-wrapper`, `-box`를 붙이지 않는다. 블록은 그 자체가 묶음이다.
  - ✗ `.news-grid-container` → ✓ `.news-section__grid`
- 페이지 루트는 `{페이지}-page` 블록으로 쓴다: `.home-page`, `.news-detail-page`, `.not-found-page`.

## 2. 요소

- 요소는 블록 안에서만 의미가 있는 부분이다: `.news-card__title`, `.footer__copyright`.
- **요소 안의 요소를 이름에 겹치지 않는다.** DOM이 깊어도 이름은 `블록__요소` 한 단계다.
  - ✗ `.news-card__head__date` → ✓ `.news-card__date`
  - 이름이 겹치면 합성어로: `.news-card__title-text`, `.footer__info-icon`
- 요소 이름은 **역할**을 쓴다. 모양(`left`, `big`, `orange`)을 쓰지 않는다.
- 레이아웃용 묶음 이름은 아래 어휘에서 고른다. `container`, `wrapper`, `box`는 쓰지 않는다.

| 요소 이름 | 용도 |
|---|---|
| `__inner` | 폭 제한(`max-width` + `margin-inline: auto` + `padding-inline`) 담당 |
| `__head` / `__body` / `__foot` | 위·본문·아래 영역 |
| `__list` / `__item` | 반복 목록과 항목 |
| `__grid` | 그리드 배치 목록 |
| `__nav` / `__actions` / `__filters` | 내비게이션 / 버튼 묶음 / 필터 묶음 |
| `__media` / `__img` / `__placeholder` | 이미지 영역 / 이미지 / 이미지 없을 때 |
| `__title` / `__subtitle` / `__label` / `__desc` / `__text` | 글자 |
| `__meta` / `__date` / `__tag` | 부가 정보 |
| `__icon` / `__link` / `__btn` | 아이콘 / 링크 / 블록 전용 버튼 |
| `__empty` / `__loading` | 빈 목록 / 로딩 표시 |

## 3. 변형 (`--`)과 상태 (`is-`)

- **변형 `--`**: 렌더할 때 정해지고 바뀌지 않는 차이. 마크업에 기본 클래스와 함께 쓴다.
  - `class="news-card news-card--compact"`, `class="footer__info-item footer__info-item--address"`
  - 변형만 단독으로 쓰지 않는다: ✗ `class="news-card--compact"`
- **상태 `is-`**: 사용자 동작·스크롤 등으로 JS가 켜고 끄는 것. `is-active`, `is-open`, `is-scrolled`, `is-shown`, `is-copied`처럼 형용사·과거분사로 쓴다.
  - CSS에서는 항상 붙여 쓴다: `.header.is-scrolled`, `.brand-tabs__tab.is-active`
  - ✗ `.is-active { … }` (단독 선택자 금지)
- 판단 기준: 같은 요소에서 **실행 중에 켜졌다 꺼지면 `is-`, 아니면 `--`**.
  - `is-compact`(로고 크기 고정 변형) → `--compact`
  - `is-email`, `is-address`, `is-conference`(종류 구분) → `--email`, `--address`, `--conference`
  - `is-active`(현재 탭) → `is-active` 유지
- 반응형으로 하나만 보이는 쌍은 변형으로: `.footer__address--mobile`, `.footer__address--desktop`. 단, 모바일 전용으로 구조가 따로 있는 컴포넌트(`MobileHeader`)는 별도 블록 `.mobile-header`로 둔다.

## 4. 선택자 작성 규칙

- **기본은 클래스 하나**: `.news-card__title { … }`. 블록으로 감싸서 쓰지 않는다 (✗ `.news-card .news-card__title`).
- 허용하는 조합은 아래뿐이다.
  - 상태·변형에 따라 요소를 바꿀 때: `.news-card:hover .news-card__title`, `.header.is-scrolled .header__nav`, `.news-card--compact .news-card__desc`
  - 의사 클래스·요소: `:hover`, `:focus-visible`, `::before` 등
- **태그 선택자 금지.** 예외는 관리자가 입력한 HTML을 그대로 보여주는 영역뿐이다: `.news-article__content p`, `.news-article__content a`.
- `id` 선택자, `!important` 금지.
- JS가 요소를 찾을 때는 클래스가 아니라 `data-*` 속성을 쓴다 (`data-hero-glow`처럼). 클래스 이름을 바꿔도 동작이 깨지지 않게 하기 위해서다.

## 5. 블록 섞기 (mix)

한 요소가 두 블록의 역할을 동시에 하면 클래스를 둘 다 단다. 이때 각 클래스는 자기 역할만 스타일링한다.

```html
<!-- section 블록이 공통 여백·폭을, news-section이 배경을 맡는다 -->
<section class="section news-section">
  <div class="section__inner">
    <div class="section__head">…</div>
    <div class="news-section__grid">…</div>
  </div>
</section>

<!-- 공용 버튼을 다른 블록 안에서 쓰면서 위치만 그 블록이 정한다 -->
<a class="btn btn--more section__more">더보기</a>
```

- 바깥 블록은 안쪽 블록의 **위치·여백**(`margin`, `grid-area`, `flex`)만 정할 수 있고, 안쪽 블록의 모양(색, 글자, 테두리)은 건드리지 않는다.

## 6. 공용 블록

여러 컴포넌트에서 쓰는 것은 별도 파일의 독립 블록으로 둔다.

| 블록 | 파일 | 예 |
|---|---|---|
| `.btn` | `button.css` | `.btn`, `.btn--primary`, `.btn--outline`, `.btn--line`, `.btn--more`, `.btn--sm`, `.btn--block`, `.btn__icon` |
| `.section` | `section.css` | `.section`, `.section__inner`, `.section__head`, `.section__label`, `.section__title`, `.section__more` |
| `.badge` | `badge.css` | `.badge`, `.badge--new`, `.badge--notice` |
| `.page-banner` | `page-banner.css` | `.page-banner`, `.page-banner__inner`, `.page-banner__title` |
| `.logo`, `.lang-switch` | `header.css` 또는 각자 파일 | 헤더·모바일 헤더·푸터에서 함께 사용 |

- 공용 버튼은 모두 `.btn` 블록의 변형이다. 블록 하나에서만 쓰는 버튼은 그 블록의 요소로 만든다: `.brand-tabs__tab`, `.gallery__filter-btn`, `.mobile-header__close`.
- 지금 있는 `fill-btn`·`line-btn`처럼 공용 버튼과 모양이 같은 지역 버튼은 `.btn--primary`·`.btn--line`으로 합친다.

## 7. 유틸리티

- 한 가지 속성만 다루는 보조 클래스는 `u-` 접두사를 붙인다: `.u-section-y`, `.u-sr-only`.
- 유틸리티는 컴포넌트 스타일을 대신하지 않는다. 새로 만들기 전에 블록·변형으로 해결할 수 있는지 먼저 본다.

## 8. 파일 규칙

1. 파일 이름은 블록 이름과 같게 한다: `.news-card` → `news-card.css` (작은 블록 여러 개를 한 파일에 둘 때는 대표 이름으로).
2. 파일 맨 위에 `/* 블록 설명 — 사용하는 컴포넌트 경로 */` 주석을 단다.
3. 순서: 블록 → 요소(마크업 순서대로) → 변형 → 상태 → 미디어 쿼리.
4. `src/app/globals.css`에서 `@import "tailwindcss"` **위에** import한다 (아래에 두면 조용히 무시된다).
5. 색·반경·글자 크기는 `globals.css`의 토큰을 쓴다 (`var(--color-brand)`, `var(--radius-lg)`, `var(--text-sm)`).

---

## 부록 A. 지금 클래스 → 새 클래스 변환 예시

기존 코드를 고칠 때의 기준이다. 표에 없는 것도 같은 방식으로 바꾼다.

| 지금 | 새 이름 | 이유 |
|---|---|---|
| `.header-wrapper` | `.header__inner` | wrapper → `__inner` |
| `.header-nav-container` | `.header__nav` | `-container` 제거, 요소로 |
| `.mobile-header-nav-container .nav-link` | `.mobile-header__nav-link` | 짧은 자식 이름 → 블록 요소 |
| `.news-card .card-title` | `.news-card__title` | 자손 선택자 → 단일 클래스 |
| `.news-card .card-title .text` | `.news-card__title-text` | 요소 중첩 없이 합성어로 |
| `.news-card .date` | `.news-card__date` | |
| `.logo-container.is-compact` | `.logo.logo--compact` | 고정 변형은 `--` |
| `.footer .info-item.is-address` | `.footer__info-item.footer__info-item--address` | 종류 구분은 `--` |
| `.address-mobile` / `.address-desktop` | `.footer__address--mobile` / `--desktop` | 반응형 쌍은 변형 |
| `.brand-tab-container .tab-btn.is-active` | `.brand-tabs__tab.is-active` | 지역 버튼은 요소, 상태는 `is-` 유지 |
| `.btn-primary` | `.btn.btn--primary` | 공용 버튼은 `.btn` 블록의 변형 |
| `.hero-btn-container .fill-btn` | `.hero__actions` + `.btn.btn--primary` | 중복 버튼 통합 |
| `.section-wrapper` | `.section__inner` | |
| `.section-head-container` | `.section__head` | |
| `.news-empty-container`, `.news-list-empty` | `.news-section__empty`, `.news-list__empty` | 빈 상태 이름 통일 |
| `.photo-box`, `.icon-box` | `.{블록}__media`, `.{블록}__icon` | `box` 금지 |
| `.home-main`, `.notfound-main` | `.home-page`, `.not-found-page` | 페이지 루트 |
| `.section-y` | `.u-section-y` | 유틸리티 접두사 |

## 부록 B. 적용 체크리스트

리네이밍 작업이 끝나면 아래를 확인한다.

```bash
# 요소 중첩 (0개여야 함)
grep -nE '__[a-z0-9-]+__' src/styles/*.css
# 금지 단어 (0개여야 함)
grep -nE '\.[a-z0-9_-]*(container|wrapper|box)\b' src/styles/*.css
# 단독 상태 선택자 (0개여야 함)
grep -nE '(^|[ ,>+~])\.is-[a-z-]+' src/styles/*.css
# 태그 선택자 (관리자 입력 HTML 영역 외에는 0개여야 함)
grep -nE '\.[a-z0-9_-]+ +(p|a|span|div|img|ul|li|h[1-6])\b' src/styles/*.css
```

- CSS에서 바꾼 이름이 `src/**/*.tsx`의 `className`에도 모두 반영됐는지 확인한다 (옛 이름으로 `grep` 해서 0개).
- 리네이밍은 화면을 바꾸면 안 된다. 바꾸기 전과 후의 공개 페이지를 데스크톱·모바일 폭에서 스크린샷으로 비교한다 (Playwright).
