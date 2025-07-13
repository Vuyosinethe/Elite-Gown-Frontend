-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    payfast_transaction_id text UNIQUE NOT NULL,
    amount numeric(10, 2) NOT NULL,
    status text NOT NULL, -- e.g., 'COMPLETE', 'FAILED', 'PENDING'
    payment_method text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    raw_data jsonb -- To store the full ITN payload for debugging/auditing
);

-- Add columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'order_id') THEN
        ALTER TABLE public.transactions ADD COLUMN order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'payfast_transaction_id') THEN
        ALTER TABLE public.transactions ADD COLUMN payfast_transaction_id text UNIQUE NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'amount') THEN
        ALTER TABLE public.transactions ADD COLUMN amount numeric(10, 2) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'status') THEN
        ALTER TABLE public.transactions ADD COLUMN status text NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'payment_method') THEN
        ALTER TABLE public.transactions ADD COLUMN payment_method text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'created_at') THEN
        ALTER TABLE public.transactions ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'updated_at') THEN
        ALTER TABLE public.transactions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'transactions' AND column_name = 'raw_data') THEN
        ALTER TABLE public.transactions ADD COLUMN raw_data jsonb;
    END IF;
END
$$;

-- Enable Row Level Security for transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones to prevent "already exists" errors
DROP POLICY IF EXISTS "Users can view their own transactions." ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions." ON public.transactions;
DROP POLICY IF EXISTS "Admins can insert transactions." ON public.transactions;
DROP POLICY IF EXISTS "Admins can update transactions." ON public.transactions;

-- Create RLS policies for transactions table
CREATE POLICY "Users can view their own transactions." ON public.transactions
FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));

CREATE POLICY "Admins can view all transactions." ON public.transactions
FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert transactions." ON public.transactions
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update transactions." ON public.transactions
FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_transactions_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger before creating new one to prevent "already exists" errors
DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;

-- Trigger to update updated_at on each update
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION update_transactions_updated_at_column();
