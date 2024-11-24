-- First, create the new enum type
create type user_role_new as enum ('client', 'admin', 'developer');

-- Create a temporary column with the new type
alter table profiles 
  add column role_new user_role_new;

-- Update the temporary column with mapped values
update profiles
set role_new = case 
  when role::text = 'admin' then 'admin'::user_role_new
  when role::text = 'user' then 'client'::user_role_new
  else 'client'::user_role_new
end;

-- Make sure all rows have the new role set
update profiles
set role_new = 'client'::user_role_new
where role_new is null;

-- Make the new column not null
alter table profiles 
  alter column role_new set not null;

-- Drop the old column and rename the new one
alter table profiles 
  drop column role cascade;

alter table profiles 
  rename column role_new to role;

-- Drop the old enum type if it exists
drop type if exists user_role cascade;

-- Rename new enum to final name
alter type user_role_new rename to user_role;

-- Add constraint to ensure valid roles
alter table profiles
  add constraint valid_role
  check (role in ('client', 'admin', 'developer'));

-- Create function to validate role changes
create or replace function validate_role_changes()
returns trigger as $$
begin
  -- Allow initial role assignment
  if TG_OP = 'INSERT' then
    return new;
  end if;

  -- Prevent changing from admin/developer to client
  if old.role in ('admin', 'developer') and new.role = 'client' then
    raise exception 'Cannot downgrade admin or developer to client role';
  end if;

  -- Prevent changing from client to admin/developer
  if old.role = 'client' and new.role in ('admin', 'developer') then
    raise exception 'Clients cannot be upgraded to admin or developer roles';
  end if;

  return new;
end;
$$ language plpgsql;

-- Create trigger for role validation
drop trigger if exists enforce_role_changes on profiles;
create trigger enforce_role_changes
  before update on profiles
  for each row
  execute function validate_role_changes();

-- Set default role for new users to 'client'
alter table profiles 
  alter column role set default 'client'::user_role;