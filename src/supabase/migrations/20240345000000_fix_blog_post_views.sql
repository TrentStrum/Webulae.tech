-- Drop existing view if it exists
drop view if exists blog_posts_with_authors;

-- Create a more comprehensive view for blog posts
create or replace view blog_posts_with_authors as
select 
  bp.*,
  p.username,
  p.full_name,
  count(bpv.post_id) as view_count
from blog_posts bp
left join profiles p on bp.author_id = p.id
left join blog_post_views bpv on bp.id = bpv.post_id
group by bp.id, p.username, p.full_name;

-- Create indexes for better performance
create index if not exists blog_post_views_post_viewer_idx 
on blog_post_views(post_id, viewer_id);

create index if not exists blog_posts_published_idx 
on blog_posts(published_at) 
where published_at is not null;

-- Update RLS policies for blog post views
drop policy if exists "Anyone can view published blog posts" on blog_posts;
create policy "Anyone can view published blog posts"
  on blog_posts for select
  using (
    published_at is not null
    or (auth.uid() = author_id)
  );

-- Grant permissions
grant select on blog_posts_with_authors to authenticated, anon;