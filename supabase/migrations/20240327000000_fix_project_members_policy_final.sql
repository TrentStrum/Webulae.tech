-- Drop all existing policies on project_members
drop policy if exists "View project members" on project_members;
drop policy if exists "Manage project members" on project_members;
drop policy if exists "Update project members" on project_members;
drop policy if exists "Delete project members" on project_members;

-- Create a single, comprehensive policy for viewing project members
create policy "project_members_view_policy"
  on project_members for select
  using (
    -- User is an admin
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
    or
    -- User is a member of the project
    auth.uid() in (
      select user_id from project_members
      where project_id = project_members.project_id
    )
  );

-- Create policy for managing project members (insert/update/delete)
create policy "project_members_manage_policy"
  on project_members
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Create indexes to improve policy performance
create index if not exists idx_project_members_user_id on project_members(user_id);
create index if not exists idx_project_members_project_id on project_members(project_id);
create index if not exists idx_profiles_role on profiles(role);