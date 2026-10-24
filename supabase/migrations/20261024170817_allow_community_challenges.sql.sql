/*
# Allow community-submitted county challenges

1. Changes
- Add INSERT policy on `county_challenges` so residents can submit their own
  community challenge ideas (e.g. "Clean up the Neuse River", "Read 1000 books
  as a county"). Previously the table was read-only from the client and only
  seeded server-side.
- Add UPDATE policy on `county_challenges` so challenge status can be toggled
  (e.g. active/archived) from the client.
- Add a `submitted_by` column to track who proposed the challenge.
- Add a `source` column to distinguish 'seeded' (default) from 'community'
  (user-submitted) challenges.

2. Security
- INSERT: anon + authenticated can insert (single-tenant, no-auth app pattern,
  matching the rest of the community tables).
- UPDATE: anon + authenticated can update (for toggling active status).
- SELECT remains public (already in place).
- No deletes from the client.

3. Notes
- The existing seed challenge ('joco-month-of-service') is preserved and its
  source is set to 'seeded'.
- New community-submitted challenges get source = 'community' and a UUID id
  generated client-side.
*/

ALTER TABLE county_challenges
  ADD COLUMN IF NOT EXISTS submitted_by text DEFAULT 'Neighbor',
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'community' CHECK (source IN ('seeded', 'community'));

UPDATE county_challenges SET source = 'seeded' WHERE id = 'joco-month-of-service';

GRANT INSERT, UPDATE ON county_challenges TO anon, authenticated;

DROP POLICY IF EXISTS "public_insert_challenges" ON county_challenges;
CREATE POLICY "public_insert_challenges"
  ON county_challenges FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_challenges" ON county_challenges;
CREATE POLICY "public_update_challenges"
  ON county_challenges FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
