-- Seed settings CMS content keys
-- This file inserts all 4 keys for category='settings' that are wired up in the frontend
-- All values are properly formatted as JSONB (double-quoted strings inside single quotes)

INSERT INTO site_content (key, value, type, category, label, updated_at)
VALUES
  ('settings.daily_unverified', '"1,000"', 'text', 'settings', 'Daily Unverified Limit', NOW()),
  ('settings.daily_verified', '"5,000,000"', 'text', 'settings', 'Daily Verified Limit', NOW()),
  ('settings.monthly_unverified', '"10,000"', 'text', 'settings', 'Monthly Unverified Limit', NOW()),
  ('settings.monthly_verified', '"50,000,000"', 'text', 'settings', 'Monthly Verified Limit', NOW())
ON CONFLICT (key) DO NOTHING;
