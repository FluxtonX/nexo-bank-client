-- Migration: Support Chat Attachments & Day Dividers
-- This script adds the attachment_url column to support_messages if desired,
-- and ensures the chat-attachments storage bucket is properly configured.
--
-- Note: The application logic already supports transparent attachment parsing
-- and storage uploads immediately out-of-the-box.

-- 1. Optional attachment_url column on support_messages
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'support_messages' and column_name = 'attachment_url'
  ) then
    alter table public.support_messages add column attachment_url text;
  end if;
end;
$$;

-- 2. Ensure chat-attachments bucket is public in storage.buckets
update storage.buckets
set public = true
where id = 'chat-attachments';
