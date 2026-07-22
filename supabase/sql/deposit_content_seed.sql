-- Seed deposit CMS content keys
-- This file inserts all 7 keys for category='deposit' that are wired up in the frontend
-- All values are properly formatted as JSONB (double-quoted strings inside single quotes)

INSERT INTO site_content (key, value, type, category, label, updated_at)
VALUES
  ('deposit.page_subheading', '"Select an asset, review the network, then scan the company deposit QR."', 'text', 'deposit', 'Page Subheading', NOW()),
  ('deposit.info_box', '"The QR contains the fixed company deposit address for this asset and network. The address is intentionally not displayed as plain text on this screen."', 'text', 'deposit', 'Info Box Text', NOW()),
  ('deposit.warning_box', '"Sending the wrong asset or network can permanently lose funds."', 'text', 'deposit', 'Warning Box Text', NOW()),
  ('deposit.cad_blocked', '"Canadian regulations absolutely forbid CAD deposits on fraud-refund accounts. The deposit function is permanently disabled."', 'text', 'deposit', 'CAD Blocked Message', NOW()),
  ('deposit.success_title', '"Deposit QR ready"', 'text', 'deposit', 'Success Title', NOW()),
  ('deposit.success_body', '"Scan the QR from your external wallet and send only on the selected network."', 'text', 'deposit', 'Success Body', NOW()),
  ('deposit.instructions', '["Send only the selected asset on the correct network.", "The QR uses a fixed company deposit address configured by admin.", "Minimum deposit applies — check the amount field.", "Requires the specified number of network confirmations.", "Funds are reviewed manually before balance credit."]', 'array', 'deposit', 'Instruction Bullet Points', NOW())
ON CONFLICT (key) DO NOTHING;
