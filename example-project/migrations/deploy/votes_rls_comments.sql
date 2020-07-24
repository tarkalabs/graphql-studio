-- Deploy stackdump:votes_rls_comments to pg
-- requires: appschema
-- requires: votes
-- requires: roles

BEGIN;

COMMENT ON COLUMN stackdump.votes.id IS E'@omit create,update';
COMMENT ON COLUMN stackdump.votes.userId IS E'@omit create,update';
COMMENT ON COLUMN stackdump.votes.bountyAmount IS E'@omit create,update';
COMMENT ON COLUMN stackdump.votes.creationDate IS E'@omit create,update';


COMMIT;
