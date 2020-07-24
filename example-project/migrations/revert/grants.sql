-- Revert stackdump:grants from pg

BEGIN;

revoke usage on schema stackdump from user_anon,user_reg;
REVOKE usage ON SCHEMA extensions FROM user_anon, user_reg;
revoke execute on function stackdump.register_user(text, text) from user_anon;
revoke execute on function stackdump.authenticate(text, text) from user_anon;
revoke select,insert,update,delete on table stackdump.posts from user_reg;
revoke usage,select on sequence stackdump.posts_id_seq from user_reg;
REVOKE execute ON FUNCTION stackdump.register_superuser(text) FROM user_anon;
REVOKE select ON TABLE stackdump.posts FROM user_anon;

COMMIT;
