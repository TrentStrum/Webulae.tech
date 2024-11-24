-- Add check constraint to ensure valid initial roles
alter table profiles
  drop constraint if exists valid_initial_role;

alter table profiles
  add constraint valid_initial_role
  check (role::text in ('client', 'admin', 'developer'));