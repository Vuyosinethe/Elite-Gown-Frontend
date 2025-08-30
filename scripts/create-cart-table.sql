-- Create cart_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGSERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    product_details TEXT DEFAULT '',
    product_image TEXT DEFAULT '/placeholder.svg?height=80&width=80',
    price INTEGER NOT NULL, -- Price in cents
    quantity INTEGER NOT NULL DEFAULT 1,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure either user_id or session_id is provided, but not both
    CONSTRAINT cart_items_user_or_session CHECK (
        (user_id IS NOT NULL AND session_id IS NULL) OR 
        (user_id IS NULL AND session_id IS NOT NULL)
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Enable Row Level Security
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can manage their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Guest users can manage their session cart items" ON cart_items;
DROP POLICY IF EXISTS "Allow anonymous cart access" ON cart_items;

-- Create policies for authenticated users
CREATE POLICY "Users can manage their own cart items" ON cart_items
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for guest users (session-based)
CREATE POLICY "Guest users can manage their session cart items" ON cart_items
    FOR ALL USING (user_id IS NULL AND session_id IS NOT NULL);

-- Allow anonymous access for session-based carts
CREATE POLICY "Allow anonymous cart access" ON cart_items
    FOR ALL TO anon USING (user_id IS NULL AND session_id IS NOT NULL);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cart_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_cart_items_updated_at();
