-- Drop existing view if it exists
drop view if exists auth_users;

-- Create a secure view for accessing auth user emails
create or replace view auth_users as
select
  id,
  email,
  email_confirmed_at,
  last_sign_in_at,
  raw_user_meta_data
from auth.users
where 
  -- Users can only see their own data
  auth.uid() = id
  -- Or they are an admin
  or exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  );

-- Grant access to the view
grant select on auth_users to authenticated;

-- Update the profiles table to properly reference auth.users
alter table profiles
  drop constraint if exists profiles_id_fkey,
  add constraint profiles_id_fkey
  foreign key (id)
  references auth.users(id)
  on delete cascade;

-- Create index for better performance
create index if not exists profiles_auth_id_idx on profiles(id);