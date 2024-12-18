-- Add check constraints for dates
alter table projects
  add constraint valid_dates check (
    (target_completion_date is null) or 
    (start_date is null) or 
    (target_completion_date >= start_date)
  );

-- Add trigger for validation
create or replace function validate_project_dates()
returns trigger as $$
begin
  if new.target_completion_date is not null and 
     new.start_date is not null and 
     new.target_completion_date < new.start_date then
    raise exception 'Target completion date must be after start date';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger enforce_project_dates
  before insert or update on projects
  for each row
  execute function validate_project_dates();

-- Add indexes for date fields
create index if not exists projects_dates_idx 
  on projects(start_date, target_completion_date)
  where start_date is not null and target_completion_date is not null;