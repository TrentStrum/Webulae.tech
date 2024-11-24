-- Create roles enum
create type user_role as enum ('user', 'admin');

-- Add role column to profiles
alter table profiles
add column role user_role default 'user';

-- Create blog posts table
create table blog_posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) not null,
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint author_must_be_admin check (
    exists (
      select 1 from profiles 
      where profiles.id = author_id 
      and profiles.role = 'admin'
    )
  )
);

-- Create comments table
create table blog_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references blog_posts(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  parent_id uuid references blog_comments(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create comment likes table
create table comment_likes (
  comment_id uuid references blog_comments(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (comment_id, user_id)
);

-- Create indexes
create index blog_posts_slug_idx on blog_posts (slug);
create index blog_posts_published_at_idx on blog_posts (published_at);
create index blog_comments_post_id_idx on blog_comments (post_id);
create index blog_comments_parent_id_idx on blog_comments (parent_id);
create index comment_likes_comment_id_idx on comment_likes (comment_id);

-- Set up RLS policies
alter table blog_posts enable row level security;
alter table blog_comments enable row level security;
alter table comment_likes enable row level security;

-- Blog posts policies
create policy "Blog posts are viewable by everyone"
  on blog_posts for select
  using (true);

create policy "Only admins can insert blog posts"
  on blog_posts for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Only admins can update their own blog posts"
  on blog_posts for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
      and profiles.id = author_id
    )
  );

-- Comments policies
create policy "Comments are viewable by everyone"
  on blog_comments for select
  using (true);

create policy "Authenticated users can insert comments"
  on blog_comments for insert
  with check (auth.uid() = author_id);

create policy "Users can update their own comments"
  on blog_comments for update
  using (auth.uid() = author_id);

create policy "Users can delete their own comments"
  on blog_comments for delete
  using (auth.uid() = author_id);

-- Likes policies
create policy "Likes are viewable by everyone"
  on comment_likes for select
  using (true);

create policy "Authenticated users can like comments"
  on comment_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike (delete) their own likes"
  on comment_likes for delete
  using (auth.uid() = user_id);

-- Functions
create or replace function get_comment_likes_count(comment_id uuid)
returns bigint
language sql
security definer
set search_path = public
stable
as $$
  select count(*)
  from comment_likes
  where comment_likes.comment_id = $1
$$;