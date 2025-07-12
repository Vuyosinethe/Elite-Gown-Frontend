-- Create the 'orders' table
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount numeric(10, 2) NOT NULL,
    status text DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    order_details jsonb -- Store order items, quantities, etc.
);

-- Enable Row Level Security (RLS) for the 'orders' table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view their own orders
DROP POLICY IF EXISTS "Users can view their own orders." ON public.orders;
CREATE POLICY "Users can view their own orders." ON public.orders
FOR SELECT USING (auth.uid() = user_id);

-- Policy for admins to view all orders
DROP POLICY IF EXISTS "Admins can view all orders." ON public.orders;
CREATE POLICY "Admins can view all orders." ON public.orders
FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to insert orders (e.g., if manually creating)
DROP POLICY IF EXISTS "Admins can insert orders." ON public.orders;
CREATE POLICY "Admins can insert orders." ON public.orders
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to update orders
DROP POLICY IF EXISTS "Admins can update orders." ON public.orders;
CREATE POLICY "Admins can update orders." ON public.orders
FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to delete orders
DROP POLICY IF EXISTS "Admins can delete orders." ON public.orders;
CREATE POLICY "Admins can delete orders." ON public.orders
FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
