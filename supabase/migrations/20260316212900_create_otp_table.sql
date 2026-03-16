/*
  # Create OTP Storage Table

  1. New Tables
    - `otp_codes`
      - `id` (uuid, primary key)
      - `user_email` (text, email address or identifier)
      - `phone_number` (text, optional phone number)
      - `code` (text, the 6-digit OTP code)
      - `type` (text, 'email' or 'sms')
      - `is_verified` (boolean, tracks if OTP was verified)
      - `created_at` (timestamp, when OTP was created)
      - `expires_at` (timestamp, when OTP expires - 15 minutes)
  
  2. Security
    - Enable RLS on `otp_codes` table
    - Add policy for inserting OTP codes
    - Add policy for public verification (no auth needed for signup flow)
*/

CREATE TABLE IF NOT EXISTS public.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  phone_number text,
  code text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'sms')),
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT now() + interval '15 minutes'
);

ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert OTP during signup"
  ON public.otp_codes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update OTP for verification"
  ON public.otp_codes FOR UPDATE
  WITH CHECK (true);

CREATE POLICY "Anyone can read OTP for verification"
  ON public.otp_codes FOR SELECT
  USING (true);