-- Add 'role' column to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user' NOT NULL;
    END IF;
END $$;

-- Update existing users to 'user' role if role is null (for existing profiles before this migration)
UPDATE profiles
SET role = 'user'
WHERE role IS NULL;

-- Optional: Add a policy to allow users to update their own role (if needed for self-service, but typically admin-only)
-- CREATE POLICY "Users can update their own role." ON profiles
-- FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Policy to allow admins to update any profile (including roles)
CREATE POLICY "Admins can update any profile." ON profiles
FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles." ON profiles
FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
