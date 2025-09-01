-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    plan_id TEXT,
    plan_name TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd' NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    session_id TEXT,
    payment_intent_id TEXT,
    payment_method TEXT DEFAULT 'stripe_checkout',
    customer_email TEXT,
    stripe_customer_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON public.payments(status);
CREATE INDEX IF NOT EXISTS payments_session_id_idx ON public.payments(session_id);
CREATE INDEX IF NOT EXISTS payments_payment_intent_id_idx ON public.payments(payment_intent_id);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON public.payments(created_at DESC);

-- Set up Row Level Security (RLS)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own payments." ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments." ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments." ON public.payments
    FOR UPDATE USING (auth.uid() = user_id);

-- Create updated_at trigger for payments
CREATE TRIGGER payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
