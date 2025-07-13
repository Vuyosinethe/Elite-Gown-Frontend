-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the order_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id uuid NOT NULL, -- Assuming a products table exists or will exist
    quantity integer NOT NULL,
    price numeric(10, 2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'order_id') THEN
        ALTER TABLE public.order_items ADD COLUMN order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'product_id') THEN
        ALTER TABLE public.order_items ADD COLUMN product_id uuid NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'quantity') THEN
        ALTER TABLE public.order_items ADD COLUMN quantity integer NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'price') THEN
        ALTER TABLE public.order_items ADD COLUMN price numeric(10, 2) NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'created_at') THEN
        ALTER TABLE public.order_items ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'updated_at') THEN
        ALTER TABLE public.order_items ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;
    END IF;
END
$$;

-- Enable Row Level Security for order_items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones to prevent "already exists" errors
DROP POLICY IF EXISTS "Users can view their own order items." ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items." ON public.order_items;
DROP POLICY IF EXISTS "Admins can update all order items." ON public.order_items;
DROP POLICY IF EXISTS "Admins can delete all order items." ON public.order_items;

-- Create RLS policies for order_items table
CREATE POLICY "Users can view their own order items." ON public.order_items
FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert their own order items." ON public.order_items
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));

CREATE POLICY "Admins can update all order items." ON public.order_items
FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete all order items." ON public.order_items
FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_items_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger before creating new one to prevent "already exists" errors
DROP TRIGGER IF EXISTS update_order_items_updated_at ON public.order_items;

-- Trigger to update updated_at on each update
CREATE TRIGGER update_order_items_updated_at
BEFORE UPDATE ON public.order_items
FOR EACH ROW EXECUTE FUNCTION update_order_items_updated_at_column();
