-- Add European / SEPA bank withdrawal columns to withdrawal_requests table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'withdrawal_requests' AND column_name = 'iban'
  ) THEN
    ALTER TABLE public.withdrawal_requests ADD COLUMN iban text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'withdrawal_requests' AND column_name = 'bic_swift'
  ) THEN
    ALTER TABLE public.withdrawal_requests ADD COLUMN bic_swift text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'withdrawal_requests' AND column_name = 'recipient_name'
  ) THEN
    ALTER TABLE public.withdrawal_requests ADD COLUMN recipient_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'withdrawal_requests' AND column_name = 'bank_name'
  ) THEN
    ALTER TABLE public.withdrawal_requests ADD COLUMN bank_name text;
  END IF;
END $$;
