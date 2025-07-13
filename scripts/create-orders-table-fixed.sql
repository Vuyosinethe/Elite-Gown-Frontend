-- Drop table if it exists to ensure a clean slate
DROP TABLE IF EXISTS orders CASCADE;

-- Create the orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_id TEXT, -- For unauthenticated users
    order_number TEXT UNIQUE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- e.g., pending, processing, shipped, delivered, cancelled
    shipping_address JSONB,
    billing_address JSONB,
    payment_status TEXT DEFAULT 'pending' NOT NULL, -- e.g., pending, paid, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to generate a unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'ORD-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 8, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a sequence for order numbers if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'order_number_seq' AND relkind = 'S') THEN
        CREATE SEQUENCE order_number_seq START 10000000;
    END IF;
END $$;

-- Create a trigger to set the order number before insert
CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to view their own orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to create orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to update their own orders" ON orders;
DROP POLICY IF EXISTS "Allow admins to view all orders" ON orders;
DROP POLICY IF EXISTS "Allow admins to update any order" ON orders;
DROP POLICY IF EXISTS "Allow guest users to view their orders" ON orders;

-- Policy: Allow authenticated users to view their own orders
CREATE POLICY "Allow authenticated users to view their own orders"
ON orders FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Allow authenticated users to create orders
CREATE POLICY "Allow authenticated users to create orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Allow authenticated users to update their own orders (e.g., cancel)
CREATE POLICY "Allow authenticated users to update their own orders"
ON orders FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Allow admins to view all orders
CREATE POLICY "Allow admins to view all orders"
ON orders FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Allow admins to update any order
CREATE POLICY "Allow admins to update any order"
ON orders FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Allow guest users to view their orders (if guest_id is provided)
CREATE POLICY "Allow guest users to view their orders"
ON orders FOR SELECT
TO public
USING (guest_id IS NOT NULL);
