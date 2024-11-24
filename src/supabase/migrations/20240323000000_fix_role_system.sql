-- First, drop any existing problematic triggers and constraints
drop trigger if exists enforce_role_changes on profiles;
drop function if exists validate_role_changes cascade;
drop function if exists check_client_role cascade;

-- Recreate the role enum cleanly
drop type if exists user_role cascade;
create type user_role as enum ('client', 'admin', 'developer');

-- Update the profiles table
alter table profiles 
  alter column role type user_role using role::text::user_role,
  alter column role set default 'client'::user_role;

-- Create improved role validation function
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