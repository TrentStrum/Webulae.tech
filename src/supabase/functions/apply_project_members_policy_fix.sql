create or replace function apply_project_members_policy_fix()
returns void
language plpgsql
security definer
as $$
begin
  -- Drop existing policies
  drop policy if exists "project_members_access" on project_members;
  drop policy if exists "project_members_policy" on project_members;
  drop policy if exists "project_members_read" on project_members;
  drop policy if exists "project_members_write" on project_members;
  drop policy if exists "project_members_simple_access" on project_members;
  
  -- Create materialized view if it doesn't exist
  create materialized view if not exists admin_users as
  select id from profiles where role = 'admin';
  
  create unique index if not exists admin_users_id_idx on admin_users(id);
  
  -- Create simplified policy
  create policy "project_members_final"
    on project_members
    using (
      exists (select 1 from admin_users where id = auth.uid())
      or user_id = auth.uid()
    )
    with check (
      exists (select 1 from admin_users where id = auth.uid())
    );
    
  -- Refresh the view
  refresh materialized view admin_users;
end;
$$;