CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID NOT NULL, -- Assuming a products table exists or will exist
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  item_total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors on re-run
DROP POLICY IF EXISTS "Users can view their own order items." ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items." ON order_items;

-- Create RLS policies
CREATE POLICY "Users can view their own order items." ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admins can view all order items." ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_items_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists to prevent errors on re-run
DROP TRIGGER IF EXISTS set_order_items_updated_at ON order_items;

-- Create trigger to update updated_at on order_item changes
CREATE TRIGGER set_order_items_updated_at
BEFORE UPDATE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_order_items_updated_at_column();
