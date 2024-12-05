-- Create feedback table
create table client_feedback (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references profiles(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create FAQ table
create table faqs (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  answer text not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index client_feedback_client_id_idx on client_feedback(client_id);
create index client_feedback_is_public_idx on client_feedback(is_public);
create index faqs_category_idx on faqs(category);

-- Set up RLS policies
alter table client_feedback enable row level security;
alter table faqs enable row level security;

-- Feedback policies
create policy "Users can view their own feedback"
  on client_feedback for select
  using (client_id = auth.uid());

create policy "Users can insert their own feedback"
  on client_feedback for insert
  with check (client_id = auth.uid());

create policy "Admins can view all feedback"
  on client_feedback for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- FAQ policies
create policy "Anyone can view FAQs"
  on faqs for select
  using (true);

create policy "Only admins can manage FAQs"
  on faqs
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Insert some sample FAQs
insert into faqs (question, answer, category) values
  (
    'How do I request changes to my project?',
    'You can request changes through the "Request Scope Change" button on your project page. Provide detailed information about the requested changes, and our team will review and respond promptly.',
    'Projects'
  ),
  (
    'What is your typical response time for support?',
    'We aim to respond to all support requests within 24 hours during business days. For urgent matters, premium support options are available.',
    'Support'
  ),
  (
    'How do I track project progress?',
    'You can track project progress through your project dashboard. The timeline section shows all major milestones and their current status.',
    'Projects'
  ),
  (
    'What payment methods do you accept?',
    'We accept major credit cards, bank transfers, and PayPal. Payment terms and methods can be discussed during project setup.',
    'Billing'
  ),
  (
    'How do I share documents with the development team?',
    'You can upload documents directly through the Documents section in your project dashboard. Supported formats include PDF, DOC, DOCX, and image files.',
    'Communication'
  );