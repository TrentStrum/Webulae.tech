-- Add missing constraints and indexes for projects
alter table projects
  alter column created_at set default timezone('utc'::text, now()),
  alter column updated_at set default timezone('utc'::text, now());

-- Add trigger to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at_column();

-- Add indexes for better query performance
create index if not exists projects_status_idx on projects(status);
create index if not exists projects_created_at_idx on projects(created_at);

-- Update project members policies
drop policy if exists "project_members_access" on project_members;

create policy "project_members_access"
  on project_members
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
    or
    exists (
      select 1 from project_members
      where project_id = project_members.project_id
      and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Add function to check project access
create or replace function has_project_access(project_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from project_members
    where project_id = $1
    and user_id = auth.uid()
  ) or exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;