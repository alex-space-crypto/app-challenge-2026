/*
# Update volunteer signup fields for event-based volunteering

1. Changes to volunteer_signups table
- Add `shift_start` (text) — start time of the volunteer shift, e.g. "1:00 PM"
- Add `shift_end` (text) — end time of the volunteer shift, e.g. "3:00 PM"
- Add `contact_phone` (text) — phone number so organizers can reach the volunteer
- Add `help_role` (text) — which activity the volunteer wants to help with
- The existing `hours`, `what_done`, and `verified_by` columns are kept for backward
  compatibility with previous signups. New signups will use the new columns instead.

2. Security
- No RLS or policy changes. The table already has anon/authenticated CRUD policies
  (no-auth app, intentionally public/shared data).
*/

ALTER TABLE volunteer_signups
  ADD COLUMN IF NOT EXISTS shift_start text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS shift_end text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS contact_phone text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS help_role text DEFAULT NULL;
