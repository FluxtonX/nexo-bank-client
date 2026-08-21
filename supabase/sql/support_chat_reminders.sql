-- Support chat reminder delivery
-- Run once in the Supabase SQL editor after support_chat.sql.

create table if not exists public.support_chat_reminders (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.support_threads(id) on delete cascade,
  admin_message_id uuid not null unique references public.support_messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed')),
  attempt_count integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  last_error text,
  provider_message_id text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_chat_reminders_due_idx
  on public.support_chat_reminders (status, next_attempt_at);

-- Create one reminder only for the latest unanswered admin message in an open thread.
create or replace function public.enqueue_due_support_chat_reminders()
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.support_chat_reminders (thread_id, admin_message_id, user_id)
  select message.thread_id, message.id, thread.user_id
  from public.support_messages message
  join public.support_threads thread on thread.id = message.thread_id
  where message.sender = 'Admin'
    and message.created_at <= now() - interval '3 minutes'
    and thread.status not in ('Resolved', 'Closed')
    and not exists (
      select 1
      from public.support_messages later_admin_message
      where later_admin_message.thread_id = message.thread_id
        and later_admin_message.sender = 'Admin'
        and later_admin_message.created_at > message.created_at
    )
    and not exists (
      select 1
      from public.support_messages client_message
      where client_message.thread_id = message.thread_id
        and client_message.sender = 'Client'
        and client_message.created_at > message.created_at
    )
  on conflict (admin_message_id) do nothing;
$$;

-- Atomically reserve due reminders for one cron invocation, avoiding duplicate sends.
create or replace function public.claim_due_support_chat_reminders(p_limit integer default 25)
returns table (
  reminder_id uuid,
  user_email text,
  user_name text,
  message_text text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with candidates as (
    select reminder.id
    from public.support_chat_reminders reminder
    join public.support_messages message on message.id = reminder.admin_message_id
    join public.support_threads thread on thread.id = reminder.thread_id
    where reminder.status in ('pending', 'failed')
      and reminder.next_attempt_at <= now()
      and reminder.attempt_count < 3
      and thread.status not in ('Resolved', 'Closed')
      and not exists (
        select 1
        from public.support_messages client_message
        where client_message.thread_id = reminder.thread_id
          and client_message.sender = 'Client'
          and client_message.created_at > message.created_at
      )
    order by reminder.created_at
    for update of reminder skip locked
    limit greatest(1, least(p_limit, 100))
  ), claimed as (
    update public.support_chat_reminders reminder
    set status = 'sending',
        attempt_count = reminder.attempt_count + 1,
        updated_at = now()
    from candidates
    where reminder.id = candidates.id
    returning reminder.id, reminder.user_id, reminder.admin_message_id
  )
  select claimed.id,
         profile.email,
         coalesce(nullif(profile.full_name, ''), split_part(profile.email, '@', 1), 'there'),
         message.text
  from claimed
  join public.profiles profile on profile.id = claimed.user_id
  join public.support_messages message on message.id = claimed.admin_message_id;
end;
$$;

grant execute on function public.enqueue_due_support_chat_reminders() to service_role;
grant execute on function public.claim_due_support_chat_reminders(integer) to service_role;
