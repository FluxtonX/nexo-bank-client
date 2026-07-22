-- Seed global CMS content keys
-- This file inserts all global keys that are wired up in the frontend
-- All values are properly formatted as JSONB (double-quoted strings inside single quotes)

INSERT INTO site_content (key, value, type, category, label, updated_at)
VALUES
  ('global.banner.enabled', 'false', 'boolean', 'global', 'Banner Enabled', NOW()),
  ('global.banner.text', '"Welcome to NorthUnion — your trusted digital asset platform."', 'text', 'global', 'Banner Message', NOW()),
  ('global.banner.url', '""', 'text', 'global', 'Link URL', NOW()),
  ('global.banner.color', '"blue"', 'text', 'global', 'Color Theme', NOW()),
  ('global.header_tagline', '"Here''s what''s happening with your portfolio today"', 'text', 'global', 'Header Tagline', NOW())
ON CONFLICT (key) DO NOTHING;
