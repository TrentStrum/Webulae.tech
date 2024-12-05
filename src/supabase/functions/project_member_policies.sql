-- Function to drop existing policies
create or replace function drop_project_member_policies()
returns void
language plpgsql
security definer
as $$
begin
  -- Drop all existing policies
  drop policy if exists "project_members_access" on project_members;
  drop policy if exists "project_members_policy" on project_members;
  drop policy if exists "project_members_read" on project_members;
  drop policy if exists "project_members_write" on project_members;
  drop policy if exists "project_members_simple_access" on project_members;
end;
$$;

-- Function to create new optimized policy
create or replace function create_project_members_policy()
returns void
language plpgsql
security definer
as $$
begin
  -- Create single, optimized policy
  create policy "project_members_simple_access"
    on project_members
    using (
      -- User is an admin or a direct member
      exists (
        select 1 from profiles
        where id = auth.uid()
        and (
          role = 'admin'
          or id = project_members.user_id
        )
      )
    )
    with check (
      -- Only admins can modify data
      exists (
        select 1 from profiles
        where id = auth.uid()
        and role = 'admin'
      )
    );

  -- Create optimized indexes if they don't exist
  if not exists (
    select 1 from pg_indexes 
    where tablename = 'project_members' 
    and indexname = 'project_members_lookup_idx'
  ) then
    create index project_members_lookup_idx 
      on project_members(user_id, project_id);
  end if;

  if not exists (
    select 1 from pg_indexes 
    where tablename = 'profiles' 
    and indexname = 'profiles_role_lookup_idx'
  ) then
    create index profiles_role_lookup_idx 
      on profiles(id, role);
  end if;

  -- Analyze tables
  analyze project_members;
  analyze profiles;
end;
$$;