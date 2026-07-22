const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eslajmbvrqbkmsolffqi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbGFqbWJ2cnFia21zb2xmZnFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM2OTYwMCwiZXhwIjoyMDk1OTQ1NjAwfQ.S50IUQvwMH9gZa3LM2NCFOjaG9_eU0gK26oteNpKBps';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('--- HISTORICAL INFLATED TRANSACTIONS MIGRATION ---');

  // Approximate current rates (used to reverse-calculate the crypto amount)
  // For BTC, e.g., 888.61 CAD was likely 0.01 BTC (rate ~ 88861)
  const btcRate = 88861;
  const ethRate = 2460.57; // Just based on the ETH transaction which was probably 1 ETH
  
  const { data: deposits } = await supabase.from('deposit_requests').select('*');
  const suspDep = deposits.filter(d => (d.asset === 'BTC' && d.expected_amount > 1) || (d.asset === 'ETH' && d.expected_amount > 10));
  
  console.log('\n--- DEPOSITS TO FIX ---');
  for (const d of suspDep) {
    const rate = d.asset === 'BTC' ? btcRate : ethRate;
    const approxCrypto = parseFloat((d.expected_amount / rate).toFixed(8));
    console.log(`ID: ${d.id} | Asset: ${d.asset} | Stored CAD: ${d.expected_amount} | New Crypto Amount: ${approxCrypto}`);
    
    // PERFORM THE FIX
    await supabase.from('deposit_requests').update({ expected_amount: approxCrypto }).eq('id', d.id);
  }

  const { data: withdrawals } = await supabase.from('withdrawal_requests').select('*');
  const suspWdr = withdrawals.filter(w => (w.asset === 'BTC' && w.amount > 1) || (w.asset === 'ETH' && w.amount > 10));
  
  console.log('\n--- WITHDRAWALS TO FIX ---');
  for (const w of suspWdr) {
    const rate = w.asset === 'BTC' ? btcRate : ethRate;
    const approxCrypto = parseFloat((w.amount / rate).toFixed(8));
    console.log(`ID: ${w.id} | Asset: ${w.asset} | Stored CAD: ${w.amount} | New Crypto Amount: ${approxCrypto}`);
    
    // PERFORM THE FIX
    await supabase.from('withdrawal_requests').update({ amount: approxCrypto }).eq('id', w.id);
  }

  // Same logic for wallet_ledger but we didn't find any suspicious ledger entries.
  console.log('\nMigration complete.');
}

main().catch(console.error);
