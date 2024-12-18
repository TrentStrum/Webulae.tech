-- Drop all existing project members policies
drop policy if exists "project_members_select" on project_members;
drop policy if exists "project_members_insert" on project_members;
drop policy if exists "project_members_update" on project_members;
drop policy if exists "project_members_delete" on project_members;

-- Drop any existing functions
drop function if exists is_admin;

-- Create a simple materialized view for admin users
create materialized view if not exists admin_users as
select id from profiles where role = 'admin';

create unique index admin_users_id_idx on admin_users(id);

-- Create a function to refresh admin users
create or replace function refresh_admin_users()
returns trigger as $$
begin
  refresh materialized view admin_users;
  return null;
end;
$$ language plpgsql;

-- Create trigger to refresh admin users
create trigger refresh_admin_users
after insert or update or delete on profiles
for each statement
execute function refresh_admin_users();

-- Create ultra-simplified policies
create policy "view_project_members"
  on project_members for select
  using (
    exists (select 1 from admin_users where id = auth.uid())
    or
    user_id = auth.uid()
  );

create policy "admin_manage_project_members"
  on project_members
  for insert
  with check (
    exists (select 1 from admin_users where id = auth.uid())
  );

create policy "admin_update_project_members"
  on project_members
  for update
  using (
    exists (select 1 from admin_users where id = auth.uid())
  );

create policy "admin_delete_project_members"
  on project_members
  for delete
  using (
    exists (select 1 from admin_users where id = auth.uid())
  );

-- Create optimized indexes
create index if not exists project_members_user_project_idx 
  on project_members(user_id, project_id);

-- Refresh the materialized view
refresh materialized view admin_users;