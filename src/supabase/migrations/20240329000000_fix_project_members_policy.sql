-- Drop all existing policies on project_members
drop policy if exists "project_members_view_policy" on project_members;
drop policy if exists "project_members_manage_policy" on project_members;

-- Create simplified policies
create policy "view_project_members"
  on project_members for select
  using (
    -- User is an admin
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
    or
    -- User is directly a member of the project
    user_id = auth.uid()
  );

create policy "manage_project_members_admin"
  on project_members
  for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Create indexes for better performance
create index if not exists idx_project_members_composite 
  on project_members(project_id, user_id);

create index if not exists idx_project_members_user_role 
  on project_members(user_id, role);