// Diagnose why new admin message is not triggering reminder
// Run with: node diagnose-reminder.js

const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#') && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

async function diagnose() {
  console.log('=== DIAGNOSING REMINDER SYSTEM ===\n');

  const headers = {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    // 1. Check recent admin messages
    console.log('1. Checking recent admin messages...\n');
    const messagesResponse = await fetch(`${SUPABASE_URL}/rest/v1/support_messages?sender=eq.Admin&order=created_at.desc&limit=10`, {
      headers
    });
    const messages = await messagesResponse.json();
    
    messages.forEach((msg, i) => {
      const ageMinutes = (Date.now() - new Date(msg.created_at).getTime()) / (1000 * 60);
      console.log(`${i + 1}. Message ID: ${msg.id}`);
      console.log(`   Thread ID: ${msg.thread_id}`);
      console.log(`   Created: ${msg.created_at} (${ageMinutes.toFixed(1)} minutes ago)`);
      console.log(`   Text: ${msg.text.substring(0, 50)}...`);
      console.log('');
    });

    // 2. Check thread statuses
    console.log('2. Checking thread statuses...\n');
    const threadIds = [...new Set(messages.map(m => m.thread_id))];
    for (const threadId of threadIds) {
      const threadResponse = await fetch(`${SUPABASE_URL}/rest/v1/support_threads?id=eq.${threadId}&select=*`, {
        headers
      });
      const threads = await threadResponse.json();
      if (threads.length > 0) {
        const thread = threads[0];
        console.log(`Thread ${threadId}: Status = ${thread.status}, User ID = ${thread.user_id}`);
      }
    }

    // 3. Check if reminders were created for these messages
    console.log('\n3. Checking if reminders exist for these admin messages...\n');
    for (const msg of messages) {
      const reminderResponse = await fetch(`${SUPABASE_URL}/rest/v1/support_chat_reminders?admin_message_id=eq.${msg.id}&select=*`, {
        headers
      });
      const reminders = await reminderResponse.json();
      
      const ageMinutes = (Date.now() - new Date(msg.created_at).getTime()) / (1000 * 60);
      const shouldHaveReminder = ageMinutes >= 3;
      
      console.log(`Message ${msg.id} (${ageMinutes.toFixed(1)} min old):`);
      console.log(`   Should have reminder: ${shouldHaveReminder ? 'YES' : 'NO'}`);
      console.log(`   Has reminder: ${reminders.length > 0 ? 'YES' : 'NO'}`);
      if (reminders.length > 0) {
        console.log(`   Reminder status: ${reminders[0].status}`);
      }
      console.log('');
    }

    // 4. Check pending reminders
    console.log('4. Checking pending reminders...\n');
    const pendingResponse = await fetch(`${SUPABASE_URL}/rest/v1/support_chat_reminders?status=eq.pending&select=*`, {
      headers
    });
    const pending = await pendingResponse.json();
    console.log(`Pending reminders: ${pending.length}`);

    // 5. Check cron job status
    console.log('\n5. Checking cron job status...\n');
    console.log('You need to check this in Supabase SQL Editor:');
    console.log('Run: select * from cron.job;');
    console.log('Look for "support-chat-reminders-cron" job');

    // 6. Manually trigger enqueue function
    console.log('\n6. Manually triggering enqueue function...\n');
    const enqueueResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/enqueue_due_support_chat_reminders`, {
      method: 'POST',
      headers
    });
    const enqueueResult = await enqueueResponse.json();
    console.log('Enqueue result:', enqueueResult);

    // 7. Check if new reminders were created
    console.log('\n7. Checking if new reminders were created after enqueue...\n');
    const newRemindersResponse = await fetch(`${SUPABASE_URL}/rest/v1/support_chat_reminders?select=*&order=created_at.desc&limit=5`, {
      headers
    });
    const newReminders = await newRemindersResponse.json();
    console.log(`Latest ${newReminders.length} reminders:`);
    newReminders.forEach((r, i) => {
      console.log(`${i + 1}. Status: ${r.status}, Created: ${r.created_at}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

diagnose();
