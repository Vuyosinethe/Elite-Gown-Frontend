CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount numeric(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- e.g., 'pending', 'completed', 'cancelled', 'refunded'
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  payfast_order_id text UNIQUE -- New column for PayFast order ID
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors
DROP POLICY IF EXISTS "Users can view their own orders." ON public.orders;
DROP POLICY IF EXISTS "Users can create orders." ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders." ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders." ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders." ON public.orders;

-- Policies
CREATE POLICY "Users can view their own orders." ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders." ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders." ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (assuming 'role' column in 'profiles' table)
CREATE POLICY "Admins can view all orders." ON public.orders
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update all orders." ON public.orders
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Add payfast_order_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payfast_order_id') THEN
        ALTER TABLE public.orders ADD COLUMN payfast_order_id text UNIQUE;
    END IF;
END
$$;
