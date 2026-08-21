/*
# Create profiles table for user accounts

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, the user's login email)
  - `name` (text, display name — defaults to the email prefix)
  - `phone` (text, nullable, the user's phone if they signed in via phone)
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `profiles`.
- Each authenticated user can read and update only their own profile row.
- INSERT policy allows a user to create their own row only.
- DELETE policy allows a user to delete their own row only.
3. Important Notes
- The `id` column defaults to `auth.uid()` so inserts from the authenticated client
  work without explicitly passing the user id.
- Email confirmation stays OFF per project convention.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  name text,
  phone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);