-- Revert stackdump:votes_before_insert_trigger from pg

BEGIN;

DROP TRIGGER IF EXISTS before_vote_insert ON stackdump.votes;
DROP FUNCTION IF EXISTS stackdump_private.check_votes();

COMMIT;
