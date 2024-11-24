-- Drop all existing project members policies
drop policy if exists "project_members_view_policy" on project_members;
drop policy if exists "project_members_manage_policy" on project_members;
drop policy if exists "view_own_project_memberships" on project_members;
drop policy if exists "view_project_team" on project_members;
drop policy if exists "admin_manage_project_members" on project_members;

-- Drop the materialized view approach as it's not needed for this simpler solution
drop materialized view if exists user_roles;
drop trigger if exists refresh_user_roles_trigger on profiles;
drop function if exists refresh_user_roles;

-- Create a function to check if a user is an admin
create or replace function is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = user_id
    and role = 'admin'
  );
end;
$$ language plpgsql security definer stable;

-- Create simplified policies
create policy "project_members_select"
  on project_members for select
  using (
    -- User can view if they are an admin or a member of the project
    is_admin(auth.uid()) or
    auth.uid() in (
      select pm.user_id
      from project_members pm
      where pm.project_id = project_members.project_id
    )
  );

create policy "project_members_insert"
  on project_members for insert
  with check (
    -- Only admins can insert new members
    is_admin(auth.uid())
  );

create policy "project_members_update"
  on project_members for update
  using (
    -- Only admins can update members
    is_admin(auth.uid())
  );

create policy "project_members_delete"
  on project_members for delete
  using (
    -- Only admins can delete members
    is_admin(auth.uid())
  );

-- Create indexes for better performance
create index if not exists idx_project_members_lookup 
  on project_members(project_id, user_id);

create index if not exists idx_project_members_user 
  on project_members(user_id);

-- Analyze tables to update statistics
analyze project_members;
analyze profiles;