CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  transaction_id TEXT UNIQUE NOT NULL, -- PayFast transaction ID
  status TEXT NOT NULL, -- e.g., 'COMPLETE', 'FAILED', 'PENDING'
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'ZAR' NOT NULL,
  payment_method TEXT,
  metadata JSONB, -- Store additional PayFast ITN data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors on re-run
DROP POLICY IF EXISTS "Users can view their own transactions." ON transactions;
DROP POLICY IF EXISTS "Admins can view all transactions." ON transactions;

-- Create RLS policies
CREATE POLICY "Users can view their own transactions." ON transactions FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = transactions.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admins can view all transactions." ON transactions FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_transactions_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists to prevent errors on re-run
DROP TRIGGER IF EXISTS set_transactions_updated_at ON transactions;

-- Create trigger to update updated_at on transaction changes
CREATE TRIGGER set_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_transactions_updated_at_column();
