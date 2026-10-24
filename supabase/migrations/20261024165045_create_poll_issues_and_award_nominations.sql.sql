/*
# Community Issue Polls & County Award Nominations

1. New Tables

- `community_poll_issues`
  Residents submit issues they care about (e.g. road safety, school funding,
  park maintenance) as poll questions so the community can vote For or Against
  and push representatives to act on things people actually care about.
  Columns:
    - id (uuid PK)
    - title (text, the issue question, e.g. "Add sidewalks on Highway 42")
    - description (text, longer explanation of the issue)
    - category (text: Infrastructure, Education, Public Safety, Health,
      Environment, Housing, Other)
    - submitted_by (text, display name of the submitter)
    - voter_id (text, per-device UUID for dedup)
    - status (text: 'active' | 'archived', default 'active')
    - votes_for (integer, default 0)
    - votes_against (integer, default 0)
    - created_at (timestamptz)

- `community_poll_issue_votes`
  One vote per device per issue, same pattern as community_poll_votes.
  Columns:
    - id (uuid PK)
    - issue_id (uuid FK -> community_poll_issues)
    - choice (text: 'for' | 'against')
    - voter_id (text, per-device UUID)
    - created_at (timestamptz)
  Unique constraint on (issue_id, voter_id).

- `award_nominations`
  Residents nominate a neighbor for a county recognition award (e.g. "Month of
  Service", "Community Hero", "Volunteer of the Month"). This gives the
  community a way to recognize people doing meaningful work.
  Columns:
    - id (uuid PK)
    - nominee_name (text, the person being nominated)
    - award_type (text: 'Month of Service', 'Community Hero',
      'Volunteer of the Month', 'Youth Leader', 'Senior Champion',
      'Neighborhood Helper', 'Other')
    - reason (text, why they deserve the award)
    - nominated_by (text, display name of the nominator)
    - status (text: 'pending' | 'recognized' | 'archived', default 'pending')
    - created_at (timestamptz)

2. Security

- Enable RLS on all three tables.
- Public read for anon + authenticated (issues, vote counts, and nominations
  are visible to all visitors, matching the existing community_poll_votes and
  help_requests pattern).
- Public insert for anon + authenticated (submitting issues, casting votes,
  and nominating are open to all).
- Update allowed on community_poll_issues for vote count increments
  (anon + authenticated can increment vote counters).
- Update allowed on award_nominations for status changes (recognized/archived).
- No deletes from the client.

3. Notes

- The banner and community tab are shown to all visitors including
  logged-out, so policies use TO anon, authenticated.
- Vote dedup is enforced by unique (issue_id, voter_id) plus a client-side
  stable UUID in localStorage.
- Vote counters on community_poll_issues are denormalized for fast display;
  they are incremented via UPDATE when a vote is cast.
*/

-- ===== Community Poll Issues =====

CREATE TABLE IF NOT EXISTS community_poll_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Other',
  submitted_by text NOT NULL DEFAULT 'Neighbor',
  voter_id text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  votes_for integer NOT NULL DEFAULT 0,
  votes_against integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_poll_issues_status
  ON community_poll_issues(status, created_at DESC);

ALTER TABLE community_poll_issues ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON community_poll_issues TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_poll_issues" ON community_poll_issues;
CREATE POLICY "public_read_poll_issues"
  ON community_poll_issues FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_poll_issues" ON community_poll_issues;
CREATE POLICY "public_insert_poll_issues"
  ON community_poll_issues FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_poll_issues" ON community_poll_issues;
CREATE POLICY "public_update_poll_issues"
  ON community_poll_issues FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ===== Community Poll Issue Votes =====

CREATE TABLE IF NOT EXISTS community_poll_issue_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES community_poll_issues(id) ON DELETE CASCADE,
  choice text NOT NULL CHECK (choice IN ('for', 'against')),
  voter_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_issue_votes_voter
  ON community_poll_issue_votes (issue_id, voter_id);

CREATE INDEX IF NOT EXISTS idx_issue_votes_issue
  ON community_poll_issue_votes(issue_id);

ALTER TABLE community_poll_issue_votes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON community_poll_issue_votes TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_issue_votes" ON community_poll_issue_votes;
CREATE POLICY "public_read_issue_votes"
  ON community_poll_issue_votes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_issue_votes" ON community_poll_issue_votes;
CREATE POLICY "public_insert_issue_votes"
  ON community_poll_issue_votes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_issue_votes" ON community_poll_issue_votes;
CREATE POLICY "public_update_issue_votes"
  ON community_poll_issue_votes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ===== Award Nominations =====

CREATE TABLE IF NOT EXISTS award_nominations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_name text NOT NULL,
  award_type text NOT NULL DEFAULT 'Month of Service',
  reason text NOT NULL DEFAULT '',
  nominated_by text NOT NULL DEFAULT 'Neighbor',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'recognized', 'archived')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_award_nominations_status
  ON award_nominations(status, created_at DESC);

ALTER TABLE award_nominations ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON award_nominations TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_award_nominations" ON award_nominations;
CREATE POLICY "public_read_award_nominations"
  ON award_nominations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_award_nominations" ON award_nominations;
CREATE POLICY "public_insert_award_nominations"
  ON award_nominations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_award_nominations" ON award_nominations;
CREATE POLICY "public_update_award_nominations"
  ON award_nominations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
