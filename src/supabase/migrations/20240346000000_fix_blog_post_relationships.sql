-- Drop existing views and policies
drop view if exists blog_posts_with_authors;
drop policy if exists "Anyone can view published blog posts" on blog_posts;

-- Create a more comprehensive view for blog posts
create or replace view blog_posts_with_authors as
select 
  bp.*,
  p.username,
  p.full_name,
  count(distinct bpv.viewer_id) as view_count
from blog_posts bp
left join profiles p on bp.author_id = p.id
left join blog_post_views bpv on bp.id = bpv.post_id
group by bp.id, p.username, p.full_name;

-- Create indexes for better performance
create index if not exists blog_posts_slug_idx on blog_posts(slug);
create index if not exists blog_posts_published_idx on blog_posts(published_at);
create index if not exists blog_posts_author_idx on blog_posts(author_id);

-- Update RLS policies
create policy "Anyone can view published blog posts"
  on blog_posts for select
  using (
    published_at is not null
    or auth.uid() = author_id
  );

create policy "Anyone can view blog post views"
  on blog_post_views for select
  using (true);

create policy "Authenticated users can record views"
  on blog_post_views for insert
  with check (true);

-- Grant permissions
grant select on blog_posts_with_authors to authenticated, anon;
grant select, insert on blog_post_views to authenticated;
grant select on blog_posts to authenticated, anon;