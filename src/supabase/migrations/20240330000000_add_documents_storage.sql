-- Enable storage for documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true);

-- Create policy to allow authenticated users to read documents
create policy "Authenticated users can read documents"
  on storage.objects for select
  using (
    bucket_id = 'documents' and
    auth.role() = 'authenticated'
  );

-- Create policy to allow admins and developers to upload documents
create policy "Admins and developers can upload documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents' and
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'developer')
    )
  );

-- Create policy to allow admins to delete documents
create policy "Admins can delete documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents' and
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );