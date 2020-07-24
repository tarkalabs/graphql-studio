-- Deploy stackdump:grants_user to pg
-- requires: roles
-- requires: appschema
-- requires: users

BEGIN;

GRANT select,update,delete ON TABLE stackdump.users TO user_reg;
GRANT select ON TABLE stackdump.users TO user_anon;
GRANT usage,select ON SEQUENCE stackdump.users_id_seq TO user_reg;

COMMIT;
