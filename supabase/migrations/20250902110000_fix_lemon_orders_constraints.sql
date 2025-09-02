-- Fix LemonSqueezy orders table constraints for proper upsert support

-- First, try to drop the constraints if they exist (to avoid conflicts)
ALTER TABLE public.lemon_orders DROP CONSTRAINT IF EXISTS lemon_orders_order_id_key;
ALTER TABLE public.lemon_orders DROP CONSTRAINT IF EXISTS lemon_orders_identifier_key;

-- Add unique constraint on order_id for lemon_orders table
ALTER TABLE public.lemon_orders 
ADD CONSTRAINT lemon_orders_order_id_key UNIQUE (order_id);

-- Add unique constraint on identifier for lemon_orders table
ALTER TABLE public.lemon_orders 
ADD CONSTRAINT lemon_orders_identifier_key UNIQUE (identifier);

-- Create index on order_id for better performance (if not exists)
CREATE INDEX IF NOT EXISTS lemon_orders_order_id_key_idx ON public.lemon_orders(order_id);

-- Create index on identifier for better performance (if not exists)
CREATE INDEX IF NOT EXISTS lemon_orders_identifier_key_idx ON public.lemon_orders(identifier);

-- Note: We're not adding constraints to payments table yet due to duplicate order_id values
-- This will be handled in a separate migration after cleaning up the data
