-- Fix payment tracking fields in profiles table
-- This migration ensures all payment tracking columns exist in the profiles table

-- Add payment tracking fields to profiles table if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_tier TEXT DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_provider TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_currency TEXT DEFAULT 'usd';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'none';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expiry_type TEXT DEFAULT 'never'; -- 'never', 'monthly', 'yearly', 'one_time'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_paid_user BOOLEAN DEFAULT FALSE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS profiles_is_paid_user_idx ON public.profiles(is_paid_user);
CREATE INDEX IF NOT EXISTS profiles_user_tier_idx ON public.profiles(user_tier);
CREATE INDEX IF NOT EXISTS profiles_payment_status_idx ON public.profiles(payment_status);

-- Update existing profiles to ensure they have the default values
UPDATE public.profiles 
SET user_tier = 'free', 
    payment_currency = 'usd', 
    payment_status = 'none', 
    expiry_type = 'never',
    is_paid_user = false
WHERE user_tier IS NULL 
   OR payment_currency IS NULL 
   OR payment_status IS NULL 
   OR expiry_type IS NULL 
   OR is_paid_user IS NULL;

-- Create or replace function to update user payment status
CREATE OR REPLACE FUNCTION public.update_user_payment_status(
    user_uuid UUID,
    tier TEXT DEFAULT 'pro',
    provider TEXT DEFAULT 'lemonsqueezy',
    amount DECIMAL(10,2) DEFAULT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'completed',
    expiry_type_param TEXT DEFAULT 'never'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    expiry_date_calculated TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Calculate expiry date based on type
    CASE expiry_type_param
        WHEN 'monthly' THEN
            expiry_date_calculated := NOW() + INTERVAL '1 month';
        WHEN 'yearly' THEN
            expiry_date_calculated := NOW() + INTERVAL '1 year';
        WHEN 'one_time' THEN
            expiry_date_calculated := NOW() + INTERVAL '100 years'; -- Effectively never for one-time purchases
        ELSE
            expiry_date_calculated := NULL; -- Never expires
    END CASE;

    -- Update user profile with payment information
    UPDATE public.profiles
    SET 
        user_tier = tier,
        payment_provider = provider,
        payment_amount = amount,
        payment_currency = currency,
        payment_status = status,
        payment_date = NOW(),
        expiry_date = expiry_date_calculated,
        expiry_type = expiry_type_param,
        is_paid_user = CASE WHEN status = 'completed' THEN TRUE ELSE FALSE END,
        updated_at = NOW()
    WHERE id = user_uuid;

    -- Return success
    RETURN FOUND;
END;
$$;

-- Create or replace function to check if user can make payment (prevent multiple payments)
CREATE OR REPLACE FUNCTION public.can_user_make_payment(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_payment_status TEXT;
    user_expiry_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get user payment status and expiry
    SELECT payment_status, expiry_date
    INTO user_payment_status, user_expiry_date
    FROM public.profiles
    WHERE id = user_uuid;

    -- If no user found, allow payment
    IF NOT FOUND THEN
        RETURN TRUE;
    END IF;

    -- If user has no payment or payment failed, allow payment
    IF user_payment_status IS NULL OR user_payment_status IN ('none', 'failed', 'refunded', 'canceled') THEN
        RETURN TRUE;
    END IF;

    -- If user has active payment and no expiry (lifetime), prevent payment
    IF user_payment_status = 'completed' AND (user_expiry_date IS NULL OR user_expiry_date > NOW()) THEN
        RETURN FALSE;
    END IF;

    -- If payment expired, allow new payment
    IF user_expiry_date IS NOT NULL AND user_expiry_date <= NOW() THEN
        RETURN TRUE;
    END IF;

    -- Default to prevent payment if we're unsure
    RETURN FALSE;
END;
$$;

-- Create or replace function to get user payment info
CREATE OR REPLACE FUNCTION public.get_user_payment_info(user_uuid UUID)
RETURNS TABLE (
    user_tier TEXT,
    payment_provider TEXT,
    payment_amount DECIMAL(10,2),
    payment_currency TEXT,
    payment_status TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    expiry_type TEXT,
    is_paid_user BOOLEAN,
    can_make_payment BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.user_tier,
        p.payment_provider,
        p.payment_amount,
        p.payment_currency,
        p.payment_status,
        p.payment_date,
        p.expiry_date,
        p.expiry_type,
        p.is_paid_user,
        public.can_user_make_payment(user_uuid) as can_make_payment
    FROM public.profiles p
    WHERE p.id = user_uuid;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.update_user_payment_status TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_user_make_payment TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_payment_info TO authenticated;

-- Update RLS policies to allow users to view their payment info
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow service role to update payment status
DROP POLICY IF EXISTS "Service role can manage all profiles." ON public.profiles;
CREATE POLICY "Service role can manage all profiles." ON public.profiles
    FOR ALL USING (auth.role() = 'service_role');