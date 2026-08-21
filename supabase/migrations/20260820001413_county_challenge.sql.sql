/*
# County Challenge — community-wide goals for Johnston County District 13

1. New Tables
- `county_challenges` — pre-seeded county-wide challenges (e.g. "Johnston County Month of Service").
  Columns: id (text PK), title, description, target_count, unit, icon, category, starts_at, ends_at, active (bool).
- `challenge_contributions` — individual contributions that roll up toward a challenge target.
  Columns: id (uuid PK), challenge_id (text FK), contributor_name (text), amount (int), note (text), created_at (timestamptz).
2. Seed Data
- One default challenge: "Johnston County Month of Service" with target 500 volunteer hours.
3. Security
- Enable RLS on both tables.
- Public read + insert for anon and authenticated (single-tenant, no-auth app; data is intentionally shared).
- No updates or deletes from the client (contributions are append-only).
4. Notes
- This is a no-auth app, so policies use TO anon, authenticated.
- Contributions are append-only — no UPDATE or DELETE policies.
*/

CREATE TABLE IF NOT EXISTS county_challenges (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  target_count integer NOT NULL DEFAULT 100,
  unit text NOT NULL DEFAULT 'logs',
  icon text NOT NULL DEFAULT '🤝',
  category text NOT NULL DEFAULT 'Community Service',
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS challenge_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id text NOT NULL REFERENCES county_challenges(id) ON DELETE CASCADE,
  contributor_name text NOT NULL DEFAULT 'Neighbor',
  amount integer NOT NULL DEFAULT 1 CHECK (amount > 0 AND amount <= 50),
  note text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_challenge_contributions_challenge_id
  ON challenge_contributions(challenge_id);

ALTER TABLE county_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_contributions ENABLE ROW LEVEL SECURITY;

-- county_challenges: public read only (seeded by server, not writable from client)
DROP POLICY IF EXISTS "public_read_challenges" ON county_challenges;
CREATE POLICY "public_read_challenges"
  ON county_challenges FOR SELECT
  TO anon, authenticated USING (true);

-- challenge_contributions: public read + public insert (append-only)
DROP POLICY IF EXISTS "public_read_contributions" ON challenge_contributions;
CREATE POLICY "public_read_contributions"
  ON challenge_contributions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_contributions" ON challenge_contributions;
CREATE POLICY "public_insert_contributions"
  ON challenge_contributions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Seed default challenge (idempotent)
INSERT INTO county_challenges (id, title, description, target_count, unit, icon, category, active)
VALUES (
  'joco-month-of-service',
  'Johnston County Month of Service',
  'Log 500 volunteer hours across Johnston County — walk a shelter dog, help at a food pantry, deliver meals to seniors, or pick up litter on a greenway. Every verified hour counts toward our county-wide goal.',
  500,
  'volunteer hours',
  '🤝',
  'Community Service',
  true
)
ON CONFLICT (id) DO NOTHING;
