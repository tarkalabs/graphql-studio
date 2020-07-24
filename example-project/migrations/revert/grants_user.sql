-- Revert stackdump:grants_user from pg

BEGIN;

REVOKE select,update,delete ON TABLE stackdump.users FROM user_reg;
REVOKE select ON TABLE stackdump.users FROM user_anon;
REVOKE usage,select ON SEQUENCE stackdump.users_id_seq FROM user_reg;

COMMIT;
