-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount numeric(10, 2) NOT NULL,
    status text DEFAULT 'pending' NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add payfast_order_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'payfast_order_id') THEN
        ALTER TABLE public.orders ADD COLUMN payfast_order_id text UNIQUE;
    END IF;
END
$$;

-- Enable Row Level Security for orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones to prevent "already exists" errors
DROP POLICY IF EXISTS "Users can view their own orders." ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders." ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders." ON public.orders;
DROP POLICY IF EXISTS "Admins can delete all orders." ON public.orders;

-- Create RLS policies for orders table
CREATE POLICY "Users can view their own orders." ON public.orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders." ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all orders." ON public.orders
FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete all orders." ON public.orders
FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger before creating new one to prevent "already exists" errors
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;

-- Trigger to update updated_at on each update
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
