-- Add RLS policies for admin role management
create policy "Only super admins can update user roles"
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

-- Function to create the first admin user
create or replace function create_first_admin(user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from profiles where role = 'admin') then
    update profiles
    set role = 'admin'
    where id = user_id;
  end if;
end;
$$;