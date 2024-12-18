-- Create project status enum
create type project_status as enum (
  'planning',
  'in_progress',
  'review',
  'completed',
  'on_hold'
);

-- Create invoice status enum
create type invoice_status as enum (
  'draft',
  'sent',
  'paid',
  'overdue',
  'cancelled'
);

-- Create message status enum
create type message_status as enum (
  'unread',
  'read',
  'archived'
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
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create project_members table to link users to projects
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

-- Create invoices table
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

-- Create indexes
create index project_members_user_id_idx on project_members (user_id);
create index project_updates_project_id_idx on project_updates (project_id);
create index project_messages_recipient_id_idx on project_messages (recipient_id);
create index project_invoices_project_id_idx on project_invoices (project_id);
create index scope_change_requests_project_id_idx on scope_change_requests (project_id);

-- Set up RLS policies
alter table projects enable row level security;
alter table project_members enable row level security;
alter table project_updates enable row level security;
alter table project_documents enable row level security;
alter table project_messages enable row level security;
alter table scope_change_requests enable row level security;
alter table project_timeline enable row level security;
alter table project_invoices enable row level security;

-- Projects policies
create policy "Users can view projects they are members of"
  on projects for select
  using (
    exists (
      select 1 from project_members
      where project_members.project_id = id
      and project_members.user_id = auth.uid()
    )
  );

-- Project members policies
create policy "Users can view project members for their projects"
  on project_members for select
  using (
    exists (
      select 1 from project_members as pm
      where pm.project_id = project_id
      and pm.user_id = auth.uid()
    )
  );

-- Project updates policies
create policy "Users can view updates for their projects"
  on project_updates for select
  using (
    exists (
      select 1 from project_members
      where project_members.project_id = project_id
      and project_members.user_id = auth.uid()
    )
  );

-- Project documents policies
create policy "Users can view documents for their projects"
  on project_documents for select
  using (
    exists (
      select 1 from project_members
      where project_members.project_id = project_id
      and project_members.user_id = auth.uid()
    )
  );

-- Project messages policies
create policy "Users can view messages they sent or received"
  on project_messages for select
  using (
    sender_id = auth.uid() or recipient_id = auth.uid()
  );

create policy "Users can send messages for their projects"
  on project_messages for insert
  with check (
    exists (
      select 1 from project_members
      where project_members.project_id = project_id
      and project_members.user_id = auth.uid()
    )
  );

-- Scope change requests policies
create policy "Users can view scope changes for their projects"
  on scope_change_requests for select
  using (
    exists (
      select 1 from project_members
      where project_members.project_id = project_id
      and project_members.user_id = auth.uid()
    )
  );

create policy "Users can create scope change requests for their projects"
  on scope_change_requests for insert
  with check (
    exists (
      select 1 from project_members
      where project_members.project_id = project_id
      and project_members.user_id = auth.uid()
    )
  );

-- Project timeline policies
create policy "Users can view timeline for their projects"
  on project_timeline for select
  using (
    exists (
      select 1 from project_members
      where project_members.project_id = project_id
      and project_members.user_id = auth.uid()
    )
  );

-- Project invoices policies
create policy "Users can view invoices for their projects"
  on project_invoices for select
  using (
    exists (
      select 1 from project_members
      where project_members.project_id = project_id
      and project_members.user_id = auth.uid()
    )
  );