-- members profile photo URL (file stored in Supabase Storage bucket `member-photos`)
alter table public.members
  add column if not exists photo_url text;

insert into storage.buckets (id, name, public)
values ('member-photos', 'member-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "member_photos_public_read" on storage.objects;
drop policy if exists "member_photos_authenticated_insert" on storage.objects;
drop policy if exists "member_photos_authenticated_update" on storage.objects;
drop policy if exists "member_photos_authenticated_delete" on storage.objects;

create policy "member_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'member-photos');

create policy "member_photos_authenticated_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'member-photos');

create policy "member_photos_authenticated_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'member-photos');

create policy "member_photos_authenticated_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'member-photos');
