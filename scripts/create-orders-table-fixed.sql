-- Drop table if it exists to ensure a clean slate
DROP TABLE IF EXISTS orders CASCADE;

-- Create the orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_id TEXT, -- For unauthenticated users
    order_number TEXT UNIQUE NOT NULL, -- Unique identifier for the order
    total_amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- e.g., pending, processing, shipped, delivered, cancelled
    shipping_address JSONB,
    billing_address JSONB,
    payment_status TEXT DEFAULT 'unpaid' NOT NULL, -- e.g., unpaid, paid, refunded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to generate a unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    new_order_num TEXT;
BEGIN
    LOOP
        new_order_num := 'ORD-' || LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0');
        EXIT WHEN NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_num);
    END LOOP;
    NEW.order_number := new_order_num;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before insert
CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view their own orders
CREATE POLICY "Allow authenticated users to view their own orders"
ON orders FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy to allow authenticated users to create orders
CREATE POLICY "Allow authenticated users to create orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy to allow authenticated users to update their own orders (e.g., status updates from payment gateway)
CREATE POLICY "Allow authenticated users to update their own orders"
ON orders FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Policy to allow guest users to view their own orders (via guest_id)
CREATE POLICY "Allow guest users to view their own orders"
ON orders FOR SELECT
TO anon
USING (guest_id = current_setting('app.guest_id', TRUE)::TEXT);

-- Policy to allow guest users to create orders
CREATE POLICY "Allow guest users to create orders"
ON orders FOR INSERT
TO anon
WITH CHECK (guest_id = current_setting('app.guest_id', TRUE)::TEXT);

-- Policy to allow admin users to view all orders
CREATE POLICY "Allow admin to view all orders"
ON orders FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy to allow admin users to update any order
CREATE POLICY "Allow admin to update any order"
ON orders FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
