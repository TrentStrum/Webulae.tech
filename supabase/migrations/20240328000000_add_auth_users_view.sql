-- Create a secure view for accessing auth user emails
create view auth_users as
select
  id,
  email,
  confirmed_at
from auth.users;

-- Grant access to the view
grant select on auth_users to authenticated;

-- Add RLS policy to only allow admins to view all users
create policy "Only admins can view all auth users"
  on auth_users
  for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );