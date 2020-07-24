-- Revert stackdump:votes_rls_comments from pg

BEGIN;

COMMENT ON COLUMN stackdump.votes.id IS NULL;
COMMENT ON COLUMN stackdump.votes.userId IS NULL;
COMMENT ON COLUMN stackdump.votes.bountyAmount IS NULL;
COMMENT ON COLUMN stackdump.votes.creationDate IS NULL;

/*DROP POLICY IF EXISTS policy_insert_votes ON stackdump.votes;
DROP POLICY IF EXISTS policy_delete_votes ON stackdump.votes;
DROP POLICY IF EXISTS policy_select_votes ON stackdump.votes;*/

COMMIT;
