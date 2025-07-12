-- Create the 'custom_quotes' table
CREATE TABLE IF NOT EXISTS public.custom_quotes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    request_details text NOT NULL,
    status text DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'reviewed', 'quoted', 'accepted', 'rejected'
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    quote_response jsonb -- Store quote details, price, etc.
);

-- Enable Row Level Security (RLS) for the 'custom_quotes' table
ALTER TABLE public.custom_quotes ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view their own custom quotes
DROP POLICY IF EXISTS "Users can view their own custom quotes." ON public.custom_quotes;
CREATE POLICY "Users can view their own custom quotes." ON public.custom_quotes
FOR SELECT USING (auth.uid() = user_id);

-- Policy for admins to view all custom quotes
DROP POLICY IF EXISTS "Admins can view all custom quotes." ON public.custom_quotes;
CREATE POLICY "Admins can view all custom quotes." ON public.custom_quotes
FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to insert custom quotes
DROP POLICY IF EXISTS "Admins can insert custom quotes." ON public.custom_quotes;
CREATE POLICY "Admins can insert custom quotes." ON public.custom_quotes
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to update custom quotes
DROP POLICY IF EXISTS "Admins can update custom quotes." ON public.custom_quotes;
CREATE POLICY "Admins can update custom quotes." ON public.custom_quotes
FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to delete custom quotes
DROP POLICY IF EXISTS "Admins can delete custom quotes." ON public.custom_quotes;
CREATE POLICY "Admins can delete custom quotes." ON public.custom_quotes
FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
