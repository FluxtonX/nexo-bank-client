-- Seed missing dashboard CMS content keys
-- This file inserts the 13 missing keys for category='dashboard' that are wired up in the frontend
-- but don't exist in the database yet

INSERT INTO site_content (key, value, type, category, label, updated_at)
VALUES
  ('dashboard.performance.title', 'Portfolio Performance', 'text', 'dashboard', 'Performance Title', NOW()),
  ('dashboard.performance.from_placeholder', 'From date', 'text', 'dashboard', 'From Placeholder', NOW()),
  ('dashboard.performance.to_placeholder', 'To date', 'text', 'dashboard', 'To Placeholder', NOW()),
  ('dashboard.performance.tooltip_label', 'CAD Value', 'text', 'dashboard', 'Tooltip Label', NOW()),
  ('dashboard.allocation.title', 'Asset Allocation', 'text', 'dashboard', 'Allocation Title', NOW()),
  ('dashboard.allocation.empty_title', 'No assets yet', 'text', 'dashboard', 'Empty Title', NOW()),
  ('dashboard.allocation.empty_sub', 'Deposit to see your allocation', 'text', 'dashboard', 'Empty Sub', NOW()),
  ('dashboard.wallets.empty_title', 'No wallets yet', 'text', 'dashboard', 'Wallets Empty Title', NOW()),
  ('dashboard.wallets.empty_sub', 'Make a deposit to get started', 'text', 'dashboard', 'Wallets Empty Sub', NOW()),
  ('dashboard.transactions.title', 'Recent Transactions', 'text', 'dashboard', 'Transactions Title', NOW()),
  ('dashboard.transactions.view_all', 'View All', 'text', 'dashboard', 'View All Link', NOW()),
  ('dashboard.transactions.loading', 'Loading transactions...', 'text', 'dashboard', 'Loading Text', NOW()),
  ('dashboard.transactions.empty', 'No recent transactions', 'text', 'dashboard', 'Empty Text', NOW())
ON CONFLICT (key) DO NOTHING;

-- Fix bad data: remove trailing "uuuuuuuuuuuuuuuu" from portfolio_label
UPDATE site_content
SET value = 'Total Portfolio Value',
    updated_at = NOW()
WHERE key = 'dashboard.top_header.portfolio_label';
