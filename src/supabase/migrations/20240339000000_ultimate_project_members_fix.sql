-- First, drop ALL existing policies and related objects
drop policy if exists "view_project_members" on project_members;
drop policy if exists "manage_project_members" on project_members;
drop table if exists admin_lookup;
drop trigger if exists maintain_admin_lookup_trigger on profiles;
drop function if exists maintain_admin_lookup;

-- Create the simplest possible policies without any recursion
create policy "project_members_policy"
  on project_members
  using (
    -- User is an admin
    (select role = 'admin' from profiles where id = auth.uid())
    or
    -- User is directly involved in the project
    user_id = auth.uid()
  )
  with check (
    -- Only admins can modify
    (select role = 'admin' from profiles where id = auth.uid())
  );

-- Create optimized indexes
create index if not exists project_members_user_idx on project_members(user_id);
create index if not exists profiles_role_idx on profiles(role) where role = 'admin';