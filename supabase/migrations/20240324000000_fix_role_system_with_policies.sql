-- First, drop dependent policies
drop policy if exists "Only admins can insert blog posts" on blog_posts;
drop policy if exists "Only admins can update their own blog posts" on blog_posts;
drop policy if exists "Only super admins can update user roles" on profiles;

-- Drop existing role-related triggers
drop trigger if exists enforce_role_changes on profiles;
drop function if exists validate_role_changes cascade;

-- Create the new role type
create type user_role_new as enum ('client', 'admin', 'developer');

-- Add a new column for the new role type
alter table profiles 
  add column role_new user_role_new default 'client';

-- Migrate existing roles to new column
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

-- Drop the old type
drop type if exists user_role cascade;

-- Rename the new type to the final name
alter type user_role_new rename to user_role;

-- Recreate the role validation function
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
    and role = 'admin'
  ) then
    raise exception 'Only administrators can modify roles';
  end if;

  -- Prevent changing from admin/developer to client
  if old.role in ('admin', 'developer') and new.role = 'client' then
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

-- Recreate the policies with the new role type
create policy "Only admins can insert blog posts"
  on blog_posts for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Only admins can update their own blog posts"
  on blog_posts for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
      and profiles.id = author_id
    )
  );

create policy "Only admins can update user roles"
  on profiles
  for update using (
    auth.uid() in (
      select id from profiles
      where role = 'admin'
    )
  )
  with check (
    auth.uid() in (
      select id from profiles
      where role = 'admin'
    )
  );