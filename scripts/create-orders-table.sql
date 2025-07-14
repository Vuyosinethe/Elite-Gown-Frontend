CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  payfast_order_id text UNIQUE -- Add this column for PayFast integration
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to ensure idempotency
DROP POLICY IF EXISTS "Users can view their own orders." ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders." ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders." ON public.orders;
DROP POLICY IF EXISTS "Admins can update any order." ON public.orders;
DROP POLICY IF EXISTS "Admins can delete any order." ON public.orders;
DROP POLICY IF EXISTS "Users can update their own pending orders." ON public.orders;

CREATE POLICY "Users can view their own orders." ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders." ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending orders." ON public.orders
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Policies for admin role (assuming 'role' column in 'profiles' table)
CREATE POLICY "Admins can view all orders." ON public.orders
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update any order." ON public.orders
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete any order." ON public.orders
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Add payfast_order_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payfast_order_id') THEN
        ALTER TABLE public.orders ADD COLUMN payfast_order_id text UNIQUE;
    END IF;
END
$$;
