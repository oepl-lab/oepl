# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

OEPL (Organic Electronic Physics Lab, Univ. of Ulsan) lab website: a public KR/EN site plus an `/admin` CMS. Next.js 16 App Router + React 19, Tailwind v4, Supabase (Postgres + Auth + Storage), deployed on Vercel (every pushed branch gets a preview deployment). Code comments and commit messages are written in Korean.

## Commands

```bash
npm run dev          # dev server (localhost:3000)
npm run build        # production build
npm run lint         # eslint (the repo has pre-existing lint errors; check only that files you touched add none)
npx tsc --noEmit     # type-check
npm run db:setup     # run every supabase/*.sql in dependency order (needs SUPABASE_DB_URL in .env.local)
node scripts/run-sql.mjs supabase/<file>.sql   # run a single SQL file
npm run db:seed      # replace DB content with seed data (needs SUPABASE_SERVICE_ROLE_KEY, or admin email/password)
npm run db:check     # sanity-check the DB connection/data
```

There is no test suite. Verify UI changes by running the app (Playwright is available) — note `/admin/*` redirects to `/login` unless a real Supabase admin account is available.

## Architecture

### Data flow: everything goes through `ContentContext`
- `src/components/Providers.tsx` wraps the app in `LangProvider` → `AuthProvider` → `ContentProvider`. Pages (public and admin) are mostly client components that read `useContent().content` (`SiteContent` in `src/types/content.ts`).
- **Reads**: `fetchSiteContent()` in `src/lib/data/repository.ts` loads all tables with the browser Supabase client (public-read RLS). If Supabase is unconfigured, a query fails, or the DB is empty, it falls back to `seedContent` (`src/lib/data/seed.ts`). The initial render uses `emptyContent` so seed data isn't flashed as real content.
- **Writes (Supabase configured)**: `ContentContext` mutators → `adminContentMutate(action, payload)` (`src/lib/admin/client-api.ts`) → `POST /api/admin/content` → `runAdminContentAction` in `src/lib/data/repository-admin.ts`. To add a new write, add the action to `AdminContentAction`, the switch in `runAdminContentAction`, **and** the `ACTIONS` set in `src/app/api/admin/content/route.ts`.
- **Writes (Supabase unconfigured)**: mutators persist to `localStorage` instead — a local-dev fallback only.
- File uploads go through `/api/admin/upload` (photos) and `/api/admin/news/media` (news photos/attachments); storage helpers are in `src/lib/supabase/content-media-server.ts`, bucket names and size limits in `content-media-constants.ts`.
- Row ↔ domain conversion (snake_case ↔ camelCase) lives in `src/lib/data/mappers.ts`. New records use `id = 0` (`NEW_ID`, `src/lib/data/ids.ts`) to mean "insert".

### Auth and authorization (defense in depth)
- Admins are Supabase Auth users listed in `public.admin_users`. `public.is_admin()` (defined in `supabase/admins.sql`) backs every table's write RLS policy.
- Server side: `requireAdmin()` (`src/lib/auth/require-admin-api.ts`) guards admin route handlers and returns a Supabase client **bound to the caller's identity** — always use `guard.session.client` for writes so RLS re-checks them. Do not create service-role clients in the app; the service role key is for `scripts/` only.
- Use `getUser()`, never `getSession()`, for server-side access decisions (`src/lib/auth/dal.ts`).
- `src/proxy.ts` is the Next 16 replacement for `middleware.ts`; it refreshes the Supabase session cookie.
- Client side, `src/app/admin/layout.tsx` redirects unauthenticated users to `/login` (UX only — the real checks are the API guard + RLS).

### Database (`supabase/*.sql`)
- One idempotent SQL file per table; run order is defined in `ORDERED_FILES` in `scripts/run-sql.mjs` (`admins.sql` must run first). When adding a table, add its file there.
- Table pattern: `public read` select policy + `*_admin_write` policy using `public.is_admin()` (see `patents.sql`).
- Multi-row writes that must be atomic use a `security invoker` plpgsql function called via `rpc` (e.g. `save_professor` in `professor.sql`). The professor profile is a single row (`id = 'default'`) plus ordered `professor_career` rows.

### Styling
- Public pages: plain CSS per page/section in `src/styles/*.css`, imported in `src/app/globals.css` **above** `@import "tailwindcss"` (an import placed below it is silently ignored). Brand tokens (`--color-brand: #E88800`, etc.) are in `globals.css`.
- Admin pages: Tailwind utility classes; shared class strings in `src/components/admin/form-styles.ts`, shared admin UI pieces in `src/components/admin/AdminUi.tsx`. `AdminShell` caps admin content/header width at 1200px.
- Icons: `lucide-react`. Font: Pretendard.

### i18n
- KR/EN text lives in `src/i18n/translations.ts` (a typed `Translations` interface plus KR and EN objects — add new keys to all three). Read via `useLang().t`; `lang` is `"KR" | "EN"`. Content records carry both languages as separate fields (e.g. `nameKo`/`nameEn`, `textKr`/`textEn`).

## Other

- `claude/component-contracts-figma/` is a separate, vendored Figma-skills toolkit, not part of the app.
