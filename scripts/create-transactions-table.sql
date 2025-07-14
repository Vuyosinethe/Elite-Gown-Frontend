CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Link to user who made the transaction
    status TEXT NOT NULL, -- e.g., 'success', 'failed', 'pending', 'cancelled', 'unknown'
    payment_status TEXT, -- e.g., 'COMPLETE', 'FAILED', 'PENDING', 'CANCELLED' from PayFast
    amount_gross NUMERIC(10, 2), -- Gross amount of the transaction
    pf_payment_id TEXT, -- PayFast's unique payment ID
    pf_transaction_id TEXT UNIQUE, -- PayFast's unique transaction ID (for ITN)
    pf_item_name TEXT,
    pf_item_description TEXT,
    pf_signature TEXT, -- Stored for audit/verification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON public.transactions (order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_pf_transaction_id ON public.transactions (pf_transaction_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy for users to view their own transactions
DROP POLICY IF EXISTS "Users can view their own transactions." ON public.transactions;
CREATE POLICY "Users can view their own transactions." ON public.transactions
FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert transactions (e.g., after payment gateway callback)
DROP POLICY IF EXISTS "Users can insert transactions." ON public.transactions;
CREATE POLICY "Users can insert transactions." ON public.transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own transactions (e.g., status updates from ITN)
DROP POLICY IF EXISTS "Users can update their own transactions." ON public.transactions;
CREATE POLICY "Users can update their own transactions." ON public.transactions
FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_transactions_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on each update
DROP TRIGGER IF EXISTS set_transactions_updated_at ON public.transactions;
CREATE TRIGGER set_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION update_transactions_updated_at_column();
