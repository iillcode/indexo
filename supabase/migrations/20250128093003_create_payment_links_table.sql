-- Create payment_links table
CREATE TABLE IF NOT EXISTS public.payment_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  stripe_payment_link_id TEXT NOT NULL,
  url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_stripe_payment_link_id UNIQUE (stripe_payment_link_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_links_user_id ON public.payment_links(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_plan_id ON public.payment_links(plan_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON public.payment_links(status);

-- Enable RLS
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own payment links"
  ON public.payment_links
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment links"
  ON public.payment_links
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_payment_links_updated_at
BEFORE UPDATE ON public.payment_links
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.payment_links IS 'Stores payment links created for users to complete purchases';
COMMENT ON COLUMN public.payment_links.status IS 'Status of the payment link: active, completed, or expired';
