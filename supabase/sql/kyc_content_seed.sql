-- Seed KYC CMS content keys
-- This file inserts all 6 keys for category='kyc' that are wired up in the frontend
-- All values are properly formatted as JSONB (double-quoted strings inside single quotes)

INSERT INTO site_content (key, value, type, category, label, updated_at)
VALUES
  ('kyc.page_heading', '"Identity Verification"', 'text', 'kyc', 'Page Heading', NOW()),
  ('kyc.page_subheading', '"Complete KYC to unlock your account"', 'text', 'kyc', 'Page Subheading', NOW()),
  ('kyc.selfie_guides', '["Face clearly visible", "Good lighting", "No sunglasses or hats", "Neutral expression"]', 'json_array', 'kyc', 'Selfie Guidelines', NOW()),
  ('kyc.thank_you', '"Thank you for submitting your documents.\nOur team is reviewing your information.\nThis typically takes 1-2 business days."', 'text_multiline', 'kyc', 'Thank You Message', NOW()),
  ('kyc.what_next', '["We'\''ll verify your identity documents", "You'\''ll receive an email when approved", "You can then access your full account"]', 'json_array', 'kyc', 'What Happens Next', NOW())
ON CONFLICT (key) DO NOTHING;
