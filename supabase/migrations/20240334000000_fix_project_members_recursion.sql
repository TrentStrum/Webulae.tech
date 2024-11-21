-- Drop all existing policies on project_members
drop policy if exists "project_members_view_policy" on project_members;
drop policy if exists "project_members_manage_policy" on project_members;
drop policy if exists "view_project_members" on project_members;
drop policy if exists "manage_project_members" on project_members;

-- Create new, simplified policies without recursion
create policy "view_project_members"
  on project_members for select
  using (
    -- User is an admin
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
    or
    -- User is directly involved in the project
    project_id in (
      select project_id 
      from project_members 
      where user_id = auth.uid()
    )
  );

create policy "manage_project_members"
  on project_members
  for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Create optimized indexes
create index if not exists idx_project_members_lookup 
  on project_members(project_id, user_id);

create index if not exists idx_project_members_user 
  on project_members(user_id);

-- Add foreign key constraints if missing
do $$ 
begin
  if not exists (
    select 1 from information_schema.table_constraints 
    where table_name = 'project_members' 
    and constraint_name = 'project_members_project_id_fkey'
  ) then
    alter table project_members
      add constraint project_members_project_id_fkey
      foreign key (project_id) references projects(id)
      on delete cascade;
  end if;

  if not exists (
    select 1 from information_schema.table_constraints 
    where table_name = 'project_members' 
    and constraint_name = 'project_members_user_id_fkey'
  ) then
    alter table project_members
      add constraint project_members_user_id_fkey
      foreign key (user_id) references profiles(id)
      on delete cascade;
  end if;
end $$;