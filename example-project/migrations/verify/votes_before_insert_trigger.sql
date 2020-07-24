-- Verify stackdump:votes_before_insert_trigger on pg

BEGIN;

SELECT * FROM pg_trigger WHERE tgname='before_vote_insert';

ROLLBACK;
