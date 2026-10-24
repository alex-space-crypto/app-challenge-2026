ALTER TABLE volunteer_signups
  ADD COLUMN IF NOT EXISTS hours numeric DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS what_done text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS verified_by text DEFAULT NULL;

ALTER TABLE volunteer_signups
  ALTER COLUMN volunteer_name DROP NOT NULL;
