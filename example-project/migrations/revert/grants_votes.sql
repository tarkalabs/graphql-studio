-- Revert stackdump:grants_votes from pg

BEGIN;

REVOKE select ON TABLE stackdump.votes FROM user_anon;
REVOKE select,insert,delete ON TABLE stackdump.votes FROM user_reg;
REVOKE usage,select ON SEQUENCE stackdump.votes_id_seq FROM user_reg;

COMMIT;
