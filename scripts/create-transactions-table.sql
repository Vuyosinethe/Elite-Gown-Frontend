CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  payfast_transaction_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL, -- e.g., 'COMPLETE', 'FAILED', 'PENDING', 'CANCELLED'
  amount_gross NUMERIC NOT NULL,
  amount_fee NUMERIC NOT NULL,
  amount_net NUMERIC NOT NULL,
  item_name TEXT,
  item_description TEXT,
  merchant_id TEXT,
  signature TEXT NOT NULL,
  payment_status TEXT, -- PayFast specific status
  m_payment_id TEXT, -- Custom payment ID from PayFast
  pf_payment_id TEXT, -- PayFast payment ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors on re-run
DROP POLICY IF EXISTS "Users can view their own transactions." ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions." ON public.transactions;
DROP POLICY IF EXISTS "Admins can manage all transactions." ON public.transactions;

-- Create RLS policies
CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "Admins can view all transactions." ON public.transactions FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage all transactions." ON public.transactions FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_transactions_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists to prevent errors on re-run
DROP TRIGGER IF EXISTS set_transactions_updated_at ON public.transactions;

-- Create trigger to update updated_at on transaction changes
CREATE TRIGGER set_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION update_transactions_updated_at_column();
