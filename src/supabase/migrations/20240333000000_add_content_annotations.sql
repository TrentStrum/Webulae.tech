-- Enable storage for annotations
insert into storage.buckets (id, name, public)
values ('annotations', 'annotations', true);

-- Create annotations table for storing metadata
create table content_annotations (
  id uuid default gen_random_uuid() primary key,
  content_type text not null check (content_type in ('blog_post', 'project_document', 'feedback')),
  content_id uuid not null,
  annotation_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references profiles(id) on delete cascade not null
);

-- Create index for better query performance
create index content_annotations_content_idx 
  on content_annotations(content_type, content_id);

-- Set up RLS policies
alter table content_annotations enable row level security;

-- Policies for annotations
create policy "Users can view annotations for content they have access to"
  on content_annotations for select
  using (
    case content_type
      when 'blog_post' then exists (
        select 1 from blog_posts where id = content_id
      )
      when 'project_document' then exists (
        select 1 from project_documents pd
        join project_members pm on pd.project_id = pm.project_id
        where pd.id = content_id and pm.user_id = auth.uid()
      )
      when 'feedback' then exists (
        select 1 from client_feedback where id = content_id and client_id = auth.uid()
      )
      else false
    end
  );

create policy "Users can create annotations for their content"
  on content_annotations for insert
  with check (
    created_by = auth.uid() and
    case content_type
      when 'blog_post' then exists (
        select 1 from blog_posts where id = content_id and author_id = auth.uid()
      )
      when 'project_document' then exists (
        select 1 from project_documents pd
        join project_members pm on pd.project_id = pm.project_id
        where pd.id = content_id and pm.user_id = auth.uid()
      )
      when 'feedback' then exists (
        select 1 from client_feedback where id = content_id and client_id = auth.uid()
      )
      else false
    end
  );

-- Storage policies for annotations
create policy "Users can read annotations they have access to"
  on storage.objects for select
  using (
    bucket_id = 'annotations' and
    auth.role() = 'authenticated' and
    exists (
      select 1 from content_annotations
      where id::text = storage.filename(name)
      and (
        created_by = auth.uid() or
        exists (
          select 1 from project_members pm
          join project_documents pd on pm.project_id = pd.project_id
          where pd.id = content_id and pm.user_id = auth.uid()
        )
      )
    )
  );

create policy "Users can upload annotations"
  on storage.objects for insert
  with check (
    bucket_id = 'annotations' and
    auth.role() = 'authenticated'
  );

-- Add enhanced content fields to existing tables
alter table blog_posts
  add column if not exists content_format text default 'html' check (content_format in ('html', 'markdown', 'rich-text')),
  add column if not exists metadata jsonb;

alter table project_documents
  add column if not exists annotations jsonb,
  add column if not exists version integer default 1,
  add column if not exists parent_id uuid references project_documents(id);

-- Function to handle document versioning
create or replace function handle_document_version()
returns trigger as $$
begin
  if new.parent_id is not null then
    new.version := (
      select version + 1
      from project_documents
      where id = new.parent_id
    );
  end if;
  return new;
end;
$$ language plpgsql;

-- Create trigger for document versioning
create trigger handle_document_version_trigger
  before insert on project_documents
  for each row
  execute function handle_document_version();