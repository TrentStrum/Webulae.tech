-- Drop existing tables if they exist
drop table if exists client_feedback cascade;
drop table if exists faqs cascade;
drop table if exists project_invoices cascade;
drop table if exists project_timeline cascade;
drop table if exists scope_change_requests cascade;
drop table if exists project_messages cascade;
drop table if exists project_documents cascade;
drop table if exists project_updates cascade;
drop table if exists project_members cascade;
drop table if exists projects cascade;
drop table if exists blog_post_views cascade;
drop table if exists comment_likes cascade;
drop table if exists blog_comments cascade;
drop table if exists blog_posts cascade;
drop table if exists profiles cascade;

-- Drop existing types if they exist
drop type if exists user_role cascade;
drop type if exists project_status cascade;
drop type if exists invoice_status cascade;
drop type if exists message_status cascade;

-- Create necessary enums
create type user_role as enum ('client', 'admin', 'developer');
create type project_status as enum ('planning', 'in_progress', 'review', 'completed', 'on_hold');
create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue', 'cancelled');
create type message_status as enum ('unread', 'read', 'archived');

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  role user_role default 'client'::user_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint username_length check (char_length(username) >= 3)
);

-- Create projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  status project_status default 'planning' not null,
  start_date date,
  target_completion_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create project_members table
create table project_members (
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null check (role in ('client', 'developer', 'project_manager')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (project_id, user_id)
);

-- Create blog_posts table
create table blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  content text not null,
  author_id uuid references profiles(id) on delete cascade not null,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create blog_comments table
create table blog_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references blog_posts(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  parent_id uuid references blog_comments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create comment_likes table
create table comment_likes (
  comment_id uuid references blog_comments(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (comment_id, user_id)
);

-- Create project related tables
create table project_updates (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table project_documents (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  uploader_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  file_url text not null,
  file_type text not null,
  category text not null check (category in ('contract', 'scope_change', 'design', 'other')),
  parent_id uuid references project_documents(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create optimized indexes
create index profiles_username_idx on profiles(username);
create index profiles_role_idx on profiles(role) where role = 'admin';
create index project_members_lookup_idx on project_members(user_id, project_id);
create index blog_posts_slug_idx on blog_posts(slug);
create index blog_posts_author_idx on blog_posts(author_id);
create index blog_comments_post_idx on blog_comments(post_id);
create index project_updates_project_idx on project_updates(project_id);

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_members enable row level security;
alter table blog_posts enable row level security;
alter table blog_comments enable row level security;
alter table comment_likes enable row level security;
alter table project_updates enable row level security;
alter table project_documents enable row level security;

-- Create storage buckets if they don't exist
do $$
begin
  insert into storage.buckets (id, name, public)
  values ('images', 'images', true)
  on conflict (id) do nothing;

  insert into storage.buckets (id, name, public)
  values ('documents', 'documents', true)
  on conflict (id) do nothing;
end $$;

-- RLS Policies

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Project policies
create policy "Projects are viewable by team members and admins"
  on projects for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    or exists (
      select 1 from project_members
      where project_id = projects.id and user_id = auth.uid()
    )
  );

create policy "Only admins can manage projects"
  on projects for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Project members policies
create policy "Project members access"
  on project_members using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    or user_id = auth.uid()
  )
  with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Blog posts policies
create policy "Blog posts are viewable by everyone"
  on blog_posts for select using (published_at is not null or auth.uid() = author_id);

create policy "Only admins can manage blog posts"
  on blog_posts for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Comments policies
create policy "Comments are viewable by everyone"
  on blog_comments for select using (true);

create policy "Authenticated users can manage their comments"
  on blog_comments for all using (auth.uid() = author_id);

-- Storage policies
drop policy if exists "Anyone can view images" on storage.objects;
drop policy if exists "Authenticated users can upload images" on storage.objects;
drop policy if exists "Users can delete their own images" on storage.objects;
drop policy if exists "Authenticated users can access documents" on storage.objects;
drop policy if exists "Team members can upload documents" on storage.objects;
drop policy if exists "Only admins can delete documents" on storage.objects;

create policy "Anyone can view images"
  on storage.objects for select using (bucket_id = 'images');

create policy "Authenticated users can upload images"
  on storage.objects for insert with check (
    bucket_id = 'images' and auth.role() = 'authenticated'
  );

create policy "Users can delete their own images"
  on storage.objects for delete using (
    bucket_id = 'images' and auth.uid() = owner
  );

create policy "Authenticated users can access documents"
  on storage.objects for select using (
    bucket_id = 'documents' and auth.role() = 'authenticated'
  );

create policy "Team members can upload documents"
  on storage.objects for insert with check (
    bucket_id = 'documents' 
    and exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'developer')
    )
  );

create policy "Only admins can delete documents"
  on storage.objects for delete using (
    bucket_id = 'documents'
    and exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Functions
create or replace function validate_role_changes()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    return new;
  end if;

  if not exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'Only administrators can modify roles';
  end if;

  if old.role in ('admin', 'developer') and new.role = 'client' then
    raise exception 'Cannot downgrade admin or developer to client role';
  end if;

  return new;
end;
$$ language plpgsql security definer;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger enforce_role_changes
  before update of role on profiles
  for each row
  execute function validate_role_changes();

create trigger set_updated_at
  before update on profiles
  for each row
  execute function set_updated_at();