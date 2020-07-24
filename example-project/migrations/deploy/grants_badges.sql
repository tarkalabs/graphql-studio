-- Deploy stackdump:grants_badges to pg
-- requires: appschema
-- requires: badges
-- requires: roles

BEGIN;

GRANT select ON TABLE stackdump.badges TO user_reg, user_anon; 

COMMIT;
