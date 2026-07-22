CREATE TABLE public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_name TEXT NOT NULL,
  os TEXT NOT NULL,
  browser TEXT NOT NULL,
  location TEXT,
  ip_address TEXT,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON public.user_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON public.user_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON public.user_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.user_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);
