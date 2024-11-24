-- Drop ALL existing policies
drop policy if exists "project_members_read" on project_members;
drop policy if exists "project_members_write" on project_members;

-- Create a single, ultra-simple policy for all operations
create policy "project_members_access"
  on project_members
  using (
    -- Cache the user's role in a CTE to avoid multiple lookups
    exists (
      with user_role as (
        select role from profiles where id = auth.uid()
      )
      select 1 where
        -- Admin access
        (select role from user_role) = 'admin'
        or
        -- Direct member access (for read-only)
        user_id = auth.uid()
    )
  )
  with check (
    -- Only admins can modify data
    (select role from profiles where id = auth.uid()) = 'admin'
  );

-- Ensure proper indexes exist
drop index if exists project_members_user_idx;
drop index if exists project_members_project_idx;
drop index if exists profiles_role_admin_idx;

-- Create optimized indexes (without CONCURRENTLY)
create index project_members_lookup_idx 
  on project_members(user_id, project_id);

create index profiles_role_lookup_idx 
  on profiles(id, role);

-- Analyze tables to update statistics
analyze project_members;
analyze profiles;