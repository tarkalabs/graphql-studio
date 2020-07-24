-- Deploy stackdump:grants_votetypes to pg
-- requires: appschema
-- requires: votes
-- requires: roles

BEGIN;

GRANT select ON TABLE stackdump.votetypes TO user_reg,user_anon;

COMMIT;
