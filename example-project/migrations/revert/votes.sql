-- Revert stackdump:votes from pg

BEGIN;

DROP INDEX stackdump.votes_id_idx;
DROP INDEX stackdump.votes_postId_idx;
DROP INDEX stackdump.votes_voteTypeId_idx;
DROP INDEX stackdump.votes_userId_idx;
DROP TABLE stackdump.votes;

COMMIT;
