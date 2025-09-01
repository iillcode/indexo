-- Fix LemonSqueezy user_id constraint issues
-- Make user_id nullable in lemon_orders table since LemonSqueezy webhooks don't always include user mapping

-- Remove NOT NULL constraint from user_id in lemon_orders
ALTER TABLE public.lemon_orders ALTER COLUMN user_id DROP NOT NULL;

-- Also make user_id nullable in payments table for LemonSqueezy records
ALTER TABLE public.payments ALTER COLUMN user_id DROP NOT NULL;

-- Create a function to lookup user by email for LemonSqueezy orders
CREATE OR REPLACE FUNCTION public.lookup_user_by_email(email_address TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_uuid UUID;
BEGIN
    -- First try to find user in auth.users by email
    SELECT id INTO user_uuid
    FROM auth.users
    WHERE email = email_address
    LIMIT 1;
    
    -- If not found in auth.users, try profiles table
    IF user_uuid IS NULL THEN
        SELECT user_id INTO user_uuid
        FROM public.profiles
        WHERE email = email_address
        LIMIT 1;
    END IF;
    
    RETURN user_uuid;
END;
$$;

-- Create a function to automatically associate LemonSqueezy orders with users
CREATE OR REPLACE FUNCTION public.associate_lemonsqueezy_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    found_user_id UUID;
BEGIN
    -- Only process if user_id is null and we have an email
    IF NEW.user_id IS NULL AND NEW.user_email IS NOT NULL THEN
        -- Try to find user by email
        SELECT public.lookup_user_by_email(NEW.user_email) INTO found_user_id;
        
        IF found_user_id IS NOT NULL THEN
            NEW.user_id := found_user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to auto-associate users for lemon_orders
DROP TRIGGER IF EXISTS lemon_orders_associate_user ON public.lemon_orders;
CREATE TRIGGER lemon_orders_associate_user
    BEFORE INSERT OR UPDATE ON public.lemon_orders
    FOR EACH ROW EXECUTE FUNCTION public.associate_lemonsqueezy_user();

-- Create trigger to auto-associate users for payments (LemonSqueezy records)
CREATE OR REPLACE FUNCTION public.associate_lemonsqueezy_payment_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    found_user_id UUID;
BEGIN
    -- Only process LemonSqueezy payments without user_id
    IF NEW.user_id IS NULL AND NEW.provider = 'lemonsqueezy' AND NEW.customer_email IS NOT NULL THEN
        -- Try to find user by email
        SELECT public.lookup_user_by_email(NEW.customer_email) INTO found_user_id;
        
        IF found_user_id IS NOT NULL THEN
            NEW.user_id := found_user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for payments table
DROP TRIGGER IF EXISTS payments_associate_lemonsqueezy_user ON public.payments;
CREATE TRIGGER payments_associate_lemonsqueezy_user
    BEFORE INSERT OR UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.associate_lemonsqueezy_payment_user();

-- Update RLS policies to allow service role to insert without user_id
DROP POLICY IF EXISTS "Service role can manage all lemon orders." ON public.lemon_orders;
CREATE POLICY "Service role can manage all lemon orders." ON public.lemon_orders
    FOR ALL USING (auth.role() = 'service_role');

-- Allow users to view lemon orders even without user_id (for guest purchases)
DROP POLICY IF EXISTS "Users can view their own lemon orders." ON public.lemon_orders;
CREATE POLICY "Users can view their own lemon orders." ON public.lemon_orders
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role' OR
        user_id IS NULL
    );

-- Update payments policies to handle nullable user_id for LemonSqueezy
DROP POLICY IF EXISTS "Users can view their own payments." ON public.payments;
CREATE POLICY "Users can view their own payments." ON public.payments
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role' OR
        (provider = 'lemonsqueezy' AND user_id IS NULL)
    );

DROP POLICY IF EXISTS "Users can insert their own payments." ON public.payments;
CREATE POLICY "Users can insert their own payments." ON public.payments
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'service_role' OR
        (provider = 'lemonsqueezy' AND user_id IS NULL)
    );

DROP POLICY IF EXISTS "Users can update their own payments." ON public.payments;
CREATE POLICY "Users can update their own payments." ON public.payments
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role' OR
        (provider = 'lemonsqueezy' AND user_id IS NULL)
    );