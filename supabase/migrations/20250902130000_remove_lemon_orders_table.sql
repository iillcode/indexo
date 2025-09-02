-- Remove lemon_orders table and all related constraints, triggers, and policies
-- This migration consolidates all payment data into the payments table

-- Drop triggers associated with lemon_orders table (if they exist)
DROP TRIGGER IF EXISTS lemon_orders_updated_at ON public.lemon_orders;
DROP TRIGGER IF EXISTS lemon_orders_associate_user ON public.lemon_orders;

-- Drop policies associated with lemon_orders table (if they exist)
DROP POLICY IF EXISTS "Users can view their own lemon orders." ON public.lemon_orders;
DROP POLICY IF EXISTS "Service role can manage all lemon orders." ON public.lemon_orders;

-- Disable RLS on lemon_orders table (if it exists)
ALTER TABLE IF EXISTS public.lemon_orders DISABLE ROW LEVEL SECURITY;

-- Drop the lemon_orders table (if it exists)
DROP TABLE IF EXISTS public.lemon_orders;

-- Drop functions that were specific to lemon_orders (if they exist)
DROP FUNCTION IF EXISTS public.associate_lemonsqueezy_user();

-- Update comments on payments table to reflect that it now handles all payment providers
COMMENT ON TABLE public.payments IS 'Stores payment information for all providers (Stripe, LemonSqueezy, etc.)';