-- Drop table if it exists to ensure a clean recreation
DROP TABLE IF EXISTS orders CASCADE;

-- Create the orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_id TEXT, -- For guest orders
    order_number TEXT UNIQUE NOT NULL, -- Unique identifier for the order
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    shipping_address JSONB,
    billing_address JSONB,
    payment_status TEXT DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'paid', 'failed'
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

-- Create a trigger to call the function before inserting a new order
CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view their own orders
CREATE POLICY "Allow authenticated users to view their own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Policy for authenticated users to create orders
CREATE POLICY "Allow authenticated users to create orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own orders (e.g., status changes initiated by user)
CREATE POLICY "Allow authenticated users to update their own orders"
ON orders FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for admins to view all orders
CREATE POLICY "Allow admins to view all orders"
ON orders FOR SELECT
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to update any order
CREATE POLICY "Allow admins to update any order"
ON orders FOR UPDATE
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for guest users to view their own orders (based on guest_id)
CREATE POLICY "Allow guests to view their own orders"
ON orders FOR SELECT
USING (guest_id = current_setting('app.guest_id', true));

-- Policy for guest users to create orders
CREATE POLICY "Allow guests to create orders"
ON orders FOR INSERT
WITH CHECK (guest_id = current_setting('app.guest_id', true));
