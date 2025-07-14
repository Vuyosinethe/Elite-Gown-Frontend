CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL, -- Assuming product_id is a string/text from your product catalog
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL, -- Price per unit at the time of order
    product_image TEXT, -- Optional: URL to product image
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy for users to view their own order items (via their orders)
DROP POLICY IF EXISTS "Users can view their own order items." ON public.order_items;
CREATE POLICY "Users can view their own order items." ON public.order_items
FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Policy for users to insert order items (only when creating their own order)
DROP POLICY IF EXISTS "Users can insert their own order items." ON public.order_items;
CREATE POLICY "Users can insert their own order items." ON public.order_items
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
