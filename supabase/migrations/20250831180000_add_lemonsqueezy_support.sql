-- Add LemonSqueezy specific fields to payments table
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS order_id TEXT,
ADD COLUMN IF NOT EXISTS order_number BIGINT,
ADD COLUMN IF NOT EXISTS identifier TEXT,
ADD COLUMN IF NOT EXISTS store_id BIGINT,
ADD COLUMN IF NOT EXISTS lemon_customer_id BIGINT,
ADD COLUMN IF NOT EXISTS product_id BIGINT,
ADD COLUMN IF NOT EXISTS variant_id BIGINT,
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS variant_name TEXT,
ADD COLUMN IF NOT EXISTS price_id BIGINT,
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,4),
ADD COLUMN IF NOT EXISTS tax_name TEXT,
ADD COLUMN IF NOT EXISTS tax_inclusive BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS discount_total DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS setup_fee DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS refunded BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS refunded_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS test_mode BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS currency_rate DECIMAL(12,8),
ADD COLUMN IF NOT EXISTS total_formatted TEXT,
ADD COLUMN IF NOT EXISTS subtotal_formatted TEXT,
ADD COLUMN IF NOT EXISTS tax_formatted TEXT,
ADD COLUMN IF NOT EXISTS discount_formatted TEXT,
ADD COLUMN IF NOT EXISTS setup_fee_formatted TEXT,
ADD COLUMN IF NOT EXISTS refunded_amount_formatted TEXT,
ADD COLUMN IF NOT EXISTS receipt_url TEXT,
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'stripe';

-- Create indexes for LemonSqueezy fields
CREATE INDEX IF NOT EXISTS payments_order_id_idx ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS payments_order_number_idx ON public.payments(order_number);
CREATE INDEX IF NOT EXISTS payments_identifier_idx ON public.payments(identifier);
CREATE INDEX IF NOT EXISTS payments_store_id_idx ON public.payments(store_id);
CREATE INDEX IF NOT EXISTS payments_lemon_customer_id_idx ON public.payments(lemon_customer_id);
CREATE INDEX IF NOT EXISTS payments_product_id_idx ON public.payments(product_id);
CREATE INDEX IF NOT EXISTS payments_provider_idx ON public.payments(provider);

-- Update existing Stripe records to have provider = 'stripe'
UPDATE public.payments SET provider = 'stripe' WHERE provider IS NULL OR provider = '';

-- Create a new orders table specifically for LemonSqueezy orders (optional, for better organization)
CREATE TABLE IF NOT EXISTS public.lemon_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    order_id TEXT UNIQUE NOT NULL,
    order_number BIGINT NOT NULL,
    identifier TEXT UNIQUE NOT NULL,
    store_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    status TEXT NOT NULL,
    currency TEXT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    tax_rate DECIMAL(5,4) DEFAULT 0,
    tax_name TEXT,
    tax_inclusive BOOLEAN DEFAULT FALSE,
    discount_total DECIMAL(10,2) DEFAULT 0,
    setup_fee DECIMAL(10,2) DEFAULT 0,
    refunded BOOLEAN DEFAULT FALSE,
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    refunded_at TIMESTAMP WITH TIME ZONE,
    test_mode BOOLEAN DEFAULT FALSE,
    currency_rate DECIMAL(12,8),
    user_name TEXT,
    user_email TEXT NOT NULL,
    total_formatted TEXT,
    subtotal_formatted TEXT,
    tax_formatted TEXT,
    discount_formatted TEXT,
    setup_fee_formatted TEXT,
    refunded_amount_formatted TEXT,
    receipt_url TEXT,
    first_order_item JSONB,
    relationships JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for lemon_orders table
CREATE INDEX IF NOT EXISTS lemon_orders_user_id_idx ON public.lemon_orders(user_id);
CREATE INDEX IF NOT EXISTS lemon_orders_order_id_idx ON public.lemon_orders(order_id);
CREATE INDEX IF NOT EXISTS lemon_orders_order_number_idx ON public.lemon_orders(order_number);
CREATE INDEX IF NOT EXISTS lemon_orders_identifier_idx ON public.lemon_orders(identifier);
CREATE INDEX IF NOT EXISTS lemon_orders_customer_id_idx ON public.lemon_orders(customer_id);
CREATE INDEX IF NOT EXISTS lemon_orders_store_id_idx ON public.lemon_orders(store_id);
CREATE INDEX IF NOT EXISTS lemon_orders_status_idx ON public.lemon_orders(status);
CREATE INDEX IF NOT EXISTS lemon_orders_created_at_idx ON public.lemon_orders(created_at DESC);

-- Set up Row Level Security (RLS) for lemon_orders
ALTER TABLE public.lemon_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for lemon_orders
CREATE POLICY "Users can view their own lemon orders." ON public.lemon_orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all lemon orders." ON public.lemon_orders
    FOR ALL USING (auth.role() = 'service_role');

-- Create updated_at trigger for lemon_orders
CREATE TRIGGER lemon_orders_updated_at
    BEFORE UPDATE ON public.lemon_orders
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();