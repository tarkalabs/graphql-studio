-- Deploy stackdump:cmt_rls_comments to pg
-- requires: appschema
-- requires: comments
-- requires: roles

BEGIN;

COMMENT ON COLUMN stackdump.comments.id IS E'@omit create,update';
COMMENT ON COLUMN stackdump.comments.score IS E'@omit create';
COMMENT ON COLUMN stackdump.comments.creationDate IS E'@omit create,update';

ALTER TABLE stackdump.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY policy_insert_comments ON stackdump.comments FOR insert TO user_reg WITH CHECK(true);
CREATE POLICY policy_select_comments ON stackdump.comments FOR select TO user_reg,user_anon USING(true);
CREATE POLICY policy_delete_comments ON stackdump.comments FOR delete TO user_reg USING (userId = current_setting('jwt.claims.user_id',false)::int);
CREATE POLICY policy_update_comments ON stackdump.comments FOR update TO user_reg USING (userId = current_setting('jwt.claims.user_id',false)::int);

COMMIT;
