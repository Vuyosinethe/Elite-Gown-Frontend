-- Drop table if it exists to ensure a clean slate
DROP TABLE IF EXISTS custom_quotes CASCADE;

-- Create the custom_quotes table
CREATE TABLE custom_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_id TEXT, -- For unauthenticated users
    quote_number TEXT UNIQUE NOT NULL, -- Unique identifier for the quote request
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    description TEXT NOT NULL,
    attachments JSONB, -- Array of file URLs or names
    status TEXT DEFAULT 'pending' NOT NULL, -- e.g., pending, reviewed, quoted, accepted, rejected, completed
    quoted_price NUMERIC(10, 2),
    quoted_currency TEXT DEFAULT 'USD',
    quoted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Admin user who provided the quote
    quoted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to generate a unique quote number
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
DECLARE
    new_quote_num TEXT;
BEGIN
    LOOP
        new_quote_num := 'QTE-' || LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0');
        EXIT WHEN NOT EXISTS (SELECT 1 FROM custom_quotes WHERE quote_number = new_quote_num);
    END LOOP;
    NEW.quote_number := new_quote_num;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before insert
CREATE TRIGGER set_quote_number
BEFORE INSERT ON custom_quotes
FOR EACH ROW
EXECUTE FUNCTION generate_quote_number();

-- Enable Row Level Security (RLS)
ALTER TABLE custom_quotes ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to view their own quotes
CREATE POLICY "Allow authenticated users to view their own quotes"
ON custom_quotes FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy to allow authenticated users to create quotes
CREATE POLICY "Allow authenticated users to create quotes"
ON custom_quotes FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy to allow authenticated users to update their own quotes (e.g., accept/reject)
CREATE POLICY "Allow authenticated users to update their own quotes"
ON custom_quotes FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Policy to allow guest users to view their own quotes (via guest_id)
CREATE POLICY "Allow guest users to view their own quotes"
ON custom_quotes FOR SELECT
TO anon
USING (guest_id = current_setting('app.guest_id', TRUE)::TEXT);

-- Policy to allow guest users to create quotes
CREATE POLICY "Allow guest users to create quotes"
ON custom_quotes FOR INSERT
TO anon
WITH CHECK (guest_id = current_setting('app.guest_id', TRUE)::TEXT);

-- Policy to allow admin users to view all custom quotes
CREATE POLICY "Allow admin to view all custom quotes"
ON custom_quotes FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy to allow admin users to update any custom quote
CREATE POLICY "Allow admin to update any custom quote"
ON custom_quotes FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
