-- Seed support CMS content keys
-- This file inserts all 5 keys for category='support' that are wired up in the frontend
-- All values are properly formatted as JSONB (double-quoted strings inside single quotes)

INSERT INTO site_content (key, value, type, category, label, updated_at)
VALUES
  ('support.page_description', '"Contact support for deposit, withdrawal, KYC, login, portfolio, and security issues."', 'text_multiline', 'support', 'Page Description', NOW()),
  ('support.response_target', '"Under 5 minutes"', 'text', 'support', 'Response Target', NOW()),
  ('support.secure_attachments', '"Screenshots and documents"', 'text', 'support', 'Secure Attachments', NOW()),
  ('support.ticket_history', '"Always available"', 'text', 'support', 'Ticket History', NOW()),
  ('support.opening_msg', '"Hi! How can we help you today? Describe your issue and we'\''ll get back to you as soon as possible."', 'text_multiline', 'support', 'Opening Message', NOW())
ON CONFLICT (key) DO NOTHING;
