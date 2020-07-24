-- Deploy stackdump:posts_rls_comments to pg
-- requires: posts
-- requires: roles

BEGIN;

COMMENT ON COLUMN stackdump.posts.id IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.acceptedAnswerId IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.lastEditorUserId IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.creationDate IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.score IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.viewCount IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.ownerUserId IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.ownerDisplayName IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.lastEditDate IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.lastActivityDate IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.answerCount IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.commentCount IS E'@omit create,update';
COMMENT ON COLUMN stackdump.posts.favoriteCount IS E'@omit create,update';

ALTER TABLE stackdump.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY policy_update_posts ON stackdump.posts FOR update TO user_reg WITH CHECK (ownerUserId = current_setting('jwt.claims.user_id')::int);
CREATE POLICY policy_delete_posts ON stackdump.posts FOR delete TO user_reg USING (ownerUserId = current_setting('jwt.claims.user_id')::int);
CREATE POLICY policy_select_posts ON stackdump.posts FOR select TO user_reg,user_anon USING (true);
CREATE POLICY policy_insert_posts ON stackdump.posts FOR insert TO user_reg WITH CHECK (true);

COMMIT;
