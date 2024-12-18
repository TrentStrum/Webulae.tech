-- Add views tracking for blog posts
create table blog_post_views (
  post_id uuid references blog_posts(id) on delete cascade not null,
  viewer_id uuid references profiles(id) on delete cascade,
  viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_address inet,
  user_agent text,
  primary key (post_id, viewed_at)
);

-- Create index for better query performance
create index blog_post_views_post_id_idx on blog_post_views (post_id);

-- Set up RLS policies
alter table blog_post_views enable row level security;

create policy "Blog post views are viewable by post authors and admins"
  on blog_post_views for select
  using (
    exists (
      select 1 from blog_posts
      join profiles on blog_posts.author_id = profiles.id
      where blog_posts.id = blog_post_views.post_id
      and (
        profiles.id = auth.uid()
        or profiles.role = 'admin'
      )
    )
  );

create policy "Anyone can insert blog post views"
  on blog_post_views for insert
  with check (true);

-- Function to get view count for a post
create or replace function get_post_view_count(post_id uuid)
returns bigint
language sql
security definer
set search_path = public
stable
as $$
  select count(distinct viewer_id)
  from blog_post_views
  where blog_post_views.post_id = $1
$$;