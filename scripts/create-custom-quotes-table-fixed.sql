-- Drop table if it exists to ensure a clean recreation
DROP TABLE IF EXISTS custom_quotes CASCADE;

-- Create the custom_quotes table
CREATE TABLE custom_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_id TEXT, -- For guest quote requests
    quote_number TEXT UNIQUE NOT NULL, -- Unique identifier for the quote request
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    phone_number TEXT,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'reviewed', 'quoted', 'accepted', 'rejected'
    quoted_price NUMERIC(10, 2),
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

-- Create a trigger to call the function before inserting a new custom quote
CREATE TRIGGER set_quote_number
BEFORE INSERT ON custom_quotes
FOR EACH ROW EXECUTE FUNCTION generate_quote_number();

-- Enable Row Level Security (RLS)
ALTER TABLE custom_quotes ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view their own quotes
CREATE POLICY "Allow authenticated users to view their own quotes"
ON custom_quotes FOR SELECT
USING (auth.uid() = user_id);

-- Policy for authenticated users to create quotes
CREATE POLICY "Allow authenticated users to create quotes"
ON custom_quotes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own quotes (e.g., accept/reject)
CREATE POLICY "Allow authenticated users to update their own quotes"
ON custom_quotes FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for admins to view all quotes
CREATE POLICY "Allow admins to view all quotes"
ON custom_quotes FOR SELECT
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to update any quote
CREATE POLICY "Allow admins to update any quote"
ON custom_quotes FOR UPDATE
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for guest users to view their own quotes (based on guest_id)
CREATE POLICY "Allow guests to view their own quotes"
ON custom_quotes FOR SELECT
USING (guest_id = current_setting('app.guest_id', true));

-- Policy for guest users to create quotes
CREATE POLICY "Allow guests to create quotes"
ON custom_quotes FOR INSERT
WITH CHECK (guest_id = current_setting('app.guest_id', true));
