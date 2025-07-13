-- Drop table if it exists to ensure a clean slate
DROP TABLE IF EXISTS custom_quotes CASCADE;

-- Create the custom_quotes table
CREATE TABLE custom_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_id TEXT, -- For unauthenticated users
    quote_number TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- e.g., pending, reviewed, quoted, accepted, rejected, completed
    quoted_price NUMERIC(10, 2),
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to generate a unique quote number
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.quote_number := 'QTE-' || LPAD(NEXTVAL('quote_number_seq')::TEXT, 8, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a sequence for quote numbers if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'quote_number_seq' AND relkind = 'S') THEN
        CREATE SEQUENCE quote_number_seq START 10000000;
    END IF;
END $$;

-- Create a trigger to set the quote number before insert
CREATE TRIGGER set_quote_number
BEFORE INSERT ON custom_quotes
FOR EACH ROW EXECUTE FUNCTION generate_quote_number();

-- Enable Row Level Security (RLS)
ALTER TABLE custom_quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to view their own quotes" ON custom_quotes;
DROP POLICY IF EXISTS "Allow authenticated users to create quotes" ON custom_quotes;
DROP POLICY IF EXISTS "Allow authenticated users to update their own quotes" ON custom_quotes;
DROP POLICY IF EXISTS "Allow admins to view all quotes" ON custom_quotes;
DROP POLICY IF EXISTS "Allow admins to update any quote" ON custom_quotes;
DROP POLICY IF EXISTS "Allow guest users to view their quotes" ON custom_quotes;

-- Policy: Allow authenticated users to view their own quotes
CREATE POLICY "Allow authenticated users to view their own quotes"
ON custom_quotes FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Allow authenticated users to create quotes
CREATE POLICY "Allow authenticated users to create quotes"
ON custom_quotes FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Allow authenticated users to update their own quotes (e.g., accept/reject)
CREATE POLICY "Allow authenticated users to update their own quotes"
ON custom_quotes FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy: Allow admins to view all quotes
CREATE POLICY "Allow admins to view all quotes"
ON custom_quotes FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Allow admins to update any quote
CREATE POLICY "Allow admins to update any quote"
ON custom_quotes FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Allow guest users to view their quotes (if guest_id is provided)
CREATE POLICY "Allow guest users to view their quotes"
ON custom_quotes FOR SELECT
TO public
USING (guest_id IS NOT NULL);
