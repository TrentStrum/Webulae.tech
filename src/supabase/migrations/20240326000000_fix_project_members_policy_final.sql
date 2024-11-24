-- First, drop all existing policies on project_members
drop policy if exists "Admins can view all project members" on project_members;
drop policy if exists "Developers can view project members for their assigned projects" on project_members;
drop policy if exists "Clients can view project members for their own projects" on project_members;
drop policy if exists "Only admins can manage project members" on project_members;

-- Create simplified, non-recursive policies
create policy "View project members"
  on project_members for select
  using (
    exists (
      select 1 from project_members pm
      where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid()
    )
    or
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Manage project members"
  on project_members
  for insert with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Update project members"
  on project_members
  for update using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Delete project members"
  on project_members
  for delete using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Create index to improve policy performance
create index if not exists project_members_user_project_idx 
  on project_members(user_id, project_id);