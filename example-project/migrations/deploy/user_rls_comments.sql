-- Deploy stackdump:user_rls_comments to pg
-- requires: users
-- requires: appschema
-- requires: roles

BEGIN;

COMMENT ON COLUMN stackdump.users.id is E'@omit update';
COMMENT ON COLUMN stackdump.users.reputation is E'@omit update';
COMMENT ON COLUMN stackdump.users.creationDate is E'@omit update';
COMMENT ON COLUMN stackdump.users.lastAccessDate is E'@omit update';
COMMENT ON COLUMN stackdump.users.views is E'@omit update';
COMMENT ON COLUMN stackdump.users.upVotes is E'@omit update';
COMMENT ON COLUMN stackdump.users.downVotes is E'@omit update';
COMMENT ON COLUMN stackdump.users.accountId is E'@omit update';
COMMENT ON TABLE stackdump.users is E'@omit create';

ALTER TABLE stackdump.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY policy_update_user ON stackdump.users FOR update TO user_reg WITH CHECK(id = current_setting('jwt.claims.user_id')::int);
CREATE POLICY policy_delete_user ON stackdump.users FOR delete TO user_reg USING (id = current_setting('jwt.claims.user_id')::int);
CREATE POLICY policy_select_user ON stackdump.users FOR select TO user_reg,user_anon USING (true);

COMMIT;
