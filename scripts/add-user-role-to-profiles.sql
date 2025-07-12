ALTER TABLE profiles
ADD COLUMN role TEXT DEFAULT 'user' NOT NULL;

-- Optional: Update an existing user to admin for testing
-- UPDATE profiles
-- SET role = 'admin'
-- WHERE email = 'your_admin_email@example.com';
