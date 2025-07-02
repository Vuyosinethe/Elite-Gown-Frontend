-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT,
  description TEXT,
  rating DECIMAL(2,1),
  reviews INTEGER,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_created_at ON wishlist_items(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own wishlist items
CREATE POLICY "Users can only access their own wishlist items" ON wishlist_items
  FOR ALL USING (auth.uid() = user_id);
