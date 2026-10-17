/*
# Community Poll — state income tax cap vote

1. New Tables
- `community_poll_votes` — stores one vote per device/user for the District 13
  community poll on keeping the NC state income tax rate from being raised
  higher than 3.5%.
  Columns:
    - id (uuid PK)
    - poll_id (text, identifies the poll; allows future polls)
    - choice (text: 'for' | 'against')
    - voter_id (text, a per-device UUID generated client-side to dedupe votes
      without requiring sign-in)
    - user_id (uuid, nullable — set when the voter is signed in)
    - created_at (timestamptz)
  Unique constraint on (poll_id, voter_id) so each device can only vote once
  per poll. Changing a vote is done via UPDATE of the existing row.

2. Security
- Enable RLS on `community_poll_votes`.
- Public read (anyone can see the tally) for anon + authenticated.
- Public insert + update for anon + authenticated (the poll is open to all
  visitors, no sign-in required, matching the help_requests pattern).
- No deletes from the client.

3. Notes
- The banner is shown to all visitors, including logged-out, so policies use
  TO anon, authenticated.
- Dedup is enforced by the unique (poll_id, voter_id) constraint plus the
  client generating a stable UUID stored in localStorage.
*/

CREATE TABLE IF NOT EXISTS community_poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id text NOT NULL,
  choice text NOT NULL CHECK (choice IN ('for', 'against')),
  voter_id text NOT NULL,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_poll_votes_voter
  ON community_poll_votes (poll_id, voter_id);

CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON community_poll_votes(poll_id);

ALTER TABLE community_poll_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_poll_votes" ON community_poll_votes;
CREATE POLICY "public_read_poll_votes"
  ON community_poll_votes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_poll_votes" ON community_poll_votes;
CREATE POLICY "public_insert_poll_votes"
  ON community_poll_votes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_poll_votes" ON community_poll_votes;
CREATE POLICY "public_update_poll_votes"
  ON community_poll_votes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
