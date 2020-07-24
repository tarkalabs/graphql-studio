-- Revert stackdump:grants_comments from pg

BEGIN;

REVOKE insert,select,update,delete ON TABLE stackdump.comments FROM user_reg;
REVOKE select ON TABLE stackdump.comments FROM user_anon;
REVOKE usage,select ON SEQUENCE stackdump.comments_id_seq FROM user_reg;

COMMIT;
