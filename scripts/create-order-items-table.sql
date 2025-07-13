-- Create the order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id integer NOT NULL, -- Assuming product_id is an integer, adjust if needed
    product_name text NOT NULL,
    product_details text,
    product_image text,
    price integer NOT NULL, -- Price in cents
    quantity integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add RLS policies for order_items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items." ON public.order_items
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can insert their own order items." ON public.order_items
FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
