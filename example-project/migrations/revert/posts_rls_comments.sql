-- Revert stackdump:posts_rls_comments from pg

BEGIN;

COMMENT ON COLUMN stackdump.posts.id IS NULL;
COMMENT ON COLUMN stackdump.posts.acceptedAnswerId IS NULL;
COMMENT ON COLUMN stackdump.posts.lastEditorUserId IS NULL;
COMMENT ON COLUMN stackdump.posts.creationDate IS NULL;
COMMENT ON COLUMN stackdump.posts.score IS NULL;
COMMENT ON COLUMN stackdump.posts.viewCount IS NULL;
COMMENT ON COLUMN stackdump.posts.ownerUserId IS NULL;
COMMENT ON COLUMN stackdump.posts.ownerDisplayName IS NULL;
COMMENT ON COLUMN stackdump.posts.lastEditDate IS NULL;
COMMENT ON COLUMN stackdump.posts.lastActivityDate IS NULL;
COMMENT ON COLUMN stackdump.posts.answerCount IS NULL;
COMMENT ON COLUMN stackdump.posts.commentCount IS NULL;
COMMENT ON COLUMN stackdump.posts.favoriteCount IS NULL;

DROP POLICY IF EXISTS policy_insert_posts on stackdump.posts;
DROP POLICY IF EXISTS policy_delete_posts on stackdump.posts;
DROP POLICY IF EXISTS policy_update_posts on stackdump.posts;
DROP POLICY IF EXISTS policy_select_posts ON stackdump.posts;

COMMIT;
