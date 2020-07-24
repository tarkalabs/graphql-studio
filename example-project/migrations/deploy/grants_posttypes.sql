-- Deploy stackdump:grants_posttypes to pg
-- requires: appschema
-- requires: posts
-- requires: roles

BEGIN;

GRANT select ON TABLE stackdump.posttypes TO user_reg,user_anon;

COMMIT;
