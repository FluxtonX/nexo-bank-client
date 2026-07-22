-- Seed withdraw CMS content keys
-- This file inserts all 6 keys for category='withdraw' that are wired up in the frontend
-- All values are properly formatted as JSONB (double-quoted strings inside single quotes)

INSERT INTO site_content (key, value, type, category, label, updated_at)
VALUES
  ('withdraw.page_subheading', '"Transfer to your bank via Interac e-Transfer"', 'text', 'withdraw', 'Page Subheading', NOW()),
  ('withdraw.fee_amount', '"2.50"', 'text', 'withdraw', 'Fee Amount', NOW()),
  ('withdraw.partial_error_message', '"For partial withdrawals, please contact support."', 'text', 'withdraw', 'Partial Error Message', NOW()),
  ('withdraw.support_link', '"/support"', 'text', 'withdraw', 'Support Link', NOW()),
  ('withdraw.important_box', '"Make sure the recipient email is correct. The recipient will need the security answer to claim the funds."', 'text_multiline', 'withdraw', 'Important Box Text', NOW()),
  ('withdraw.otp_text', '"We have sent a 6-digit code to your registered email address."', 'text', 'withdraw', 'OTP Text', NOW())
ON CONFLICT (key) DO NOTHING;
