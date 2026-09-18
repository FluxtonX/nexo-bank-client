-- Migration: Make interac_email nullable on withdrawal_requests
-- Reason: To support cryptocurrency and SEPA bank wire withdrawals where Interac e-Transfer email is not applicable.

DO $$
BEGIN
  -- 1. Drop NOT NULL constraint on interac_email if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'withdrawal_requests' 
      AND column_name = 'interac_email' 
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.withdrawal_requests ALTER COLUMN interac_email DROP NOT NULL;
  END IF;

  -- 2. Drop NOT NULL constraint on security_question and security_answer if applicable
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'withdrawal_requests' 
      AND column_name = 'security_question' 
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.withdrawal_requests ALTER COLUMN security_question DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'withdrawal_requests' 
      AND column_name = 'security_answer' 
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.withdrawal_requests ALTER COLUMN security_answer DROP NOT NULL;
  END IF;

  -- 3. Set default to NULL for interac_email
  ALTER TABLE public.withdrawal_requests ALTER COLUMN interac_email SET DEFAULT NULL;
END $$;
