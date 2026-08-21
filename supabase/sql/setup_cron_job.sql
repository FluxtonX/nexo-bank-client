-- Setup pg_cron for automated support chat reminders
-- Run this in your Supabase SQL Editor

-- Step 1: Enable pg_cron extension (if not already enabled)
create extension if not exists pg_cron;

-- Step 2: Create a cron job to call the support-chat-reminders function every 3 minutes
-- This will trigger the Edge Function via net.http_post if available, 
-- or you can use an external cron service to call the Edge Function directly

-- Schedule to run every 3 minutes
-- Note: pg_cron may not support net.http_post in all Supabase plans
-- If this fails, use Option 2 (external cron service) instead
select cron.schedule(
  'support-chat-reminders-cron',
  '*/3 * * * *',  -- Every 3 minutes
  $$
  select net.http_post(
    url := 'https://psugoqazdztntspgqbiu.supabase.co/functions/v1/support-chat-reminders',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdWdvcWF6ZHp0bnRzcGdxYml1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcxNDY0OCwiZXhwIjoyMTAwMjkwNjQ4fQ.0ajH-7hSPjOBDwD-Z4obl0kAekhfq_KFqILz-xWbfhQ',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Check if the cron job is scheduled
select * from cron.job;

-- To remove the cron job later:
-- select cron.unschedule('support-chat-reminders-cron');
