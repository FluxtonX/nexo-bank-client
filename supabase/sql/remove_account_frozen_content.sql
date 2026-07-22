-- Remove Account Frozen Message from site_content
-- This removes the CMS-editable field for the account frozen message
-- The frozen account feature itself remains functional; only the CMS editing capability is removed

DELETE FROM site_content
WHERE key = 'global.account_frozen_message';
