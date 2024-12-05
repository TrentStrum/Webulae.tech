-- Drop all existing project members policies
drop policy if exists "project_members_view_policy" on project_members;
drop policy if exists "project_members_manage_policy" on project_members;
drop policy if exists "view_project_members" on project_members;
drop policy if exists "manage_project_members" on project_members;

-- Create a materialized view for caching user roles
create materialized view if not exists user_roles as
select id, role from profiles;

create unique index if not exists user_roles_id_idx on user_roles(id);

-- Create function to refresh user roles
create or replace function refresh_user_roles()
returns trigger as $$
begin
  refresh materialized view concurrently user_roles;
  return null;
end;
$$ language plpgsql;

-- Create trigger to refresh user roles
create trigger refresh_user_roles_trigger
after insert or update or delete on profiles
for each statement
execute function refresh_user_roles();

-- Create simplified policies using the materialized view
create policy "view_own_project_memberships"
  on project_members for select
  using (
    -- User is viewing their own memberships
    user_id = auth.uid()
  );

create policy "view_project_team"
  on project_members for select
  using (
    -- User can view members of projects they're part of
    exists (
      select 1 from project_members
      where project_id = project_members.project_id
      and user_id = auth.uid()
    )
  );

create policy "admin_manage_project_members"
  on project_members
  for all
  using (
    -- Admin check using materialized view
    exists (
      select 1 from user_roles
      where id = auth.uid()
      and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from user_roles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Refresh the materialized view initially
refresh materialized view user_roles;