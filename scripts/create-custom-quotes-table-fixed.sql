-- Drop existing tables if they exist to ensure a clean slate
DROP TABLE IF EXISTS public.custom_quotes CASCADE;

-- Create the custom_quotes table
CREATE TABLE public.custom_quotes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_id text, -- For unauthenticated users
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    description text NOT NULL,
    status text DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'reviewed', 'quoted', 'accepted', 'rejected'
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) for custom_quotes
ALTER TABLE public.custom_quotes ENABLE ROW LEVEL SECURITY;

-- Policies for custom_quotes table
-- Allow authenticated users to view their own quotes
DROP POLICY IF EXISTS "Users can view their own custom quotes." ON public.custom_quotes;
CREATE POLICY "Users can view their own custom quotes."
ON public.custom_quotes FOR SELECT USING (auth.uid() = user_id);

-- Allow guests to view their own quotes (if guest_id matches)
DROP POLICY IF EXISTS "Guests can view their own custom quotes." ON public.custom_quotes;
CREATE POLICY "Guests can view their own custom quotes."
ON public.custom_quotes FOR SELECT USING (guest_id = current_setting('app.guest_id', true)::text);

-- Allow authenticated users to create quotes
DROP POLICY IF EXISTS "Authenticated users can create custom quotes." ON public.custom_quotes;
CREATE POLICY "Authenticated users can create custom quotes."
ON public.custom_quotes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow guests to create quotes
DROP POLICY IF EXISTS "Guests can create custom quotes." ON public.custom_quotes;
CREATE POLICY "Guests can create custom quotes."
ON public.custom_quotes FOR INSERT WITH CHECK (guest_id = current_setting('app.guest_id', true)::text);

-- Allow admins to view all custom quotes
DROP POLICY IF EXISTS "Admins can view all custom quotes." ON public.custom_quotes;
CREATE POLICY "Admins can view all custom quotes."
ON public.custom_quotes FOR SELECT USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Allow admins to manage all custom quotes (insert, update, delete)
DROP POLICY IF EXISTS "Admins can manage all custom quotes." ON public.custom_quotes;
CREATE POLICY "Admins can manage all custom quotes."
ON public.custom_quotes FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for custom_quotes table
CREATE OR REPLACE TRIGGER update_custom_quotes_updated_at
BEFORE UPDATE ON public.custom_quotes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
