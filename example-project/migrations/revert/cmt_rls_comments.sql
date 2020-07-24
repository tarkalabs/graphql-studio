-- Revert stackdump:cmt_rls_comments from pg

BEGIN;

COMMENT ON COLUMN stackdump.comments.id IS NULL;
COMMENT ON COLUMN stackdump.comments.score IS NULL;
COMMENT ON COLUMN stackdump.comments.creationDate IS NULL;

ALTER TABLE stackdump.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY policy_insert_comments ON stackdump.comments;
DROP POLICY policy_select_comments ON stackdump.comments;
DROP POLICY policy_delete_comments ON stackdump.comments;
DROP POLICY policy_update_comments ON stackdump.comments;

COMMIT;
