// Test script to verify Brevo email configuration
// Run with: node test-brevo.js

const { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } = require('@getbrevo/brevo');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testBrevoEmail() {
  console.log('🧪 Testing Brevo Email Configuration...\n');

  // Check API Key
  if (!process.env.BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY not found in .env.local');
    return;
  }
  console.log('✅ BREVO_API_KEY found');

  // Initialize API
  const apiInstance = new TransactionalEmailsApi();
  apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

  // Test email
  const testEmail = 'muhammedmudassir40@gmail.com'; // Your email for testing
  const testCode = '123456';

  const sendSmtpEmail = new SendSmtpEmail();
  sendSmtpEmail.sender = { 
    email: 'noreply@ndntbank.com', 
    name: 'Nexo Platform Test' 
  };
  sendSmtpEmail.to = [{ email: testEmail }];
  sendSmtpEmail.subject = 'Brevo Configuration Test';
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
      <h1 style="color: #2563EB;">Brevo Test Email</h1>
      <p style="color: #4A5568; font-size: 16px;">If you receive this email, your Brevo configuration is working correctly!</p>
      <div style="background-color: #F8F9FA; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="font-size: 32px; letter-spacing: 4px; color: #0A0F2C; margin: 0;">${testCode}</h2>
      </div>
      <p style="color: #718096; font-size: 14px;">Test Code: ${testCode}</p>
    </div>
  `;

  try {
    console.log('📧 Sending test email to:', testEmail);
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Test email sent successfully!');
    console.log('📬 Please check your inbox (and spam folder) for the test email.');
  } catch (error) {
    console.error('❌ Failed to send test email:');
    console.error('Error details:', error.response ? error.response.body : error.message);
    
    // Common issues
    if (error.message && error.message.includes('Invalid sender')) {
      console.error('💡 Issue: Sender domain not verified in Brevo');
    } else if (error.message && error.message.includes('Unauthenticated')) {
      console.error('💡 Issue: Invalid API key');
    } else if (error.message && error.message.includes('quota')) {
      console.error('💡 Issue: Brevo quota exceeded');
    }
  }
}

testBrevoEmail();