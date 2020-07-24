-- Deploy stackdump:grants to pg
-- requires: roles
-- requires: appschema
-- requires: authentication
-- requires: register_user
-- requires: posts

BEGIN;

grant usage on schema stackdump to user_anon, user_reg;
GRANT usage ON SCHEMA extensions to user_anon,user_reg;
grant execute on function stackdump.register_user(text, text) to user_anon;
grant execute on function stackdump.authenticate(text, text) to user_anon;
grant select,insert,update,delete on table stackdump.posts to user_reg;
GRANT execute ON FUNCTION stackdump.register_superuser(text) to user_anon;
GRANT select ON TABLE stackdump.posts to user_anon;
grant usage,select on sequence stackdump.posts_id_seq to user_reg,user_anon;

COMMIT;
