-- Fix lookup_user_by_email to reference profiles.id (not profiles.user_id)
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
        SELECT id INTO user_uuid
        FROM public.profiles
        WHERE email = email_address
        LIMIT 1;
    END IF;
    
    RETURN user_uuid;
END;
$$;

-- Create helper to link existing guest payments to a user by email
CREATE OR REPLACE FUNCTION public.link_guest_payments_to_user(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_email TEXT;
    v_updated_count INTEGER := 0;
BEGIN
    -- Find the user's email
    SELECT email INTO v_email FROM public.profiles WHERE id = p_user_id;
    IF v_email IS NULL THEN
        RETURN 0;
    END IF;

    -- Attach any LemonSqueezy payments that were made as a guest using this email
    UPDATE public.payments
    SET user_id = p_user_id,
        updated_at = NOW()
    WHERE user_id IS NULL
      AND provider = 'lemonsqueezy'
      AND customer_email = v_email;

    GET DIAGNOSTICS v_updated_count = ROW_COUNT;

    RETURN v_updated_count;
END;
$$;

-- On new profile creation, backfill guest payments and update profile payment status
CREATE OR REPLACE FUNCTION public.handle_profile_created_backfill()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_linked_count INTEGER;
    v_amount DECIMAL(10,2);
    v_currency TEXT;
    v_status TEXT;
    v_provider TEXT := 'lemonsqueezy';
    v_expiry_type TEXT := 'one_time';
BEGIN
    -- Link guest payments by email to this user
    SELECT public.link_guest_payments_to_user(NEW.id) INTO v_linked_count;

    -- If we linked any payments (or there are pre-existing paid records), update profile payment tracking
    -- Pick the most recent completed LemonSqueezy payment for this user
    SELECT amount, currency, status
    INTO v_amount, v_currency, v_status
    FROM public.payments
    WHERE user_id = NEW.id
      AND provider = 'lemonsqueezy'
      AND status IN ('completed', 'paid', 'succeeded')
    ORDER BY created_at DESC
    LIMIT 1;

    IF FOUND THEN
      -- Normalize status to 'completed' for profile
      PERFORM public.update_user_payment_status(
        NEW.id,
        'pro',
        v_provider,
        v_amount,
        COALESCE(v_currency, 'usd'),
        'completed',
        v_expiry_type
      );
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_backfill_guest_payments ON public.profiles;
CREATE TRIGGER profiles_backfill_guest_payments
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_created_backfill();

-- Helpful index for email lookups on payments
CREATE INDEX IF NOT EXISTS payments_customer_email_idx ON public.payments(customer_email);
