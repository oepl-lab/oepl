-- Admin allowlist for Supabase Auth
--
-- Run this BEFORE the other table SQL files, since their RLS policies call
-- public.is_admin().
--
-- Being able to sign in is NOT the same as being an admin. Supabase Auth decides
-- who has an account; this table decides which of those accounts may write. A user
-- who signs in but is absent here can read exactly what the public can read and
-- nothing more.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  note text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Admins may see the roster. Nobody may modify it over the API — grants below cut
-- off write entirely, so membership changes go through the SQL editor or a service
-- role key. That keeps a compromised admin session from minting more admins.
drop policy if exists "admin_users_admin_read" on public.admin_users;
create policy "admin_users_admin_read" on public.admin_users
  for select to authenticated using (public.is_admin());

revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

-- security definer so the lookup itself isn't subject to admin_users' own RLS,
-- which would recurse. search_path is pinned so a caller can't shadow the table.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ── Granting admin ────────────────────────────────────────────────────────────
-- 1. Create the user in the Supabase dashboard (Authentication → Users → Add user),
--    or have them sign up if signups are enabled.
-- 2. Run, with their email:
--
--    insert into public.admin_users (user_id, email, note)
--    select id, email, 'lab manager' from auth.users where email = 'someone@ulsan.ac.kr'
--    on conflict (user_id) do nothing;
--
-- Revoking is a delete from this table; it takes effect on the user's next request
-- without needing to touch their account or anyone else's session.
