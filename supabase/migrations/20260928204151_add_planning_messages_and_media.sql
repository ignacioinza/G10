create table public.planning_cycles (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade, title text not null, starts_on date not null, ends_on date not null,
  status text not null default 'draft' check (status in ('draft','active','completed','archived')),
  plan_data jsonb not null default '[]'::jsonb check (jsonb_typeof(plan_data) = 'array'), version integer not null default 1 check (version > 0),
  created_by uuid not null references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint planning_cycles_dates_check check (ends_on >= starts_on), constraint planning_cycles_scope_key unique (organization_id, athlete_id, starts_on)
);
create index planning_cycles_athlete_date_idx on public.planning_cycles (athlete_id, starts_on desc);
create index planning_cycles_org_status_idx on public.planning_cycles (organization_id, status, starts_on desc);
alter table public.planning_cycles enable row level security;
create policy "planning_cycles_select_authorized" on public.planning_cycles for select to authenticated using (
  exists (select 1 from public.athletes a where a.id = planning_cycles.athlete_id and a.user_id = (select auth.uid()))
  or exists (select 1 from public.memberships m where m.organization_id = planning_cycles.organization_id and m.user_id = (select auth.uid()) and m.role in ('admin','coach','trainer'))
);

create table public.messages (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  athlete_id uuid references public.athletes(id) on delete cascade, sender_user_id uuid not null references auth.users(id), recipient_user_id uuid not null references auth.users(id),
  body text not null check (char_length(btrim(body)) between 1 and 4000), read_at timestamptz, created_at timestamptz not null default now(),
  constraint messages_distinct_users check (sender_user_id <> recipient_user_id)
);
create index messages_sender_date_idx on public.messages (sender_user_id, created_at desc);
create index messages_recipient_date_idx on public.messages (recipient_user_id, created_at desc);
create index messages_org_date_idx on public.messages (organization_id, created_at desc);
alter table public.messages enable row level security;
create policy "messages_select_participant_or_admin" on public.messages for select to authenticated using (
  sender_user_id = (select auth.uid()) or recipient_user_id = (select auth.uid())
  or exists (select 1 from public.memberships m where m.organization_id = messages.organization_id and m.user_id = (select auth.uid()) and m.role = 'admin')
);
create policy "messages_insert_sender" on public.messages for insert to authenticated with check (
  sender_user_id = (select auth.uid())
  and (exists (select 1 from public.memberships m where m.organization_id = messages.organization_id and m.user_id = (select auth.uid()))
    or exists (select 1 from public.athletes a where a.organization_id = messages.organization_id and a.user_id = (select auth.uid())))
  and (exists (select 1 from public.memberships m where m.organization_id = messages.organization_id and m.user_id = messages.recipient_user_id)
    or exists (select 1 from public.athletes a where a.organization_id = messages.organization_id and a.user_id = messages.recipient_user_id))
);
create policy "messages_update_recipient" on public.messages for update to authenticated
  using (recipient_user_id = (select auth.uid())) with check (recipient_user_id = (select auth.uid()) and sender_user_id <> (select auth.uid()));

create table public.media_assets (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  athlete_id uuid references public.athletes(id) on delete set null, exercise_id uuid references public.exercise_library(id) on delete set null,
  bucket_path text not null unique, file_name text not null, mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800), created_by uuid not null references auth.users(id), created_at timestamptz not null default now()
);
create index media_assets_org_date_idx on public.media_assets (organization_id, created_at desc);
create index media_assets_athlete_idx on public.media_assets (athlete_id, created_at desc);
alter table public.media_assets enable row level security;
create policy "media_assets_select_authorized" on public.media_assets for select to authenticated using (
  exists (select 1 from public.memberships m where m.organization_id = media_assets.organization_id and m.user_id = (select auth.uid()))
  or exists (select 1 from public.athletes a where a.organization_id = media_assets.organization_id and a.user_id = (select auth.uid()) and (media_assets.athlete_id is null or media_assets.athlete_id = a.id))
);
create policy "media_assets_insert_authorized" on public.media_assets for insert to authenticated with check (
  created_by = (select auth.uid()) and (
    exists (select 1 from public.memberships m where m.organization_id = media_assets.organization_id and m.user_id = (select auth.uid()) and m.role in ('admin','coach','trainer'))
    or exists (select 1 from public.athletes a where a.organization_id = media_assets.organization_id and a.user_id = (select auth.uid()) and media_assets.athlete_id = a.id)
  )
);
create policy "media_assets_delete_owner_or_admin" on public.media_assets for delete to authenticated using (
  created_by = (select auth.uid()) or exists (select 1 from public.memberships m where m.organization_id = media_assets.organization_id and m.user_id = (select auth.uid()) and m.role = 'admin')
);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('g10-media','g10-media',false,52428800,array['image/jpeg','image/png','image/webp','video/mp4','video/webm'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "g10_media_select_org" on storage.objects for select to authenticated using (
  bucket_id='g10-media' and (exists (select 1 from public.memberships m where m.organization_id::text=(storage.foldername(name))[1] and m.user_id=(select auth.uid()))
  or exists (select 1 from public.athletes a where a.organization_id::text=(storage.foldername(name))[1] and a.user_id=(select auth.uid())))
);
create policy "g10_media_insert_own_folder" on storage.objects for insert to authenticated with check (
  bucket_id='g10-media' and (storage.foldername(name))[2]=(select auth.uid()::text)
  and (exists (select 1 from public.memberships m where m.organization_id::text=(storage.foldername(name))[1] and m.user_id=(select auth.uid()))
  or exists (select 1 from public.athletes a where a.organization_id::text=(storage.foldername(name))[1] and a.user_id=(select auth.uid())))
);
create policy "g10_media_update_owner" on storage.objects for update to authenticated
  using (bucket_id='g10-media' and owner_id=(select auth.uid()::text))
  with check (bucket_id='g10-media' and owner_id=(select auth.uid()::text) and (storage.foldername(name))[2]=(select auth.uid()::text));
create policy "g10_media_delete_owner" on storage.objects for delete to authenticated using (bucket_id='g10-media' and owner_id=(select auth.uid()::text));
grant select,insert,update,delete on public.planning_cycles to authenticated;
grant select,insert,update on public.messages to authenticated;
grant select,insert,delete on public.media_assets to authenticated;

