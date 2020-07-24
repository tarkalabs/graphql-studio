-- Revert stackdump:grants_votetypes from pg

BEGIN;

REVOKE select ON TABLE stackdump.votetypes FROM user_reg,user_anon;

COMMIT;
