-- Drop table if it already exists to ensure a clean slate
DROP TABLE IF EXISTS custom_quotes CASCADE;

-- Create the custom_quotes table
CREATE TABLE custom_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quote_number TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'completed')),
    quoted_price NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to generate a unique quote number
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
DECLARE
    new_quote_number TEXT;
    is_unique BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 8-character alphanumeric string
        new_quote_number := UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
        
        -- Check if it's unique
        SELECT NOT EXISTS (SELECT 1 FROM custom_quotes WHERE quote_number = new_quote_number) INTO is_unique;
        
        IF is_unique THEN
            NEW.quote_number := new_quote_number;
            EXIT;
        END IF;
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before inserting a new custom quote
CREATE TRIGGER set_quote_number
BEFORE INSERT ON custom_quotes
FOR EACH ROW EXECUTE FUNCTION generate_quote_number();

-- Enable Row Level Security (RLS)
ALTER TABLE custom_quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to view their own custom quotes" ON custom_quotes;
DROP POLICY IF EXISTS "Allow admins to view all custom quotes" ON custom_quotes;
DROP POLICY IF EXISTS "Allow admins to update custom quotes" ON custom_quotes;
DROP POLICY IF EXISTS "Allow authenticated users to create custom quotes" ON custom_quotes;

-- Policy: Allow authenticated users to view their own custom quotes
CREATE POLICY "Allow authenticated users to view their own custom quotes"
ON custom_quotes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow admins to view all custom quotes
CREATE POLICY "Allow admins to view all custom quotes"
ON custom_quotes FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Allow admins to update custom quotes
CREATE POLICY "Allow admins to update custom quotes"
ON custom_quotes FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Allow authenticated users to create custom quotes
CREATE POLICY "Allow authenticated users to create custom quotes"
ON custom_quotes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
