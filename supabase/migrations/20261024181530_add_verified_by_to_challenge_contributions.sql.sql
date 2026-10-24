ALTER TABLE challenge_contributions
  ADD COLUMN IF NOT EXISTS verified_by text DEFAULT NULL;