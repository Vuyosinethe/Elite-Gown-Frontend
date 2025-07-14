CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL, -- Assuming a products table exists or product_id is just an identifier
  name text NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors on re-run
DROP POLICY IF EXISTS "Users can view their own order items." ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items." ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items." ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order items." ON public.order_items;

-- Create RLS policies
CREATE POLICY "Users can view their own order items." ON public.order_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert their own order items." ON public.order_items
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));

-- Policies for admin role
CREATE POLICY "Admins can view all order items." ON public.order_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage all order items." ON public.order_items
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_items_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists to prevent errors on re-run
DROP TRIGGER IF EXISTS set_order_items_updated_at ON public.order_items;

-- Create trigger to update updated_at on order_item changes
CREATE TRIGGER set_order_items_updated_at
BEFORE UPDATE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION update_order_items_updated_at_column();
