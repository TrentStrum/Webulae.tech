-- Drop all existing role-related functions and triggers first
drop trigger if exists enforce_role_changes on profiles;
drop function if exists validate_role_changes cascade;
drop function if exists check_client_role cascade;

-- Drop existing policies that depend on the role column
drop policy if exists "Only admins can insert blog posts" on blog_posts;
drop policy if exists "Only admins can update their own blog posts" on blog_posts;
drop policy if exists "Only admins can update user roles" on profiles;

-- Create a clean role enum
drop type if exists user_role_new cascade;
create type user_role_new as enum ('client', 'admin', 'developer');

-- Add a temporary column with the new type
alter table profiles 
  add column role_new user_role_new default 'client'::user_role_new;

-- Copy data to the new column with proper casting
update profiles
set role_new = case 
  when role::text = 'admin' then 'admin'::user_role_new
  when role::text = 'developer' then 'developer'::user_role_new
  else 'client'::user_role_new
end;

-- Drop the old column and rename the new one
alter table profiles 
  drop column role cascade;

alter table profiles 
  rename column role_new to role;

-- Drop the old type if it exists
drop type if exists user_role cascade;

-- Rename new enum to final name
alter type user_role_new rename to user_role;

-- Create new role validation function
create or replace function validate_role_changes()
returns trigger as $$
begin
  -- Allow initial role assignment
  if TG_OP = 'INSERT' then
    return new;
  end if;

  -- Only admins can change roles
  if not exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'::user_role
  ) then
    raise exception 'Only administrators can modify roles';
  end if;

  -- Prevent changing from admin/developer to client
  if old.role in ('admin'::user_role, 'developer'::user_role) 
     and new.role = 'client'::user_role then
    raise exception 'Cannot downgrade admin or developer to client role';
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Create new trigger for role validation
create trigger enforce_role_changes
  before update of role on profiles
  for each row
  execute function validate_role_changes();

-- Recreate policies with proper enum casting
create policy "Only admins can insert blog posts"
  on blog_posts for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and role = 'admin'::user_role
    )
  );

create policy "Only admins can update their own blog posts"
  on blog_posts for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and role = 'admin'::user_role
      and profiles.id = author_id
    )
  );

create policy "Only admins can update user roles"
  on profiles
  for update using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and role = 'admin'::user_role
    )
  )
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and role = 'admin'::user_role
    )
  );

-- Set default role for new users
alter table profiles 
  alter column role set default 'client'::user_role;

-- Add constraint to ensure valid roles
alter table profiles
  drop constraint if exists valid_role_values;

alter table profiles
  add constraint valid_role_values
  check (role in ('client'::user_role, 'admin'::user_role, 'developer'::user_role));