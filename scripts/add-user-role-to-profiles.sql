-- Add a 'role' column to the 'profiles' table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles
        ADD COLUMN role text DEFAULT 'user' NOT NULL;
    END IF;
END
$$;

-- Optional: Update an existing user to 'admin' role for testing
-- Replace 'YOUR_USER_ID' with the actual ID of the user you want to make an admin
-- You can find user IDs in the 'auth.users' table or 'public.profiles' table
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = 'YOUR_USER_ID';

-- Or update by email if you know it and it's unique in profiles table
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'your_user_email@example.com';
