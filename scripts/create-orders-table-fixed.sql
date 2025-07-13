-- Drop existing tables if they exist to ensure a clean slate
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- Create the orders table
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_id text, -- For unauthenticated users
    order_number text UNIQUE NOT NULL,
    total_amount numeric(10, 2) NOT NULL,
    status text DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    shipping_address jsonb,
    billing_address jsonb,
    payment_status text DEFAULT 'unpaid' NOT NULL, -- e.g., 'unpaid', 'paid', 'refunded'
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the order_items table
CREATE TABLE public.order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id text NOT NULL, -- Assuming product_id is a string for simplicity, adjust if it's UUID
    product_name text NOT NULL,
    quantity integer NOT NULL,
    price numeric(10, 2) NOT NULL,
    item_total numeric(10, 2) NOT NULL,
    metadata jsonb, -- e.g., size, color, customization details
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) for orders and order_items
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policies for orders table
-- Allow authenticated users to view their own orders
DROP POLICY IF EXISTS "Users can view their own orders." ON public.orders;
CREATE POLICY "Users can view their own orders."
ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Allow guests to view their own orders (if guest_id matches)
DROP POLICY IF EXISTS "Guests can view their own orders." ON public.orders;
CREATE POLICY "Guests can view their own orders."
ON public.orders FOR SELECT USING (guest_id = current_setting('app.guest_id', true)::text);

-- Allow authenticated users to create orders
DROP POLICY IF EXISTS "Authenticated users can create orders." ON public.orders;
CREATE POLICY "Authenticated users can create orders."
ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow guests to create orders
DROP POLICY IF EXISTS "Guests can create orders." ON public.orders;
CREATE POLICY "Guests can create orders."
ON public.orders FOR INSERT WITH CHECK (guest_id = current_setting('app.guest_id', true)::text);

-- Allow admins to view all orders
DROP POLICY IF EXISTS "Admins can view all orders." ON public.orders;
CREATE POLICY "Admins can view all orders."
ON public.orders FOR SELECT USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Allow admins to manage all orders (insert, update, delete)
DROP POLICY IF EXISTS "Admins can manage all orders." ON public.orders;
CREATE POLICY "Admins can manage all orders."
ON public.orders FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));


-- Policies for order_items table
-- Allow authenticated users to view their own order items
DROP POLICY IF EXISTS "Users can view their own order items." ON public.order_items;
CREATE POLICY "Users can view their own order items."
ON public.order_items FOR SELECT USING (order_id IN (SELECT id FROM public.orders WHERE auth.uid() = user_id));

-- Allow guests to view their own order items
DROP POLICY IF EXISTS "Guests can view their own order items." ON public.order_items;
CREATE POLICY "Guests can view their own order items."
ON public.order_items FOR SELECT USING (order_id IN (SELECT id FROM public.orders WHERE guest_id = current_setting('app.guest_id', true)::text));

-- Allow authenticated users to create order items
DROP POLICY IF EXISTS "Authenticated users can create order items." ON public.order_items;
CREATE POLICY "Authenticated users can create order items."
ON public.order_items FOR INSERT WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE auth.uid() = user_id));

-- Allow guests to create order items
DROP POLICY IF EXISTS "Guests can create order items." ON public.order_items;
CREATE POLICY "Guests can create order items."
ON public.order_items FOR INSERT WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE guest_id = current_setting('app.guest_id', true)::text));

-- Allow admins to view all order items
DROP POLICY IF EXISTS "Admins can view all order items." ON public.order_items;
CREATE POLICY "Admins can view all order items."
ON public.order_items FOR SELECT USING (order_id IN (SELECT id FROM public.orders WHERE auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')));

-- Allow admins to manage all order items (insert, update, delete)
DROP POLICY IF EXISTS "Admins can manage all order items." ON public.order_items;
CREATE POLICY "Admins can manage all order items."
ON public.order_items FOR ALL USING (order_id IN (SELECT id FROM public.orders WHERE auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')));

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
    current_year TEXT;
    current_month TEXT;
    current_day TEXT;
    sequence_val BIGINT;
BEGIN
    -- Get current year, month, day
    current_year := to_char(now(), 'YYYY');
    current_month := to_char(now(), 'MM');
    current_day := to_char(now(), 'DD');

    -- Get next value from a sequence, reset daily
    -- This requires a sequence to be created: CREATE SEQUENCE order_number_seq;
    -- And a daily reset mechanism (e.g., a cron job or a more complex function)
    -- For simplicity, let's use a simple counter for now, but in a real system,
    -- you'd want a more robust, globally unique, and resetable sequence.
    -- For a simple, non-resettable sequence:
    -- SELECT nextval('order_number_seq') INTO sequence_val;

    -- For a daily resettable sequence, you'd need a more advanced approach,
    -- e.g., storing the last reset date and sequence value in a separate table.
    -- For this example, let's just use a random component for uniqueness,
    -- which is not ideal for sequential order numbers but avoids complex sequence management.
    -- In a production system, consider a dedicated sequence table with daily reset logic.
    new_order_number := 'ORD-' || current_year || current_month || current_day || '-' || lpad(floor(random() * 1000000)::text, 6, '0');

    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set order_number before insert
CREATE OR REPLACE TRIGGER set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for orders table
CREATE OR REPLACE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for order_items table
CREATE OR REPLACE TRIGGER update_order_items_updated_at
BEFORE UPDATE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
