-- Add is_frozen column to profiles for admin account freeze/unfreeze
-- After running this migration, enable Realtime for the profiles table in
-- Supabase Dashboard → Database → Replication (or Table Editor → profiles → Enable Realtime).
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'is_frozen'
  ) then
    alter table public.profiles add column is_frozen boolean default false;
  end if;
end $$;
