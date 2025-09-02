-- Fix duplicate order_id values in payments table and add unique constraint

-- First, let's identify and remove duplicate payments, keeping the most recent one
DELETE FROM payments
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY created_at DESC) as row_num
        FROM payments
        WHERE order_id IS NOT NULL
    ) t
    WHERE t.row_num > 1
);

-- Now add the unique constraint on order_id for payments table
ALTER TABLE public.payments 
ADD CONSTRAINT payments_order_id_key UNIQUE (order_id);