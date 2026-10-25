-- Add community poll tables to the Supabase realtime publication
-- so live vote updates propagate to all connected clients.
ALTER PUBLICATION supabase_realtime ADD TABLE community_poll_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE community_poll_issue_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE community_poll_issues;
