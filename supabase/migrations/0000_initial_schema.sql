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

-- This is where we'll put your schema
-- You can generate this by running:
-- supabase db dump > supabase/migrations/0000_initial_schema.sql 

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  role user_role default 'client',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint username_length check (char_length(username) >= 3)
);

-- Create projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  status project_status default 'planning' not null,
  start_date timestamp with time zone,
  target_completion_date timestamp with time zone,
  dev_environment_url text,
  staging_environment_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint valid_dates check (
    (target_completion_date is null) or 
    (start_date is null) or 
    (target_completion_date >= start_date)
  )
);

-- Create project_members table
create table project_members (
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null check (role in ('client', 'developer', 'project_manager')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (project_id, user_id)
);

-- Create project_updates table
create table project_updates (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create project_documents table
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

-- Create project_messages table
create table project_messages (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  recipient_id uuid references profiles(id) on delete cascade not null,
  subject text not null,
  content text not null,
  status message_status default 'unread' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create scope_change_requests table
create table scope_change_requests (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  requester_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')) not null,
  approved_by uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create project_timeline table
create table project_timeline (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('planned', 'in_progress', 'completed', 'delayed')) not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create project_invoices table
create table project_invoices (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  invoice_number text unique not null,
  amount decimal(10,2) not null,
  status invoice_status default 'draft' not null,
  due_date timestamp with time zone not null,
  paid_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create client_feedback table
create table client_feedback (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references profiles(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create faqs table
create table faqs (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  answer text not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create necessary indexes
create index profiles_username_idx on profiles(username);
create index profiles_id_idx on profiles(id);
create index profiles_role_idx on profiles(role) where role = 'admin';
create index project_members_user_id_idx on project_members(user_id);
create index project_updates_project_id_idx on project_updates(project_id);
create index project_messages_recipient_id_idx on project_messages(recipient_id);
create index project_invoices_project_id_idx on project_invoices(project_id);
create index scope_change_requests_project_id_idx on scope_change_requests(project_id);
create index client_feedback_client_id_idx on client_feedback(client_id);
create index client_feedback_is_public_idx on client_feedback(is_public);
create index faqs_category_idx on faqs(category);
create index projects_status_idx on projects(status);
create index projects_created_at_idx on projects(created_at);
create index projects_dates_idx on projects(start_date, target_completion_date) 
  where start_date is not null and target_completion_date is not null;

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_members enable row level security;
alter table project_updates enable row level security;
alter table project_documents enable row level security;
alter table project_messages enable row level security;
alter table scope_change_requests enable row level security;
alter table project_timeline enable row level security;
alter table project_invoices enable row level security;
alter table client_feedback enable row level security;
alter table faqs enable row level security;

-- Create storage buckets
insert into storage.buckets (id, name, public)
values 
  ('images', 'images', true),
  ('documents', 'documents', true);

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid()::uuid = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid()::uuid = id);

-- Projects policies
create policy "Projects are viewable by team members and admins"
  on projects for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role = 'admin'
    ) or
    exists (
      select 1 from project_members
      where project_id = projects.id
      and user_id = auth.uid()::uuid
    )
  );

create policy "Only admins can create projects"
  on projects for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role = 'admin'
    )
  );

create policy "Only admins can update projects"
  on projects for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role = 'admin'
    )
  );

create policy "Only admins can delete projects"
  on projects for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role = 'admin'
    )
  );

-- Project members policies
create policy "Project members are viewable by team members"
  on project_members for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role = 'admin'
    ) or
    exists (
      select 1 from project_members pm
      where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid()::uuid
    )
  );

create policy "Only admins can manage project members"
  on project_members
  for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role = 'admin'
    )
  );

-- Project updates policies
create policy "Updates are viewable by team members"
  on project_updates for select
  using (
    exists (
      select 1 from project_members
      where project_id = project_updates.project_id
      and user_id = auth.uid()::uuid
    )
  );

create policy "Team members can create updates"
  on project_updates for insert
  with check (
    exists (
      select 1 from project_members
      where project_id = project_updates.project_id
      and user_id = auth.uid()::uuid
    )
  );

-- Project documents policies
create policy "Documents are viewable by team members"
  on project_documents for select
  using (
    exists (
      select 1 from project_members
      where project_id = project_documents.project_id
      and user_id = auth.uid()::uuid
    )
  );

create policy "Team members can upload documents"
  on project_documents for insert
  with check (
    exists (
      select 1 from project_members
      where project_id = project_documents.project_id
      and user_id = auth.uid()::uuid
    )
  );

-- Project messages policies
create policy "Users can view their own messages"
  on project_messages for select
  using (
    sender_id = auth.uid()::uuid or
    recipient_id = auth.uid()::uuid
  );

create policy "Users can send messages to team members"
  on project_messages for insert
  with check (
    exists (
      select 1 from project_members
      where project_id = project_messages.project_id
      and user_id = auth.uid()::uuid
    )
  );

-- Scope change requests policies
create policy "Team members can view scope changes"
  on scope_change_requests for select
  using (
    exists (
      select 1 from project_members
      where project_id = scope_change_requests.project_id
      and user_id = auth.uid()::uuid
    )
  );

create policy "Team members can create scope changes"
  on scope_change_requests for insert
  with check (
    exists (
      select 1 from project_members
      where project_id = scope_change_requests.project_id
      and user_id = auth.uid()::uuid
    )
  );

create policy "Only admins can approve scope changes"
  on scope_change_requests for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role = 'admin'
    )
  );

