-- Create the transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    payfast_transaction_id text UNIQUE, -- PayFast's pf_payment_id
    status text NOT NULL, -- e.g., 'complete', 'failed', 'pending', 'cancelled', 'refunded'
    amount_gross numeric NOT NULL,
    amount_fee numeric,
    amount_net numeric,
    payment_status text, -- PayFast's payment_status
    item_name text,
    item_description text,
    merchant_id text,
    metadata jsonb, -- Store full ITN response or other relevant data
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create a trigger to update the updated_at column automatically
DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions." ON public.transactions
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = transactions.order_id AND orders.user_id = auth.uid())
);

-- Only service role should insert/update transactions based on ITN
-- No public insert/update policies for transactions table
