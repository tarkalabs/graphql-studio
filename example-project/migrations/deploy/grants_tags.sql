-- Deploy stackdump:grants_tgs to pg
-- requires: appschema
-- requires: tags
-- requires: roles

BEGIN;

GRANT select ON TABLE stackdump.tags TO user_reg,user_anon;

COMMIT;
