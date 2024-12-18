create or replace function drop_all_project_member_policies()
returns void
language plpgsql
security definer
as $$
begin
  drop policy if exists "project_members_access" on project_members;
  drop policy if exists "project_members_policy" on project_members;
  drop policy if exists "project_members_read" on project_members;
  drop policy if exists "project_members_write" on project_members;
  
  drop index if exists project_members_lookup_idx;
  drop index if exists profiles_role_lookup_idx;
end;
$$;