-- Revert stackdump:grants_posttypes from pg

BEGIN;

REVOKE select ON TABLE stackdump.posttypes FROM user_reg,user_anon;

COMMIT;
