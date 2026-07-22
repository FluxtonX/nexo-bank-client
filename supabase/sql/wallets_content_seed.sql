-- Seed wallets CMS content keys
-- This file inserts all 4 keys for category='wallets' that are wired up in the frontend
-- All values are properly formatted as JSONB (double-quoted strings inside single quotes)

INSERT INTO site_content (key, value, type, category, label, updated_at)
VALUES
  ('wallets.cad_title', '"Withdrawal Only"', 'text', 'wallets', 'CAD Title', NOW()),
  ('wallets.cad_body', '"This wallet is only suitable for withdrawals. CAD deposits are not accepted on this platform due to Canadian regulations."', 'text_multiline', 'wallets', 'CAD Body', NOW()),
  ('wallets.instructions', '["Only send {asset name} to this address", "Minimum deposit: 0.0005 BTC / 0.01 ETH / 5.0 USDT", "Requires 3 network confirmations", "Submit transaction hash on deposit request page after sending"]', 'json_array', 'wallets', 'Instructions', NOW()),
  ('wallets.confirmations', '"3"', 'text', 'wallets', 'Confirmations', NOW())
ON CONFLICT (key) DO NOTHING;
