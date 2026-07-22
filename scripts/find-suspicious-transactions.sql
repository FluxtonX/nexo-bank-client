-- Find suspicious deposit requests with abnormally large amounts
-- These are likely test data that should be cleaned up

SELECT 
  id,
  asset,
  expected_amount,
  status,
  user_id,
  created_at
FROM deposit_requests
WHERE 
  (asset = 'BTC' AND expected_amount > 10)
  OR (asset = 'ETH' AND expected_amount > 100)
  OR (asset = 'USDT' AND expected_amount > 100000)
  OR (asset = 'USDC' AND expected_amount > 100000)
ORDER BY expected_amount DESC;

-- Find suspicious withdrawal requests with abnormally large amounts
-- These are likely test data that should be cleaned up

SELECT 
  id,
  asset,
  amount,
  status,
  user_id,
  created_at
FROM withdrawal_requests
WHERE 
  (asset = 'BTC' AND amount > 10)
  OR (asset = 'ETH' AND amount > 100)
  OR (asset = 'USDT' AND amount > 100000)
  OR (asset = 'USDC' AND amount > 100000)
ORDER BY amount DESC;

-- After confirming which transactions to delete, use these DELETE statements:
-- DELETE FROM deposit_requests WHERE id IN ('<id1>', '<id2>', ...);
-- DELETE FROM withdrawal_requests WHERE id IN ('<id1>', '<id2>', ...);
