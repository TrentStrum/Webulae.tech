-- Drop all existing project members policies and related objects
drop policy if exists "view_project_members" on project_members;
drop policy if exists "admin_manage_project_members" on project_members;
drop policy if exists "admin_update_project_members" on project_members;
drop policy if exists "admin_delete_project_members" on project_members;
drop materialized view if exists admin_users;
drop trigger if exists refresh_admin_users on profiles;
drop function if exists refresh_admin_users;

-- Create a simple lookup table for admin users
create table if not exists admin_lookup (
  user_id uuid primary key references profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for admin lookup
create index if not exists admin_lookup_user_id_idx on admin_lookup(user_id);

-- Function to maintain admin lookup table
create or replace function maintain_admin_lookup()
returns trigger as $$
begin
  -- Clear existing entries for the user
  delete from admin_lookup where user_id = new.id;
  
  -- If user is admin, add to lookup
  if new.role = 'admin' then
    insert into admin_lookup (user_id) values (new.id);
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for admin lookup maintenance
create trigger maintain_admin_lookup_trigger
after insert or update on profiles
for each row
execute function maintain_admin_lookup();

-- Initialize admin lookup table
insert into admin_lookup (user_id)
select id from profiles where role = 'admin'
on conflict do nothing;

-- Create ultra-simple policies
create policy "view_project_members"
  on project_members for select
  using (
    exists (select 1 from admin_lookup where user_id = auth.uid())
    or
    user_id = auth.uid()
  );

create policy "manage_project_members"
  on project_members
  for all
  using (
    exists (select 1 from admin_lookup where user_id = auth.uid())
  )
  with check (
    exists (select 1 from admin_lookup where user_id = auth.uid())
  );

-- Create optimized indexes
create index if not exists project_members_user_project_idx 
  on project_members(user_id, project_id);