-- Drop existing foreign key if it exists
alter table blog_posts
drop constraint if exists blog_posts_author_id_fkey;

-- Recreate the foreign key with correct reference
alter table blog_posts
add constraint blog_posts_author_id_fkey
foreign key (author_id)
references profiles(id)
on delete cascade;

-- Create index for better query performance
create index if not exists blog_posts_author_id_idx 
on blog_posts(author_id);

-- Update the blog posts view to include profile information
create or replace view blog_posts_with_authors as
select 
  bp.*,
  p.username,
  p.full_name
from blog_posts bp
left join profiles p on bp.author_id = p.id;

-- Grant appropriate permissions
grant select on blog_posts_with_authors to authenticated;