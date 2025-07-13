-- Drop existing trigger and function to prevent errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Function to create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call handle_new_user on new user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users who might not have a profile
INSERT INTO public.profiles (id, email, first_name, last_name, phone, avatar_url)
SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'first_name',
  u.raw_user_meta_data->>'last_name',
  u.raw_user_meta_data->>'phone',
  u.raw_user_meta_data->>'avatar_url'
FROM auth.users AS u
LEFT JOIN public.profiles AS p ON u.id = p.id
WHERE p.id IS NULL;
