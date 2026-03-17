CREATE TABLE public.otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  phone_number TEXT,
  code TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'email',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '15 minutes'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert OTP codes" ON public.otp_codes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read OTP codes" ON public.otp_codes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can update OTP codes" ON public.otp_codes FOR UPDATE TO anon, authenticated USING (true);