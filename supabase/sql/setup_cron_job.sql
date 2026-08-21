-- Setup pg_cron for automated support chat reminders
-- Run this in your Supabase SQL Editor

-- Step 1: Enable pg_cron extension (if not already enabled)
create extension if not exists pg_cron;

-- Step 2: Create a cron job to call the support-chat-reminders function every 3 minutes
-- This will trigger the Edge Function via net.http_post if available, 
-- or you can use an external cron service to call the Edge Function directly

-- First, remove the existing cron job if it exists
select cron.unschedule('support-chat-reminders-cron');

-- Schedule to run every 3 minutes using a simpler approach
-- This will call the enqueue function directly in the database
select cron.schedule(
  'support-chat-reminders-cron',
  '*/3 * * * *',  -- Every 3 minutes
  $$
  select enqueue_due_support_chat_reminders();
  $$
);

-- Check if the cron job is scheduled
select * from cron.job;

-- To remove the cron job later:
-- select cron.unschedule('support-chat-reminders-cron');
