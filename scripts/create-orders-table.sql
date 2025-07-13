CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'completed', 'cancelled', 'refunded'
  shipping_address JSONB,
  billing_address JSONB,
  payment_method TEXT,
  payfast_order_id TEXT UNIQUE, -- New column for PayFast order ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add payfast_order_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payfast_order_id') THEN
        ALTER TABLE orders ADD COLUMN payfast_order_id TEXT UNIQUE;
    END IF;
END
$$;

-- Set up Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors on re-run
DROP POLICY IF EXISTS "Users can view their own orders." ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders." ON orders;
DROP POLICY IF EXISTS "Admins can view all orders." ON orders;
DROP POLICY IF EXISTS "Admins can update any order." ON orders;

-- Create RLS policies
CREATE POLICY "Users can view their own orders." ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders." ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders." ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update any order." ON orders FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists to prevent errors on re-run
DROP TRIGGER IF EXISTS set_orders_updated_at ON orders;

-- Create trigger to update updated_at on order changes
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_orders_updated_at_column();
