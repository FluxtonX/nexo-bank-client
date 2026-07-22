-- Seed buy/sell CMS content keys
-- This file inserts all 4 keys for category='buysell' that are wired up in the frontend
-- All values are properly formatted as JSONB (double-quoted strings inside single quotes)

INSERT INTO site_content (key, value, type, category, label, updated_at)
VALUES
  ('buysell.page_subheading', '"Live Binance market data for crypto charting and market stats"', 'text', 'buysell', 'Page Subheading', NOW()),
  ('buysell.disclaimer', '"Orders are reviewed before confirmation. Live Binance market price may change."', 'text_multiline', 'buysell', 'Disclaimer', NOW()),
  ('buysell.buy_fee', '"0.50"', 'text', 'buysell', 'Buy Fee', NOW()),
  ('buysell.sell_fee', '"0.40"', 'text', 'buysell', 'Sell Fee', NOW())
ON CONFLICT (key) DO NOTHING;
