-- Revert stackdump:user_rls_comments from pg

BEGIN;

COMMENT ON COLUMN stackdump.users.id is NULL;
COMMENT ON COLUMN stackdump.users.reputation is NULL;
COMMENT ON COLUMN stackdump.users.creationDate is NULL;
COMMENT ON COLUMN stackdump.users.lastAccessDate is NULL;
COMMENT ON COLUMN stackdump.users.views is NULL;
COMMENT ON COLUMN stackdump.users.upVotes is NULL;
COMMENT ON COLUMN stackdump.users.downVotes is NULL;
COMMENT ON COLUMN stackdump.users.accountId is NULL;
COMMENT ON TABLE stackdump.users is NULL;

DROP POLICY policy_update_user ON stackdump.users;
DROP POLICY policy_delete_user ON stackdump.users;
DROP POLICY policy_select_user ON stackdump.users;


COMMIT;