// Check support chat reminders in database
// Run with: node check-reminders.js

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

async function checkReminders() {
  console.log('Checking support chat reminders...\n');

  // Use direct HTTP requests to avoid WebSocket issues
  const headers = {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    // Get recent reminders
    const remindersResponse = await fetch(`${SUPABASE_URL}/rest/v1/support_chat_reminders?select=*&order=created_at.desc&limit=10`, {
      headers
    });
    
    const reminders = await remindersResponse.json();
    console.log(`Found ${reminders.length} recent reminders:\n`);

    reminders.forEach((reminder, index) => {
      console.log(`${index + 1}. Reminder ID: ${reminder.id}`);
      console.log(`   User ID: ${reminder.user_id}`);
      console.log(`   Status: ${reminder.status}`);
      console.log(`   Attempt Count: ${reminder.attempt_count}`);
      console.log(`   Next Attempt: ${reminder.next_attempt_at}`);
      console.log(`   Sent At: ${reminder.sent_at || 'Not sent yet'}`);
      console.log(`   Last Error: ${reminder.last_error || 'None'}`);
      console.log(`   Provider Message ID: ${reminder.provider_message_id || 'None'}`);
      console.log(`   Created At: ${reminder.created_at}`);
      console.log('');
    });

    // Check for specific user email
    console.log('\n--- Checking for lala81681@gmail.com ---\n');
    
    const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.lala81681@gmail.com&select=id,email,full_name`, {
      headers
    });
    
    const profiles = await profileResponse.json();

    if (profiles && profiles.length > 0) {
      const profile = profiles[0];
      console.log('User found:');
      console.log(`   ID: ${profile.id}`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Name: ${profile.full_name || 'Not set'}`);
      
      const userRemindersResponse = await fetch(`${SUPABASE_URL}/rest/v1/support_chat_reminders?user_id=eq.${profile.id}&order=created_at.desc&limit=5`, {
        headers
      });
      
      const userReminders = await userRemindersResponse.json();
      
      console.log(`\nReminders for this user: ${userReminders?.length || 0}`);
      userReminders?.forEach((r, i) => {
        console.log(`   ${i + 1}. Status: ${r.status}, Sent: ${r.sent_at || 'No'}, Error: ${r.last_error || 'None'}`);
      });
    } else {
      console.log('User lala81681@gmail.com not found in profiles table');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkReminders();