-- Project timeline policies
create policy "Team members can view timeline"
  on project_timeline for select
  using (
    exists (
      select 1 from project_members
      where project_id = project_timeline.project_id
      and user_id = auth.uid()::uuid
    )
  );

create policy "Only admins can manage timeline"
  on project_timeline
  for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role = 'admin'
    )
  );

-- Project invoices policies
create policy "Clients can view their invoices"
  on project_invoices for select
  using (
    exists (
      select 1 from project_members
      where project_id = project_invoices.project_id
      and user_id = auth.uid()::uuid
    )
  );

create policy "Only admins can manage invoices"
  on project_invoices
  for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role = 'admin'
    )
  );

-- Client feedback policies
create policy "Public feedback is viewable by everyone"
  on client_feedback for select
  using (is_public = true);

create policy "Clients can create feedback"
  on client_feedback for insert
  with check (auth.uid()::uuid = client_id);

-- FAQ policies
create policy "FAQs are viewable by everyone"
  on faqs for select
  using (true);

create policy "Only admins can manage FAQs"
  on faqs
  for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role = 'admin'
    )
  );

-- Storage policies for images
create policy "Anyone can view images"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'images' and
    auth.role() = 'authenticated' and
    auth.uid() = owner
  );

create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'images' and
    auth.uid() = owner
  );

-- Storage policies for documents
create policy "Authenticated users can read documents"
  on storage.objects for select
  using (
    bucket_id = 'documents' and
    auth.role() = 'authenticated'
  );

create policy "Team members can upload documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents' and
    auth.uid() = owner and
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role in ('admin', 'developer')
    )
  );

create policy "Only admins can delete documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents' and
    exists (
      select 1 from profiles
      where id = auth.uid()::uuid and role = 'admin'
    )
  );

-- Seed Data
do $$
declare
    admin_id uuid;
    developer_id uuid;
    client_id uuid;
    project_id uuid;
    document_id uuid;
begin
    -- First create users in auth.users
    insert into auth.users (id, email)
    values 
        ('d7bed82f-accb-4fae-b661-a81a588524d5', 'admin@example.com'),
        ('91f11c3c-be0f-4e76-9aa3-c8e9cc9a24cc', 'developer@example.com'),
        ('c49a011e-76c3-4096-99e8-6e69ae24d730', 'client@example.com');

    -- Then create their profiles
    insert into profiles (id, username, full_name, role)
    values 
        ('d7bed82f-accb-4fae-b661-a81a588524d5', 'admin', 'Admin User', 'admin'),
        ('91f11c3c-be0f-4e76-9aa3-c8e9cc9a24cc', 'developer', 'Developer User', 'developer'),
        ('c49a011e-76c3-4096-99e8-6e69ae24d730', 'client', 'Client User', 'client')
    returning id into admin_id;

    -- Create a sample project
    insert into projects (id, name, description, status)
    values (
        'e52d5dd7-0f44-4a8d-9f8b-acd0f7ae7097',
        'Sample Project',
        'This is a sample project for testing',
        'planning'
    )
    returning id into project_id;

    -- Add project members
    insert into project_members (project_id, user_id, role)
    values
        (project_id, admin_id, 'project_manager'),
        (project_id, 'd7bed82f-accb-4fae-b661-a81a588524d5', 'developer'),
        (project_id, '91f11c3c-be0f-4e76-9aa3-c8e9cc9a24cc', 'developer'),
        (project_id, 'c49a011e-76c3-4096-99e8-6e69ae24d730', 'client');

    -- Add project updates
    insert into project_updates (project_id, author_id, title, content)
    values
        (project_id, admin_id, 'Project Kickoff', 'Project has been initiated successfully'),
        (project_id, admin_id, 'First Sprint Complete', 'Completed initial setup and planning');

    -- Add project documents
    insert into project_documents (project_id, uploader_id, name, file_url, file_type, category)
    values
        (project_id, admin_id, 'Project Scope', '/documents/scope.pdf', 'application/pdf', 'contract')
    returning id into document_id;

    -- Add project messages
    insert into project_messages (project_id, sender_id, recipient_id, subject, content)
    values
        (project_id, admin_id, 'c49a011e-76c3-4096-99e8-6e69ae24d730', 'Welcome to the project', 'Welcome aboard! Let us know if you have any questions.');

    -- Add scope change requests
    insert into scope_change_requests (project_id, requester_id, title, description)
    values
        (project_id, 'c49a011e-76c3-4096-99e8-6e69ae24d730', 'Add New Feature', 'Would like to add user authentication');

    -- Add project timeline entries
    insert into project_timeline (project_id, title, description, status, start_date, end_date)
    values
        (project_id, 'Phase 1', 'Initial Development', 'planned', now(), now() + interval '30 days');

    -- Add project invoices
    insert into project_invoices (project_id, invoice_number, amount, status, due_date)
    values
        (project_id, 'INV-001', 1000.00, 'draft', now() + interval '30 days');

    -- Add client feedback
    insert into client_feedback (client_id, rating, comment, is_public)
    values
        ('c49a011e-76c3-4096-99e8-6e69ae24d730', 5, 'Great service and communication!', true);

    -- Add FAQs
    insert into faqs (question, answer, category)
    values
        ('How do I submit a change request?', 'You can submit a change request through your project dashboard.', 'Projects'),
        ('What are your payment terms?', 'Payment terms are net 30 days from invoice date.', 'Billing');

end; $$;