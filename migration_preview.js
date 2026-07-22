const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eslajmbvrqbkmsolffqi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzbGFqbWJ2cnFia21zb2xmZnFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM2OTYwMCwiZXhwIjoyMDk1OTQ1NjAwfQ.S50IUQvwMH9gZa3LM2NCFOjaG9_eU0gK26oteNpKBps';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('--- HISTORICAL INFLATED TRANSACTIONS ---');

  // Let's get live rates directly or just print out all transactions for manual review.
  const btcRate = 88000;
  const ethRate = 4500;
  const usdtRate = 1.36;

  const { data: deposits } = await supabase.from('deposit_requests').select('*');
  const suspDep = deposits.filter(d => (d.asset === 'BTC' && d.expected_amount > 1) || (d.asset === 'ETH' && d.expected_amount > 10));
  console.log('Suspicious Deposits:', suspDep.map(d => ({ id: d.id, asset: d.asset, amount: d.expected_amount })));

  const { data: withdrawals } = await supabase.from('withdrawal_requests').select('*');
  const suspWdr = withdrawals.filter(w => (w.asset === 'BTC' && w.amount > 1) || (w.asset === 'ETH' && w.amount > 10));
  console.log('Suspicious Withdrawals:', suspWdr.map(w => ({ id: w.id, asset: w.asset, amount: w.amount })));

  const { data: ledger } = await supabase.from('wallet_ledger').select('*');
  const suspLed = ledger.filter(l => (l.currency === 'BTC' && l.amount > 1) || (l.currency === 'ETH' && l.amount > 10));
  console.log('Suspicious Ledger:', suspLed.map(l => ({ id: l.id, asset: l.currency, amount: l.amount })));
}

main().catch(console.error);
