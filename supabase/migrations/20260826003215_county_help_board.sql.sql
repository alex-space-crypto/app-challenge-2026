/*
# County Help Board — community help requests and offers

1. New Tables
- `help_requests` — neighbors can post requests for help (e.g. hurricane Helene relief,
  storm cleanup, food, supplies, transportation) or offers to help others.
  Columns:
    - id (uuid PK)
    - type (text: 'request' | 'offer')
    - category (text: e.g. 'Hurricane Relief', 'Storm Cleanup', 'Food & Supplies',
      'Transportation', 'Shelter', 'Volunteers Needed', 'Other')
    - title (text)
    - description (text)
    - contact_name (text)
    - location (text, optional — town or area)
    - status (text: 'open' | 'fulfilled')
    - urgency (text: 'low' | 'medium' | 'high')
    - created_at (timestamptz)
2. Seed Data
- One example help request for hurricane Helene relief.
3. Security
- Enable RLS on `help_requests`.
- Public read + insert for anon and authenticated (single-tenant, no-auth app; data is intentionally shared).
- Allow update of status (open/fulfilled) by anyone.
- No deletes from the client (append + status-change only).
4. Notes
- This is a no-auth app, so policies use TO anon, authenticated.
- Help requests are append-only with status updates — no DELETE policy.
*/

CREATE TABLE IF NOT EXISTS help_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'request' CHECK (type IN ('request', 'offer')),
  category text NOT NULL DEFAULT 'Other',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  contact_name text NOT NULL DEFAULT 'Neighbor',
  location text DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'fulfilled')),
  urgency text NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);
CREATE INDEX IF NOT EXISTS idx_help_requests_type ON help_requests(type);
CREATE INDEX IF NOT EXISTS idx_help_requests_created ON help_requests(created_at DESC);

ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "public_read_help_requests" ON help_requests;
CREATE POLICY "public_read_help_requests"
  ON help_requests FOR SELECT
  TO anon, authenticated USING (true);

-- Public insert (anyone can post a help request or offer)
DROP POLICY IF EXISTS "public_insert_help_requests" ON help_requests;
CREATE POLICY "public_insert_help_requests"
  ON help_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Public update (anyone can mark a request as fulfilled or reopen it)
DROP POLICY IF EXISTS "public_update_help_requests" ON help_requests;
CREATE POLICY "public_update_help_requests"
  ON help_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed example help request (idempotent)
INSERT INTO help_requests (type, category, title, description, contact_name, location, status, urgency)
VALUES (
  'request',
  'Hurricane Relief',
  'Hurricane Helene — Volunteer Cleanup Crews Needed',
  'Neighbors affected by Hurricane Helene need help clearing debris, tarping roofs, and delivering supplies in the Benson and Four Oaks areas. If you can spare a few hours, please reach out. Bring work gloves and water if you have them.',
  'Johnston County Emergency Services',
  'Benson & Four Oaks, NC',
  'open',
  'high'
)
ON CONFLICT DO NOTHING;
