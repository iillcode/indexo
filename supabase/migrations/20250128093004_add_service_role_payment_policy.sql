-- Add policy to allow service role to bypass RLS for payments table
CREATE POLICY "Enable service role to bypass RLS on payments" 
ON public.payments 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Add comment for documentation
COMMENT ON POLICY "Enable service role to bypass RLS on payments" ON public.payments IS 'Allows service role to bypass RLS for server-side operations like webhooks';
