-- Drop table if it exists to ensure a clean creation with all columns
DROP TABLE IF EXISTS custom_quotes CASCADE;

-- Create custom_quotes table for special/custom orders
CREATE TABLE IF NOT EXISTS custom_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'quoted', 'approved', 'in_production', 'completed', 'cancelled')),
  product_type TEXT NOT NULL,
  description TEXT NOT NULL,
  specifications JSONB,
  quantity INTEGER NOT NULL,
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  deadline DATE,
  admin_notes TEXT,
  customer_notes TEXT,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint after table creation
ALTER TABLE custom_quotes ADD CONSTRAINT custom_quotes_quote_number_unique UNIQUE (quote_number);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_quotes_user_id ON custom_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_quotes_status ON custom_quotes(status);
CREATE INDEX IF NOT EXISTS idx_custom_quotes_created_at ON custom_quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_custom_quotes_quote_number ON custom_quotes(quote_number);

-- Enable RLS
ALTER TABLE custom_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own quotes" ON custom_quotes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quotes" ON custom_quotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all quotes" ON custom_quotes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all quotes" ON custom_quotes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
