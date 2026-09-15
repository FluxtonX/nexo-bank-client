-- Optional Migration: Add country column to profiles table
-- This allows mirroring the user's selected country on the profiles row
-- prior to or alongside KYC completion.
-- Note: kyc_submissions already possesses the country column.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'country'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN country text;
  END IF;
END $$;
