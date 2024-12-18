-- Drop ALL existing policies
drop policy if exists "project_members_read" on project_members;
drop policy if exists "project_members_insert" on project_members;
drop policy if exists "project_members_update" on project_members;
drop policy if exists "project_members_delete" on project_members;

-- Create a single, simple read policy
create policy "project_members_read"
  on project_members for select
  using (
    -- Direct admin check without joins or subqueries
    (select role from profiles where id = auth.uid()) = 'admin'
    or
    -- Direct membership check without recursion
    user_id = auth.uid()
  );

-- Single, simple write policy for admins
create policy "project_members_write"
  on project_members for all
  using (
    -- Simple admin check
    (select role from profiles where id = auth.uid()) = 'admin'
  )
  with check (
    -- Same simple admin check
    (select role from profiles where id = auth.uid()) = 'admin'
  );

-- Ensure we have the right indexes
drop index if exists project_members_user_idx;
drop index if exists project_members_project_idx;
drop index if exists profiles_admin_idx;

create index project_members_user_idx on project_members(user_id);
create index project_members_project_idx on project_members(project_id);
create index profiles_role_admin_idx on profiles(id) where role = 'admin';