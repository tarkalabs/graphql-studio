-- Deploy stackdump:grants_votes to pg
-- requires: appschema
-- requires: votes
-- requires: roles

BEGIN;

GRANT select ON TABLE stackdump.votes TO user_anon;
GRANT select,insert,delete ON TABLE stackdump.votes TO user_reg;
GRANT usage,select ON SEQUENCE stackdump.votes_id_seq TO user_reg;

COMMIT;
