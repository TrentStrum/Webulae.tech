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
      -- User is an admin
      (select role from profiles where id = auth.uid()) = 'admin'
      or
      -- User is a direct member of the project
      user_id = auth.uid()
    )
    with check (
      -- Only admins can modify data
      (select role from profiles where id = auth.uid()) = 'admin'
    );

  -- Create optimized indexes
  create index project_members_lookup_idx 
    on project_members(user_id, project_id);

  create index profiles_role_lookup_idx 
    on profiles(id, role);

  -- Analyze tables
  analyze project_members;
  analyze profiles;
end;
$$;