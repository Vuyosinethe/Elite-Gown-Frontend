-- Drop table if it already exists to ensure a clean slate
DROP TABLE IF EXISTS orders CASCADE;

-- Create the orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to generate a unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    new_order_number TEXT;
    is_unique BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 8-character alphanumeric string
        new_order_number := UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
        
        -- Check if it's unique
        SELECT NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) INTO is_unique;
        
        IF is_unique THEN
            NEW.order_number := new_order_number;
            EXIT;
        END IF;
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before inserting a new order
CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to view their own orders" ON orders;
DROP POLICY IF EXISTS "Allow admins to view all orders" ON orders;
DROP POLICY IF EXISTS "Allow admins to update orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to create orders" ON orders;

-- Policy: Allow authenticated users to view their own orders
CREATE POLICY "Allow authenticated users to view their own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow admins to view all orders
CREATE POLICY "Allow admins to view all orders"
ON orders FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Allow admins to update orders
CREATE POLICY "Allow admins to update orders"
ON orders FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Allow authenticated users to create orders
CREATE POLICY "Allow authenticated users to create orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
