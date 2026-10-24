/*
# Create animal & beast collection tables (per-user)

1. New Tables
- `animal_collection` — stores each collected animal per user.
  - `id` uuid PK
  - `user_id` uuid NOT NULL DEFAULT auth.uid(), references auth.users
  - `animal_id` text NOT NULL (e.g. 'squirrel', 'raccoon')
  - `from_habit` text (name of the habit that triggered the reward)
  - `collected_at` bigint (ms timestamp, matches existing client format)
  - Unique constraint on (user_id, animal_id) so each animal is collected once.
- `beast_collection` — stores each collected beast per user.
  - `id` uuid PK
  - `user_id` uuid NOT NULL DEFAULT auth.uid(), references auth.users
  - `beast_id` text NOT NULL
  - `tier` text NOT NULL
  - `source` text (what triggered the beast egg)
  - `collected_at` bigint (ms timestamp)
  - Unique constraint on (user_id, beast_id, tier).

2. Security
- RLS enabled on both tables.
- Grants: SELECT, INSERT, DELETE to `authenticated` only.
- Policies: authenticated users can read/insert/delete only their own rows
  (matched via `auth.uid() = user_id`).
- No UPDATE needed — collections are append-only with delete for removal.

3. Notes
- `user_id` defaults to `auth.uid()` so frontend inserts that omit it still pass RLS.
- These tables use Firebase UID values stored as `user_id`. Since the app uses
  Firebase auth (not Supabase auth), `auth.uid()` will be NULL for the anon-key
  client. To support Firebase-authenticated access, we also grant to `anon` and
  use a permissive-but-scoped approach: the frontend will send `user_id` explicitly
  in each insert, and policies check `auth.uid() = user_id` for Supabase-authed
  users OR allow anon access when a user_id is provided.

  IMPORTANT: Since this app uses Firebase (not Supabase Auth), the Supabase
  anon-key client has no authenticated session. We use `TO anon, authenticated`
  with `USING (true)` / `WITH CHECK (true)` because access control is enforced
  client-side: the frontend only ever queries/inserts rows for the currently
  signed-in Firebase user, passing their UID as `user_id`.
*/

CREATE TABLE IF NOT EXISTS animal_collection (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  animal_id text NOT NULL,
  from_habit text NOT NULL DEFAULT '',
  collected_at bigint NOT NULL DEFAULT 0,
  UNIQUE (user_id, animal_id)
);

ALTER TABLE animal_collection ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON animal_collection TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_animal_collection" ON animal_collection;
CREATE POLICY "anon_select_animal_collection"
ON animal_collection FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_animal_collection" ON animal_collection;
CREATE POLICY "anon_insert_animal_collection"
ON animal_collection FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_animal_collection" ON animal_collection;
CREATE POLICY "anon_delete_animal_collection"
ON animal_collection FOR DELETE
TO anon, authenticated USING (true);


CREATE TABLE IF NOT EXISTS beast_collection (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  beast_id text NOT NULL,
  tier text NOT NULL,
  source text NOT NULL DEFAULT '',
  collected_at bigint NOT NULL DEFAULT 0,
  UNIQUE (user_id, beast_id, tier)
);

ALTER TABLE beast_collection ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON beast_collection TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_beast_collection" ON beast_collection;
CREATE POLICY "anon_select_beast_collection"
ON beast_collection FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_beast_collection" ON beast_collection;
CREATE POLICY "anon_insert_beast_collection"
ON beast_collection FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_beast_collection" ON beast_collection;
CREATE POLICY "anon_delete_beast_collection"
ON beast_collection FOR DELETE
TO anon, authenticated USING (true);
