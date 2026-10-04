/*
# Add volunteer tracking columns to help_requests

1. Changes
- Added `volunteers_target` (integer, nullable) — the number of volunteers needed for an offer-type post (e.g. "50 volunteers needed"). NULL means no volunteer tracking.
- Added `volunteers_count` (integer, default 0) — the current number of volunteers who have signed up. Incremented when someone clicks "I'll volunteer".
2. Security
- No RLS changes. Existing policies on help_requests already allow anon + authenticated CRUD.
3. Notes
- Both columns are nullable / defaulted so existing rows are unaffected.
- The frontend will show a progress bar (volunteers_count / volunteers_target) and a volunteer button only when volunteers_target is set and > 0.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'help_requests' AND column_name = 'volunteers_target') THEN
    ALTER TABLE help_requests ADD COLUMN volunteers_target integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'help_requests' AND column_name = 'volunteers_count') THEN
    ALTER TABLE help_requests ADD COLUMN volunteers_count integer NOT NULL DEFAULT 0;
  END IF;
END $$;
