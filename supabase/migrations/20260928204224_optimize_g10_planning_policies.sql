create index planning_cycles_created_by_idx on public.planning_cycles (created_by);
create index messages_athlete_idx on public.messages (athlete_id, created_at desc);
create index media_assets_created_by_idx on public.media_assets (created_by);
create index media_assets_exercise_idx on public.media_assets (exercise_id);
drop policy if exists "planning_cycles_write_professional" on public.planning_cycles;
create policy "planning_cycles_insert_professional" on public.planning_cycles for insert to authenticated with check (
  created_by=(select auth.uid())
  and exists (select 1 from public.memberships m where m.organization_id=planning_cycles.organization_id and m.user_id=(select auth.uid()) and m.role in ('admin','coach','trainer'))
  and exists (select 1 from public.athletes a where a.id=planning_cycles.athlete_id and a.organization_id=planning_cycles.organization_id)
);
create policy "planning_cycles_update_professional" on public.planning_cycles for update to authenticated
using (exists (select 1 from public.memberships m where m.organization_id=planning_cycles.organization_id and m.user_id=(select auth.uid()) and m.role in ('admin','coach','trainer')))
with check (
  exists (select 1 from public.memberships m where m.organization_id=planning_cycles.organization_id and m.user_id=(select auth.uid()) and m.role in ('admin','coach','trainer'))
  and exists (select 1 from public.athletes a where a.id=planning_cycles.athlete_id and a.organization_id=planning_cycles.organization_id)
);
create policy "planning_cycles_delete_professional" on public.planning_cycles for delete to authenticated using (
  exists (select 1 from public.memberships m where m.organization_id=planning_cycles.organization_id and m.user_id=(select auth.uid()) and m.role in ('admin','coach','trainer'))
);

