-- Enable storage for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Create policy to allow authenticated users to read images
create policy "Anyone can read images"
  on storage.objects for select
  using (bucket_id = 'images');

-- Create policy to allow authenticated users to upload images
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'images' and
    auth.role() = 'authenticated'
  );

-- Create policy to allow owners to delete their images
create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'images' and
    auth.uid()::text = owner
  );