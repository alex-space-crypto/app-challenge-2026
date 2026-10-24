/*
# Create volunteer_signups table

1. New Tables
- `volunteer_signups` — tracks individual volunteer sign-ups for help_requests that have a volunteer target.
  - `id` (uuid, primary key)
  - `request_id` (uuid, foreign key to help_requests, ON DELETE CASCADE)
  - `volunteer_name` (text, not null) — name of the person volunteering
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `volunteer_signups`.
- Grant SELECT, INSERT to `anon` + `authenticated` (no-auth single-tenant app, data is intentionally public/shared).
- No UPDATE or DELETE needed — sign-ups are append-only.
- Policies: anon + authenticated can SELECT all and INSERT new sign-ups (USING (true) / WITH CHECK (true) is correct here because the help board is a shared public community board).
3. Notes
- The `volunteers_count` column on `help_requests` is kept in sync by the frontend (incremented on each new sign-up).
- This table provides the per-sign-up feed (names + timestamps) for the "recent sign-ups" display.
*/

CREATE TABLE IF NOT EXISTS volunteer_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES help_requests(id) ON DELETE CASCADE,
  volunteer_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE volunteer_signups ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON volunteer_signups TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_volunteer_signups" ON volunteer_signups;
CREATE POLICY "anon_select_volunteer_signups"
  ON volunteer_signups FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_volunteer_signups" ON volunteer_signups;
CREATE POLICY "anon_insert_volunteer_signups"
  ON volunteer_signups FOR INSERT
  TO anon, authenticated WITH CHECK (true);