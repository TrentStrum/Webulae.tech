-- Drop ALL existing policies
drop policy if exists "project_members_policy" on project_members;

-- Create two separate, simple policies for read and write operations
create policy "project_members_read"
  on project_members for select
  using (
    -- Direct role check for admin
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
    or
    -- Direct membership check
    user_id = auth.uid()
  );

-- Separate policies for each write operation
create policy "project_members_insert"
  on project_members for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "project_members_update"
  on project_members for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "project_members_delete"
  on project_members for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Ensure proper indexes exist
drop index if exists project_members_user_idx;
drop index if exists profiles_role_idx;

create index project_members_user_idx on project_members(user_id);
create index profiles_admin_idx on profiles(id) where role = 'admin';