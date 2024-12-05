-- Drop the problematic policy
drop policy if exists "Users can view project members for their projects" on project_members;

-- Create separate policies for different roles
create policy "Admins can view all project members"
  on project_members for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Developers can view project members for their assigned projects"
  on project_members for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'developer'
      and exists (
        select 1 from project_members pm
        where pm.project_id = project_members.project_id
        and pm.user_id = auth.uid()
      )
    )
  );

create policy "Clients can view project members for their own projects"
  on project_members for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'client'
      and exists (
        select 1 from project_members pm
        where pm.project_id = project_members.project_id
        and pm.user_id = auth.uid()
      )
    )
  );

-- Add policies for insert/update/delete
create policy "Only admins can manage project members"
  on project_members
  for all
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