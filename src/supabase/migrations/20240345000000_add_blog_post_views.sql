create table if not exists public.blog_post_views (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.blog_posts(id) on delete cascade,
  viewer_id uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.blog_post_views enable row level security;

create policy "Anyone can create blog post views"
  on public.blog_post_views
  for insert
  to authenticated, anon
  with check (true); 