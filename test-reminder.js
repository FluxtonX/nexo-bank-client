// Test script to manually trigger support chat reminders
// Run with: node test-reminder.js

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
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const functionUrl = `${SUPABASE_URL}/functions/v1/support-chat-reminders`;

async function triggerReminder() {
  console.log('Triggering support chat reminders...');
  console.log(`URL: ${functionUrl}`);
  
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Reminder function executed successfully!');
      console.log(`Claimed: ${data.claimed}`);
      console.log(`Sent: ${data.sent}`);
      console.log(`Failed: ${data.failed}`);
      console.log(`Skipped: ${data.skipped}`);
    } else {
      console.error('\n❌ Error executing reminder function');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

triggerReminder();
