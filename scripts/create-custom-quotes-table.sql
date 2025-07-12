CREATE TYPE quote_status AS ENUM ('new', 'reviewed', 'quoted', 'accepted', 'rejected');

CREATE TABLE custom_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details TEXT NOT NULL,
    status quote_status DEFAULT 'new' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE custom_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own custom quotes." ON custom_quotes
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all custom quotes." ON custom_quotes
FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert custom quotes." ON custom_quotes
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update custom quotes." ON custom_quotes
FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Optional: Add a trigger to update `updated_at` on change
CREATE TRIGGER update_custom_quotes_updated_at
BEFORE UPDATE ON custom_quotes
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');
