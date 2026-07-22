import { createAdminClient } from '../src/lib/supabase/admin';

const supabase = createAdminClient();

async function findSuspiciousTransactions() {
  console.log('=== Finding Suspicious Transactions ===\n');

  // Query deposit_requests for suspicious amounts
  console.log('Checking deposit_requests...');
  const { data: deposits, error: depositsError } = await supabase
    .from('deposit_requests')
    .select('id, asset, expected_amount, status, created_at, user_id')
    .order('expected_amount', { ascending: false });

  if (depositsError) {
    console.error('Error fetching deposits:', depositsError);
  } else {
    console.log(`Found ${deposits.length} deposit requests\n`);
    
    const suspiciousDeposits = deposits.filter(d => {
      const amount = Number(d.expected_amount);
      const asset = (d.asset || '').toUpperCase();
      
      if (asset === 'BTC' && amount > 10) return true;
      if (asset === 'ETH' && amount > 100) return true;
      if (asset === 'USDT' && amount > 100000) return true;
      if (asset === 'USDC' && amount > 100000) return true;
      return false;
    });

    if (suspiciousDeposits.length > 0) {
      console.log('=== SUSPICIOUS DEPOSITS ===');
      suspiciousDeposits.forEach(d => {
        console.log(`ID: ${d.id}`);
        console.log(`  Asset: ${d.asset}`);
        console.log(`  Amount: ${d.expected_amount}`);
        console.log(`  Status: ${d.status}`);
        console.log(`  User ID: ${d.user_id}`);
        console.log(`  Created: ${d.created_at}`);
        console.log('');
      });
    } else {
      console.log('No suspicious deposits found.\n');
    }
  }

  // Query withdrawal_requests for suspicious amounts
  console.log('\nChecking withdrawal_requests...');
  const { data: withdrawals, error: withdrawalsError } = await supabase
    .from('withdrawal_requests')
    .select('id, asset, amount, status, created_at, user_id')
    .order('amount', { ascending: false });

  if (withdrawalsError) {
    console.error('Error fetching withdrawals:', withdrawalsError);
  } else {
    console.log(`Found ${withdrawals.length} withdrawal requests\n`);
    
    const suspiciousWithdrawals = withdrawals.filter(w => {
      const amount = Number(w.amount);
      const asset = (w.asset || '').toUpperCase();
      
      if (asset === 'BTC' && amount > 10) return true;
      if (asset === 'ETH' && amount > 100) return true;
      if (asset === 'USDT' && amount > 100000) return true;
      if (asset === 'USDC' && amount > 100000) return true;
      return false;
    });

    if (suspiciousWithdrawals.length > 0) {
      console.log('=== SUSPICIOUS WITHDRAWALS ===');
      suspiciousWithdrawals.forEach(w => {
        console.log(`ID: ${w.id}`);
        console.log(`  Asset: ${w.asset}`);
        console.log(`  Amount: ${w.amount}`);
        console.log(`  Status: ${w.status}`);
        console.log(`  User ID: ${w.user_id}`);
        console.log(`  Created: ${w.created_at}`);
        console.log('');
      });
    } else {
      console.log('No suspicious withdrawals found.\n');
    }
  }

  console.log('=== Summary ===');
  console.log('Please review the suspicious transactions above and confirm which ones should be deleted.');
  console.log('To delete, use the DELETE statements in the SQL queries below:');
}

findSuspiciousTransactions().catch(console.error);
